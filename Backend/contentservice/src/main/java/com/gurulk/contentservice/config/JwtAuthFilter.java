package com.gurulk.contentservice.config;

import com.gurulk.contentservice.client.AuthServiceClient;
import com.gurulk.contentservice.dto.TokenValidationResponse;
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
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }

    String token = authHeader.substring(7);

    Optional<TokenValidationResponse> validationResponse = authServiceClient.validateToken(token);

    if (validationResponse.isEmpty() || !validationResponse.get().isValid()) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }

    TokenValidationResponse responseBody = validationResponse.get();

    // Set up Spring Security authentication
    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
        responseBody.getUsername(),
        null,
        List.of(new SimpleGrantedAuthority("ROLE_" + responseBody.getRole())));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    // Set attributes for controllers to access
    request.setAttribute("username", responseBody.getUsername());
    request.setAttribute("role", responseBody.getRole());

    filterChain.doFilter(request, response);
  }
}