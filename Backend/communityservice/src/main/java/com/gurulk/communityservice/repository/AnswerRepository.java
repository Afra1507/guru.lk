package com.gurulk.communityservice.repository;

import com.gurulk.communityservice.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // Find all answers for a specific question
    List<Answer> findByQuestionQuestionId(Long questionId);

    // Find all answers by a specific user
    List<Answer> findByUserId(Long userId);

    // Find all accepted answers
    List<Answer> findByIsAcceptedTrue();

    // Find accepted answer for a specific question
    Optional<Answer> findByQuestionQuestionIdAndIsAcceptedTrue(Long questionId);

    // Check if a user has already answered a question
    boolean existsByQuestionQuestionIdAndUserId(Long questionId, Long userId);

    // Find answers for a question sorted by creation date
    List<Answer> findByQuestionQuestionIdOrderByCreatedAtDesc(Long questionId);

    // Find top voted answers for a question
    @Query("SELECT a FROM Answer a WHERE a.question.questionId = :questionId " +
            "ORDER BY (SELECT COUNT(v) FROM Vote v WHERE v.answer = a AND v.isUpvote = true) - " +
            "(SELECT COUNT(v) FROM Vote v WHERE v.answer = a AND v.isUpvote = false) DESC")
    List<Answer> findTopVotedAnswersByQuestionId(@Param("questionId") Long questionId);

    // Update answer acceptance status
    @Modifying
    @Transactional
    @Query("UPDATE Answer a SET a.isAccepted = :isAccepted WHERE a.answerId = :answerId")
    void updateAnswerAcceptanceStatus(@Param("answerId") Long answerId, @Param("isAccepted") boolean isAccepted);

    // Count total votes for an answer (both upvotes and downvotes)
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.answer.answerId = :answerId")
    int countTotalVotesByAnswerId(@Param("answerId") Long answerId);

    // Delete all answers for a question
    @Modifying
    @Transactional
    @Query("DELETE FROM Answer a WHERE a.question.questionId = :questionId")
    void deleteByQuestionQuestionId(@Param("questionId") Long questionId);

    // Count answers for a question
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.question.questionId = :questionId")
    int countByQuestionQuestionId(@Param("questionId") Long questionId);
}