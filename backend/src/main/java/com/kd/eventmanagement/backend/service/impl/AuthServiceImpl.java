package com.kd.eventmanagement.backend.service.impl;

import com.kd.eventmanagement.backend.dto.request.LoginRequest;
import com.kd.eventmanagement.backend.dto.respone.LoginResponse;
import com.kd.eventmanagement.backend.entity.Role;
import com.kd.eventmanagement.backend.entity.User;
import com.kd.eventmanagement.backend.repository.UserRepository;
import com.kd.eventmanagement.backend.service.AuthService;
import com.kd.eventmanagement.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!user.isEnabled()) {
            throw new BadCredentialsException("User account is disabled");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user);
        
        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );
    }
}
