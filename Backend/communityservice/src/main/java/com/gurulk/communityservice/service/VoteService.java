package com.gurulk.communityservice.service;

import com.gurulk.communityservice.dto.VoteRequest;
import com.gurulk.communityservice.dto.VoteResponse;
import com.gurulk.communityservice.entity.Answer;
import com.gurulk.communityservice.entity.Vote;
import com.gurulk.communityservice.exception.ResourceNotFoundException;
import com.gurulk.communityservice.exception.UnauthorizedException;
import com.gurulk.communityservice.repository.AnswerRepository;
import com.gurulk.communityservice.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class VoteService {

    private final VoteRepository voteRepository;
    private final AnswerRepository answerRepository;

    public VoteResponse createVote(Long userId, String userRole, VoteRequest request) {
        if ("ADMIN".equals(userRole)) {
            throw new UnauthorizedException("Admins cannot vote on answers");
        }

        Answer answer = answerRepository.findById(request.getAnswerId())
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + request.getAnswerId()));

        if (answer.getUserId().equals(userId)) {
            throw new UnauthorizedException("Cannot vote on your own answer");
        }

        Optional<Vote> existingVote = voteRepository.findByUserIdAndAnswerAnswerId(userId, request.getAnswerId());

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            if (vote.getIsUpvote().equals(request.getIsUpvote())) {
                voteRepository.delete(vote);
                return null;
            } else {
                vote.setIsUpvote(request.getIsUpvote());
                return mapToResponse(voteRepository.save(vote));
            }
        } else {
            Vote newVote = Vote.builder()
                    .userId(userId)
                    .answer(answer)
                    .isUpvote(request.getIsUpvote())
                    .build();
            return mapToResponse(voteRepository.save(newVote));
        }
    }

    public int countVotes(Long answerId, Boolean isUpvote) {
        if (!answerRepository.existsById(answerId)) {
            throw new ResourceNotFoundException("Answer not found with id: " + answerId);
        }
        return voteRepository.countByAnswerAnswerIdAndIsUpvote(answerId, isUpvote);
    }

    public Integer getVoteDifference(Long answerId) {
        if (!answerRepository.existsById(answerId)) {
            throw new ResourceNotFoundException("Answer not found with id: " + answerId);
        }
        return voteRepository.getVoteDifference(answerId);
    }

    public void removeVote(Long userId, String userRole, Long answerId) {
        if (!answerRepository.existsById(answerId)) {
            throw new ResourceNotFoundException("Answer not found with id: " + answerId);
        }
        voteRepository.deleteByUserIdAndAnswerAnswerId(userId, answerId);
    }

    private VoteResponse mapToResponse(Vote vote) {
        if (vote == null) {
            return null;
        }
        return VoteResponse.builder()
                .voteId(vote.getVoteId())
                .answerId(vote.getAnswer().getAnswerId())
                .userId(vote.getUserId())
                .isUpvote(vote.getIsUpvote())
                .createdAt(vote.getCreatedAt())
                .build();
    }
}