package com.mmarkov.eduteach.repository;

import com.mmarkov.eduteach.entity.participant.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Integer> {

    // Загружаем участников ситуации — учителей
    @Query("""
        SELECT p FROM Participant p
        JOIN FETCH p.teacher t
        LEFT JOIN FETCH t.pedagogicalStyle
        LEFT JOIN FETCH t.emotionIntelligence
        LEFT JOIN FETCH t.professionalRole
        WHERE p.id IN (
            SELECT part.id FROM Situation s
            JOIN s.participants part
            WHERE s.id = :situationId
        )
    """)
    List<Participant> findTeachersBySituationId(@Param("situationId") Integer situationId);

    // Загружаем участников ситуации — учеников
    @Query("""
        SELECT p FROM Participant p
        JOIN FETCH p.student st
        LEFT JOIN FETCH st.commStyle
        LEFT JOIN FETCH st.socialStatus
        LEFT JOIN FETCH st.techEquip
        WHERE p.id IN (
            SELECT part.id FROM Situation s
            JOIN s.participants part
            WHERE s.id = :situationId
        )
    """)
    List<Participant> findStudentsBySituationId(@Param("situationId") Integer situationId);
}