package com.gurulk.contentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenValidationResponse {
    private boolean valid;
    private String username;
    private String role;
}
