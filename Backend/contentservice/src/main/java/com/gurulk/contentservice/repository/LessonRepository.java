package com.gurulk.contentservice.repository;

import com.gurulk.contentservice.entity.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

  // Approved lessons
  List<Lesson> findByIsApprovedTrue();

  Page<Lesson> findByIsApprovedTrue(Pageable pageable);

  // Unapproved lessons
  List<Lesson> findByIsApprovedFalse();

  // By uploader
  List<Lesson> findByUploaderId(Long uploaderId);

  Page<Lesson> findByUploaderId(Long uploaderId, Pageable pageable);

  List<Lesson> findByUploaderIdAndIsApproved(Long uploaderId, boolean isApproved);

  // Subject and title filters
  List<Lesson> findBySubject(String subject);

  List<Lesson> findByTitleContainingIgnoreCase(String title);

  List<Lesson> findByDescriptionContainingIgnoreCase(String keyword);

  List<Lesson> findBySubjectAndIsApprovedTrue(String subject);

  // Analytics support
  long countByIsApprovedTrue();

  long countByIsApprovedFalse();

  @Query("SELECT l FROM Lesson l ORDER BY l.viewCount DESC")
  List<Lesson> findTopPopularLessons(Pageable pageable);
}
