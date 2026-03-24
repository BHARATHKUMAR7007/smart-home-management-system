package com.smarthome.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_reports")
@Data
public class MaintenanceReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private User technician;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
