package com.smarthome.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsagePatternDTO {
    private List<String> labels; // e.g., "Mon", "Tue" or "Week 1"
    private List<Double> data; // corresponding energy values
}
