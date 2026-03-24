package com.smarthome.backend.dto;

import com.smarthome.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private String avatarUrl;
    private String phoneNumber;
    private String address;
    private String theme;
    private java.time.LocalDateTime createdAt;
}
