package com.kd.eventmanagement.backend.dto.request;
import com.kd.eventmanagement.backend.entity.Event;
import jakarta.validation.constraints.NotNull;

public record UpdateEventStatusRequest(
        @NotNull Event.EventStatus status
) {}
