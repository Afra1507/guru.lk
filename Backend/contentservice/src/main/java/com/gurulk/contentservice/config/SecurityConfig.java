package com.gurulk.contentservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthFilter jwtAuthFilter;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.GET, "/public/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/lessons/create").hasAnyRole("CONTRIBUTOR", "ADMIN")
            .requestMatchers(HttpMethod.POST, "/lessons/*/approve").hasRole("ADMIN")
            .requestMatchers(HttpMethod.GET, "/lessons/approved").hasAnyRole("LEARNER", "CONTRIBUTOR", "ADMIN")
            .requestMatchers(HttpMethod.POST, "/lessons/*/view").hasAnyRole("LEARNER", "CONTRIBUTOR", "ADMIN")
            .requestMatchers(HttpMethod.POST, "/downloads/create").hasAnyRole("LEARNER", "CONTRIBUTOR", "ADMIN")
            .requestMatchers(HttpMethod.GET, "/downloads/user/*").hasAnyRole("LEARNER", "CONTRIBUTOR", "ADMIN")
            .anyRequest().authenticated())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}