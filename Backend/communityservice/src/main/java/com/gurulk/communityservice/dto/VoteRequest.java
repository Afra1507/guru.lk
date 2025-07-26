package com.gurulk.communityservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequest {
  @NotNull(message = "Answer ID is required")
  private Long answerId;

  @NotNull(message = "Vote type is required (true=upvote, false=downvote)")
  private Boolean isUpvote;
}