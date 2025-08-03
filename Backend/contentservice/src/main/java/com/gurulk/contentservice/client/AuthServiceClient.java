package com.gurulk.contentservice.client;

import com.gurulk.contentservice.dto.TokenValidationRequest;
import com.gurulk.contentservice.dto.TokenValidationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuthServiceClient {

  private final RestTemplate restTemplate;

  public Optional<TokenValidationResponse> validateToken(String token) {
    try {
      ResponseEntity<TokenValidationResponse> response = restTemplate.postForEntity(
          "http://authservice:8081/auth/validate-token",
          new TokenValidationRequest(token),
          TokenValidationResponse.class);
      return Optional.ofNullable(response.getBody());
    } catch (Exception e) {
      return Optional.empty();
    }
  }
}
