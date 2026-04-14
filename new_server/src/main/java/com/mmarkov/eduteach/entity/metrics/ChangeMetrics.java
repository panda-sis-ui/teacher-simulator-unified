package com.mmarkov.eduteach.entity.metrics;

import com.mmarkov.eduteach.entity.situation.SituationsPassedUser;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "change_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangeMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "motivation")
    private Double motivation;

    @Column(name = "stress")
    private Double stress;

    @Column(name = "trust")
    private Double trust;

    @Column(name = "class_climate")
    private Double classClimate;

    @Column(name = "teacher_authority")
    private Double teacherAuthority;

    @Column(name = "teacher_burnout")
    private Double teacherBurnout;

    @OneToOne(mappedBy = "changeMetrics")
    private Consequence consequence;

    @OneToOne(mappedBy = "finalMetrics")
    private SituationsPassedUser situationsPassedUser;
}