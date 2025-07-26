package com.gurulk.authservice.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

  @NotBlank(message = "Username is required")
  @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
  private String username;

  @NotBlank(message = "Email is required")
  @Email(message = "Email should be valid")
  private String email;

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters long")
  private String password;

  @NotBlank(message = "Role is required")
  @Pattern(regexp = "LEARNER|CONTRIBUTOR|ADMIN", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Role must be LEARNER, CONTRIBUTOR, or ADMIN")
  private String role;

  @Pattern(regexp = "SINHALA|TAMIL|ENGLISH", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Language must be SINHALA, TAMIL, or ENGLISH")
  private String preferredLanguage;

  @Size(max = 100, message = "Region cannot exceed 100 characters")
  private String region;

  private Boolean isLowIncome;
}