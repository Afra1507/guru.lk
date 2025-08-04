package com.gurulk.contentservice.controller;

import com.gurulk.contentservice.dto.DownloadResponseDTO;
import com.gurulk.contentservice.service.DownloadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/downloads")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<DownloadResponseDTO> createDownload(
            @RequestParam Long userId,
            @RequestParam Long lessonId) {
        return ResponseEntity.ok(downloadService.createDownload(userId, lessonId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<List<DownloadResponseDTO>> getUserDownloads(@PathVariable Long userId) {
        return ResponseEntity.ok(downloadService.getDownloadsByUser(userId));
    }

    // ✅ New: get downloads for a lesson
    @GetMapping("/lesson/{lessonId}")
    @PreAuthorize("hasAnyRole('CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<List<DownloadResponseDTO>> getDownloadsByLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(downloadService.getDownloadsByLesson(lessonId));
    }

    // ✅ New: count downloads for a lesson
    @GetMapping("/lesson/{lessonId}/count")
    @PreAuthorize("hasAnyRole('CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<Long> countDownloadsByLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(downloadService.countDownloadsByLesson(lessonId));
    }

    // ✅ New: check if a user downloaded a specific lesson
    @GetMapping("/user/{userId}/lesson/{lessonId}")
    @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<Boolean> hasUserDownloadedLesson(@PathVariable Long userId, @PathVariable Long lessonId) {
        return ResponseEntity.ok(downloadService.hasUserDownloadedLesson(userId, lessonId));
    }

    // ✅ New: get all expired downloads (admin view)
    @GetMapping("/expired")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DownloadResponseDTO>> getExpiredDownloads() {
        return ResponseEntity.ok(downloadService.getExpiredDownloads());
    }
}