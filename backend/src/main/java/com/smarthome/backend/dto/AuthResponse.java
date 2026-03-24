package com.smarthome.backend.dto;

import com.smarthome.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Role role;
    private String username;
    private String fullName;
}
