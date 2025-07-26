package com.gurulk.notificationservice.controller;

import com.gurulk.notificationservice.dto.NotificationRequest;
import com.gurulk.notificationservice.dto.NotificationResponse;
import com.gurulk.notificationservice.exception.UnauthorizedException;
import com.gurulk.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

  private final NotificationService notificationService;

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<NotificationResponse> createNotification(
      @RequestBody NotificationRequest request,
      @RequestAttribute String role,
      @RequestAttribute(required = false) String email) {
    if (!"ADMIN".equals(role)) {
      throw new UnauthorizedException("Only admins can create notifications");
    }
    return ResponseEntity.ok(notificationService.createNotification(request, role, email));
  }

  // All other endpoints remain exactly the same
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
  public ResponseEntity<Integer> getUnreadCount(
      @RequestAttribute Long userId) {
    return ResponseEntity.ok(notificationService.getUnreadCount(userId));
  }

  @GetMapping("/recent")
  public ResponseEntity<List<NotificationResponse>> getRecentNotifications(
      @RequestAttribute Long userId,
      @RequestParam(defaultValue = "5") int count) {
    return ResponseEntity.ok(notificationService.getRecentNotifications(userId, count));
  }

  @PatchMapping("/{notificationId}/read")
  public ResponseEntity<NotificationResponse> markAsRead(
      @PathVariable Long notificationId,
      @RequestAttribute Long userId) {
    return ResponseEntity.ok(notificationService.markAsRead(notificationId, userId));
  }

  @PatchMapping("/read-all")
  public ResponseEntity<Integer> markAllAsRead(
      @RequestAttribute Long userId) {
    return ResponseEntity.ok(notificationService.markAllAsRead(userId));
  }

  @DeleteMapping("/{notificationId}")
  public ResponseEntity<Void> deleteNotification(
      @PathVariable Long notificationId,
      @RequestAttribute Long userId) {
    notificationService.deleteNotification(notificationId, userId);
    return ResponseEntity.noContent().build();
  }
}