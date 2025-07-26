package com.gurulk.authservice.service;

import com.gurulk.authservice.dto.*;
import com.gurulk.authservice.entity.User;
import com.gurulk.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public JwtResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent())
            throw new RuntimeException("Username already exists");

        if (userRepository.findByEmail(request.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

        // Convert string role to enum
        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role specified");
        }

        // Convert string language to enum if provided
        User.Language preferredLanguage = null;
        if (request.getPreferredLanguage() != null) {
            try {
                preferredLanguage = User.Language.valueOf(request.getPreferredLanguage().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid preferred language specified");
            }
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .preferredLanguage(preferredLanguage)
                .region(request.getRegion())
                .isLowIncome(request.getIsLowIncome())
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new JwtResponse(token);
    }

    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
            throw new RuntimeException("Invalid credentials");

        String token = jwtService.generateToken(user);
        return new JwtResponse(token);
    }

    public TokenValidationResponse validateToken(String token) {
        try {
            String username = jwtService.extractUsername(token);
            String role = jwtService.extractRole(token);
            Long userId = jwtService.extractUserId(token);
            String email = jwtService.extractEmail(token);

            if (username == null || role == null || userId == null || email == null) {
                return new TokenValidationResponse(false, null, null, null, null, "Invalid token claims");
            }

            var userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                return new TokenValidationResponse(false, null, null, null, null, "User not found");
            }

            return new TokenValidationResponse(true, userId, username, role, email, "Token valid");
        } catch (Exception e) {
            return new TokenValidationResponse(false, null, null, null, null, "Invalid token: " + e.getMessage());
        }
    }
}