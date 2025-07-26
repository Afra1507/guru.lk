package com.gurulk.contentservice.repository;

import com.gurulk.contentservice.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DownloadRepository extends JpaRepository<Download, Long> {

  // Find downloads by user ID
  List<Download> findByUserId(Long userId);

  // Find downloads by lesson ID (corrected)
  @Query("SELECT d FROM Download d WHERE d.lesson.lessonId = :lessonId")
  List<Download> findByLessonId(@Param("lessonId") Long lessonId);

  // Find expired downloads
  List<Download> findByExpiresAtBefore(LocalDateTime date);

  // Count downloads by user ID
  long countByUserId(Long userId);

  // Additional useful queries
  List<Download> findByUserIdAndLesson_LessonId(Long userId, Long lessonId);

  @Query("SELECT COUNT(d) FROM Download d WHERE d.lesson.lessonId = :lessonId")
  long countByLessonId(@Param("lessonId") Long lessonId);
}