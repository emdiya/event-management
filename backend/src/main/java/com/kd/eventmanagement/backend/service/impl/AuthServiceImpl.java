package com.kd.eventmanagement.backend.service.impl;

import com.kd.eventmanagement.backend.dto.request.LoginRequest;
import com.kd.eventmanagement.backend.dto.respone.LoginResponse;
import com.kd.eventmanagement.backend.entity.Role;
import com.kd.eventmanagement.backend.entity.User;
import com.kd.eventmanagement.backend.repository.UserRepository;
import com.kd.eventmanagement.backend.service.AuthService;
import com.kd.eventmanagement.backend.common.util.AppLogger;
import com.kd.eventmanagement.backend.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final AppLogger log = AppLogger.getLogger(AuthServiceImpl.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for username: {}", request.username());
        
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> {
                    log.warn("Failed login attempt for non-existent username: {}", request.username());
                    return new BadCredentialsException("Invalid username or password");
                });

        if (!user.isEnabled()) {
            log.warn("Login attempt for disabled account: {}", request.username());
            throw new BadCredentialsException("User account is disabled");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Failed login attempt with incorrect password for username: {}", request.username());
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user);
        log.success("User logged in successfully: {}", request.username());
        
        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );
    }
}
