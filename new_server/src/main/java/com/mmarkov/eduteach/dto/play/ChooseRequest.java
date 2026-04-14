package com.mmarkov.eduteach.dto.play;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChooseRequest {

    @NotNull(message = "choiceId обязателен")
    private Integer choiceId;
}