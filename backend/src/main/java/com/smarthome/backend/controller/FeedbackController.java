package com.smarthome.backend.controller;

import com.smarthome.backend.model.Feedback;
import com.smarthome.backend.model.User;
import com.smarthome.backend.repository.FeedbackRepository;
import com.smarthome.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")

public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody java.util.Map<String, String> payload, Principal principal) {
        System.out.println("Received feedback submission request");
        String name = payload.get("name");
        String email = payload.get("email");
        String message = payload.get("message");

        if (name == null || email == null || message == null) {
            return ResponseEntity.badRequest().body("Name, Email and Message are required");
        }

        Feedback feedback = new Feedback();
        feedback.setName(name);
        feedback.setEmail(email);
        feedback.setMessage(message);

        if (principal != null) {
            User user = userRepository.findByUsername(principal.getName()).orElse(null);
            feedback.setUser(user);
        }

        feedbackRepository.save(feedback);
        System.out.println("Feedback saved successfully for " + email);
        return ResponseEntity.ok("Feedback submitted successfully. Thank you!");
    }

    @GetMapping("/my")
    public ResponseEntity<List<Feedback>> getMyFeedback(Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        return ResponseEntity.ok(feedbackRepository.findByUserId(user.getId()));
    }
}
