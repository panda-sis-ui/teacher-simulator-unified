package com.mmarkov.eduteach.repository;

import com.mmarkov.eduteach.entity.access.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByLogin(String login);

    @Query("""
        SELECT u FROM User u
        JOIN FETCH u.role r
        WHERE u.login = :login
    """)
    Optional<User> findByLoginWithRole(@Param("login") String login);
}