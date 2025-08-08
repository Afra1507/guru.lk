package com.gurulk.contentservice.dto;

import com.gurulk.contentservice.entity.Lesson;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResponseDTO {

  private Long lessonId;
  private String title;
  private String description;
  private String contentType;
  private String subject;
  private String language;
  private String ageGroup;
  private Long uploaderId;
  private Integer viewCount;
  private boolean isApproved;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String fileUrl;

  public static LessonResponseDTO fromEntity(Lesson lesson) {
    return LessonResponseDTO.builder()
        .lessonId(lesson.getLessonId())
        .title(lesson.getTitle())
        .description(lesson.getDescription())
        .contentType(lesson.getContentType())
        .subject(lesson.getSubject())
        .language(lesson.getLanguage())
        .ageGroup(lesson.getAgeGroup())
        .uploaderId(lesson.getUploaderId())
        .viewCount(lesson.getViewCount())
        .isApproved(lesson.isApproved())
        .createdAt(lesson.getCreatedAt())
        .updatedAt(lesson.getUpdatedAt())
        .fileUrl(lesson.getFileUrl())
        .build();
  }
}
