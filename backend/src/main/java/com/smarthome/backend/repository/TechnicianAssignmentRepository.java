package com.smarthome.backend.repository;

import com.smarthome.backend.model.TechnicianAssignment;
import com.smarthome.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TechnicianAssignmentRepository extends JpaRepository<TechnicianAssignment, Long> {
    List<TechnicianAssignment> findByTechnician(User technician);

    boolean existsByTechnicianAndHomeowner(User technician, User homeowner);
}
