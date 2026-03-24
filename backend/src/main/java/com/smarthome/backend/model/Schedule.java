package com.smarthome.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
@Data
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    private LocalTime onTime;
    private LocalTime offTime;

    private boolean active = true;
}
