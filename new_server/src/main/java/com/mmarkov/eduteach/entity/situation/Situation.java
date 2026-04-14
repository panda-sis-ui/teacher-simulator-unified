package com.mmarkov.eduteach.entity.situation;

import com.mmarkov.eduteach.entity.participant.Participant;
import com.mmarkov.eduteach.entity.problem.Problem;
import com.mmarkov.eduteach.entity.script.ScriptNode;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "situation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Situation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "context_id", nullable = false)
    private Context context;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "script_node_id", unique = true, nullable = false)
    private ScriptNode scriptNode;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany
    @JoinTable(
        name = "situation_participants",
        joinColumns = @JoinColumn(name = "situation_id"),
        inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    @Builder.Default
    private List<Participant> participants = new ArrayList<>();
}