package com.gurulk.communityservice.repository;

import com.gurulk.communityservice.entity.Question;
import com.gurulk.communityservice.entity.Question.Language;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

        // Find questions by subject
        List<Question> findBySubject(String subject);

        // Find questions by language
        List<Question> findByLanguage(Language language);

        // Find questions by user
        List<Question> findByUserId(Long userId);

        // Get all questions with pagination
        Page<Question> findAll(Pageable pageable);

        // Search questions by title containing keyword
        @Query("SELECT q FROM Question q WHERE LOWER(q.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        Page<Question> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

        // Get popular questions (most answered)
        @Query("SELECT q FROM Question q ORDER BY SIZE(q.answers) DESC")
        Page<Question> findPopularQuestions(Pageable pageable);

        // Get unanswered questions
        @Query("SELECT q FROM Question q WHERE SIZE(q.answers) = 0")
        Page<Question> findUnansweredQuestions(Pageable pageable);

        // Get questions sorted by recent activity
        @Query("SELECT q FROM Question q ORDER BY " +
                        "GREATEST(q.createdAt, COALESCE((SELECT MAX(a.createdAt) FROM q.answers a), q.createdAt)) DESC")
        Page<Question> findRecentActiveQuestions(Pageable pageable);

        // Count answers for a question
        @Query("SELECT COUNT(a) FROM Answer a WHERE a.question.questionId = :questionId")
        int countAnswersByQuestionId(@Param("questionId") Long questionId);

        // Check if question exists and is owned by user
        @Query("SELECT CASE WHEN COUNT(q) > 0 THEN true ELSE false END " +
                        "FROM Question q WHERE q.questionId = :questionId AND q.userId = :userId")
        boolean existsByQuestionIdAndUserId(@Param("questionId") Long questionId,
                        @Param("userId") Long userId);
}