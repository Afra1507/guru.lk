package com.gurulk.communityservice.controller;

import com.gurulk.communityservice.dto.VoteRequest;
import com.gurulk.communityservice.dto.VoteResponse;
import com.gurulk.communityservice.service.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/votes")
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<VoteResponse> createVote(
            @RequestParam Long userId,
            @RequestParam String role,
            @Valid @RequestBody VoteRequest request) {
        VoteResponse response = voteService.createVote(userId, role, request);
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/count/{answerId}")
    public ResponseEntity<Integer> getVoteCount(
            @PathVariable Long answerId,
            @RequestParam Boolean isUpvote) {
        return ResponseEntity.ok(voteService.countVotes(answerId, isUpvote));
    }

    @DeleteMapping("/remove/{answerId}")
    @PreAuthorize("hasAnyRole('LEARNER', 'CONTRIBUTOR', 'ADMIN')")
    public ResponseEntity<Void> removeVote(
            @RequestParam Long userId,
            @RequestParam String role,
            @PathVariable Long answerId) {
        voteService.removeVote(userId, role, answerId);
        return ResponseEntity.noContent().build();
    }
}