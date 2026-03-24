package com.smarthome.backend.controller;

import com.smarthome.backend.model.Role;
import com.smarthome.backend.model.User;
import com.smarthome.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
// Ensure SecurityConfig handles this or use @PreAuthorize
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- User Management ---

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String roleStr = request.get("role");
        String fullName = request.get("fullName");

        if (userRepository.findByEmail(email).isPresent() || userRepository.findByUsername(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);

        try {
            Role role = Role.valueOf(roleStr.toUpperCase());
            user.setRole(role);
        } catch (IllegalArgumentException e) {
            user.setRole(Role.HOMEOWNER); // Default
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        if (request.containsKey("fullName"))
            user.setFullName(request.get("fullName"));
        if (request.containsKey("role")) {
            try {
                user.setRole(Role.valueOf(request.get("role").toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid
            }
        }
        if (request.containsKey("password") && !request.get("password").isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.get("password")));
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // --- Dashboard Stats ---

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        // Typically, we would query the DeviceRepository for device counts.
        // For now, returning mocked up or zeros if repository isn't available
        // in this context yet. Let's assume we can add DeviceRepository later.
        stats.put("totalUsers", totalUsers);
        stats.put("activeDevices", 0); // To be implemented
        stats.put("alerts", 0); // To be implemented
        return ResponseEntity.ok(stats);
    }
}
