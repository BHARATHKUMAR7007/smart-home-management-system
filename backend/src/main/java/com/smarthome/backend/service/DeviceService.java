package com.smarthome.backend.service;

import com.smarthome.backend.model.Device;
import com.smarthome.backend.model.Role;
import com.smarthome.backend.model.User;
import com.smarthome.backend.repository.DeviceRepository;
import com.smarthome.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.smarthome.backend.repository.EnergyLogRepository energyLogRepository;

    public List<com.smarthome.backend.dto.DeviceUsageDTO> getDevicesWithUsage(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        List<Device> devices = deviceRepository.findByOwnerId(user.getId());

        return devices.stream().map(device -> {
            double todayUsage = energyLogRepository.findByDeviceId(device.getId()).stream()
                    .filter(log -> log.getTimestamp().toLocalDate().equals(java.time.LocalDate.now()))
                    .mapToDouble(com.smarthome.backend.model.EnergyLog::getEnergyConsumed).sum();

            return new com.smarthome.backend.dto.DeviceUsageDTO(
                    device.getId(),
                    device.getName(),
                    device.getType(),
                    device.getPowerRating(),
                    device.getLocation(),
                    device.getStatus(),
                    todayUsage);
        }).collect(java.util.stream.Collectors.toList());
    }

    public List<Device> getDevices(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        if (user.getRole() == Role.ADMIN) {
            return deviceRepository.findAll();
        }
        return deviceRepository.findByOwnerId(user.getId());
    }

    public Device addDevice(Device device, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        device.setOwner(user);
        return deviceRepository.save(device);
    }

    public Device updateDevice(Long id, Device updatedDevice, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Device device = deviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Device not found"));

        if (user.getRole() != Role.ADMIN && !device.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to device");
        }

        device.setName(updatedDevice.getName());
        device.setType(updatedDevice.getType());
        device.setPowerRating(updatedDevice.getPowerRating());
        device.setLocation(updatedDevice.getLocation());
        return deviceRepository.save(device);
    }

    public void deleteDevice(Long id, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Device device = deviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Device not found"));

        if (user.getRole() != Role.ADMIN && !device.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to device");
        }
        deviceRepository.deleteById(id);
    }

    public Device toggleDevice(Long id, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Device device = deviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Device not found"));

        if (user.getRole() != Role.ADMIN && !device.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to device");
        }

        device.setStatus(!device.getStatus());
        return deviceRepository.save(device);
    }

    // Technician only feature, typically doesn't need owner check if restricted to
    // technician role at endpoint
    public Device updateInstallationStatus(Long id, String status) {
        return deviceRepository.findById(id).map(device -> {
            device.setInstallationStatus(status);
            return deviceRepository.save(device);
        }).orElseThrow(() -> new RuntimeException("Device not found"));
    }
}
