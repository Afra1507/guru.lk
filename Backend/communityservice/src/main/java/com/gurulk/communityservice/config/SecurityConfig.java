package com.gurulk.communityservice.config;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(auth -> auth
                                                // Public endpoints
                                                .requestMatchers(
                                                                "/community/debug/**",
                                                                "/questions/**",
                                                                "/answers/**",
                                                                "/votes/**")
                                                .permitAll()

                                                // Protected endpoints (using hasRole)
                                                .requestMatchers(HttpMethod.POST, "/questions/create")
                                                .hasAnyRole("LEARNER", "CONTRIBUTOR", "ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/answers/create")
                                                .hasAnyRole("ADMIN", "LEARNER", "CONTRIBUTOR")
                                                .requestMatchers(HttpMethod.POST, "/votes/create")
                                                .hasAnyRole("ADMIN", "LEARNER", "CONTRIBUTOR")

                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                // Use allowedOriginPatterns instead of allowedOrigins
                configuration.setAllowedOriginPatterns(List.of(
                                "http://127.0.0.1:*", // allow any localhost port
                                "http://localhost:3000", // React dev server
                                "http://localhost:30080", // frontend via NodePort
                                "http://frontend",
                                "http://192.168.49.2:*" // frontend service inside cluster
                ));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}