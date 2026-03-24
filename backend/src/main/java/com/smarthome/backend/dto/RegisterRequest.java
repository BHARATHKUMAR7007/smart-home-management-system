package com.smarthome.backend.dto;

import com.smarthome.backend.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String password;
    private Role role;
    private String fullName;
    private String email;
}
