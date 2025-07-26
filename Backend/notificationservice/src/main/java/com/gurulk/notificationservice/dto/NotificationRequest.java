package com.gurulk.notificationservice.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private Long userId;
    private String type;
    private String message;
    private Long referenceId;
}