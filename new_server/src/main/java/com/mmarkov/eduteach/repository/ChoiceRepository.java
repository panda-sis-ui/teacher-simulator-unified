package com.mmarkov.eduteach.repository;

import com.mmarkov.eduteach.entity.script.Choice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChoiceRepository extends JpaRepository<Choice, Integer> {

    @Query("""
        SELECT c FROM Choice c
        JOIN FETCH c.fromScriptNode fsn
        LEFT JOIN FETCH c.nextScriptNode nsn
        LEFT JOIN FETCH nsn.choicesFrom nc
        LEFT JOIN FETCH c.typeConsequence
        WHERE c.id = :id
    """)
    Optional<Choice> findByIdWithNodes(@Param("id") Integer id);
}