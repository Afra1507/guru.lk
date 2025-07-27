package com.gurulk.notificationservice.config;

import feign.Logger;
import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

  @Bean
  public Logger.Level feignLoggerLevel() {
    return Logger.Level.FULL; // Enables full request/response logging
  }

  @Bean
  public RequestInterceptor requestInterceptor() {
    return new FeignRequestInterceptor(); // Use our custom interceptor
  }
}
