package com.gurulk.authservice.repository;

import com.gurulk.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  Optional<User> findByUsername(String username);

  @NonNull
  Optional<User> findById(@NonNull Long userId);
}
