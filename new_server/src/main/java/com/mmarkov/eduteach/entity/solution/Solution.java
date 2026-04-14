package com.mmarkov.eduteach.entity.solution;

import com.mmarkov.eduteach.entity.dictionary.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "solution")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Solution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sol_type_id", nullable = false)
    private SolutionType solutionType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resp_strat_id", nullable = false)
    private ResponseStrategy responseStrategy;

    @Column(name = "risk")
    private Integer risk;

    @Column(name = "student_autonomy")
    private Integer studentAutonomy;

    @ManyToMany
    @JoinTable(
        name = "solution_Resource",
        joinColumns = @JoinColumn(name = "solution_id"),
        inverseJoinColumns = @JoinColumn(name = "resource_id")
    )
    @Builder.Default
    private Set<Resource> resources = new HashSet<>();
}