package com.kd.eventmanagement.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public record CreateEventRequest(
        @NotBlank String title,
        String description,
        @NotNull OffsetDateTime startAt,
        @NotNull OffsetDateTime endAt
) {}
