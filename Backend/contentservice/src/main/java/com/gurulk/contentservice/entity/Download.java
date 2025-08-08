package com.gurulk.contentservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "downloads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Download {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "download_id")
    private Long downloadId;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonBackReference
    private Lesson lesson;

    @Column(name = "downloaded_at", nullable = false, updatable = false)
    private LocalDateTime downloadedAt;

    @NotNull
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        this.downloadedAt = LocalDateTime.now();
        if (this.expiresAt == null) {
            this.expiresAt = LocalDateTime.now().plusDays(30); // Default 30-day expiry
        }
    }
}