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
public class VoteResponse {
    private Long voteId;
    private Long answerId;
    private Long userId;
    private boolean isUpvote;
    private LocalDateTime createdAt;
}