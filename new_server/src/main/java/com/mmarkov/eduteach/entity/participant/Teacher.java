package com.mmarkov.eduteach.entity.participant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teacher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

    @Id
    @Column(name = "participant_id")
    private Integer participantId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    @MapsId
    private Participant participant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emotion_intell_id")
    private EmotionIntelligence emotionIntelligence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "style_id")
    private PedagogicalStyle pedagogicalStyle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prof_role_id")
    private ProfessionalRole professionalRole;

    @Column(name = "experience")
    private Integer experience;
}