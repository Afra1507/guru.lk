package com.gurulk.notificationservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @Column(nullable = false)
    private Long userId;

    @Column
    private String role; // ADMIN, CONTRIBUTOR, LEARNER, or null for individual

    @Column(nullable = false)
    private String type; // reply, content_update, announcement

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private Long referenceId; // ID of question/lesson/etc

    @Builder.Default
    private Boolean isRead = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}