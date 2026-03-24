package com.smarthome.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "technician_assignments")
@Data
public class TechnicianAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private User technician;

    @ManyToOne
    @JoinColumn(name = "homeowner_id", nullable = false)
    private User homeowner;

    private LocalDateTime assignedAt;

    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
    }
}
