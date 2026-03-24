package com.smarthome.backend.repository;

import com.smarthome.backend.model.DeviceErrorLog;
import com.smarthome.backend.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeviceErrorLogRepository extends JpaRepository<DeviceErrorLog, Long> {
    List<DeviceErrorLog> findByDeviceOrderByTimestampDesc(Device device);
}
