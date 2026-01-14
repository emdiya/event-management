package com.kd.eventmanagement.backend.service;

import com.kd.eventmanagement.backend.dto.request.CreateEventRequest;
import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;
import org.springframework.data.domain.Page;

public interface EventService {
    EventResponse createEvent(CreateEventRequest req);
    EventResponse getByCode(String code);
    Page<EventResponse> getAllEvents(int page, int size, String title, Event.EventStatus status);
    EventResponse updateEvent(String codeOrHash, CreateEventRequest req);
    void deleteEvent(String codeOrHash);

}
