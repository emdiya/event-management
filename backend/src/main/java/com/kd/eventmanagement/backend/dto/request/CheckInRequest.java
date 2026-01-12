package com.kd.eventmanagement.backend.dto.request;
import jakarta.validation.constraints.NotBlank;

public record CheckInRequest(
        @NotBlank String qrPayload
) {}