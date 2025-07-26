package com.gurulk.contentservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "lesson_id")
  private Long lessonId;

  @NotBlank
  @Column(nullable = false)
  private String title;

  @NotBlank
  @Column(nullable = false, columnDefinition = "TEXT")
  private String description;

  @NotBlank
  @Column(name = "content_type", nullable = false)
  private String contentType;

  @NotBlank
  @Column(name = "file_url", nullable = false)
  private String fileUrl;

  @NotBlank
  @Column(nullable = false)
  private String subject;

  @NotBlank
  @Column(nullable = false)
  private String language;

  @NotBlank
  @Column(name = "age_group", nullable = false)
  private String ageGroup;

  @Column(name = "uploader_id", nullable = false)
  private Long uploaderId;

  @Column(name = "is_approved", nullable = false)
  @Builder.Default
  private boolean isApproved = false;

  @Column(name = "view_count", nullable = false)
  @Builder.Default
  private Integer viewCount = 0;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
  private List<Download> downloads;

  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}