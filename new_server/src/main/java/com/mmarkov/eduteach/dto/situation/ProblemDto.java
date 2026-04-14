package com.mmarkov.eduteach.dto.situation;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemDto {
    private String typeProblem;
    private String sourceProblem;
    private Double intensity;
    private String description;
    private List<String> emotions;
}