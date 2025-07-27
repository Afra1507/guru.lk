package com.gurulk.notificationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service", url = "${auth.service.url}", path = "/auth")
public interface UserServiceClient {
  @GetMapping("/users/{userId}/email")
  String getUserEmail(
      @PathVariable Long userId,
      @RequestHeader("Authorization") String authToken);
}