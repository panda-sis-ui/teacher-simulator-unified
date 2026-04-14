package com.mmarkov.eduteach.entity.metrics;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "consequence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "change_metrics_id", unique = true, nullable = false)
    private ChangeMetrics changeMetrics;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_conseq_id", nullable = false)
    private TypeConsequence typeConsequence;

    @Column(name = "text", columnDefinition = "TEXT")
    private String text;

    @Column(name = "long_term")
    @Builder.Default
    private Boolean longTerm = false;

    @Column(name = "reversible")
    @Builder.Default
    private Boolean reversible = false;

    @Column(name = "intensity")
    private Double intensity;
}