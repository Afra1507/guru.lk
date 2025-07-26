package com.gurulk.authservice.dto;

import lombok.Data;

@Data
public class TokenValidationResponse {
    private boolean isValid;
    private Long userId;
    private String username;
    private String role;
    private String email;
    private String message;

    public TokenValidationResponse(boolean isValid, Long userId, String username,
            String role, String email, String message) {
        this.isValid = isValid;
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.email = email;
        this.message = message;
    }
}