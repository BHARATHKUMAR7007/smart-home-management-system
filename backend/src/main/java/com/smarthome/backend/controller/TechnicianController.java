package com.smarthome.backend.controller;

import com.smarthome.backend.model.*;
import com.smarthome.backend.service.TechnicianService;
import com.smarthome.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/technician")
@RequiredArgsConstructor

public class TechnicianController {

    private final TechnicianService technicianService;
    private final UserRepository userRepository;

    @GetMapping("/assigned-homes")
    public List<User> getAssignedHomes(Principal principal) {
        User technician = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Technician not found"));
        return technicianService.getAssignedHomeowners(technician);
    }

    @GetMapping("/homes/{homeownerId}/devices")
    public List<Device> getHomeDevices(@PathVariable Long homeownerId) {
        return technicianService.getDevicesByHomeowner(homeownerId);
    }

    @PostMapping("/devices/register")
    public Device registerDevice(@RequestBody Map<String, Object> payload) {
        Long homeownerId = Long.valueOf(payload.get("homeownerId").toString());
        Device device = new Device();
        device.setName(payload.get("name").toString());
        device.setType(DeviceType.valueOf(payload.get("type").toString()));
        device.setPowerRating(Double.valueOf(payload.get("powerRating").toString()));
        device.setLocation(payload.get("location").toString());

        return technicianService.registerDevice(device, homeownerId);
    }

    @PutMapping("/devices/{deviceId}")
    public Device updateDevice(@PathVariable Long deviceId, @RequestBody Device deviceDetails) {
        return technicianService.updateDeviceConfig(deviceId, deviceDetails);
    }

    @PostMapping("/reports")
    public MaintenanceReport submitReport(Principal principal, @RequestBody Map<String, Object> payload) {
        User technician = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        Long deviceId = Long.valueOf(payload.get("deviceId").toString());
        String remarks = payload.get("remarks").toString();
        String resolutionNotes = payload.get("resolutionNotes").toString();

        return technicianService.submitReport(technician.getId(), deviceId, remarks, resolutionNotes);
    }

    @GetMapping("/devices/{deviceId}/logs")
    public List<DeviceErrorLog> getDeviceLogs(@PathVariable Long deviceId) {
        return technicianService.getDeviceErrorLogs(deviceId);
    }

    @GetMapping("/tasks")
    public List<ServiceTask> getMyTasks(Principal principal) {
        User technician = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Technician not found"));
        return technicianService.getTasksForTechnician(technician);
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ServiceTask updateTaskStatus(@PathVariable Long taskId, @RequestBody Map<String, String> payload) {
        ServiceTask.TaskStatus status = ServiceTask.TaskStatus.valueOf(payload.get("status"));
        return technicianService.updateTaskStatus(taskId, status);
    }

    @PostMapping("/devices/{deviceId}/test")
    public Map<String, String> testDevice(@PathVariable Long deviceId) {
        String result = technicianService.remoteTestDevice(deviceId);
        return Map.of("message", result);
    }

    @PostMapping("/devices/{deviceId}/reset")
    public Map<String, String> resetDevice(@PathVariable Long deviceId) {
        String result = technicianService.remoteResetDevice(deviceId);
        return Map.of("message", result);
    }

    @GetMapping("/metrics")
    public TechnicianMetric getMetrics(Principal principal) {
        User technician = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Technician not found"));
        return technicianService.getMetrics(technician);
    }
}
