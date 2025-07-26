package com.gurulk.communityservice.controller;

import com.gurulk.communityservice.dto.AnswerRequest;
import com.gurulk.communityservice.dto.AnswerResponse;
import com.gurulk.communityservice.service.AnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/answers")
@RequiredArgsConstructor
public class AnswerController {
    private final AnswerService answerService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<AnswerResponse> createAnswer(
            @RequestParam Long userId,
            @Valid @RequestBody AnswerRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(answerService.createAnswer(userId, request));
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<AnswerResponse>> getAnswersForQuestion(
            @PathVariable Long questionId) {
        return ResponseEntity.ok(answerService.getAnswersByQuestionId(questionId));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<AnswerResponse> updateAnswer(
            @RequestParam Long userId,
            @RequestParam String role,
            @PathVariable Long id,
            @Valid @RequestBody AnswerRequest request) {
        return ResponseEntity.ok(answerService.updateAnswer(userId, role, id, request));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteAnswer(
            @RequestParam Long userId,
            @RequestParam String role,
            @PathVariable Long id) {
        answerService.deleteAnswer(userId, role, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/accept/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> acceptAnswer(
            @RequestParam Long userId,
            @RequestParam String role,
            @PathVariable Long id) {
        answerService.acceptAnswer(userId, role, id);
        return ResponseEntity.ok().build();
    }
}