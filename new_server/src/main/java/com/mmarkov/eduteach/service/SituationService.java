package com.mmarkov.eduteach.service;

import com.mmarkov.eduteach.dto.situation.*;
import com.mmarkov.eduteach.entity.participant.Participant;
import com.mmarkov.eduteach.entity.situation.Situation;
import com.mmarkov.eduteach.repository.ParticipantRepository;
import com.mmarkov.eduteach.repository.SituationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SituationService {

    private final SituationRepository situationRepository;
    private final ParticipantRepository participantRepository;

    @Transactional(readOnly = true)
    public List<SituationListItemDto> getAll() {
        return situationRepository.findAllWithSummary().stream()
                .map(this::mapToListItem)
                .toList();
    }

    @Transactional(readOnly = true)
    public SituationDetailDto getById(Integer id) {
        Situation situation = situationRepository.findByIdForDetail(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Ситуация не найдена: " + id));

        // Загружаем учителей и учеников отдельными запросами
        List<Participant> teachers = participantRepository.findTeachersBySituationId(id);
        List<Participant> students = participantRepository.findStudentsBySituationId(id);

        List<ParticipantDto> allParticipants = new ArrayList<>();
        teachers.stream().map(this::mapParticipant).forEach(allParticipants::add);
        students.stream().map(this::mapParticipant).forEach(allParticipants::add);

        return SituationDetailDto.builder()
                .id(situation.getId())
                .name(situation.getName())
                .context(mapContext(situation))
                .problem(mapProblem(situation))
                .participants(allParticipants)
                .startNodeId(situation.getScriptNode().getId())
                .build();
    }

    // =========================================================================
    // МАППИНГ
    // =========================================================================

    private SituationListItemDto mapToListItem(Situation s) {
        return SituationListItemDto.builder()
                .id(s.getId())
                .name(s.getName())
                .typeProblem(s.getProblem().getTypeProblem().getName())
                .lessonName(s.getContext().getLesson().getName())
                .lessonFormat(s.getContext().getLessonFormat().getName())
                .problemIntensity(s.getProblem().getIntensity())
                .build();
    }

    private ContextDto mapContext(Situation s) {
        var c = s.getContext();
        return ContextDto.builder()
                .lesson(c.getLesson().getName())
                .classroom(c.getClassroom().getName())
                .lessonStage(c.getLessonStage().getName())
                .lessonFormat(c.getLessonFormat().getName())
                .techEquip(c.getTechEquip() != null ? c.getTechEquip().getName() : null)
                .duration(c.getDuration())
                .build();
    }

    private ProblemDto mapProblem(Situation s) {
        var p = s.getProblem();
        return ProblemDto.builder()
                .typeProblem(p.getTypeProblem().getName())
                .sourceProblem(p.getSourceProblem().getName())
                .intensity(p.getIntensity())
                .description(p.getDescription())
                .emotions(p.getEmotions().stream()
                        .map(e -> e.getName())
                        .toList())
                .build();
    }

    private ParticipantDto mapParticipant(Participant p) {
        ParticipantDto.ParticipantDtoBuilder builder = ParticipantDto.builder()
                .id(p.getId())
                .fullName(p.getFullName())
                .age(p.getAge());

        if (p.getTeacher() != null) {
            var t = p.getTeacher();
            builder.type("TEACHER")
                    .pedagogicalStyle(t.getPedagogicalStyle() != null
                            ? t.getPedagogicalStyle().getName() : null)
                    .emotionIntelligence(t.getEmotionIntelligence() != null
                            ? t.getEmotionIntelligence().getName() : null)
                    .professionalRole(t.getProfessionalRole() != null
                            ? t.getProfessionalRole().getName() : null)
                    .experience(t.getExperience());
        } else if (p.getStudent() != null) {
            var st = p.getStudent();
            builder.type("STUDENT")
                    .communicationStyle(st.getCommStyle() != null
                            ? st.getCommStyle().getName() : null)
                    .socialStatus(st.getSocialStatus() != null
                            ? st.getSocialStatus().getName() : null)
                    .techEquip(st.getTechEquip() != null
                            ? st.getTechEquip().getName() : null)
                    .motivation(st.getMotivation())
                    .preparation(st.getPreparation());
        }

        return builder.build();
    }
}