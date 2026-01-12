package com.kd.eventmanagement.backend.service.impl;

import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.repository.AttendeeRepository;
import com.kd.eventmanagement.backend.repository.EventRepository;
import com.kd.eventmanagement.backend.repository.TicketRepository;
import com.kd.eventmanagement.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final EventRepository eventRepository;
    private final AttendeeRepository attendeeRepository;
    private final TicketRepository ticketRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventResponse updateEventStatus(UUID eventId, Event.EventStatus status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        event.setStatus(status);
        Event updated = eventRepository.save(event);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteEvent(UUID eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found with id: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getAttendeeCount(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        return attendeeRepository.findAll().stream()
                .filter(a -> a.getEvent().getId().equals(event.getId()))
                .count();
    }

    @Override
    @Transactional(readOnly = true)
    public long getCheckedInCount(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        return ticketRepository.findAll().stream()
                .filter(t -> t.getEvent().getId().equals(event.getId()))
                .filter(t -> t.getCheckedInAt() != null)
                .count();
    }

    private EventResponse mapToResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getCode(),
                event.getTitle(),
                event.getDescription(),
                event.getStartAt(),
                event.getEndAt(),
                event.getStatus().name()
        );
    }
}
