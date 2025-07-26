package com.gurulk.notificationservice.config;

import com.gurulk.notificationservice.client.AuthServiceClient;
import com.gurulk.notificationservice.dto.TokenValidationResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

  private final AuthServiceClient authServiceClient;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      String token = authHeader.substring(7);
      Optional<TokenValidationResponse> validationResponse = authServiceClient.validateToken(token);

      if (validationResponse.isEmpty() || !validationResponse.get().isValid()) {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        return;
      }

      TokenValidationResponse responseBody = validationResponse.get();
      String role = "ROLE_" + responseBody.getRole().toUpperCase();

      UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
          responseBody.getUsername(),
          null,
          List.of(new SimpleGrantedAuthority(role)));

      SecurityContextHolder.getContext().setAuthentication(authentication);

      // Set all user attributes from token
      request.setAttribute("userId", responseBody.getUserId());
      request.setAttribute("username", responseBody.getUsername());
      request.setAttribute("role", responseBody.getRole());
      request.setAttribute("preferredLanguage", responseBody.getPreferredLanguage());

      filterChain.doFilter(request, response);
    } catch (Exception e) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
    }
  }
}