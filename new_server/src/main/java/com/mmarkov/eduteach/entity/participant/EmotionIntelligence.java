package com.mmarkov.eduteach.entity.participant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "emotion_intelligence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmotionIntelligence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;
}