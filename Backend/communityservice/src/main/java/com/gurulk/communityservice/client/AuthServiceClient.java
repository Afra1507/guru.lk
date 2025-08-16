// AuthServiceClient.java
package com.gurulk.communityservice.client;

import com.gurulk.communityservice.dto.TokenValidationRequest;
import com.gurulk.communityservice.dto.TokenValidationResponse;
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

    public Long extractUserIdFromToken(String token) {
        Optional<TokenValidationResponse> response = validateToken(token);
        return response.map(TokenValidationResponse::getUserId)
                .orElseThrow(() -> new SecurityException("Invalid token"));
    }
}