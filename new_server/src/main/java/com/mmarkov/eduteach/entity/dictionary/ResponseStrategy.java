package com.mmarkov.eduteach.entity.dictionary;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "response_strategy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseStrategy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;
}