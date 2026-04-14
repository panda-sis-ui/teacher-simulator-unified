package com.mmarkov.eduteach.repository;

import com.mmarkov.eduteach.entity.script.ScriptNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScriptNodeRepository extends JpaRepository<ScriptNode, Integer> {

    @Query("""
        SELECT sn FROM ScriptNode sn
        LEFT JOIN FETCH sn.choicesFrom c
        LEFT JOIN FETCH c.solution sol
        LEFT JOIN FETCH c.typeConsequence
        WHERE sn.id = :id
    """)
    Optional<ScriptNode> findByIdWithChoices(@Param("id") Integer id);

    /**
     * Проверяет, достижим ли узел fromNodeId из стартового узла ситуации.
     * Используется для валидации: принадлежит ли выбор данной ситуации.
     */
    @Query("""
        SELECT COUNT(c) > 0
        FROM Choice c
        WHERE c.fromScriptNode.id = :fromNodeId
          AND c.id = :choiceId
    """)
    boolean existsChoiceForNode(
            @Param("fromNodeId") Integer fromNodeId,
            @Param("choiceId") Integer choiceId
    );
}