package com.gurulk.authservice.controller;

import com.gurulk.authservice.dto.*;
import com.gurulk.authservice.service.AuthService;
import lombok.RequiredArgsConstructor;
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

}
