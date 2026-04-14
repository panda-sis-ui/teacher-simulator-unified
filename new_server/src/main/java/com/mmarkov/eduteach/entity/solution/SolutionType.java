package com.mmarkov.eduteach.entity.solution;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "solution_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolutionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;
}