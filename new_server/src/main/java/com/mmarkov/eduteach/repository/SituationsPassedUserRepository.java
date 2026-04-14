package com.mmarkov.eduteach.repository;

import com.mmarkov.eduteach.entity.situation.SituationsPassedUser;
import com.mmarkov.eduteach.entity.situation.SituationsPassedUserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SituationsPassedUserRepository
        extends JpaRepository<SituationsPassedUser, SituationsPassedUserId> {

    @Query("""
        SELECT spu FROM SituationsPassedUser spu
        JOIN FETCH spu.situation sit
        JOIN FETCH sit.problem p
        JOIN FETCH spu.finalMetrics fm
        WHERE spu.id.userId = :userId
          AND spu.id.situationId = :situationId
    """)
    Optional<SituationsPassedUser> findByUserIdAndSituationId(
            @Param("userId") Integer userId,
            @Param("situationId") Integer situationId
    );

    @Query("""
        SELECT spu FROM SituationsPassedUser spu
        JOIN FETCH spu.situation sit
        JOIN FETCH spu.finalMetrics fm
        WHERE spu.id.userId = :userId
        ORDER BY spu.passedAt DESC
    """)
    List<SituationsPassedUser> findAllByUserId(@Param("userId") Integer userId);
}