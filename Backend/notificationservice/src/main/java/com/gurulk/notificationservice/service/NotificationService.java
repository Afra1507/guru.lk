package com.gurulk.notificationservice.service;

import com.gurulk.notificationservice.client.UserServiceClient;
import com.gurulk.notificationservice.dto.NotificationRequest;
import com.gurulk.notificationservice.dto.NotificationResponse;
import com.gurulk.notificationservice.entity.Notification;
import com.gurulk.notificationservice.exception.NotificationException;
import com.gurulk.notificationservice.exception.ResourceNotFoundException;
import com.gurulk.notificationservice.exception.UnauthorizedException;
import com.gurulk.notificationservice.repository.NotificationRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

  private final NotificationRepository notificationRepository;
  private final EmailService emailService;
  private final UserServiceClient userServiceClient;
  private final JavaMailSender mailSender;

  @Transactional
  public NotificationResponse createNotification(
      NotificationRequest request,
      String senderRole,
      String authToken) {

    validateNotificationRequest(request);

    Notification notification = Notification.builder()
        .userId(request.getUserId())
        .type(request.getType())
        .message(request.getMessage())
        .referenceId(request.getReferenceId())
        .isRead(false)
        .build();

    Notification saved = notificationRepository.save(notification);

    if ("ADMIN".equals(senderRole)) {
      try {
        log.info("Fetching email for user {} from auth-service", request.getUserId());
        String email = userServiceClient.getUserEmail(request.getUserId(), authToken);

        if (email != null && !email.isBlank()) {
          log.info("Sending email to {}", email);
          emailService.sendNotificationEmail(
              email,
              "Notification: " + request.getType(),
              request.getMessage());
        } else {
          log.warn("Empty email returned for user {}", request.getUserId());
        }
      } catch (Exception e) {
        log.error("Failed to process email for user {}: {}", request.getUserId(), e.toString());
      }
    }

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

  @PostConstruct
  public void checkMailConfig() {
    log.info("JavaMailSender initialized: {}", mailSender != null);
    log.info("Mail password present in environment: {}", System.getenv("GMAIL_APP_PASSWORD") != null);
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

  private Notification buildNotification(NotificationRequest request) {
    return Notification.builder()
        .userId(request.getUserId())
        .type(request.getType())
        .message(request.getMessage())
        .referenceId(request.getReferenceId())
        .isRead(false)
        .build();
  }
}
