package com.gurulk.notificationservice.dto;

import lombok.*;

@Data
@Builder(toBuilder = true) // enable toBuilder method
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private Long userId;
    private String role; // optional: ADMIN, CONTRIBUTOR, LEARNER
    private String type;
    private String message;
    private Long referenceId;
}
