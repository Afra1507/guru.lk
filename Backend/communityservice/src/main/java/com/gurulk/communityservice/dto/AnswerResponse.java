package com.gurulk.communityservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerResponse {
    private Long answerId;
    private Long questionId;
    private Long userId;
    private String body;
    private boolean isAccepted;
    private int voteCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}