package com.gurulk.notificationservice.service;

import com.gurulk.notificationservice.client.UserServiceClient;
import com.gurulk.notificationservice.dto.NotificationBroadcastRequest;
import com.gurulk.notificationservice.dto.NotificationRequest;
import com.gurulk.notificationservice.dto.NotificationResponse;
import com.gurulk.notificationservice.entity.Notification;
import com.gurulk.notificationservice.exception.NotificationException;
import com.gurulk.notificationservice.exception.ResourceNotFoundException;
import com.gurulk.notificationservice.exception.UnauthorizedException;
import com.gurulk.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

  private final NotificationRepository notificationRepository;
  private final EmailService emailService;
  private final UserServiceClient userServiceClient;

  @PostConstruct
  public void init() {
    log.info("NotificationService initialized");
  }

  @Transactional
  public NotificationResponse createNotification(NotificationRequest request, String senderRole, String authToken) {
    validateNotificationRequest(request);

    Notification notification = buildNotification(request);
    Notification saved = notificationRepository.save(notification);

    if ("ADMIN".equalsIgnoreCase(senderRole)) {
      sendEmailAsync(request, authToken);
    }

    return mapToResponse(saved);
  }

  @Async
  void sendEmailAsync(NotificationRequest request, String authToken) {
    try {
      String email = userServiceClient.getUserEmail(request.getUserId(), authToken);
      if (email != null && !email.isBlank()) {
        emailService.sendNotificationEmail(email, request.getType(), request.getMessage());
        log.info("Notification email sent to {}", email);
      } else {
        log.warn("No email found for user {}", request.getUserId());
      }
    } catch (Exception e) {
      log.error("Error sending email to user {}: {}", request.getUserId(), e.getMessage(), e);
    }
  }

  @Async
  @Transactional
  public void sendNotificationToRole(NotificationRequest request, String senderRole, String authToken) {
    log.info("Token in async method: {}", authToken); // Debug token
    authorizeAdmin(senderRole);

    List<Long> userIds = userServiceClient.getUserIdsByRole(request.getRole(), authToken);
    if (userIds.isEmpty()) {
      log.warn("No users found with role {}", request.getRole());
      return;
    }

    log.info("Sending notifications to {} users with role {}", userIds.size(), request.getRole());
    sendNotificationsToUsers(userIds, request, authToken);
  }

  @Async
  @Transactional
  public void sendNotificationToAll(NotificationBroadcastRequest request, String senderRole, String authToken) {
    authorizeAdmin(senderRole);

    List<Long> userIds = userServiceClient.getAllUserIds(authToken);
    if (userIds.isEmpty()) {
      log.warn("No users found to send notifications");
      return;
    }

    NotificationRequest notificationRequest = NotificationRequest.builder()
        .type(request.getType())
        .message(request.getMessage())
        .referenceId(request.getReferenceId())
        .build();

    log.info("Sending broadcast notification to {} users", userIds.size());
    sendNotificationsToUsers(userIds, notificationRequest, authToken);
  }

  private void sendNotificationsToUsers(List<Long> userIds, NotificationRequest request, String authToken) {
    int batchSize = 50; // Adjust batch size if needed

    for (int i = 0; i < userIds.size(); i += batchSize) {
      int end = Math.min(i + batchSize, userIds.size());
      List<Long> batch = userIds.subList(i, end);

      batch.forEach(userId -> {
        NotificationRequest userRequest = request.toBuilder().userId(userId).build();
        Notification notification = buildNotification(userRequest);
        notificationRepository.save(notification);

        try {
          sendEmailAsync(userRequest, authToken);
        } catch (Exception e) {
          log.error("Error sending email to user {}: {}", userId, e.getMessage(), e);
        }
      });
    }
  }

  public List<NotificationResponse> getUserNotifications(Long userId) {
    return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
        .stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  public List<NotificationResponse> getUserNotifications(Long userId, String role) {
    return notificationRepository.findByUserIdOrRoleOrderByCreatedAtDesc(userId, role)
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

    authorizeNotificationOwner(notification, userId);

    notificationRepository.markAsRead(notificationId, userId);
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

    authorizeNotificationOwner(notification, userId);

    notificationRepository.delete(notification);
  }

  public List<NotificationResponse> getRecentNotifications(Long userId, int count) {
    return notificationRepository.findTopByUserIdOrderByCreatedAtDesc(userId, Pageable.ofSize(count))
        .stream()
        .map(this::mapToResponse)
        .collect(Collectors.toList());
  }

  private void validateNotificationRequest(NotificationRequest request) {
    if (request.getUserId() == null)
      throw new NotificationException("User ID is required");
    if (request.getMessage() == null || request.getMessage().isBlank())
      throw new NotificationException("Message cannot be empty");
    if (request.getType() == null || request.getType().isBlank())
      throw new NotificationException("Notification type is required");
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

  private void authorizeAdmin(String role) {
    if (!"ADMIN".equalsIgnoreCase(role)) {
      throw new UnauthorizedException("Only ADMIN can perform this action");
    }
  }

  private void authorizeNotificationOwner(Notification notification, Long userId) {
    if (!notification.getUserId().equals(userId)) {
      throw new UnauthorizedException("You can only modify your own notifications");
    }
  }
}
