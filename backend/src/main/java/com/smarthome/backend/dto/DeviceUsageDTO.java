package com.smarthome.backend.dto;

import com.smarthome.backend.model.DeviceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeviceUsageDTO {
    private Long id;
    private String name;
    private DeviceType type;
    private Double powerRating;
    private String location;
    private Boolean status;
    private Double todayUsage; // kWh
}
