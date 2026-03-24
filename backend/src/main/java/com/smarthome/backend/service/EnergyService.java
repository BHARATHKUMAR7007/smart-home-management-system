package com.smarthome.backend.service;

import com.smarthome.backend.dto.CostPredictionDTO;
import com.smarthome.backend.dto.PeakAnalysisDTO;
import com.smarthome.backend.dto.UsageComparisonDTO;
import com.smarthome.backend.dto.UsagePatternDTO;
import com.smarthome.backend.model.EnergyLog;
import com.smarthome.backend.model.User;
import com.smarthome.backend.model.Role;
import com.smarthome.backend.repository.EnergyLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EnergyService {

    @Autowired
    private EnergyLogRepository energyLogRepository;

    @Autowired
    private NotificationService notificationService;

    public UsagePatternDTO getUsagePattern(User user, String timeframe) {
        List<EnergyLog> logs = getLogsForUser(user);
        Map<String, Double> dataMap = new LinkedHashMap<>();

        if ("daily".equalsIgnoreCase(timeframe)) {
            // Last 24 hours grouped by hour
            LocalDateTime start = LocalDateTime.now().minusHours(24);
            for (int i = 0; i < 24; i++) {
                LocalDateTime hourStart = start.plusHours(i);
                String label = hourStart.format(DateTimeFormatter.ofPattern("HH:00"));
                dataMap.put(label, 0.0);
            }
            logs.stream()
                    .filter(l -> l.getTimestamp().isAfter(start))
                    .forEach(l -> {
                        String label = l.getTimestamp().format(DateTimeFormatter.ofPattern("HH:00"));
                        dataMap.merge(label, l.getEnergyConsumed(), Double::sum);
                    });
        } else if ("monthly".equalsIgnoreCase(timeframe)) {
            // Last 12 months
            LocalDate start = LocalDate.now().minusMonths(11).withDayOfMonth(1);
            for (int i = 0; i < 12; i++) {
                String label = start.plusMonths(i).format(DateTimeFormatter.ofPattern("MMM yyyy"));
                dataMap.put(label, 0.0);
            }
            logs.stream()
                    .filter(l -> l.getTimestamp().toLocalDate().isAfter(start.minusDays(1)))
                    .forEach(l -> {
                        String label = l.getTimestamp().format(DateTimeFormatter.ofPattern("MMM yyyy"));
                        dataMap.merge(label, l.getEnergyConsumed(), Double::sum);
                    });
        } else {
            // Weekly by default: last 7 days
            LocalDate start = LocalDate.now().minusDays(6);
            for (int i = 0; i < 7; i++) {
                String label = start.plusDays(i).format(DateTimeFormatter.ofPattern("EEE"));
                dataMap.put(label, 0.0);
            }
            logs.stream()
                    .filter(l -> !l.getTimestamp().toLocalDate().isBefore(start))
                    .forEach(l -> {
                        String label = l.getTimestamp().format(DateTimeFormatter.ofPattern("EEE"));
                        dataMap.merge(label, l.getEnergyConsumed(), Double::sum);
                    });
        }

        return new UsagePatternDTO(new ArrayList<>(dataMap.keySet()), new ArrayList<>(dataMap.values()));
    }

    public UsageComparisonDTO getUsageComparison(User user) {
        List<EnergyLog> logs = getLogsForUser(user);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneWeekAgo = now.minusDays(7);
        LocalDateTime twoWeeksAgo = now.minusDays(14);

        double thisWeekUsage = logs.stream()
                .filter(l -> l.getTimestamp().isAfter(oneWeekAgo) && !l.getTimestamp().isAfter(now))
                .mapToDouble(EnergyLog::getEnergyConsumed).sum();

        double lastWeekUsage = logs.stream()
                .filter(l -> l.getTimestamp().isAfter(twoWeeksAgo) && !l.getTimestamp().isAfter(oneWeekAgo))
                .mapToDouble(EnergyLog::getEnergyConsumed).sum();

        double rawChange = 0.0;
        if (lastWeekUsage > 0) {
            rawChange = ((thisWeekUsage - lastWeekUsage) / lastWeekUsage) * 100;
        } else if (thisWeekUsage > 0) {
            rawChange = 100.0;
        }

        double percentageChange = Math.round(rawChange * 10.0) / 10.0;

        String summary;
        if (percentageChange < 0) {
            summary = "Energy reduced by " + Math.abs(percentageChange) + "%";
        } else if (percentageChange > 0) {
            summary = "Energy increased by " + percentageChange + "%";
        } else {
            summary = "No change in energy usage";
        }

        return new UsageComparisonDTO(lastWeekUsage, thisWeekUsage, percentageChange, summary);
    }

    public CostPredictionDTO getCostPrediction(User user, Double rate) {
        List<EnergyLog> logs = getLogsForUser(user);
        double totalConsumed = logs.stream().mapToDouble(EnergyLog::getEnergyConsumed).sum();

        // Let's find daily average over the available days
        if (logs.isEmpty()) {
            return new CostPredictionDTO(0.0, 0.0, rate, 0.0);
        }

        LocalDateTime earliest = logs.stream().map(EnergyLog::getTimestamp).min(LocalDateTime::compareTo)
                .orElse(LocalDateTime.now());
        long daysDiff = java.time.Duration.between(earliest, LocalDateTime.now()).toDays();
        long days = Math.max(daysDiff, 1);

        double dailyAverageKwh = totalConsumed / days;
        double dailyCost = dailyAverageKwh * rate;
        double estimatedMonthlyBill = dailyCost * 30;

        return new CostPredictionDTO(dailyCost, estimatedMonthlyBill, rate, totalConsumed);
    }

    public PeakAnalysisDTO getPeakAnalysis(User user) {
        List<EnergyLog> logs = getLogsForUser(user);

        Double[] hourlySums = new Double[24];
        Arrays.fill(hourlySums, 0.0);

        logs.forEach(log -> {
            int hour = log.getTimestamp().getHour();
            hourlySums[hour] += log.getEnergyConsumed();
        });

        List<Double> hourlyUsage = Arrays.asList(hourlySums);

        // Find peak and off-peak logic (simple: top 4 hours vs bottom 4 hours)
        List<Integer> sortedHours = new ArrayList<>();
        for (int i = 0; i < 24; i++)
            sortedHours.add(i);
        sortedHours.sort((a, b) -> Double.compare(hourlySums[b], hourlySums[a])); // descending

        List<String> peak = sortedHours.subList(0, 4).stream()
                .map(this::formatHourRange)
                .collect(Collectors.toList());

        List<String> offPeak = sortedHours.subList(20, 24).stream()
                .map(this::formatHourRange)
                .collect(Collectors.toList());

        return new PeakAnalysisDTO(peak, offPeak, hourlyUsage);
    }

    public List<String> getInsights(User user) {
        List<String> insights = new ArrayList<>();
        List<EnergyLog> logs = getLogsForUser(user);
        if (logs.isEmpty()) {
            insights.add("Not enough data to generate insights yet.");
            return insights;
        }

        PeakAnalysisDTO peakData = getPeakAnalysis(user);
        if (!peakData.getPeakHours().isEmpty()) {
            insights.add("Your peak usage is during " + peakData.getPeakHours().get(0)
                    + ". Try shifting high-energy tasks to off-peak hours (" + peakData.getOffPeakHours().get(0)
                    + ") to save energy.");
        }

        Map<String, Double> deviceUsage = logs.stream()
                .collect(Collectors.groupingBy(log -> log.getDevice().getName(),
                        Collectors.summingDouble(EnergyLog::getEnergyConsumed)));

        deviceUsage.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .ifPresent(entry -> insights.add("Your " + entry.getKey() + " consumes the most energy ("
                        + String.format("%.1f", entry.getValue())
                        + " kWh). Consider using it less if possible or setting a schedule."));

        insights.add("Did you know? Setting a schedule for your devices can reduce energy by up to 20%.");

        return insights;
    }

    // Runs every minute to check if consumption has crossed 100 kWh for today
    @org.springframework.scheduling.annotation.Scheduled(cron = "0 * * * * *")
    public void checkEnergyOverloads() {
        double todayConsumption = energyLogRepository.findAll().stream()
                .filter(log -> log.getTimestamp().toLocalDate().equals(LocalDate.now()))
                .mapToDouble(EnergyLog::getEnergyConsumed).sum();

        if (todayConsumption > 100.0) {
            // Check if alert already sent today to avoid spamming (simplistic check for
            // this demo)
            List<com.smarthome.backend.model.Notification> notifs = notificationService.getUnreadNotifications();
            boolean alreadySent = notifs.stream().anyMatch(n -> n.getMessage().contains("High Energy Alert")
                    && n.getTimestamp().toLocalDate().equals(LocalDate.now()));
            if (!alreadySent) {
                notificationService.createNotification(
                        "High Energy Alert: Total consumption has exceeded 100 kWh today! Please turn off unnecessary devices.");
                System.out.println("Energy Overload Alert triggered! Total today: " + todayConsumption);
            }
        }
    }

    private String formatHourRange(int hour) {
        String start = String.format("%02d:00", hour);
        String end = String.format("%02d:00", (hour + 1) % 24);
        return start + " - " + end;
    }

    private List<EnergyLog> getLogsForUser(User user) {
        if (user.getRole() == Role.ADMIN) {
            return energyLogRepository.findAll();
        }
        return energyLogRepository.findByDeviceOwnerId(user.getId());
    }
}
