package com.smarthome.backend.repository;

import com.smarthome.backend.model.TechnicianMetric;
import com.smarthome.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TechnicianMetricRepository extends JpaRepository<TechnicianMetric, Long> {
    Optional<TechnicianMetric> findByTechnicianAndDate(User technician, LocalDate date);
}
