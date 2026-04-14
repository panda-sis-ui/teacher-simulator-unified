package com.mmarkov.eduteach.entity.problem;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "type_problem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypeProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;
}