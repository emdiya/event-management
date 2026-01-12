package com.kd.eventmanagement.backend.service.impl;

import com.kd.eventmanagement.backend.dto.request.CreateEventRequest;
import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.repository.EventRepository;
import com.kd.eventmanagement.backend.service.EventService;
import com.kd.eventmanagement.backend.util.CodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    @Transactional
    public EventResponse createEvent(CreateEventRequest req) {
        if (req.endAt().isBefore(req.startAt())) {
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
                .status(Event.EventStatus.DRAFT)
                .createdAt(OffsetDateTime.now())
                .build();

        e = eventRepository.save(e);
        return toResponse(e);
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponse getByCode(String code) {
        Event e = eventRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + code));
        return toResponse(e);
    }

    private static EventResponse toResponse(Event e) {
        return new EventResponse(
                e.getId(),
                e.getCode(),
                e.getTitle(),
                e.getDescription(),
                e.getStartAt(),
                e.getEndAt(),
                e.getStatus().name()
        );
    }
}
