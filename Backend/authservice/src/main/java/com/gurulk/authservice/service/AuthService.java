package com.gurulk.authservice.service;

import com.gurulk.authservice.dto.*;
import com.gurulk.authservice.entity.User;
import com.gurulk.authservice.exception.ResourceAlreadyExistsException;
import com.gurulk.authservice.exception.ResourceNotFoundException;
import com.gurulk.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Authentication methods
    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResourceAlreadyExistsException("Username already exists");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(convertToRole(request.getRole()))
                .preferredLanguage(convertToLanguage(request.getPreferredLanguage()))
                .region(request.getRegion())
                .isLowIncome(request.getIsLowIncome())
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new JwtResponse(token);
    }

    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResourceNotFoundException("Invalid credentials");
        }

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

    // User profile methods
    public UserProfileDto getCurrentUserProfile() {
        User user = getCurrentUser();
        return mapToProfileDto(user);
    }

    @Transactional
    public UserProfileDto updateCurrentUserProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ResourceAlreadyExistsException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getPreferredLanguage() != null) {
            user.setPreferredLanguage(convertToLanguage(request.getPreferredLanguage()));
        }
        if (request.getRegion() != null) {
            user.setRegion(request.getRegion());
        }
        if (request.getIsLowIncome() != null) {
            user.setIsLowIncome(request.getIsLowIncome());
        }

        userRepository.save(user);
        return mapToProfileDto(user);
    }

    // Admin methods
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public UserResponseDto getUserById(Long userId) {
        return mapToResponseDto(userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId)));
    }

    @Transactional
    public UserResponseDto updateUserRole(Long userId, User.Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Prevent admins from modifying their own role
        if (user.getUsername().equals(getCurrentUsername())) {
            throw new AccessDeniedException("Cannot modify your own role");
        }

        user.setRole(role);
        userRepository.save(user);
        return mapToResponseDto(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Prevent admins from deleting themselves
        if (user.getUsername().equals(getCurrentUsername())) {
            throw new AccessDeniedException("Cannot delete your own account");
        }

        userRepository.delete(user);
    }

    // Utility methods
    public String getUserEmail(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId))
                .getEmail();
    }

    // Get all user IDs by role
    public List<Long> getUserIdsByRole(String role) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole().name().equalsIgnoreCase(role))
                .map(User::getUserId)
                .collect(Collectors.toList());
    }

    // Get all user IDs
    public List<Long> getAllUserIds() {
        return userRepository.findAll().stream()
                .map(User::getUserId)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        return userRepository.findByUsername(getCurrentUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private User.Role convertToRole(String roleStr) {
        try {
            return User.Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role specified");
        }
    }

    private User.Language convertToLanguage(String languageStr) {
        if (languageStr == null)
            return null;
        try {
            return User.Language.valueOf(languageStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid preferred language specified");
        }
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