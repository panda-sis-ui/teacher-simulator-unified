package com.mmarkov.eduteach.dto.situation;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SituationDetailDto {
    private Integer id;
    private String name;
    private ContextDto context;
    private ProblemDto problem;
    private List<ParticipantDto> participants;
    private Integer startNodeId;
}