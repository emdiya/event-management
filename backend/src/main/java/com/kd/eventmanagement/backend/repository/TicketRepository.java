package com.kd.eventmanagement.backend.repository;
import com.kd.eventmanagement.backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    Optional<Ticket> findById(UUID id);
}
