package com.kd.eventmanagement.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterAttendeeRequest(
        @NotBlank String eventCode,
        @NotNull Long telegramUserId,
        @NotBlank String fullName,
        String phone,
        String email,
        String company
) {}