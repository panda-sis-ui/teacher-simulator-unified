package com.mmarkov.eduteach.dto.play;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChooseResponse {
    private String consequenceText;
    private String typeConsequenceName;
    private NodeDto nextNode;      // null если isFinished = true
    private MetricsDto metrics;
    private Boolean isFinished;
}