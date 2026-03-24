package com.smarthome.backend.repository;

import com.smarthome.backend.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByOwnerId(Long ownerId);

    List<com.smarthome.backend.model.Device> findByOwner(com.smarthome.backend.model.User owner);
}
