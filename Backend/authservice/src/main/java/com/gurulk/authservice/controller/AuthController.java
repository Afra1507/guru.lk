package com.gurulk.authservice.controller;

import com.gurulk.authservice.dto.*;
import com.gurulk.authservice.service.AuthService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public JwtResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/validate-token")
    public TokenValidationResponse validateToken(@RequestBody TokenValidationRequest request) {
        return authService.validateToken(request.getToken());
    }

    @GetMapping("/users/{userId}/email")
    public String getUserEmail(@PathVariable Long userId) {
        return authService.getUserEmail(userId);
    }

    // Get all user IDs by role
    @GetMapping("/roles/{role}/users")
    public List<Long> getUserIdsByRole(@PathVariable String role) {
        return authService.getUserIdsByRole(role);
    }

    // Get all user IDs
    @GetMapping("/users/ids")
    public List<Long> getAllUserIds() {
        return authService.getAllUserIds();
    }

}
