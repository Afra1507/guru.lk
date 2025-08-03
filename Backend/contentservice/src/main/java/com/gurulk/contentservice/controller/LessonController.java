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
}