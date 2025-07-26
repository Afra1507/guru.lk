package com.gurulk.communityservice.dto;

import com.gurulk.communityservice.entity.Question.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
  private Long questionId;
  private Long userId;
  private String title;
  private String body;
  private String subject;
  private Language language;
  private int answerCount;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}