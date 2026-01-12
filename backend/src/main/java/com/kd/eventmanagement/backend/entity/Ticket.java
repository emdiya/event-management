package com.kd.eventmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets", indexes = {
        @Index(name = "idx_tickets_event_ticketNo", columnList = "event_id,ticketNo", unique = true)
})
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Event event;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    private Attendee attendee;

    @Column(nullable = false, length = 32)
    private String ticketNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private TicketStatus status;

    private OffsetDateTime checkedInAt;

    @Column(length = 80)
    private String checkedInBy;

    @Column(nullable = false)
    private OffsetDateTime issuedAt;

    public enum TicketStatus {
        ACTIVE, REVOKED
    }
}
