package com.mmarkov.eduteach.entity.participant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pedagogical_style")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedagogicalStyle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;
}