package com.mmarkov.eduteach.repository;

import com.mmarkov.eduteach.entity.metrics.ChangeMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChangeMetricsRepository extends JpaRepository<ChangeMetrics, Integer> {
}