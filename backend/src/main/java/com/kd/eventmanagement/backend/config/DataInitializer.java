package com.kd.eventmanagement.backend.config;

import com.kd.eventmanagement.backend.entity.Role;
import com.kd.eventmanagement.backend.entity.User;
import com.kd.eventmanagement.backend.repository.RoleRepository;
import com.kd.eventmanagement.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.time.OffsetDateTime;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    @Bean
    CommandLineRunner init(RoleRepository roleRepo, UserRepository userRepo) {
        return args -> {

            Role adminRole = roleRepo.findByName("ADMIN")
                    .orElseGet(() -> roleRepo.save(Role.builder().name("ADMIN").build()));

            Role staffRole = roleRepo.findByName("STAFF")
                    .orElseGet(() -> roleRepo.save(Role.builder().name("STAFF").build()));

            if (userRepo.findByUsername("admin").isEmpty()) {
                userRepo.save(User.builder()
                        .username("admin")
                        .password(new BCryptPasswordEncoder().encode("admin123"))
                        .enabled(true)
                        .roles(Set.of(adminRole))
                        .createdAt(OffsetDateTime.now())
                        .build());
            }
        };
    }
}
