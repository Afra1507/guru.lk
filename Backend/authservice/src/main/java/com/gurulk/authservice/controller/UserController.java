package com.gurulk.authservice.controller;

import com.gurulk.authservice.entity.User;
import com.gurulk.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

  private final UserRepository userRepository;

  @PreAuthorize("hasAnyAuthority('LEARNER','CONTRIBUTOR','ADMIN')")
  @GetMapping("/profile")
  public ResponseEntity<?> getProfile() {
    String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return ResponseEntity.ok(user);
  }
}
