package com.smarthome.backend.controller;

import com.smarthome.backend.model.EnergyLog;
import com.smarthome.backend.repository.EnergyLogRepository;
import com.smarthome.backend.service.EnergyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/energy")
public class EnergyController {

        @Autowired
        private EnergyLogRepository energyLogRepository;

        @Autowired
        private com.smarthome.backend.repository.UserRepository userRepository;

        @Autowired
        private com.smarthome.backend.repository.DeviceRepository deviceRepository;

        @Autowired
        private EnergyService energyService;

        private com.smarthome.backend.model.User getCurrentUser() {
                String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                                .getAuthentication().getName();
                return userRepository.findByUsername(username).orElseThrow();
        }

        @GetMapping("/analytics")
        public com.smarthome.backend.dto.EnergyAnalyticsDTO getAnalytics() {
                com.smarthome.backend.model.User user = getCurrentUser();
                List<EnergyLog> logs;

                if (user.getRole() == com.smarthome.backend.model.Role.ADMIN) {
                        logs = energyLogRepository.findAll();
                } else {
                        logs = energyLogRepository.findByDeviceOwnerId(user.getId());
                }

                if (logs.isEmpty()) {
                        return new com.smarthome.backend.dto.EnergyAnalyticsDTO("None", "None", 0.0, 0, 0.0);
                }

                java.util.Map<String, Double> consumptionByDevice = logs.stream()
                                .collect(java.util.stream.Collectors.groupingBy(log -> log.getDevice().getName(),
                                                java.util.stream.Collectors
                                                                .summingDouble(EnergyLog::getEnergyConsumed)));

                String mostUsed = consumptionByDevice.entrySet().stream()
                                .max(java.util.Map.Entry.comparingByValue())
                                .map(java.util.Map.Entry::getKey).orElse("None");

                String leastUsed = consumptionByDevice.entrySet().stream()
                                .min(java.util.Map.Entry.comparingByValue())
                                .map(java.util.Map.Entry::getKey).orElse("None");

                double avgUsage = logs.stream().mapToDouble(EnergyLog::getEnergyConsumed).average().orElse(0);
                int frequency = logs.size();
                double totalConsumption = logs.stream().mapToDouble(EnergyLog::getEnergyConsumed).sum();
                double estimatedCost = totalConsumption * 10.0; // Updated rate to ₹10/kWh

                return new com.smarthome.backend.dto.EnergyAnalyticsDTO(mostUsed, leastUsed, avgUsage, frequency,
                                estimatedCost);
        }

        @GetMapping("/summary")
        public com.smarthome.backend.dto.EnergySummaryDTO getSummary() {
                com.smarthome.backend.model.User user = getCurrentUser();
                List<com.smarthome.backend.model.Device> devices = deviceRepository.findByOwnerId(user.getId());
                List<EnergyLog> logs = energyLogRepository.findByDeviceOwnerId(user.getId());

                double todayConsumption = logs.stream()
                                .filter(log -> log.getTimestamp().toLocalDate().equals(java.time.LocalDate.now()))
                                .mapToDouble(EnergyLog::getEnergyConsumed).sum();

                double monthlyConsumption = logs.stream()
                                .filter(log -> log.getTimestamp().getMonth()
                                                .equals(java.time.LocalDate.now().getMonth()))
                                .mapToDouble(EnergyLog::getEnergyConsumed).sum();

                String highestDevice = logs.stream()
                                .collect(java.util.stream.Collectors.groupingBy(log -> log.getDevice().getName(),
                                                java.util.stream.Collectors
                                                                .summingDouble(EnergyLog::getEnergyConsumed)))
                                .entrySet().stream().max(java.util.Map.Entry.comparingByValue())
                                .map(java.util.Map.Entry::getKey).orElse("N/A");

                return new com.smarthome.backend.dto.EnergySummaryDTO(
                                devices.size(),
                                todayConsumption,
                                monthlyConsumption,
                                highestDevice,
                                monthlyConsumption * 10.0);
        }

        @GetMapping("/logs/{deviceId}")
        public List<EnergyLog> getDeviceLogs(@PathVariable Long deviceId) {
                com.smarthome.backend.model.User user = getCurrentUser();
                return energyLogRepository.findByDeviceId(deviceId);
        }

        @GetMapping("/analytics/patterns")
        public com.smarthome.backend.dto.UsagePatternDTO getUsagePatterns(
                        @RequestParam(defaultValue = "weekly") String timeframe) {
                return energyService.getUsagePattern(getCurrentUser(), timeframe);
        }

        @GetMapping("/analytics/comparison")
        public com.smarthome.backend.dto.UsageComparisonDTO getUsageComparison() {
                return energyService.getUsageComparison(getCurrentUser());
        }

        @GetMapping("/analytics/cost")
        public com.smarthome.backend.dto.CostPredictionDTO getCostPrediction(
                        @RequestParam(defaultValue = "10.0") Double rate) {
                return energyService.getCostPrediction(getCurrentUser(), rate);
        }

        @GetMapping("/analytics/peak")
        public com.smarthome.backend.dto.PeakAnalysisDTO getPeakAnalysis() {
                return energyService.getPeakAnalysis(getCurrentUser());
        }

        @GetMapping("/insights")
        public List<String> getInsights() {
                return energyService.getInsights(getCurrentUser());
        }
}
