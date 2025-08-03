package com.gurulk.contentservice.service;

import com.gurulk.contentservice.dto.LessonResponseDTO;
import com.gurulk.contentservice.entity.Lesson;
import com.gurulk.contentservice.exception.ResourceNotFoundException;
import com.gurulk.contentservice.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;

    @Transactional
    public Lesson createLesson(Lesson lesson) {
        lesson.setApproved(false); // New lessons need approval
        lesson.setViewCount(0); // Initialize view count
        return lessonRepository.save(lesson);
    }

    public List<LessonResponseDTO> getAllApprovedLessons() {
        return lessonRepository.findByIsApprovedTrue().stream()
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

    @Transactional
    public LessonResponseDTO incrementViewCount(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        lesson.setViewCount(lesson.getViewCount() + 1);
        return LessonResponseDTO.fromEntity(lessonRepository.save(lesson));
    }
}