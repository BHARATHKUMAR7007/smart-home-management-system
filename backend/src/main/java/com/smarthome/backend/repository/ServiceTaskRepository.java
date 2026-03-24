package com.smarthome.backend.repository;

import com.smarthome.backend.model.ServiceTask;
import com.smarthome.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceTaskRepository extends JpaRepository<ServiceTask, Long> {
    List<ServiceTask> findByTechnician(User technician);

    List<ServiceTask> findByHomeowner(User homeowner);
}
