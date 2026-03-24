package com.smarthome.backend.repository;

import com.smarthome.backend.model.MaintenanceReport;
import com.smarthome.backend.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaintenanceReportRepository extends JpaRepository<MaintenanceReport, Long> {
    List<MaintenanceReport> findByDevice(Device device);
}
