package com.gurulk.contentservice.service;

import com.gurulk.contentservice.dto.DownloadResponseDTO;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DownloadService {

  private final DownloadRepository downloadRepository;
  private final LessonRepository lessonRepository;

  @Transactional
  public DownloadResponseDTO createDownload(Long userId, Long lessonId) {
    if (userId == null || lessonId == null) {
      throw new IllegalArgumentException("User ID and Lesson ID cannot be null");
    }

    Lesson lesson = lessonRepository.findById(lessonId)
        .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

    Download download = Download.builder()
        .userId(userId)
        .lesson(lesson)
        .expiresAt(LocalDateTime.now().plusDays(7))
        .build();

    Download savedDownload = downloadRepository.save(download);
    return DownloadResponseDTO.fromEntity(savedDownload);
  }

  public List<DownloadResponseDTO> getDownloadsByUser(Long userId) {
    return downloadRepository.findByUserId(userId).stream()
        .map(DownloadResponseDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public List<DownloadResponseDTO> getDownloadsByLesson(Long lessonId) {
    return downloadRepository.findByLessonId(lessonId).stream()
        .map(DownloadResponseDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public long countDownloadsByLesson(Long lessonId) {
    return downloadRepository.countByLessonId(lessonId);
  }

  public boolean hasUserDownloadedLesson(Long userId, Long lessonId) {
    return !downloadRepository.findByUserIdAndLessonId(userId, lessonId).isEmpty();
  }

  public List<DownloadResponseDTO> getExpiredDownloads() {
    return downloadRepository.findByExpiresAtBefore(LocalDateTime.now()).stream()
        .map(DownloadResponseDTO::fromEntity)
        .collect(Collectors.toList());
  }
}