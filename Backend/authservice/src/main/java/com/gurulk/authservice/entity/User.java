package com.gurulk.authservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long userId;

  @Column(nullable = false, unique = true, length = 50)
  private String username;

  @Column(nullable = false, unique = true, length = 100)
  private String email;

  @Column(name = "password_hash", nullable = false, length = 255)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, columnDefinition = "ENUM('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  private Role role;

  @Enumerated(EnumType.STRING)
  @Column(name = "preferred_language", columnDefinition = "ENUM('SINHALA', 'TAMIL', 'ENGLISH')")
  private Language preferredLanguage;

  @Column(length = 100)
  private String region;

  @Column(name = "is_low_income")
  private Boolean isLowIncome;

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public enum Role {
    LEARNER, CONTRIBUTOR, ADMIN
  }

  public enum Language {
    SINHALA, TAMIL, ENGLISH
  }
}