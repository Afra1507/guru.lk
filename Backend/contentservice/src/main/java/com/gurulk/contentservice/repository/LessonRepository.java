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

  Page<Lesson> findByIsApprovedTrue(Pageable pageable); // Paginated version

  // Lessons by uploader
  List<Lesson> findByUploaderId(Long uploaderId);

  Page<Lesson> findByUploaderId(Long uploaderId, Pageable pageable);

  // Unapproved lessons
  List<Lesson> findByIsApprovedFalse();

  // Search functionality
  List<Lesson> findBySubject(String subject);

  List<Lesson> findByTitleContainingIgnoreCase(String title);

  List<Lesson> findByDescriptionContainingIgnoreCase(String keyword);

  // Combined filters
  List<Lesson> findBySubjectAndIsApprovedTrue(String subject);

  List<Lesson> findByUploaderIdAndIsApproved(Long uploaderId, boolean isApproved);

  // Popular lessons (custom query example)
  @Query("SELECT l FROM Lesson l ORDER BY l.viewCount DESC LIMIT 10")
  List<Lesson> findTop10PopularLessons();
}