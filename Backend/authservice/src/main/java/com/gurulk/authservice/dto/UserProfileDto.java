package com.gurulk.authservice.dto;

import com.gurulk.authservice.entity.User;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {
    private String username;
    private String email;
    private User.Role role;
    private User.Language preferredLanguage;
    private String region;
    private Boolean isLowIncome;
}
