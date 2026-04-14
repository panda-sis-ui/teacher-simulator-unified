package com.mmarkov.eduteach.repository;

import com.mmarkov.eduteach.entity.situation.Situation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SituationRepository extends JpaRepository<Situation, Integer> {

    // Для PlayService — только то что нужно для старта
    @Query("""
        SELECT s FROM Situation s
        JOIN FETCH s.problem p
        JOIN FETCH s.scriptNode sn
        JOIN FETCH s.context c
        WHERE s.id = :id
    """)
    Optional<Situation> findByIdWithDetails(@Param("id") Integer id);

    // Для списка ситуаций
    @Query("""
        SELECT s FROM Situation s
        JOIN FETCH s.problem p
        JOIN FETCH p.typeProblem
        JOIN FETCH s.context c
        JOIN FETCH c.lesson
        JOIN FETCH c.lessonFormat
        JOIN FETCH s.scriptNode
    """)
    List<Situation> findAllWithSummary();

    // Для детальной карточки ситуации — без участников
    @Query("""
        SELECT s FROM Situation s
        JOIN FETCH s.problem p
        JOIN FETCH p.typeProblem
        JOIN FETCH p.sourceProblem
        LEFT JOIN FETCH p.emotions
        JOIN FETCH s.context c
        JOIN FETCH c.lesson
        JOIN FETCH c.classroom
        JOIN FETCH c.lessonStage
        JOIN FETCH c.lessonFormat
        LEFT JOIN FETCH c.techEquip
        JOIN FETCH s.scriptNode sn
        WHERE s.id = :id
    """)
    Optional<Situation> findByIdForDetail(@Param("id") Integer id);

    // Участники ситуации — отдельным запросом
    @Query("""
        SELECT s FROM Situation s
        JOIN FETCH s.participants p
        WHERE s.id = :id
    """)
    Optional<Situation> findByIdWithParticipants(@Param("id") Integer id);
}