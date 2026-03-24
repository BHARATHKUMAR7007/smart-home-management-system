package com.smarthome.backend.service;

import com.smarthome.backend.model.*;
import com.smarthome.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TechnicianService {

    private final TechnicianAssignmentRepository assignmentRepository;
    private final DeviceRepository deviceRepository;
    private final MaintenanceReportRepository reportRepository;
    private final DeviceErrorLogRepository errorLogRepository;
    private final UserRepository userRepository;
    private final ServiceTaskRepository serviceTaskRepository;
    private final TechnicianMetricRepository metricRepository;

    public List<User> getAssignedHomeowners(User technician) {
        return assignmentRepository.findByTechnician(technician)
                .stream()
                .map(TechnicianAssignment::getHomeowner)
                .collect(Collectors.toList());
    }

    public List<Device> getDevicesByHomeowner(Long homeownerId) {
        User homeowner = userRepository.findById(homeownerId)
                .orElseThrow(() -> new RuntimeException("Homeowner not found"));
        return deviceRepository.findByOwner(homeowner);
    }

    @Transactional
    public Device registerDevice(Device device, Long homeownerId) {
        User homeowner = userRepository.findById(homeownerId)
                .orElseThrow(() -> new RuntimeException("Homeowner not found"));
        device.setOwner(homeowner);
        device.setInstallationDate(LocalDateTime.now());
        device.setHealthStatus(HealthStatus.ACTIVE);
        return deviceRepository.save(device);
    }

    @Transactional
    public Device updateDeviceConfig(Long deviceId, Device deviceDetails) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        device.setName(deviceDetails.getName());
        device.setPowerRating(deviceDetails.getPowerRating());
        device.setLocation(deviceDetails.getLocation());
        device.setHealthStatus(deviceDetails.getHealthStatus());

        return deviceRepository.save(device);
    }

    @Transactional
    public MaintenanceReport submitReport(Long technicianId, Long deviceId, String remarks, String resolutionNotes) {
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        MaintenanceReport report = new MaintenanceReport();
        report.setTechnician(technician);
        report.setDevice(device);
        report.setRemarks(remarks);
        report.setResolutionNotes(resolutionNotes);

        return reportRepository.save(report);
    }

    public List<DeviceErrorLog> getDeviceErrorLogs(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        return errorLogRepository.findByDeviceOrderByTimestampDesc(device);
    }

    public List<ServiceTask> getTasksForTechnician(User technician) {
        return serviceTaskRepository.findByTechnician(technician);
    }

    @Transactional
    public ServiceTask updateTaskStatus(Long taskId, ServiceTask.TaskStatus status) {
        ServiceTask task = serviceTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return serviceTaskRepository.save(task);
    }

    @Transactional
    public String remoteTestDevice(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // Mock testing logic: update last active and return status
        device.setLastActive(LocalDateTime.now());
        deviceRepository.save(device);

        return "Ping successful. Latency: 24ms. Internal Self-Test: PASSED. Battery: 89%.";
    }

    @Transactional
    public String remoteResetDevice(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // Mock reset logic
        device.setStatus(false);
        device.setLastActive(LocalDateTime.now());
        deviceRepository.save(device);

        return "Device rebooted successfully. Connection re-established.";
    }

    public TechnicianMetric getMetrics(User technician) {
        return metricRepository.findByTechnicianAndDate(technician, java.time.LocalDate.now())
                .orElseGet(() -> {
                    TechnicianMetric m = new TechnicianMetric();
                    m.setTechnician(technician);
                    m.setDate(java.time.LocalDate.now());
                    return metricRepository.save(m);
                });
    }
}
