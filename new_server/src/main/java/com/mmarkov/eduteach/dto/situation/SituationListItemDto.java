package com.mmarkov.eduteach.dto.situation;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SituationListItemDto {
    private Integer id;
    private String name;
    private String typeProblem;
    private String lessonName;
    private String lessonFormat;
    private Double problemIntensity;
}