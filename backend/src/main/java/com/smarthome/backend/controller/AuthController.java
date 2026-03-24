package com.smarthome.backend.controller;

import com.smarthome.backend.dto.AuthRequest;
import com.smarthome.backend.dto.AuthResponse;
import com.smarthome.backend.dto.RegisterRequest;
import com.smarthome.backend.dto.GoogleAuthRequest;
import com.smarthome.backend.model.Role;
import com.smarthome.backend.model.User;
import com.smarthome.backend.repository.UserRepository;
import com.smarthome.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getEmail()).isPresent() ||
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.HOMEOWNER);
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        return ResponseEntity.ok(new AuthResponse(jwt, user.getRole(), user.getUsername(), user.getFullName()));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequest request) {
        System.out.println("Received Google Login Request");
        System.out.println("Token: " + request.getToken());

        try {
            // Verify access token with Google UserInfo endpoint
            String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setBearerAuth(request.getToken());
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>("", headers);

            System.out.println("Calling Google UserInfo API...");
            ResponseEntity<java.util.Map<String, Object>> response = restTemplate.exchange(userInfoUrl,
                    org.springframework.http.HttpMethod.GET,
                    entity, new org.springframework.core.ParameterizedTypeReference<java.util.Map<String, Object>>() {
                    });
            java.util.Map<String, Object> googleUser = response.getBody();

            System.out.println("Google API Response: " + googleUser);

            if (googleUser == null || googleUser.containsKey("error_description")) {
                System.out.println("Invalid Google Token or Error from Google");
                return ResponseEntity.status(401).body("Invalid Google Token");
            }

            String email = (String) googleUser.get("email");
            String name = (String) googleUser.get("name");

            System.out.println("User Email: " + email);

            // Check if user exists by Email (most reliable for OAuth)
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // Fallback: Check by username if email lookup failed (unlikely but safe)
                user = userRepository.findByUsername(email).orElse(null);
            }

            if (user == null) {
                System.out.println("User not found, registering new user...");
                // Register new user
                user = new User();
                user.setUsername(email);
                user.setPassword(passwordEncoder.encode("GOOGLE_AUTH_placeholder"));
                user.setRole(Role.HOMEOWNER);
                user.setEmail(email);
                user.setFullName(name);
                userRepository.save(user);
            } else {
                System.out.println("User found: " + user.getUsername());
            }

            final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(jwt, user.getRole(), user.getUsername(), user.getFullName()));

        } catch (Exception e) {
            System.err.println("Google Auth Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Google Authentication Failed: " + e.getMessage());
        }
    }

    @Autowired
    private com.smarthome.backend.service.EmailService emailService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByUsername(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setResetToken(otp); // Reusing resetToken field for OTP
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Send Email
        String emailBody = "Your OTP for password reset is: " + otp + "\nThis OTP is valid for 15 minutes.";
        emailService.sendEmail(email, "Password Reset OTP", emailBody);

        System.out.println("==================================================");
        System.out.println("OTP SENT TO " + email + ": " + otp);
        System.out.println("==================================================");

        return ResponseEntity.ok("OTP sent to your email!");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        User user = userRepository.findByUsername(email).orElse(null);

        if (user == null || !otp.equals(user.getResetToken())
                || user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }

        return ResponseEntity.ok("OTP verified successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        User user = userRepository.findByUsername(email).orElse(null);

        if (user == null || !otp.equals(user.getResetToken())
                || user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Successfully logged out");
    }
}
