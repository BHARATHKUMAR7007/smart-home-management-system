package com.smarthome.backend.service;

import com.smarthome.backend.model.Device;
import com.smarthome.backend.model.EnergyLog;
import com.smarthome.backend.repository.DeviceRepository;
import com.smarthome.backend.repository.EnergyLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@EnableScheduling
public class SimulatorService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private EnergyLogRepository energyLogRepository;

    @Autowired
    private NotificationService notificationService;

    private final Random random = new Random();

    // Run every 10 seconds to simulate data
    @Scheduled(fixedRate = 10000)
    public void generateEnergyLogs() {
        List<Device> devices = deviceRepository.findAll();
        for (Device device : devices) {
            if (Boolean.TRUE.equals(device.getStatus())) {
                double hours = 1.0; // Assume 1 hour passed for simulation
                double powerKw = device.getPowerRating() / 1000.0;
                // Add some variance
                double variance = 0.8 + (1.2 - 0.8) * random.nextDouble();
                double consumed = powerKw * hours * variance;

                if (consumed > 0.05) { // Threshold for "spike" in 10s window (approx 18kW load)
                    notificationService.createNotification("High energy usage detected for " + device.getName());
                }

                EnergyLog log = new EnergyLog();
                log.setDevice(device);
                log.setTimestamp(LocalDateTime.now());
                log.setEnergyConsumed(consumed);
                energyLogRepository.save(log);
            }
        }
        System.out.println("Generated energy logs at " + LocalDateTime.now());
    }
}
