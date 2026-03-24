package com.smarthome.backend.service;

import com.smarthome.backend.model.Notification;
import com.smarthome.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByReadFalseOrderByTimestampDesc();
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
}
