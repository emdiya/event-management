package com.kd.eventmanagement.backend.service.impl;

import com.kd.eventmanagement.backend.common.enums.ErrorCode;
import com.kd.eventmanagement.backend.common.exception.BusinessException;
import com.kd.eventmanagement.backend.common.exception.ResourceNotFoundException;
import com.kd.eventmanagement.backend.common.mapper.TicketMapper;
import com.kd.eventmanagement.backend.common.util.QrSigner;
import com.kd.eventmanagement.backend.dto.request.RegisterAttendeeRequest;
import com.kd.eventmanagement.backend.dto.respone.TicketIssuedResponse;
import com.kd.eventmanagement.backend.entity.Attendee;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.entity.Ticket;
import com.kd.eventmanagement.backend.integration.telegram.TelegramBotClient;
import com.kd.eventmanagement.backend.repository.AttendeeRepository;
import com.kd.eventmanagement.backend.repository.EventRepository;
import com.kd.eventmanagement.backend.repository.TicketRepository;
import com.kd.eventmanagement.backend.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final EventRepository eventRepository;
    private final AttendeeRepository attendeeRepository;
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final TelegramBotClient telegramBotClient;

    @Value("${app.qr.secret:change-me}")
    private String qrSecret;

    @Override
    @Transactional
    public TicketIssuedResponse register(RegisterAttendeeRequest req) {
        log.info("Registering attendee {} for event {}", req.fullName(), req.eventCode());

        Event event = eventRepository.findByCode(req.eventCode())
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EVENT_NOT_FOUND,
                        "Event not found: " + req.eventCode()
                ));

        if (event.getStatus() == Event.EventStatus.CLOSED) {
            throw new BusinessException(ErrorCode.EVENT_CLOSED, "Event is closed");
        }

        // Prevent duplicate registration (same telegramUserId in same event)
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

        // One ticket per attendee (if you want to prevent duplicates, check existing ticket too)
        Ticket ticket = Ticket.builder()
                .event(event)
                .attendee(attendee)
                .ticketNo(generateTicketNo())
                .status(Ticket.TicketStatus.ACTIVE)
                .issuedAt(OffsetDateTime.now())
                .build();

        ticket = ticketRepository.save(ticket);

        String qrPayload = buildSignedQrPayload(ticket.getId(), event.getCode(), ticket.getIssuedAt());

        // Send confirmation (don’t fail registration if Telegram fails)
        sendTelegramConfirmation(req.telegramUserId(), ticket, event);

        return ticketMapper.toIssuedResponse(ticket, qrPayload);
    }

    private String generateTicketNo() {
        return "T-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String buildSignedQrPayload(UUID ticketId, String eventCode, OffsetDateTime issuedAt) {
        long ts = issuedAt.toEpochSecond();
        String base = "t=" + ticketId + "&e=" + eventCode + "&ts=" + ts;
        String sig = QrSigner.hmacSha256Hex(qrSecret, base);
        return base + "&sig=" + sig;
    }

    private void sendTelegramConfirmation(Long telegramUserId, Ticket ticket, Event event) {
        try {
            String message = String.format("""
                ✅ <b>Registration Confirmed!</b>
                                
                📅 Event: <b>%s</b>
                🎫 Ticket: <code>%s</code>
                📍 Location: %s
                🕒 Start: %s
                🕒 End: %s
                                
                Please save your QR code for check-in.
                """,
                    event.getTitle(),
                    ticket.getTicketNo(),
                    event.getLocation() != null ? event.getLocation() : "TBA",
                    event.getStartAt(),
                    event.getEndAt()
            );

            telegramBotClient.sendMessageToUser(telegramUserId, message);
        } catch (Exception e) {
            log.error("Failed to send Telegram confirmation", e);
        }
    }
}
