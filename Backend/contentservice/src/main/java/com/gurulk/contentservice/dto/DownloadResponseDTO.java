package com.gurulk.contentservice.dto;

import com.gurulk.contentservice.entity.Download;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DownloadResponseDTO {
  private Long downloadId;
  private Long userId;
  private LessonResponseDTO lesson;
  private LocalDateTime downloadedAt;
  private LocalDateTime expiresAt;

  // Add static mapper method
  public static DownloadResponseDTO fromEntity(Download download) {
    return DownloadResponseDTO.builder()
        .downloadId(download.getDownloadId())
        .userId(download.getUserId())
        .lesson(LessonResponseDTO.fromEntity(download.getLesson()))
        .downloadedAt(download.getDownloadedAt())
        .expiresAt(download.getExpiresAt())
        .build();
  }
}