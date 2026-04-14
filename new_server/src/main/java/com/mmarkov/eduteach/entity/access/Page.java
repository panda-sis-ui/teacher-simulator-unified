package com.mmarkov.eduteach.entity.access;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "page")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "url_page", unique = true, nullable = false, length = 500)
    private String urlPage;

    @ManyToMany(mappedBy = "pages")
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
}