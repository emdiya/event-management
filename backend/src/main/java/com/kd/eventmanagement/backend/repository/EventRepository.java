package com.kd.eventmanagement.backend.repository;

import com.kd.eventmanagement.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    Optional<Event> findByCode(String code);
    boolean existsByCode(String code);
}
