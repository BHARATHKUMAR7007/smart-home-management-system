package com.smarthome.backend.repository;

import com.smarthome.backend.model.EnergyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnergyLogRepository extends JpaRepository<EnergyLog, Long> {
    List<EnergyLog> findByDeviceId(Long deviceId);

    List<EnergyLog> findByDeviceOwnerId(Long ownerId);

    List<EnergyLog> findByDeviceIdAndTimestampAfter(Long deviceId, java.time.LocalDateTime timestamp);
}
