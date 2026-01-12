package com.kd.eventmanagement.backend.dto.respone;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TicketIssuedResponse(
        UUID ticketId,
        String ticketNo,
        String eventCode,
        String qrPayload,
        OffsetDateTime issuedAt
) {}
