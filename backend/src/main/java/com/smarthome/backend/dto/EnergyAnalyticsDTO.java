package com.smarthome.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnergyAnalyticsDTO {
    private String mostUsedDevice;
    private String leastUsedDevice;
    private Double averageUsageDurationHours;
    private Integer onOffFrequency;
    private Double estimatedCostINR;
}
