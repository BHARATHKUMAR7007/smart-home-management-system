package com.smarthome.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "automation_rules")
@Data
public class AutomationRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "Turn on AC if hot"

    @Column(nullable = false)
    private Long triggerSensorId; // ID of the sensor to watch

    @Column(nullable = false)
    private String condition; // >, <, =

    @Column(nullable = false)
    private Double triggerValue; // e.g., 30.0

    @Column(nullable = false)
    private Long actionDeviceId; // ID of device to control

    @Column(nullable = false)
    private String action; // ON, OFF
}
