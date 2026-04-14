package com.mmarkov.eduteach.entity.situation;

import com.mmarkov.eduteach.entity.access.User;
import com.mmarkov.eduteach.entity.metrics.ChangeMetrics;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "situations_passed_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SituationsPassedUser {

    @EmbeddedId
    private SituationsPassedUserId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("situationId")
    @JoinColumn(name = "situation_id")
    private Situation situation;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "final_metrics_id", unique = true)
    private ChangeMetrics finalMetrics;

    @Column(name = "passed_at")
    private LocalDateTime passedAt;
}