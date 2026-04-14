package com.mmarkov.eduteach.dto.history;

import com.mmarkov.eduteach.dto.play.MetricsDto;
import com.mmarkov.eduteach.dto.play.NormativeChecksDto;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryItemDto {
    private Integer situationId;
    private String situationName;
    private LocalDateTime passedAt;
    private String result;
    private Integer metricsPassed;
    private MetricsDto finalMetrics;
    private NormativeChecksDto normativeChecks;
}