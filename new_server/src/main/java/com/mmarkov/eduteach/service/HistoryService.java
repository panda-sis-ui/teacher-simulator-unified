package com.mmarkov.eduteach.service;

import com.mmarkov.eduteach.dto.history.HistoryItemDto;
import com.mmarkov.eduteach.dto.play.MetricsDto;
import com.mmarkov.eduteach.dto.play.NormativeChecksDto;
import com.mmarkov.eduteach.entity.metrics.ChangeMetrics;
import com.mmarkov.eduteach.entity.situation.SituationsPassedUser;
import com.mmarkov.eduteach.repository.SituationsPassedUserRepository;
import com.mmarkov.eduteach.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final SituationsPassedUserRepository situationsPassedUserRepository;

    @Transactional(readOnly = true)
    public List<HistoryItemDto> getHistory() {
        Integer userId = getCurrentUserId();

        return situationsPassedUserRepository.findAllByUserId(userId).stream()
                .map(this::mapToHistoryItem)
                .toList();
    }

    // =========================================================================
    // МАППИНГ
    // =========================================================================

    private HistoryItemDto mapToHistoryItem(SituationsPassedUser spu) {
        ChangeMetrics m = spu.getFinalMetrics();

        boolean motivationOk   = m.getMotivation()       != null && m.getMotivation()       >= 0.7;
        boolean stressOk       = m.getStress()           != null && m.getStress()           <= 0.4;
        boolean trustOk        = m.getTrust()            != null && m.getTrust()            >= 0.6;
        boolean classClimateOk = m.getClassClimate()     != null && m.getClassClimate()     >= 0.7;
        boolean authorityOk    = m.getTeacherAuthority() != null && m.getTeacherAuthority() >= 0.6;
        boolean burnoutOk      = m.getTeacherBurnout()   != null && m.getTeacherBurnout()   <= 0.3;

        int passed = countPassed(motivationOk, stressOk, trustOk,
                classClimateOk, authorityOk, burnoutOk);

        String result;
        if (passed == 6)      result = "SUCCESS";
        else if (passed >= 4) result = "PARTIAL_SUCCESS";
        else                  result = "FAILURE";

        return HistoryItemDto.builder()
                .situationId(spu.getSituation().getId())
                .situationName(spu.getSituation().getName())
                .passedAt(spu.getPassedAt())
                .result(result)
                .metricsPassed(passed)
                .finalMetrics(MetricsDto.builder()
                        .motivation(m.getMotivation())
                        .stress(m.getStress())
                        .trust(m.getTrust())
                        .classClimate(m.getClassClimate())
                        .teacherAuthority(m.getTeacherAuthority())
                        .teacherBurnout(m.getTeacherBurnout())
                        .build())
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

    private int countPassed(boolean... checks) {
        int count = 0;
        for (boolean check : checks) if (check) count++;
        return count;
    }

    private Integer getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }
}