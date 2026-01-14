package com.kd.eventmanagement.backend.service.impl;

import com.kd.eventmanagement.backend.common.enums.ErrorCode;
import com.kd.eventmanagement.backend.common.exception.ResourceNotFoundException;
import com.kd.eventmanagement.backend.common.helper.HashidsHelper;
import com.kd.eventmanagement.backend.common.mapper.EventMapper;
import com.kd.eventmanagement.backend.common.util.CodeGenerator;
import com.kd.eventmanagement.backend.dto.request.CreateEventRequest;
import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.repository.EventRepository;
import com.kd.eventmanagement.backend.service.EventService;
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
    private final HashidsHelper hashidsHelper;

    /* =====================================================
       CREATE
       ===================================================== */
    @Override
    @Transactional
    public EventResponse createEvent(CreateEventRequest req) {
        log.info("Creating event title={}", req.title());

        validateDates(req);

        String code = generateUniqueCode();

        Event event = Event.builder()
                .code(code)
                .title(req.title())
                .description(req.description())
                .location(req.location())
                .startAt(req.startAt())
                .endAt(req.endAt())
                .status(req.status() != null ? req.status() : Event.EventStatus.DRAFT)
                .createdAt(OffsetDateTime.now())
                .build();

        eventRepository.save(event);

        log.info("Event created code={} id={}", event.getCode(), event.getId());
        return eventMapper.toResponse(event);
    }

    /* =====================================================
       READ (code OR hashid)
       ===================================================== */
    @Override
    @Transactional(readOnly = true)
    public EventResponse getByCode(String codeOrHash) {
        Event event = findByCodeOrHash(codeOrHash);
        return eventMapper.toResponse(event);
    }

    /* =====================================================
       LIST + FILTER
       ===================================================== */
    @Override
    @Transactional(readOnly = true)
    public Page<EventResponse> getAllEvents(int page, int size, String title, Event.EventStatus status) {
        int pageIndex = Math.max(page - 1, 0);
        int pageSize  = Math.max(size, 1);

        Pageable pageable = PageRequest.of(
                pageIndex,
                pageSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Event> events;

        boolean hasTitle = title != null && !title.isBlank();
        boolean hasStatus = status != null;

        if (hasTitle && hasStatus) {
            events = eventRepository.findByTitleContainingIgnoreCaseAndStatus(title.trim(), status, pageable);
        } else if (hasTitle) {
            events = eventRepository.findByTitleContainingIgnoreCase(title.trim(), pageable);
        } else if (hasStatus) {
            events = eventRepository.findByStatus(status, pageable);
        } else {
            events = eventRepository.findAll(pageable);
        }

        return events.map(eventMapper::toResponse);
    }


    /* =====================================================
       UPDATE
       ===================================================== */
    @Override
    @Transactional
    public EventResponse updateEvent(String codeOrHash, CreateEventRequest req) {
        log.info("Updating event {}", codeOrHash);

        validateDates(req);

        Event event = findByCodeOrHash(codeOrHash);

        // ❗ Do NOT change code once created
        event.setTitle(req.title());
        event.setDescription(req.description());
        event.setLocation(req.location());
        event.setStartAt(req.startAt());
        event.setEndAt(req.endAt());

        if (req.status() != null) {
            event.setStatus(req.status());
        }

        eventRepository.save(event);

        return eventMapper.toResponse(event);
    }

    /* =====================================================
       DELETE
       ===================================================== */
    @Override
    @Transactional
    public void deleteEvent(String codeOrHash) {
        log.warn("Deleting event {}", codeOrHash);
        Event event = findByCodeOrHash(codeOrHash);
        eventRepository.delete(event);
    }


    private Event findByCodeOrHash(String codeOrHash) {
        if (codeOrHash == null || codeOrHash.isBlank()) {
            throw new ResourceNotFoundException(ErrorCode.EVENT_NOT_FOUND, "Event not found");
        }

        if (hashidsHelper.isValid(codeOrHash)) {
            Long id = hashidsHelper.decodeLong(codeOrHash);
            if (id != null) {
                return eventRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                ErrorCode.EVENT_NOT_FOUND,
                                "Event not found: " + codeOrHash
                        ));
            }
        }

        return eventRepository.findByCode(codeOrHash)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.EVENT_NOT_FOUND,
                        "Event not found: " + codeOrHash
                ));
    }

    private void validateDates(CreateEventRequest req) {
        if (req.endAt().isBefore(req.startAt())) {
            throw new IllegalArgumentException("endAt must be after startAt");
        }
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = CodeGenerator.eventCode();
        } while (eventRepository.existsByCode(code));
        return code;
    }
}
