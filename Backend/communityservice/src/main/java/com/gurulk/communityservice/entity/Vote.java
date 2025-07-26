package com.gurulk.communityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "votes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "vote_id")
  private Long voteId;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "answer_id", nullable = false)
  private Answer answer;

  @Column(name = "is_upvote", nullable = false)
  private Boolean isUpvote;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

}