package com.mmarkov.eduteach.dto.play;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartSessionResponse {
    private NodeDto currentNode;
    private MetricsDto metrics;
}