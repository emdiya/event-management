package com.kd.eventmanagement.backend.service.impl;

import com.kd.eventmanagement.backend.dto.request.RegisterAttendeeRequest;
import com.kd.eventmanagement.backend.dto.respone.TicketIssuedResponse;
import com.kd.eventmanagement.backend.entity.Attendee;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.entity.Ticket;
import com.kd.eventmanagement.backend.repository.AttendeeRepository;
import com.kd.eventmanagement.backend.repository.EventRepository;
import com.kd.eventmanagement.backend.repository.TicketRepository;
import com.kd.eventmanagement.backend.util.QrSigner;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements com.kd.eventmanagement.backend.service.impl.RegistrationService {

    private final EventRepository eventRepository;
    private final AttendeeRepository attendeeRepository;
    private final TicketRepository ticketRepository;

    @Value("${app.qr.secret:change-me}")
    private String qrSecret;

    @Override
    @Transactional
    public TicketIssuedResponse register(RegisterAttendeeRequest req) {
        Event event = eventRepository.findByCode(req.eventCode())
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + req.eventCode()));

        if (event.getStatus() == Event.EventStatus.CLOSED) {
            throw new IllegalArgumentException("Event is closed");
        }

        // prevent duplicate registration per Telegram user per event
        Attendee attendee = attendeeRepository.findByEventAndTelegramUserId(event, req.telegramUserId())
                .orElseGet(() -> attendeeRepository.save(Attendee.builder()
                        .event(event)
                        .telegramUserId(req.telegramUserId())
                        .fullName(req.fullName())
                        .phone(req.phone())
                        .email(req.email())
                        .company(req.company())
                        .createdAt(OffsetDateTime.now())
                        .build()));

        // One ticket per attendee (simple)
        Ticket ticket = Ticket.builder()
                .event(event)
                .attendee(attendee)
                .ticketNo(generateTicketNo())
                .status(Ticket.TicketStatus.ACTIVE)
                .issuedAt(OffsetDateTime.now())
                .build();

        ticket = ticketRepository.save(ticket);

        String qrPayload = buildSignedQrPayload(ticket.getId(), event.getCode(), ticket.getIssuedAt());

        return new TicketIssuedResponse(
                ticket.getId(),
                ticket.getTicketNo(),
                event.getCode(),
                qrPayload,
                ticket.getIssuedAt()
        );
    }

    private String generateTicketNo() {
        // MVP: use UUID short (later: use sequence table)
        return "T-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String buildSignedQrPayload(UUID ticketId, String eventCode, OffsetDateTime issuedAt) {
        long ts = issuedAt.toEpochSecond();
        String base = "t=" + ticketId + "&e=" + eventCode + "&ts=" + ts;
        String sig = QrSigner.hmacSha256Hex(qrSecret, base);
        return base + "&sig=" + sig;
    }
}
