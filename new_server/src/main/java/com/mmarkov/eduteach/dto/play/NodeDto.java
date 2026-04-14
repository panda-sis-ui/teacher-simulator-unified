package com.mmarkov.eduteach.dto.play;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NodeDto {
    private Integer id;
    private String description;
    private String urlImage;
    private Boolean isTerminal;
    private List<ChoiceDto> choices;
}