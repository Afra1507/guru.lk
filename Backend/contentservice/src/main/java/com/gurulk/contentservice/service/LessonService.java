package com.gurulk.contentservice.service;

import com.gurulk.contentservice.entity.Lesson;
import com.gurulk.contentservice.exception.ResourceNotFoundException;
import com.gurulk.contentservice.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;

    @Transactional
    public Lesson createLesson(Lesson lesson) {
        lesson.setApproved(false); // New lessons need approval
        lesson.setViewCount(0);    // Initialize view count
        return lessonRepository.save(lesson);
    }

    public List<Lesson> getAllApprovedLessons() {
        return lessonRepository.findByIsApprovedTrue();
    }

    public Lesson getLessonById(Long id) {
        return lessonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
    }

    @Transactional
    public Lesson approveLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        lesson.setApproved(true);
        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson incrementViewCount(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        lesson.setViewCount(lesson.getViewCount() + 1);
        return lessonRepository.save(lesson);
    }
}