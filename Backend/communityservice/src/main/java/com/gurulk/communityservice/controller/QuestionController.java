package com.gurulk.communityservice.controller;

import com.gurulk.communityservice.dto.QuestionRequest;
import com.gurulk.communityservice.dto.QuestionResponse;
import com.gurulk.communityservice.entity.Question;
import com.gurulk.communityservice.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<QuestionResponse> createQuestion(
            @RequestParam Long userId,
            @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(questionService.createQuestion(userId, request));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<QuestionResponse> getQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<QuestionResponse>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsBySubject(
            @PathVariable String subject) {
        return ResponseEntity.ok(questionService.getQuestionsBySubject(subject));
    }

    @GetMapping("/language/{language}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByLanguage(
            @PathVariable Question.Language language) {
        return ResponseEntity.ok(questionService.getQuestionsByLanguage(language));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteQuestion(
            @RequestParam Long userId,
            @RequestParam String role,
            @PathVariable Long id) {
        questionService.deleteQuestion(userId, role, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByUserId(@PathVariable Long userId) {
        List<QuestionResponse> questions = questionService.getQuestionsByUserId(userId);
        return ResponseEntity.ok(questions);
    }

}