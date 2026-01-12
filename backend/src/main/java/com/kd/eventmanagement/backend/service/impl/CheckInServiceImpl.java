package com.kd.eventmanagement.backend.service.impl;

import com.kd.eventmanagement.backend.dto.respone.CheckInResponse;
import com.kd.eventmanagement.backend.entity.Ticket;
import com.kd.eventmanagement.backend.repository.EventRepository;
import com.kd.eventmanagement.backend.repository.TicketRepository;
import com.kd.eventmanagement.backend.service.CheckInService;
import com.kd.eventmanagement.backend.util.QrSigner;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckInServiceImpl implements CheckInService {

    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;

    @Value("${app.qr.secret:change-me}")
    private String qrSecret;

    @Override
    @Transactional
    public CheckInResponse checkIn(String qrPayload, String staffUser) {
        Map<String, String> q = parseQuery(qrPayload);

        String ticketIdStr = q.get("t");
        String eventCode = q.get("e");
        String ts = q.get("ts");
        String sig = q.get("sig");

        if (ticketIdStr == null || eventCode == null || ts == null || sig == null) {
            return new CheckInResponse(false, "Invalid QR payload", null, null, null);
        }

        String base = "t=" + ticketIdStr + "&e=" + eventCode + "&ts=" + ts;
        String expectedSig = QrSigner.hmacSha256Hex(qrSecret, base);
        if (!expectedSig.equalsIgnoreCase(sig)) {
            return new CheckInResponse(false, "Invalid signature (fake QR)", null, null, null);
        }

        // Ensure event exists
        var event = eventRepository.findByCode(eventCode)
                .orElse(null);
        if (event == null) {
            return new CheckInResponse(false, "Event not found", null, null, null);
        }

        UUID ticketId;
        try {
            ticketId = UUID.fromString(ticketIdStr);
        } catch (Exception ex) {
            return new CheckInResponse(false, "Invalid ticket id", null, null, null);
        }

        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket == null) {
            return new CheckInResponse(false, "Ticket not found", null, null, null);
        }

        if (!ticket.getEvent().getCode().equals(eventCode)) {
            return new CheckInResponse(false, "Ticket does not belong to this event", null, null, null);
        }

        if (ticket.getStatus() == Ticket.TicketStatus.REVOKED) {
            return new CheckInResponse(false, "Ticket revoked", null, ticket.getTicketNo(), null);
        }

        if (ticket.getCheckedInAt() != null) {
            return new CheckInResponse(false, "Already checked-in", ticket.getAttendee().getFullName(),
                    ticket.getTicketNo(), ticket.getCheckedInAt());
        }

        // Optional: check time window
        OffsetDateTime now = OffsetDateTime.now();
        if (now.isBefore(event.getStartAt()) || now.isAfter(event.getEndAt())) {
            return new CheckInResponse(false, "Event not active (outside time window)", ticket.getAttendee().getFullName(),
                    ticket.getTicketNo(), null);
        }

        ticket.setCheckedInAt(now);
        ticket.setCheckedInBy(staffUser);
        ticketRepository.save(ticket);

        return new CheckInResponse(true, "Checked-in successfully",
                ticket.getAttendee().getFullName(),
                ticket.getTicketNo(),
                ticket.getCheckedInAt());
    }

    private static Map<String, String> parseQuery(String payload) {
        String s = payload.trim();
        // allow full URL like https://...?... too
        int idx = s.indexOf('?');
        if (idx >= 0) s = s.substring(idx + 1);

        Map<String, String> map = new HashMap<>();
        for (String part : s.split("&")) {
            int eq = part.indexOf('=');
            if (eq <= 0) continue;
            String k = URLDecoder.decode(part.substring(0, eq), StandardCharsets.UTF_8);
            String v = URLDecoder.decode(part.substring(eq + 1), StandardCharsets.UTF_8);
            map.put(k, v);
        }
        return map;
    }
}
