package com.kd.eventmanagement.backend.repository;

import com.kd.eventmanagement.backend.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByCode(String code);
    boolean existsByCode(String code);
    
    // Pagination and search/filter methods
    Page<Event> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Event> findByStatus(Event.EventStatus status, Pageable pageable);
    Page<Event> findByTitleContainingIgnoreCaseAndStatus(String title, Event.EventStatus status, Pageable pageable);
}
