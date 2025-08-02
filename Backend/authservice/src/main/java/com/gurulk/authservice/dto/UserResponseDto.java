package com.gurulk.authservice.dto;

import java.time.LocalDateTime;
import com.gurulk.authservice.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDto {
  private Long userId;
  private String username;
  private String email;
  private User.Role role;
  private User.Language preferredLanguage;
  private String region;
  private Boolean isLowIncome;
  private LocalDateTime createdAt;
}
