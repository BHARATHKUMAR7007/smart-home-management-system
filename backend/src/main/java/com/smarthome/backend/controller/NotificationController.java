package com.smarthome.backend.controller;

import com.smarthome.backend.model.Notification;
import com.smarthome.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")

public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getUnreadNotifications() {
        return notificationService.getUnreadNotifications();
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
}
