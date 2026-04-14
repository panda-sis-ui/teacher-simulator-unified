package com.mmarkov.eduteach.dto.play;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultResponse {
    private String situationName;
    private String result;           // SUCCESS / PARTIAL_SUCCESS / FAILURE
    private Integer metricsPassed;
    private MetricsDto finalMetrics;
    private NormativeChecksDto normativeChecks;
}