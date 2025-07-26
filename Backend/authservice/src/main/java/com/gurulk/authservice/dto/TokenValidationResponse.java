package com.gurulk.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenValidationResponse {
    private boolean valid;
    private Long userId;
    private String username;
    private String role;
    private String message;
}
