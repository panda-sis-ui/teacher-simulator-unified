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

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Id
    @Column(name = "situation_id")
    private Integer situationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "situation_id", insertable = false, updatable = false)
    private Situation situation;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "final_metrics_id", unique = true)
    private ChangeMetrics finalMetrics;

    @Column(name = "passed_at")
    @Builder.Default
    private LocalDateTime passedAt = LocalDateTime.now();
}