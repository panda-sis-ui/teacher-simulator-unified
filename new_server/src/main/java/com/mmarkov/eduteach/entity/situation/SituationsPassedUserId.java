package com.mmarkov.eduteach.entity.situation;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class SituationsPassedUserId implements Serializable {

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "situation_id")
    private Integer situationId;
}