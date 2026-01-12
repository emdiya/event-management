package com.kd.eventmanagement.backend.dto.respone;

import java.time.OffsetDateTime;

public record CheckInResponse(
        boolean success,
        String message,
        String attendeeName,
        String ticketNo,
        OffsetDateTime checkedInAt
) {}
