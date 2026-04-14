package com.mmarkov.eduteach.dto.play;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetricsDto {
    private Double motivation;
    private Double stress;
    private Double trust;
    private Double classClimate;
    private Double teacherAuthority;
    private Double teacherBurnout;
}