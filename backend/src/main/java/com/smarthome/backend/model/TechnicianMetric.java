package com.smarthome.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "technician_metrics")
@Data
public class TechnicianMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private User technician;

    private LocalDate date;

    private Integer jobsCompleted = 0;
    private Double avgResolutionTime = 0.0; // in minutes
    private Double firstTimeFixRate = 100.0; // percentage
    private Double customerRating = 5.0; // 1-5 scale
    private Integer pendingJobs = 0;
    private Double slaComplianceRate = 100.0; // percentage
}
