package com.smarthome.backend.controller;

import com.smarthome.backend.model.Sensor;
import com.smarthome.backend.repository.SensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sensors")

public class SensorController {

    @Autowired
    private SensorRepository sensorRepository;

    @GetMapping
    public List<Sensor> getAllSensors() {
        List<Sensor> sensors = sensorRepository.findAll();
        if (sensors.isEmpty()) {
            // Seed initial data if empty
            createMockSensors();
            return sensorRepository.findAll();
        }
        return sensors;
    }

    private void createMockSensors() {
        createSensor("Temperature", 24.5, "°C");
        createSensor("Humidity", 45.0, "%");
        createSensor("CO2", 400.0, "ppm");
        createSensor("Motion", 0.0, ""); // 0 = No motion, 1 = Motion
    }

    private void createSensor(String type, Double value, String unit) {
        Sensor s = new Sensor();
        s.setType(type);
        s.setValue(value);
        s.setUnit(unit);
        sensorRepository.save(s);
    }

    // Endpoint to update sensor data (simulating hardware push)
    @PostMapping("/{id}/update")
    public Sensor updateSensor(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        Sensor sensor = sensorRepository.findById(id).orElseThrow();
        sensor.setValue(payload.get("value"));
        return sensorRepository.save(sensor);
    }
}
