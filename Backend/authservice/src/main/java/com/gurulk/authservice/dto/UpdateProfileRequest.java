package com.gurulk.authservice.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateProfileRequest {
  @Email(message = "Email should be valid")
  private String email;

  @Pattern(regexp = "SINHALA|TAMIL|ENGLISH", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Language must be SINHALA, TAMIL, or ENGLISH")
  private String preferredLanguage;

  @Size(max = 100, message = "Region cannot exceed 100 characters")
  private String region;

  private Boolean isLowIncome;
}