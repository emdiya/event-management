package com.kd.eventmanagement.backend.repository;

import com.kd.eventmanagement.backend.entity.Attendee;
import com.kd.eventmanagement.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AttendeeRepository extends JpaRepository<Attendee, UUID> {
    Optional<Attendee> findByEventAndTelegramUserId(Event event, Long telegramUserId);
}
