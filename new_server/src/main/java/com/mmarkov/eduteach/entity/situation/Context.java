package com.mmarkov.eduteach.entity.situation;

import com.mmarkov.eduteach.entity.participant.TechEquip;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "context")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Context {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_stage_id", nullable = false)
    private LessonStage lessonStage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_format_id", nullable = false)
    private LessonFormat lessonFormat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tech_equip_id")
    private TechEquip techEquip;

    @Column(name = "duration")
    private Integer duration;
}