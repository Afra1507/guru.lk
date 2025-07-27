package com.gurulk.notificationservice.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FeignRequestInterceptor implements RequestInterceptor {

  @Override
  public void apply(RequestTemplate template) {
    // Set default headers
    template.header("Content-Type", "application/json");

    // Optional: log method, URL, and headers
    log.debug("Feign Request: {} {} Headers: {}",
        template.method(),
        template.url(),
        template.headers());
  }
}
