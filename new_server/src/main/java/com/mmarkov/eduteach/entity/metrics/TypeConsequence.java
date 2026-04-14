package com.mmarkov.eduteach.entity.metrics;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "type_consequence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypeConsequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;
}