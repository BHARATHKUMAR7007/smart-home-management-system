package com.smarthome.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "devices")
@Data
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeviceType type;

    @Column(nullable = false)
    private Double powerRating; // In Watts

    private String location; // e.g., Living Room

    @Column(nullable = false)
    private Boolean status = false; // false = OFF, true = ON

    private String installationStatus = "PENDING"; // PENDING, COMPLETED

    // New fields for advanced control
    private Double temperature; // For AC (e.g., 24.0)
    private Integer speed; // For Fan (1-5)
    private String mode; // For AC/Lights (e.g., "COOL", "WARM", "DIM")

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private User owner;

    private java.time.LocalDateTime installationDate;
    private java.time.LocalDateTime lastActive;

    @Enumerated(EnumType.STRING)
    private HealthStatus healthStatus = HealthStatus.ACTIVE;

    private Integer batteryLevel; // 0-100
    private String firmwareVersion;
    private Integer signalStrength; // 0-100
}
