package com.mmarkov.eduteach.dto.play;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NormativeChecksDto {
    private Boolean motivation;
    private Boolean stress;
    private Boolean trust;
    private Boolean classClimate;
    private Boolean teacherAuthority;
    private Boolean teacherBurnout;
}