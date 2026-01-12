package com.kd.eventmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "attendees", indexes = {
        @Index(name = "idx_attendees_event_tg", columnList = "event_id,telegramUserId", unique = true)
})
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attendee {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Event event;

    @Column(nullable = false)
    private Long telegramUserId;
    @Column(nullable = false, length = 120)
    private String fullName;

    @Column(length = 40)
    private String phone;

    @Column(length = 200)
    private String email;

    @Column(length = 200)
    private String company;

    @Column(nullable = false)
    private OffsetDateTime createdAt;
}
