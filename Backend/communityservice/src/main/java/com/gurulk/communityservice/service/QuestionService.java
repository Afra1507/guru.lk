package com.gurulk.communityservice.service;

import com.gurulk.communityservice.dto.QuestionRequest;
import com.gurulk.communityservice.dto.QuestionResponse;
import com.gurulk.communityservice.entity.Question;
import com.gurulk.communityservice.entity.Question.Language;
import com.gurulk.communityservice.exception.ResourceNotFoundException;
import com.gurulk.communityservice.exception.UnauthorizedException;
import com.gurulk.communityservice.repository.AnswerRepository;
import com.gurulk.communityservice.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    public QuestionResponse createQuestion(Long userId, QuestionRequest request) {
        Question question = Question.builder()
                .userId(userId)
                .title(request.getTitle())
                .body(request.getBody())
                .subject(request.getSubject())
                .language(request.getLanguage())
                .build();

        Question savedQuestion = questionRepository.save(question);
        return mapToResponse(savedQuestion);
    }

    public QuestionResponse getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return mapToResponse(question);
    }

    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<QuestionResponse> getAllQuestions(Pageable pageable) {
        return questionRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public List<QuestionResponse> getQuestionsBySubject(String subject) {
        return questionRepository.findBySubject(subject).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<QuestionResponse> getQuestionsByLanguage(Language language) {
        return questionRepository.findByLanguage(language).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteQuestion(Long userId, String userRole, Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        checkUserAuthorization(userId, userRole, question);

        // First delete all answers to maintain referential integrity
        answerRepository.deleteByQuestionQuestionId(questionId);
        questionRepository.delete(question);
    }

    private void checkUserAuthorization(Long userId, String userRole, Question question) {
        if (!question.getUserId().equals(userId) && !"ADMIN".equals(userRole)) {
            throw new UnauthorizedException("User is not authorized to perform this action");
        }
    }

    public List<QuestionResponse> getQuestionsByUserId(Long userId) {
        List<Question> questions = questionRepository.findByUserId(userId);
        return questions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private QuestionResponse mapToResponse(Question question) {
        int answerCount = answerRepository.countByQuestionQuestionId(question.getQuestionId());
        return QuestionResponse.builder()
                .questionId(question.getQuestionId())
                .userId(question.getUserId())
                .title(question.getTitle())
                .body(question.getBody())
                .subject(question.getSubject())
                .language(question.getLanguage())
                .answerCount(answerCount)
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }
}