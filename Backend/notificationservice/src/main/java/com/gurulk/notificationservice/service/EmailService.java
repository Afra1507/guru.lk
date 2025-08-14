package com.gurulk.notificationservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Sends a notification email asynchronously.
     */
    @Async
    public void sendNotificationEmail(String recipientEmail, String notificationType, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(recipientEmail);
            mailMessage.setSubject("New Notification: " + notificationType);
            mailMessage.setText("You have received a new notification:\n\n" +
                    message + "\n\nPlease log in to view more details.");

            mailSender.send(mailMessage);
            log.info("Notification email sent successfully to {}", recipientEmail);

        } catch (Exception e) {
            log.error("Failed to send notification email to {}: {}", recipientEmail, e.getMessage());
        }
    }
}
