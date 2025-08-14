package com.gurulk.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRoleRequest {
    private String role;     // e.g., "LEARNER"
    private String type;     // e.g., "INFO"
    private String message;  // The notification message
    private Long referenceId; // Optional reference ID for the notification
}
