package com.gurulk.communityservice.service;

import com.gurulk.communityservice.dto.AnswerRequest;
import com.gurulk.communityservice.dto.AnswerResponse;
import com.gurulk.communityservice.entity.Answer;
import com.gurulk.communityservice.entity.Question;
import com.gurulk.communityservice.exception.ResourceNotFoundException;
import com.gurulk.communityservice.exception.UnauthorizedException;
import com.gurulk.communityservice.repository.AnswerRepository;
import com.gurulk.communityservice.repository.QuestionRepository;
import com.gurulk.communityservice.repository.VoteRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final VoteRepository voteRepository;

    public AnswerResponse createAnswer(Long userId, AnswerRequest request) {
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + request.getQuestionId()));

        Answer answer = Answer.builder()
                .question(question)
                .userId(userId)
                .body(request.getBody())
                .isAccepted(false)
                .build();

        Answer savedAnswer = answerRepository.save(answer);
        return mapToResponse(savedAnswer);
    }

    public List<AnswerResponse> getAnswersByQuestionId(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new ResourceNotFoundException("Question not found with id: " + questionId);
        }

        return answerRepository.findByQuestionQuestionId(questionId).stream()
                .map(answer -> {
                    AnswerResponse response = mapToResponse(answer);
                    response.setVoteCount(voteRepository.countByAnswerAnswerId(answer.getAnswerId()));
                    return response;
                })
                .collect(Collectors.toList());
    }

    public AnswerResponse updateAnswer(Long userId, String userRole, Long answerId, AnswerRequest request) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));

        checkUserAuthorization(userId, userRole, answer);

        answer.setBody(request.getBody());
        Answer updatedAnswer = answerRepository.save(answer);
        return mapToResponse(updatedAnswer);
    }

    public void deleteAnswer(Long userId, String userRole, Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));

        checkUserAuthorization(userId, userRole, answer);

        answerRepository.delete(answer);
    }

    public void acceptAnswer(Long userId, String userRole, Long answerId) {
        if (!"ADMIN".equals(userRole)) {
            throw new UnauthorizedException("Only ADMIN can accept answers");
        }

        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));

        answer.setIsAccepted(true);
        answerRepository.save(answer);
    }

    private void checkUserAuthorization(Long userId, String userRole, Answer answer) {
        if (!answer.getUserId().equals(userId) && !"ADMIN".equals(userRole)) {
            throw new UnauthorizedException("User is not authorized to perform this action");
        }
    }

    private AnswerResponse mapToResponse(Answer answer) {
        return AnswerResponse.builder()
                .answerId(answer.getAnswerId())
                .questionId(answer.getQuestion().getQuestionId())
                .userId(answer.getUserId())
                .body(answer.getBody())
                .isAccepted(answer.getIsAccepted())
                .voteCount(voteRepository.countByAnswerAnswerId(answer.getAnswerId()))
                .createdAt(answer.getCreatedAt())
                .updatedAt(answer.getUpdatedAt())
                .build();
    }
}