package com.kd.eventmanagement.backend.service.impl;
import com.kd.eventmanagement.backend.dto.request.CreateEventRequest;
import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.common.enums.ErrorCode;
import com.kd.eventmanagement.backend.common.exception.ResourceNotFoundException;
import com.kd.eventmanagement.backend.common.mapper.EventMapper;
import com.kd.eventmanagement.backend.repository.EventRepository;
import com.kd.eventmanagement.backend.service.EventService;
import com.kd.eventmanagement.backend.common.util.CodeGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    @Transactional
    public EventResponse createEvent(CreateEventRequest req) {
        log.info("Creating new event with title: {}", req.title());
        
        if (req.endAt().isBefore(req.startAt())) {
            log.error("Invalid event dates: endAt {} is before startAt {}", req.endAt(), req.startAt());
            throw new IllegalArgumentException("endAt must be after startAt");
        }
        String code;
        do {
            code = CodeGenerator.eventCode();
        } while (eventRepository.existsByCode(code));

        Event e = Event.builder()
                .code(code)
                .title(req.title())
                .description(req.description())
                .startAt(req.startAt())
                .endAt(req.endAt())
                .status(req.status() != null ? req.status() : Event.EventStatus.DRAFT)
                .createdAt(OffsetDateTime.now())
                .build();

        e = eventRepository.save(e);
        log.info("Event created successfully with code: {} and id: {}", e.getCode(), e.getId());
        return eventMapper.toResponse(e);
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponse getByCode(String code) {
        log.debug("Fetching event with code: {}", code);
        Event e = eventRepository.findByCode(code)
                .orElseThrow(() -> {
                    log.error("Event not found with code: {}", code);
                    return new ResourceNotFoundException(ErrorCode.EVENT_NOT_FOUND, "Event not found: " + code);
                });
        log.debug("Event found: {}", e.getTitle());
        return eventMapper.toResponse(e);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventResponse> getAllEvents(int page, int size, String title, Event.EventStatus status) {
        log.debug("Fetching events - page: {}, size: {}, title: {}, status: {}", page, size, title, status);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Event> eventPage;
        
        if (title != null && !title.trim().isEmpty() && status != null) {
            // Search by both title and status
            eventPage = eventRepository.findByTitleContainingIgnoreCaseAndStatus(title.trim(), status, pageable);
        } else if (title != null && !title.trim().isEmpty()) {
            // Search by title only
            eventPage = eventRepository.findByTitleContainingIgnoreCase(title.trim(), pageable);
        } else if (status != null) {
            // Filter by status only
            eventPage = eventRepository.findByStatus(status, pageable);
        } else {
            // No filters
            eventPage = eventRepository.findAll(pageable);
        }
        
        return eventPage.map(eventMapper::toResponse);
    }
}
