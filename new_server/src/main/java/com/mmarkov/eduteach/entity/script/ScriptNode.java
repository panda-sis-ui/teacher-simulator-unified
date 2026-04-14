package com.mmarkov.eduteach.entity.script;

import com.mmarkov.eduteach.entity.situation.Situation;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "script_node")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScriptNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "url_image", length = 500)
    private String urlImage;

    @Column(name = "is_terminal")
    @Builder.Default
    private Boolean isTerminal = false;

    @OneToMany(mappedBy = "fromScriptNode", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Choice> choicesFrom = new ArrayList<>();

    @OneToMany(mappedBy = "nextScriptNode", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Choice> choicesTo = new ArrayList<>();

    @OneToOne(mappedBy = "scriptNode")
    private Situation situation;
}