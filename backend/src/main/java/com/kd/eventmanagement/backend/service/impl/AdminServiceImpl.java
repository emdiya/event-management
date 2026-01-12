package com.kd.eventmanagement.backend.service.impl;

import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.common.enums.ErrorCode;
import com.kd.eventmanagement.backend.common.exception.BusinessException;
import com.kd.eventmanagement.backend.common.exception.ResourceNotFoundException;
import com.kd.eventmanagement.backend.common.helper.HashidsHelper;
import com.kd.eventmanagement.backend.common.mapper.EventMapper;
import com.kd.eventmanagement.backend.repository.AttendeeRepository;
import com.kd.eventmanagement.backend.repository.EventRepository;
import com.kd.eventmanagement.backend.repository.TicketRepository;
import com.kd.eventmanagement.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final EventRepository eventRepository;
    private final AttendeeRepository attendeeRepository;
    private final TicketRepository ticketRepository;
    private final EventMapper eventMapper;
    private final HashidsHelper hashidsHelper;

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        log.debug("Fetching all events");
        List<EventResponse> events = eventRepository.findAll().stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());
        log.info("Found {} events", events.size());
        return events;
    }

    @Override
    @Transactional
    public EventResponse updateEventStatus(String hashId, Event.EventStatus status) {
        log.info("Updating event {} status to {}", hashId, status);
        
        Long eventId = hashidsHelper.decodeLong(hashId);
        if (eventId == null) {
            log.error("Invalid hashId: {}", hashId);
            throw new BusinessException(ErrorCode.INVALID_INPUT, "Invalid event ID");
        }
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    log.error("Event not found with id: {}", eventId);
                    return new ResourceNotFoundException(ErrorCode.EVENT_NOT_FOUND, "Event not found with id: " + hashId);
                });
        
        event.setStatus(status);
        Event updated = eventRepository.save(event);
        log.info("Event status updated successfully for event: {}", hashId);
        return eventMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteEvent(String hashId) {
        log.warn("Deleting event with hashId: {}", hashId);
        
        Long eventId = hashidsHelper.decodeLong(hashId);
        if (eventId == null) {
            log.error("Invalid hashId: {}", hashId);
            throw new BusinessException(ErrorCode.INVALID_INPUT, "Invalid event ID");
        }
        
        if (!eventRepository.existsById(eventId)) {
            log.error("Event not found with id: {}", eventId);
            throw new ResourceNotFoundException(ErrorCode.EVENT_NOT_FOUND, "Event not found with id: " + hashId);
        }
        eventRepository.deleteById(eventId);
        log.info("Event deleted successfully: {}", hashId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getAttendeeCount(String hashId) {
        Long eventId = hashidsHelper.decodeLong(hashId);
        if (eventId == null) {
            log.error("Invalid hashId: {}", hashId);
            throw new BusinessException(ErrorCode.INVALID_INPUT, "Invalid event ID");
        }
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EVENT_NOT_FOUND, "Event not found with id: " + hashId));
        
        return attendeeRepository.findAll().stream()
                .filter(a -> a.getEvent().getId().equals(event.getId()))
                .count();
    }

    @Override
    @Transactional(readOnly = true)
    public long getCheckedInCount(String hashId) {
        Long eventId = hashidsHelper.decodeLong(hashId);
        if (eventId == null) {
            log.error("Invalid hashId: {}", hashId);
            throw new BusinessException(ErrorCode.INVALID_INPUT, "Invalid event ID");
        }
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EVENT_NOT_FOUND, "Event not found with id: " + hashId));
        
        return ticketRepository.findAll().stream()
                .filter(t -> t.getEvent().getId().equals(event.getId()))
                .filter(t -> t.getCheckedInAt() != null)
                .count();
    }
}
