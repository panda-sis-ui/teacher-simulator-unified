package com.mmarkov.eduteach.service;

import com.mmarkov.eduteach.dto.play.*;
import com.mmarkov.eduteach.entity.metrics.ChangeMetrics;
import com.mmarkov.eduteach.entity.script.Choice;
import com.mmarkov.eduteach.entity.script.ScriptNode;
import com.mmarkov.eduteach.entity.situation.Situation;
import com.mmarkov.eduteach.entity.situation.SituationsPassedUser;
import com.mmarkov.eduteach.entity.situation.SituationsPassedUserId;
import com.mmarkov.eduteach.repository.*;
import com.mmarkov.eduteach.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayService {

    private final SituationRepository situationRepository;
    private final ScriptNodeRepository scriptNodeRepository;
    private final ChoiceRepository choiceRepository;
    private final ChangeMetricsRepository changeMetricsRepository;
    private final SituationsPassedUserRepository situationsPassedUserRepository;
    private final UserRepository userRepository;

    // =========================================================================
    // СТАРТ ПРОХОЖДЕНИЯ
    // =========================================================================

    @Transactional
    public StartSessionResponse startSession(Integer situationId) {
        Integer userId = getCurrentUserId();

        Situation situation = situationRepository.findByIdWithDetails(situationId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Ситуация не найдена: " + situationId));

        // Создаём новые метрики из стартовых значений проблемы
        ChangeMetrics metrics = ChangeMetrics.builder()
                .motivation(situation.getProblem().getStartMotivation())
                .stress(situation.getProblem().getStartStress())
                .trust(situation.getProblem().getStartTrust())
                .classClimate(situation.getProblem().getStartClassClimate())
                .teacherAuthority(situation.getProblem().getStartTeacherAuthority())
                .teacherBurnout(situation.getProblem().getStartTeacherBurnout())
                .build();
        metrics = changeMetricsRepository.save(metrics);

        // Удаляем старую запись если есть (рестарт)
        SituationsPassedUserId compositeId =
                new SituationsPassedUserId(userId, situationId);
        situationsPassedUserRepository.findById(compositeId)
                .ifPresent(situationsPassedUserRepository::delete);
        situationsPassedUserRepository.flush();

        // Создаём новую запись прохождения
        SituationsPassedUser session = SituationsPassedUser.builder()
                .id(compositeId)
                .user(userRepository.getReferenceById(userId))
                .situation(situation)
                .finalMetrics(metrics)
                .passedAt(LocalDateTime.now())
                .build();
        situationsPassedUserRepository.save(session);

        // Загружаем стартовый узел с вариантами выбора
        ScriptNode startNode = scriptNodeRepository
                .findByIdWithChoices(situation.getScriptNode().getId())
                .orElseThrow(() -> new IllegalStateException(
                        "Стартовый узел не найден"));

        return StartSessionResponse.builder()
                .currentNode(mapToNodeDto(startNode))
                .metrics(mapToMetricsDto(metrics))
                .build();
    }

    // =========================================================================
    // ПОЛУЧЕНИЕ УЗЛА
    // =========================================================================

    @Transactional(readOnly = true)
    public StartSessionResponse getNode(Integer situationId, Integer nodeId) {
        Integer userId = getCurrentUserId();

        SituationsPassedUser session = getSessionOrThrow(userId, situationId);

        ScriptNode node = scriptNodeRepository.findByIdWithChoices(nodeId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Узел не найден: " + nodeId));

        return StartSessionResponse.builder()
                .currentNode(mapToNodeDto(node))
                .metrics(mapToMetricsDto(session.getFinalMetrics()))
                .build();
    }

    // =========================================================================
    // СОВЕРШЕНИЕ ВЫБОРА
    // =========================================================================

    @Transactional
    public ChooseResponse choose(Integer situationId, Integer choiceId) {
        Integer userId = getCurrentUserId();

        SituationsPassedUser session = getSessionOrThrow(userId, situationId);

        Choice choice = choiceRepository.findByIdWithNodes(choiceId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Вариант выбора не найден: " + choiceId));

        // Валидация: выбор должен принадлежать правильному узлу
        if (choice.getFromScriptNode() == null) {
            throw new IllegalStateException("Выбор не привязан к узлу сценария");
        }

        boolean valid = scriptNodeRepository.existsChoiceForNode(
                choice.getFromScriptNode().getId(), choiceId);
        if (!valid) {
            throw new IllegalArgumentException(
                    "Выбор не принадлежит текущему узлу ситуации");
        }

        // Применяем дельты к метрикам
        ChangeMetrics metrics = session.getFinalMetrics();
        applyDeltas(metrics, choice);
        changeMetricsRepository.save(metrics);

        // Определяем следующий узел
        ScriptNode nextNode = choice.getNextScriptNode();
        boolean isFinished = (nextNode == null) || Boolean.TRUE.equals(nextNode.getIsTerminal());

        NodeDto nextNodeDto = null;
        if (!isFinished) {
            nextNodeDto = scriptNodeRepository
                    .findByIdWithChoices(nextNode.getId())
                    .map(this::mapToNodeDto)
                    .orElseThrow(() -> new IllegalStateException(
                            "Следующий узел не найден: " + nextNode.getId()));
        } else if (nextNode != null) {
            nextNodeDto = NodeDto.builder()
                    .id(nextNode.getId())
                    .description(nextNode.getDescription())
                    .urlImage(nextNode.getUrlImage())
                    .isTerminal(true)
                    .choices(List.of())
                    .build();
        }

        String typeConsequenceName = null;
        if (choice.getTypeConsequence() != null) {
            typeConsequenceName = choice.getTypeConsequence().getName();
        }

        return ChooseResponse.builder()
                .consequenceText(choice.getConsequenceText())
                .typeConsequenceName(typeConsequenceName)
                .nextNode(nextNodeDto)
                .metrics(mapToMetricsDto(metrics))
                .isFinished(isFinished)
                .build();
    }

    // =========================================================================
    // РЕЗУЛЬТАТ
    // =========================================================================

    @Transactional(readOnly = true)
    public ResultResponse getResult(Integer situationId) {
        Integer userId = getCurrentUserId();
        SituationsPassedUser session = getSessionOrThrow(userId, situationId);

        ChangeMetrics metrics = session.getFinalMetrics();

        // Проверка нормативов
        boolean motivationOk      = metrics.getMotivation()       != null && metrics.getMotivation()       >= 0.7;
        boolean stressOk          = metrics.getStress()           != null && metrics.getStress()           <= 0.4;
        boolean trustOk           = metrics.getTrust()            != null && metrics.getTrust()            >= 0.6;
        boolean classClimateOk    = metrics.getClassClimate()     != null && metrics.getClassClimate()     >= 0.7;
        boolean authorityOk       = metrics.getTeacherAuthority() != null && metrics.getTeacherAuthority() >= 0.6;
        boolean burnoutOk         = metrics.getTeacherBurnout()   != null && metrics.getTeacherBurnout()   <= 0.3;

        int passed = countPassed(motivationOk, stressOk, trustOk,
                classClimateOk, authorityOk, burnoutOk);

        String result;
        if (passed == 6)      result = "SUCCESS";
        else if (passed >= 4) result = "PARTIAL_SUCCESS";
        else                  result = "FAILURE";

        return ResultResponse.builder()
                .situationName(session.getSituation().getName())
                .result(result)
                .metricsPassed(passed)
                .finalMetrics(mapToMetricsDto(metrics))
                .normativeChecks(NormativeChecksDto.builder()
                        .motivation(motivationOk)
                        .stress(stressOk)
                        .trust(trustOk)
                        .classClimate(classClimateOk)
                        .teacherAuthority(authorityOk)
                        .teacherBurnout(burnoutOk)
                        .build())
                .build();
    }

    // =========================================================================
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // =========================================================================

    private void applyDeltas(ChangeMetrics metrics, Choice choice) {
        metrics.setMotivation(clamp(
                safeGet(metrics.getMotivation()) + safeGet(choice.getDeltaMotivation())));
        metrics.setStress(clamp(
                safeGet(metrics.getStress()) + safeGet(choice.getDeltaStress())));
        metrics.setTrust(clamp(
                safeGet(metrics.getTrust()) + safeGet(choice.getDeltaTrust())));
        metrics.setClassClimate(clamp(
                safeGet(metrics.getClassClimate()) + safeGet(choice.getDeltaClassClimate())));
        metrics.setTeacherAuthority(clamp(
                safeGet(metrics.getTeacherAuthority()) + safeGet(choice.getDeltaTeacherAuthority())));
        metrics.setTeacherBurnout(clamp(
                safeGet(metrics.getTeacherBurnout()) + safeGet(choice.getDeltaTeacherBurnout())));
    }

    private double clamp(double value) {
        return Math.max(0.0, Math.min(1.0, value));
    }

    private double safeGet(Double value) {
        return value != null ? value : 0.0;
    }

    private int countPassed(boolean... checks) {
        int count = 0;
        for (boolean check : checks) {
            if (check) count++;
        }
        return count;
    }

    private Integer getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    private SituationsPassedUser getSessionOrThrow(Integer userId, Integer situationId) {
        return situationsPassedUserRepository
                .findByUserIdAndSituationId(userId, situationId)
                .orElseThrow(() -> new IllegalStateException(
                        "Сессия прохождения не найдена. Сначала вызовите /start"));
    }

    private NodeDto mapToNodeDto(ScriptNode node) {
        List<ChoiceDto> choices = node.getChoicesFrom().stream()
                .map(c -> ChoiceDto.builder()
                        .id(c.getId())
                        .description(c.getDescription())
                        .build())
                .toList();

        return NodeDto.builder()
                .id(node.getId())
                .description(node.getDescription())
                .urlImage(node.getUrlImage())
                .isTerminal(node.getIsTerminal())
                .choices(choices)
                .build();
    }

    private MetricsDto mapToMetricsDto(ChangeMetrics m) {
        return MetricsDto.builder()
                .motivation(m.getMotivation())
                .stress(m.getStress())
                .trust(m.getTrust())
                .classClimate(m.getClassClimate())
                .teacherAuthority(m.getTeacherAuthority())
                .teacherBurnout(m.getTeacherBurnout())
                .build();
    }
}