package com.mmarkov.eduteach.entity.script;

import com.mmarkov.eduteach.entity.metrics.TypeConsequence;
import com.mmarkov.eduteach.entity.solution.Solution;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "choice")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Choice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solution_id", nullable = false)
    private Solution solution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_script_node_id")
    private ScriptNode fromScriptNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "next_script_node_id")
    private ScriptNode nextScriptNode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "delta_motivation")
    @Builder.Default
    private Double deltaMotivation = 0.0;

    @Column(name = "delta_stress")
    @Builder.Default
    private Double deltaStress = 0.0;

    @Column(name = "delta_trust")
    @Builder.Default
    private Double deltaTrust = 0.0;

    @Column(name = "delta_class_climate")
    @Builder.Default
    private Double deltaClassClimate = 0.0;

    @Column(name = "delta_teacher_authority")
    @Builder.Default
    private Double deltaTeacherAuthority = 0.0;

    @Column(name = "delta_teacher_burnout")
    @Builder.Default
    private Double deltaTeacherBurnout = 0.0;

    @Column(name = "consequence_text", columnDefinition = "TEXT")
    private String consequenceText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_consequence_id")
    private TypeConsequence typeConsequence;
}