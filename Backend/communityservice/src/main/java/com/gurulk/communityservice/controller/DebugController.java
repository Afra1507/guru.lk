package com.gurulk.communityservice.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/community/debug")
public class DebugController {

    @GetMapping("/auth-check")
    public Map<String, Object> checkAuth(Authentication authentication) {
        return Map.of(
            "authenticated", authentication != null,
            "username", authentication != null ? authentication.getName() : null,
            "roles", authentication != null ? authentication.getAuthorities() : null
        );
    }
}