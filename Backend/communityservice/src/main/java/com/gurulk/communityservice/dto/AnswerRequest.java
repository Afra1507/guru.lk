package com.gurulk.communityservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotBlank(message = "Answer body cannot be empty")
    private String body;
}