package com.smarthome.backend.controller;

import com.smarthome.backend.dto.UserDTO;
import com.smarthome.backend.model.User;
import com.smarthome.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getAvatarUrl(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getTheme(),
                user.getCreatedAt()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@RequestBody UserDTO userDTO, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDTO.getFullName() != null)
            user.setFullName(userDTO.getFullName());
        if (userDTO.getEmail() != null)
            user.setEmail(userDTO.getEmail());
        if (userDTO.getPhoneNumber() != null)
            user.setPhoneNumber(userDTO.getPhoneNumber());
        if (userDTO.getAddress() != null)
            user.setAddress(userDTO.getAddress());
        if (userDTO.getAvatarUrl() != null)
            user.setAvatarUrl(userDTO.getAvatarUrl());
        if (userDTO.getTheme() != null)
            user.setTheme(userDTO.getTheme());

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(new UserDTO(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getFullName(),
                updatedUser.getRole(),
                updatedUser.getAvatarUrl(),
                updatedUser.getPhoneNumber(),
                updatedUser.getAddress(),
                updatedUser.getTheme(),
                updatedUser.getCreatedAt()));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody java.util.Map<String, String> payload, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }
}
