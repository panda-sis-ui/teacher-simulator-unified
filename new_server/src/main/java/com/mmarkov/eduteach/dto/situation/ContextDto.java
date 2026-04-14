package com.mmarkov.eduteach.dto.situation;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContextDto {
    private String lesson;
    private String classroom;
    private String lessonStage;
    private String lessonFormat;
    private String techEquip;
    private Integer duration;
}