package com.gurulk.communityservice.repository;

import com.gurulk.communityservice.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    // Check if user has already voted on an answer
    boolean existsByUserIdAndAnswerAnswerId(Long userId, Long answerId);

    // Count votes for an answer by type
    int countByAnswerAnswerIdAndIsUpvote(Long answerId, boolean isUpvote);

    // Find a specific user's vote on an answer
    Optional<Vote> findByUserIdAndAnswerAnswerId(Long userId, Long answerId);

    // Delete a vote
    @Modifying
    @Transactional
    void deleteByUserIdAndAnswerAnswerId(Long userId, Long answerId);

    // Get vote difference (upvotes - downvotes) for an answer
    @Query("SELECT (SUM(CASE WHEN v.isUpvote = true THEN 1 ELSE 0 END) - " +
            "SUM(CASE WHEN v.isUpvote = false THEN 1 ELSE 0 END)) " +
            "FROM Vote v WHERE v.answer.answerId = :answerId")
    Integer getVoteDifference(@Param("answerId") Long answerId);

    // Count total votes for an answer
    int countByAnswerAnswerId(Long answerId);
}