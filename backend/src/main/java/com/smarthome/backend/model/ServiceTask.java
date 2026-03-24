package com.smarthome.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_tasks")
@Data
public class ServiceTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskType type; // INSTALLATION, MAINTENANCE, TROUBLESHOOTING

    @Enumerated(EnumType.STRING)
    private TaskPriority priority; // LOW, MEDIUM, HIGH, URGENT

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    private LocalDateTime scheduledDate;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private User technician;

    @ManyToOne
    @JoinColumn(name = "homeowner_id", nullable = false)
    private User homeowner;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TaskType {
        INSTALLATION, MAINTENANCE, TROUBLESHOOTING
    }

    public enum TaskPriority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum TaskStatus {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
