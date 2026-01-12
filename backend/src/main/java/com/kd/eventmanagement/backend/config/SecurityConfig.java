package com.kd.eventmanagement.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kd.eventmanagement.backend.dto.respone.ErrorResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/events", "/api/events/**").permitAll()
                .requestMatchers("/api/registrations/**").permitAll()
                .requestMatchers("/api/checkin/**").authenticated()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/v3/api-docs", "/swagger-resources/**", "/webjars/**").permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    
                    String traceId = MDC.get("traceId");
                    if (traceId == null) {
                        traceId = UUID.randomUUID().toString();
                    }
                    
                    ErrorResponse error = ErrorResponse.builder()
                            .traceId(traceId)
                            .status(HttpStatus.UNAUTHORIZED.value())
                            .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                            .message("Authentication required. Please provide valid credentials.")
                            .path(request.getRequestURI())
                            .timestamp(OffsetDateTime.now())
                            .build();
                    
                    response.getWriter().write(objectMapper.writeValueAsString(error));
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    
                    String traceId = MDC.get("traceId");
                    if (traceId == null) {
                        traceId = UUID.randomUUID().toString();
                    }
                    
                    ErrorResponse error = ErrorResponse.builder()
                            .traceId(traceId)
                            .status(HttpStatus.FORBIDDEN.value())
                            .error(HttpStatus.FORBIDDEN.getReasonPhrase())
                            .message("Access denied. You don't have permission to access this resource.")
                            .path(request.getRequestURI())
                            .timestamp(OffsetDateTime.now())
                            .build();
                    
                    response.getWriter().write(objectMapper.writeValueAsString(error));
                })
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
