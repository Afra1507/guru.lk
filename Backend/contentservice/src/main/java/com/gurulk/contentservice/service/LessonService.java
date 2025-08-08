package com.gurulk.contentservice.service;

import com.gurulk.contentservice.dto.LessonResponseDTO;
import com.gurulk.contentservice.entity.Lesson;
import com.gurulk.contentservice.exception.ResourceNotFoundException;
import com.gurulk.contentservice.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.StandardCopyOption;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;

    // Path to store uploaded files, set in application.properties or hardcoded here
    @Value("${lesson.upload.dir:uploads}")
    private String uploadDir;

    @Transactional
    public Lesson createLesson(Lesson lesson) {
        lesson.setApproved(false); // New lessons need approval
        lesson.setViewCount(0); // Initialize view count
        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson createLessonWithUrl(Lesson lesson) {
        lesson.setApproved(false); // needs approval
        lesson.setViewCount(0);

        // Ensure fileUrl is set, no file saving
        if (lesson.getFileUrl() == null || lesson.getFileUrl().isBlank()) {
            throw new IllegalArgumentException("File URL must be provided");
        }

        return lessonRepository.save(lesson);
    }

    public List<LessonResponseDTO> getAllApprovedLessons() {
        return lessonRepository.findByIsApprovedTrue().stream()
                .map(LessonResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LessonResponseDTO> getPendingLessons() {
        return lessonRepository.findByIsApprovedFalse()
                .stream()
                .map(LessonResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public LessonResponseDTO getLessonById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
        return LessonResponseDTO.fromEntity(lesson);
    }

    @Transactional
    public LessonResponseDTO approveLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        lesson.setApproved(true);
        return LessonResponseDTO.fromEntity(lessonRepository.save(lesson));
    }

    public List<LessonResponseDTO> getLessonsByUploader(Long uploaderId) {
        return lessonRepository.findByUploaderId(uploaderId)
                .stream()
                .map(LessonResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LessonResponseDTO> getApprovedLessonsBySubject(String subject) {
        return lessonRepository.findBySubjectAndIsApprovedTrue(subject)
                .stream()
                .map(LessonResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LessonResponseDTO> searchByTitle(String keyword) {
        return lessonRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .filter(Lesson::isApproved)
                .map(LessonResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LessonResponseDTO> searchByDescription(String keyword) {
        return lessonRepository.findByDescriptionContainingIgnoreCase(keyword)
                .stream()
                .filter(Lesson::isApproved)
                .map(LessonResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LessonResponseDTO> getTop10PopularLessons() {
        int minViews = 3;
        Pageable topTen = PageRequest.of(0, 10);
        return lessonRepository.findPopularLessonsWithMinViews(minViews, topTen)
                .stream()
                .map(LessonResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LessonResponseDTO> getLessonsByUploaderAndApproval(Long uploaderId, boolean approved) {
        return lessonRepository.findByUploaderIdAndIsApproved(uploaderId, approved)
                .stream()
                .map(LessonResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getContentAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", lessonRepository.count());
        stats.put("approved", lessonRepository.countByIsApprovedTrue());
        stats.put("pending", lessonRepository.countByIsApprovedFalse());
        stats.put("topViewed", getTop10PopularLessons());
        return stats;
    }

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    @Transactional
    public LessonResponseDTO incrementViewCount(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        lesson.setViewCount(lesson.getViewCount() + 1);
        return LessonResponseDTO.fromEntity(lessonRepository.save(lesson));
    }
}
