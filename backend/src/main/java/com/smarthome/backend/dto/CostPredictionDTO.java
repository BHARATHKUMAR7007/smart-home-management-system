package com.smarthome.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CostPredictionDTO {
    private Double dailyCost;
    private Double estimatedMonthlyBill;
    private Double ratePerUnit;
    private Double totalEnergyConsumed;
}
