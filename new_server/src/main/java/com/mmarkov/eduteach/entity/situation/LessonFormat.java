package com.mmarkov.eduteach.entity.situation;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lesson_format")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonFormat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;
}