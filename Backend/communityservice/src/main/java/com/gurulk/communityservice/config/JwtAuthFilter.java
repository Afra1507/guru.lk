package com.gurulk.communityservice.config;

import com.gurulk.communityservice.client.AuthServiceClient;
import com.gurulk.communityservice.dto.TokenValidationResponse;
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

    System.out.println("\n=== JWT AUTH FILTER START ===");
    System.out.println("Request URI: " + request.getRequestURI());
    System.out.println("HTTP Method: " + request.getMethod());

    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    System.out.println("Authorization Header: " + (authHeader != null ? "[present]" : "null"));

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      System.out.println("⚠️ No Bearer token found or malformed header");
      filterChain.doFilter(request, response);
      return;
    }

    try {
      String token = authHeader.substring(7);
      System.out.println("🔐 Token received: " + token.substring(0, 10) + "..."); // Log first 10 chars only

      System.out.println("🔄 Validating token with auth service...");
      Optional<TokenValidationResponse> validationResponse = authServiceClient.validateToken(token);

      if (validationResponse.isEmpty() || !validationResponse.get().isValid()) {
        String errorMsg = validationResponse.map(r -> "Reason: " + r.getMessage()).orElse("No validation response");
        System.out.println("❌ Token validation failed. " + errorMsg);
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        return;
      }

      TokenValidationResponse responseBody = validationResponse.get();
      System.out.println("✅ Token validated successfully");
      System.out.println("👤 User ID: " + responseBody.getUserId());
      System.out.println("👤 Username: " + responseBody.getUsername());
      System.out.println("🛡️ Raw Role from token: " + responseBody.getRole());

      String role = "ROLE_" + responseBody.getRole().toUpperCase();
      System.out.println("🛡️ Processed Authority: " + role);

      UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
          responseBody.getUsername(),
          null,
          List.of(new SimpleGrantedAuthority(role)));

      SecurityContextHolder.getContext().setAuthentication(authentication);
      System.out.println("🔒 Authentication set in SecurityContext");

      // Set attributes for controller access
      request.setAttribute("userId", responseBody.getUserId());
      request.setAttribute("username", responseBody.getUsername());
      request.setAttribute("role", responseBody.getRole());
      System.out.println("📌 Request attributes set: userId=" + responseBody.getUserId());

      filterChain.doFilter(request, response);
      System.out.println("✅ Filter chain completed successfully");

    } catch (Exception e) {
      System.out.println("❗ Exception during authentication: " + e.getClass().getSimpleName());
      System.out.println("❗ Error message: " + e.getMessage());
      e.printStackTrace();
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
    } finally {
      System.out.println("=== JWT AUTH FILTER END ===\n");
    }
  }
}