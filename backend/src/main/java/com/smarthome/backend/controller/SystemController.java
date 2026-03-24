package com.smarthome.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/system")

public class SystemController {

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("appName", "Smart Power Saving System");
        info.put("version", "1.1.0");
        info.put("description", "A comprehensive solution for monitoring and optimizing home energy consumption.");
        info.put("developer", "Smart Power Team");
        info.put("features", new String[] {
                "Real-time Energy Monitoring",
                "Smart Device Control",
                "Automated Scheduling",
                "Energy Analytics & Insights",
                "Multi-node Security Tracking"
        });
        info.put("supportEmail", "support@smartpower.com");
        return ResponseEntity.ok(info);
    }
}
