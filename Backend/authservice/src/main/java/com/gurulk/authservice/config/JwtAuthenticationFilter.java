package com.gurulk.authservice.config;

import com.gurulk.authservice.entity.User;
import com.gurulk.authservice.service.JwtService;
import com.gurulk.authservice.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserRepository userRepository;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String jwt;
    final String username;

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    jwt = authHeader.substring(7);
    username = jwtService.extractUsername(jwt);

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      User user = userRepository.findByUsername(username).orElse(null);

      if (user != null && jwtService.isTokenValid(jwt, user)) {
        String authority = "ROLE_" + user.getRole().name();
        var authorities = List.of(new SimpleGrantedAuthority(authority));

        var authToken = new UsernamePasswordAuthenticationToken(
            user,
            null,
            authorities);

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // Set user attributes for downstream use
        request.setAttribute("userId", user.getUserId());
        request.setAttribute("username", user.getUsername());
        request.setAttribute("role", user.getRole().name());
        request.setAttribute("email", user.getEmail());
      }
    }

    filterChain.doFilter(request, response);
  }
}