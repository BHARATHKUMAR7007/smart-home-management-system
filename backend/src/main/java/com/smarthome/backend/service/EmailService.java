package com.smarthome.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("your-email@gmail.com"); // Will be overridden by properties usually, but good fallback
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("Email Sent Successfully to " + to);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            System.out.println("FALLBACK: Link for " + to + " is in the body: " + body);
        }
    }
}
