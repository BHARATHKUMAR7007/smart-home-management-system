package com.smarthome.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeakAnalysisDTO {
    private List<String> peakHours; // e.g. "18:00 - 22:00"
    private List<String> offPeakHours; // e.g. "00:00 - 06:00"
    private List<Double> hourlyUsage; // 24 items mapping 0-23 hours to consumption
}
