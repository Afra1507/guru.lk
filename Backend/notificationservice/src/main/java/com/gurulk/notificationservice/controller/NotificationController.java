package com.gurulk.notificationservice.controller;

import com.gurulk.notificationservice.client.UserServiceClient;
import com.gurulk.notificationservice.dto.*;
import com.gurulk.notificationservice.service.NotificationService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserServiceClient userServiceClient;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationResponse> createNotification(
            @RequestBody NotificationRequest request,
            @RequestHeader("Authorization") String authToken,
            @RequestAttribute String role) {

        NotificationResponse response = notificationService.createNotification(request, role, authToken);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            @RequestAttribute Long userId) {

        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<NotificationResponse>> getMyNotificationsPaginated(
            @RequestAttribute Long userId,
            Pageable pageable) {

        return ResponseEntity.ok(notificationService.getUserNotificationsPaginated(userId, pageable));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getMyUnreadNotifications(
            @RequestAttribute Long userId) {

        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Integer> getUnreadCount(@RequestAttribute Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<NotificationResponse>> getRecentNotifications(
            @RequestAttribute Long userId,
            @RequestParam(defaultValue = "5") int count) {

        return ResponseEntity.ok(notificationService.getRecentNotifications(userId, count));
    }

    @GetMapping("/user-or-role")
    public ResponseEntity<List<NotificationResponse>> getUserOrRoleNotifications(
            @RequestAttribute Long userId,
            @RequestAttribute String role) {

        return ResponseEntity.ok(notificationService.getUserNotifications(userId, role));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long notificationId,
            @RequestAttribute Long userId) {

        return ResponseEntity.ok(notificationService.markAsRead(notificationId, userId));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Integer> markAllAsRead(@RequestAttribute Long userId) {
        return ResponseEntity.ok(notificationService.markAllAsRead(userId));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId,
            @RequestAttribute Long userId) {

        notificationService.deleteNotification(notificationId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Send notification to all users of a specific role (e.g., LEARNER)
     * Only ADMIN can perform this action
     */
    @PostMapping("/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sendNotificationToRole(
            @RequestBody NotificationRoleRequest request,
            @RequestHeader("Authorization") String authToken) {

        String senderRole = "ADMIN";

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .type(request.getType())
                .message(request.getMessage())
                .role(request.getRole())
                .referenceId(request.getReferenceId())
                .build();

        try {
            notificationService.sendNotificationToRole(notificationRequest, senderRole, authToken);
            return ResponseEntity.ok("Notifications sent to all users with role: " + request.getRole());
        } catch (FeignException.Forbidden e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Permission denied to fetch users for role: " + request.getRole());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send notifications: " + e.getMessage());
        }
    }

    /**
     * Send notification to all users regardless of role
     * Only ADMIN can perform this action
     */
    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sendNotificationToAll(
            @RequestBody NotificationBroadcastRequest request,
            @RequestHeader("Authorization") String authToken) {

        String senderRole = "ADMIN";

        try {
            notificationService.sendNotificationToAll(request, senderRole, authToken);
            return ResponseEntity.ok("Notifications sent to all users");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to broadcast notifications: " + e.getMessage());
        }
    }
}
