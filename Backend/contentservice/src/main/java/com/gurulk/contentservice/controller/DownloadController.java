package com.gurulk.contentservice.controller;

import com.gurulk.contentservice.entity.Download;
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
    public ResponseEntity<Download> createDownload(
            @RequestParam Long userId,
            @RequestParam Long lessonId) {
        return ResponseEntity.ok(downloadService.createDownload(userId, lessonId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<List<Download>> getUserDownloads(@PathVariable Long userId) {
        return ResponseEntity.ok(downloadService.getDownloadsByUser(userId));
    }
}