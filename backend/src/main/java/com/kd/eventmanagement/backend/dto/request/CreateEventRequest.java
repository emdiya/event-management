package com.kd.eventmanagement.backend.dto.request;
import com.kd.eventmanagement.backend.entity.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public record CreateEventRequest(
        @NotBlank String title,
        String description,
        String location,
        @NotNull OffsetDateTime startAt,
        @NotNull OffsetDateTime endAt,
        Event.EventStatus status // Optional, defaults to DRAFT if not provided
) {}
