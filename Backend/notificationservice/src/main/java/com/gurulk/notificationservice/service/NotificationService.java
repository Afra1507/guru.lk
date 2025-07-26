package com.gurulk.notificationservice.service;

import com.gurulk.notificationservice.dto.NotificationRequest;
import com.gurulk.notificationservice.dto.NotificationResponse;
import com.gurulk.notificationservice.entity.Notification;
import com.gurulk.notificationservice.exception.NotificationException;
import com.gurulk.notificationservice.exception.ResourceNotFoundException;
import com.gurulk.notificationservice.exception.UnauthorizedException;
import com.gurulk.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

  private final NotificationRepository notificationRepository;

  @Transactional
  public NotificationResponse createNotification(NotificationRequest request) {
    validateNotificationRequest(request);

    Notification notification = Notification.builder()
        .userId(request.getUserId())
        .type(request.getType())
        .message(request.getMessage())
        .referenceId(request.getReferenceId())
        .isRead(false)
        .build();

    Notification saved = notificationRepository.save(notification);
    return mapToResponse(saved);
  }

  public List<NotificationResponse> getUserNotifications(Long userId) {
    return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
        .stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  public Page<NotificationResponse> getUserNotificationsPaginated(Long userId, Pageable pageable) {
    return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
        .map(this::mapToResponse);
  }

  public List<NotificationResponse> getUnreadNotifications(Long userId) {
    return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
        .stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  public int getUnreadCount(Long userId) {
    return notificationRepository.countByUserIdAndIsReadFalse(userId);
  }

  @Transactional
  public NotificationResponse markAsRead(Long notificationId, Long userId) {
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

    if (!notification.getUserId().equals(userId)) {
      throw new UnauthorizedException("You can only mark your own notifications as read");
    }

    int updated = notificationRepository.markAsRead(notificationId, userId);
    if (updated == 0) {
      throw new NotificationException("Failed to mark notification as read");
    }

    notification.setIsRead(true);
    return mapToResponse(notification);
  }

  @Transactional
  public int markAllAsRead(Long userId) {
    return notificationRepository.markAllAsRead(userId);
  }

  @Transactional
  public void deleteNotification(Long notificationId, Long userId) {
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

    if (!notification.getUserId().equals(userId)) {
      throw new UnauthorizedException("You can only delete your own notifications");
    }

    notificationRepository.delete(notification);
  }

  public List<NotificationResponse> getRecentNotifications(Long userId, int count) {
    return notificationRepository.findTopByUserIdOrderByCreatedAtDesc(userId, Pageable.ofSize(count))
        .stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  private void validateNotificationRequest(NotificationRequest request) {
    if (request.getUserId() == null) {
      throw new NotificationException("User ID is required");
    }
    if (request.getMessage() == null || request.getMessage().isBlank()) {
      throw new NotificationException("Message cannot be empty");
    }
    if (request.getType() == null || request.getType().isBlank()) {
      throw new NotificationException("Notification type is required");
    }
  }

  private NotificationResponse mapToResponse(Notification notification) {
    return NotificationResponse.builder()
        .notificationId(notification.getNotificationId())
        .userId(notification.getUserId())
        .type(notification.getType())
        .message(notification.getMessage())
        .referenceId(notification.getReferenceId())
        .isRead(notification.getIsRead())
        .createdAt(notification.getCreatedAt())
        .build();
  }
}