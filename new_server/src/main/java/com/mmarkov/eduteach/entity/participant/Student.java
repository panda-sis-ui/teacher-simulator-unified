package com.mmarkov.eduteach.entity.participant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @Column(name = "participant_id")
    private Integer participantId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    @MapsId
    private Participant participant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tech_equip_id")
    private TechEquip techEquip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comm_style_id")
    private CommunicationStyle commStyle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "social_status_id")
    private SocialStatus socialStatus;

    @Column(name = "motivation")
    private Double motivation;

    @Column(name = "preparation")
    private Double preparation;
}