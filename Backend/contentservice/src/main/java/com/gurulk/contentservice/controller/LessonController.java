package com.gurulk.contentservice.controller;

import com.gurulk.contentservice.dto.LessonResponseDTO;
import com.gurulk.contentservice.entity.Lesson;
import com.gurulk.contentservice.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lessons")
@RequiredArgsConstructor
public class LessonController {

  private final LessonService lessonService;

  @PostMapping("/create")
  @PreAuthorize("hasAnyRole('CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<LessonResponseDTO> createLesson(@Valid @RequestBody Lesson lesson) {
    return ResponseEntity.ok(LessonResponseDTO.fromEntity(lessonService.createLesson(lesson)));
  }

  @GetMapping("/approved")
  @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<List<LessonResponseDTO>> getAllApprovedLessons() {
    return ResponseEntity.ok(lessonService.getAllApprovedLessons());
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<LessonResponseDTO> getLessonById(@PathVariable Long id) {
    return ResponseEntity.ok(lessonService.getLessonById(id));
  }

  @PostMapping("/{id}/approve")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<LessonResponseDTO> approveLesson(@PathVariable Long id) {
    return ResponseEntity.ok(lessonService.approveLesson(id));
  }

  @PostMapping("/{id}/view")
  @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<LessonResponseDTO> incrementViewCount(@PathVariable Long id) {
    return ResponseEntity.ok(lessonService.incrementViewCount(id));
  }

  @GetMapping("/pending")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<LessonResponseDTO>> getPendingLessons() {
    return ResponseEntity.ok(lessonService.getPendingLessons());
  }

  // ✅ Get lessons by uploader (all)
  @GetMapping("/uploader/{uploaderId}")
  @PreAuthorize("hasAnyRole('CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<List<LessonResponseDTO>> getLessonsByUploader(@PathVariable Long uploaderId) {
    return ResponseEntity.ok(lessonService.getLessonsByUploader(uploaderId));
  }

  // ✅ Get approved lessons by subject
  @GetMapping("/subject/{subject}")
  @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<List<LessonResponseDTO>> getLessonsBySubject(@PathVariable String subject) {
    return ResponseEntity.ok(lessonService.getApprovedLessonsBySubject(subject));
  }

  // ✅ Search lessons by title (approved only)
  @GetMapping("/search/title")
  @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<List<LessonResponseDTO>> searchByTitle(@RequestParam String keyword) {
    return ResponseEntity.ok(lessonService.searchByTitle(keyword));
  }

  // ✅ Search lessons by description (approved only)
  @GetMapping("/search/description")
  @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<List<LessonResponseDTO>> searchByDescription(@RequestParam String keyword) {
    return ResponseEntity.ok(lessonService.searchByDescription(keyword));
  }

  // ✅ Get most popular lessons
  @GetMapping("/popular")
  @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<List<LessonResponseDTO>> getPopularLessons() {
    return ResponseEntity.ok(lessonService.getTop10PopularLessons());
  }

  // ✅ Get uploader’s approved/unapproved lessons
  @GetMapping("/uploader/{uploaderId}/status")
  @PreAuthorize("hasAnyRole('CONTRIBUTOR', 'ADMIN')")
  public ResponseEntity<List<LessonResponseDTO>> getLessonsByUploaderAndApproval(
      @PathVariable Long uploaderId,
      @RequestParam boolean approved) {
    return ResponseEntity.ok(lessonService.getLessonsByUploaderAndApproval(uploaderId, approved));
  }

  @GetMapping("/all")
  @PreAuthorize("hasRole('ADMIN')")
  public List<Lesson> getAllLessons() {
    return lessonService.getAllLessons();
  }

  @GetMapping("/analytics")
  @PreAuthorize("hasRole('ADMIN')")
  public Map<String, Object> getContentAnalytics() {
    return lessonService.getContentAnalytics();
  }

}