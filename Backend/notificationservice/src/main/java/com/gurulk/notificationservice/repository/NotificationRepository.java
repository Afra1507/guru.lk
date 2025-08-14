package com.gurulk.notificationservice.repository;

import com.gurulk.notificationservice.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

  List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

  Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

  List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

  List<Notification> findByUserIdOrRoleOrderByCreatedAtDesc(Long userId, String role);

  int countByUserIdAndIsReadFalse(Long userId);

  List<Notification> findTopByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

  @Transactional
  @Modifying(clearAutomatically = true)
  @Query("UPDATE Notification n SET n.isRead = true WHERE n.notificationId = :notificationId AND n.userId = :userId")
  int markAsRead(Long notificationId, Long userId);

  @Transactional
  @Modifying(clearAutomatically = true)
  @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
  int markAllAsRead(Long userId);
}
