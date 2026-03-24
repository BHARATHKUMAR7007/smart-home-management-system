package com.smarthome.backend.controller;

import com.smarthome.backend.model.Device;
import com.smarthome.backend.model.Schedule;
import com.smarthome.backend.repository.ScheduleRepository;
import com.smarthome.backend.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private com.smarthome.backend.repository.UserRepository userRepository;

    private com.smarthome.backend.model.User getCurrentUser() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @GetMapping
    public List<Schedule> getAllSchedules() {
        com.smarthome.backend.model.User user = getCurrentUser();
        if (user.getRole() == com.smarthome.backend.model.Role.ADMIN) {
            return scheduleRepository.findAll();
        }
        return scheduleRepository.findByDeviceOwnerId(user.getId());
    }

    @GetMapping("/device/{deviceId}")
    public List<Schedule> getSchedulesByDevice(@PathVariable Long deviceId) {
        return scheduleRepository.findByDeviceId(deviceId);
    }

    @PostMapping("/device/{deviceId}")
    public Schedule addSchedule(@PathVariable Long deviceId, @RequestBody ScheduleRequest request) {
        Device device = deviceRepository.findById(deviceId).orElseThrow();
        Schedule schedule = new Schedule();
        schedule.setDevice(device);
        schedule.setOnTime(request.getOnTime());
        schedule.setOffTime(request.getOffTime());
        schedule.setActive(true);
        return scheduleRepository.save(schedule);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        scheduleRepository.deleteById(id);
    }

    // DTO class
    public static class ScheduleRequest {
        private LocalTime onTime;
        private LocalTime offTime;

        public LocalTime getOnTime() {
            return onTime;
        }

        public void setOnTime(LocalTime onTime) {
            this.onTime = onTime;
        }

        public LocalTime getOffTime() {
            return offTime;
        }

        public void setOffTime(LocalTime offTime) {
            this.offTime = offTime;
        }
    }
}
