package com.mmarkov.eduteach.entity.problem;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "problem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_problem_id", nullable = false)
    private TypeProblem typeProblem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_problem_id", nullable = false)
    private SourceProblem sourceProblem;

    @Column(name = "intensity")
    private Double intensity;

    @Column(name = "tension_factor")
    private Double tensionFactor;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_motivation")
    @Builder.Default
    private Double startMotivation = 0.5;

    @Column(name = "start_stress")
    @Builder.Default
    private Double startStress = 0.3;

    @Column(name = "start_trust")
    @Builder.Default
    private Double startTrust = 0.5;

    @Column(name = "start_class_climate")
    @Builder.Default
    private Double startClassClimate = 0.5;

    @Column(name = "start_teacher_authority")
    @Builder.Default
    private Double startTeacherAuthority = 0.5;

    @Column(name = "start_teacher_burnout")
    @Builder.Default
    private Double startTeacherBurnout = 0.2;

    @ManyToMany
    @JoinTable(
        name = "problem_emotions",
        joinColumns = @JoinColumn(name = "problem_id"),
        inverseJoinColumns = @JoinColumn(name = "emotion_id")
    )
    @Builder.Default
    private Set<Emotion> emotions = new HashSet<>();
}