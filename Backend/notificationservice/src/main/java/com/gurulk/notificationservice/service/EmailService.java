package com.gurulk.notificationservice.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
  private final JavaMailSender mailSender;

  public void sendNotificationEmail(String recipientEmail, String notificationType, String message) {
    SimpleMailMessage mailMessage = new SimpleMailMessage();
    mailMessage.setTo(recipientEmail);
    mailMessage.setSubject("New Notification: " + notificationType);
    mailMessage.setText("You have received a new notification:\n\n" +
        message + "\n\n" +
        "Please log in to view more details.");
    mailSender.send(mailMessage);
  }
}