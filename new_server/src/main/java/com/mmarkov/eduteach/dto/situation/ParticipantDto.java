package com.mmarkov.eduteach.dto.situation;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantDto {
    private Integer id;
    private String fullName;
    private Integer age;
    private String type;      // TEACHER или STUDENT

    // Поля учителя
    private String pedagogicalStyle;
    private String emotionIntelligence;
    private String professionalRole;
    private Integer experience;

    // Поля ученика
    private String communicationStyle;
    private String socialStatus;
    private String techEquip;
    private Double motivation;
    private Double preparation;
}