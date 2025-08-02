package com.gurulk.authservice.controller;

import com.gurulk.authservice.dto.*;
import com.gurulk.authservice.entity.User;
import com.gurulk.authservice.exception.ResourceNotFoundException;
import com.gurulk.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

  private final UserRepository userRepository;

  @GetMapping("/profile")
  @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<UserProfileDto> getCurrentUserProfile() {
    User user = getCurrentUser();
    log.info("Fetching profile for user: {}", user.getUsername());
    return ResponseEntity.ok(mapToProfileDto(user));
  }

  @PutMapping("/profile")
  @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<UserProfileDto> updateCurrentUserProfile(@RequestBody UpdateProfileRequest request) {
    User user = getCurrentUser();
    log.info("Updating profile for user: {}", user.getUsername());

    if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
      if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        throw new IllegalArgumentException("Email already in use");
      }
      user.setEmail(request.getEmail());
    }

    if (request.getPreferredLanguage() != null) {
      user.setPreferredLanguage(User.Language.valueOf(request.getPreferredLanguage().toUpperCase()));
    }
    if (request.getRegion() != null) {
      user.setRegion(request.getRegion());
    }
    if (request.getIsLowIncome() != null) {
      user.setIsLowIncome(request.getIsLowIncome());
    }

    userRepository.save(user);
    return ResponseEntity.ok(mapToProfileDto(user));
  }

  @GetMapping("/admin/all")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<UserResponseDto>> getAllUsers() {
    log.info("Admin fetching all users");
    List<User> users = userRepository.findAll();
    return ResponseEntity.ok(
        users.stream()
            .map(this::mapToResponseDto)
            .collect(Collectors.toList()));
  }

  @GetMapping("/admin/{userId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long userId) {
    log.info("Admin fetching user with ID: {}", userId);
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    return ResponseEntity.ok(mapToResponseDto(user));
  }

  @PutMapping("/admin/{userId}/role")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserResponseDto> updateUserRole(
      @PathVariable Long userId,
      @RequestParam User.Role role) {
    log.info("Admin updating role for user ID: {} to {}", userId, role);
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

    if (user.getUsername().equals(getCurrentUsername())) {
      throw new IllegalArgumentException("Cannot modify your own role");
    }

    user.setRole(role);
    userRepository.save(user);
    return ResponseEntity.ok(mapToResponseDto(user));
  }

  @DeleteMapping("/admin/{userId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
    log.info("Admin deleting user with ID: {}", userId);
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

    if (user.getUsername().equals(getCurrentUsername())) {
      throw new IllegalArgumentException("Cannot delete your own account");
    }

    userRepository.delete(user);
    return ResponseEntity.noContent().build();
  }

  // Helper methods
  private User getCurrentUser() {
    return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
  }

  private String getCurrentUsername() {
    User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return user.getUsername();
  }

  private UserProfileDto mapToProfileDto(User user) {
    return UserProfileDto.builder()
        .username(user.getUsername())
        .email(user.getEmail())
        .role(user.getRole())
        .preferredLanguage(user.getPreferredLanguage())
        .region(user.getRegion())
        .isLowIncome(user.getIsLowIncome())
        .build();
  }

  private UserResponseDto mapToResponseDto(User user) {
    return UserResponseDto.builder()
        .userId(user.getUserId())
        .username(user.getUsername())
        .email(user.getEmail())
        .role(user.getRole())
        .preferredLanguage(user.getPreferredLanguage())
        .region(user.getRegion())
        .isLowIncome(user.getIsLowIncome())
        .createdAt(user.getCreatedAt())
        .build();
  }
}