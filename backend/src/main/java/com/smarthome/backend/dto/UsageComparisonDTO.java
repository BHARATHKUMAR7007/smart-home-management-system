package com.smarthome.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsageComparisonDTO {
    private Double lastWeekUsage;
    private Double thisWeekUsage;
    private Double percentageChange; // negative means reduction
    private String summary; // e.g., "Energy reduced by 16%"
}
