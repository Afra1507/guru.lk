package com.gurulk.contentservice.service;

import com.gurulk.contentservice.entity.Download;
import com.gurulk.contentservice.entity.Lesson;
import com.gurulk.contentservice.exception.ResourceNotFoundException;
import com.gurulk.contentservice.repository.DownloadRepository;
import com.gurulk.contentservice.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DownloadService {

  private final DownloadRepository downloadRepository;
  private final LessonRepository lessonRepository;

  @Transactional
  public Download createDownload(Long userId, Long lessonId) {
    // Verify lesson exists
    Lesson lesson = lessonRepository.findById(lessonId)
        .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

    // Only allow download if lesson is approved
    if (!lesson.isApproved()) {
      throw new IllegalStateException("Cannot download unapproved lesson");
    }

    Download download = Download.builder()
        .userId(userId)
        .lesson(lesson) // Changed from lessonId to lesson object
        .expiresAt(LocalDateTime.now().plusDays(7))
        .build();

    return downloadRepository.save(download);
  }

  public List<Download> getDownloadsByUser(Long userId) {
    return downloadRepository.findByUserId(userId);
  }
}