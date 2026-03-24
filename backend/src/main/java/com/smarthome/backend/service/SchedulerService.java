package com.smarthome.backend.service;

import com.smarthome.backend.model.Device;
import com.smarthome.backend.model.Schedule;
import com.smarthome.backend.repository.DeviceRepository;
import com.smarthome.backend.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class SchedulerService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Scheduled(cron = "0 * * * * *") // Every minute
    public void checkSchedules() {
        List<Schedule> schedules = scheduleRepository.findAll();
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);

        for (Schedule schedule : schedules) {
            if (schedule.isActive()) {
                if (schedule.getOnTime() != null && schedule.getOnTime().equals(now)) {
                    updateDeviceStatus(schedule.getDevice(), true);
                } else if (schedule.getOffTime() != null && schedule.getOffTime().equals(now)) {
                    updateDeviceStatus(schedule.getDevice(), false);
                }
            }
        }
    }

    private void updateDeviceStatus(Device device, boolean status) {
        if (device.getStatus() != status) {
            device.setStatus(status);
            deviceRepository.save(device);
            System.out.println("Scheduler updated device " + device.getName() + " to " + (status ? "ON" : "OFF"));
        }
    }
}
