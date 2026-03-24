package com.smarthome.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnergySummaryDTO {
    private long totalDevices;
    private double todayConsumption; // kWh
    private double monthlyConsumption; // kWh
    private String highestConsumingDevice;
    private double estimatedMonthlyCost;
}
