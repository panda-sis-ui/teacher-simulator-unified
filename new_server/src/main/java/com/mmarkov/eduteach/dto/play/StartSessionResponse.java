package com.mmarkov.eduteach.dto.play;

import com.mmarkov.eduteach.dto.situation.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartSessionResponse {
    private NodeDto currentNode;
    private MetricsDto metrics;
    private ContextDto context;
    private ProblemDto problem;
    private List<ParticipantDto> participants;
}