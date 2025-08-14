package com.gurulk.notificationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import java.util.List;

@FeignClient(name = "auth-service", url = "${auth.service.url}", path = "/auth")
public interface UserServiceClient {

  @GetMapping("/users/{userId}/email")
  String getUserEmail(
      @PathVariable Long userId,
      @RequestHeader("Authorization") String authToken);

  @GetMapping("/roles/{role}/users")
  List<Long> getUserIdsByRole(
      @PathVariable String role,
      @RequestHeader("Authorization") String authToken);

  @GetMapping("/users/ids")
  List<Long> getAllUserIds(@RequestHeader("Authorization") String authToken);
}