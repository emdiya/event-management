package com.kd.eventmanagement.backend.service;

import com.kd.eventmanagement.backend.dto.request.CreateEventRequest;
import com.kd.eventmanagement.backend.dto.respone.EventResponse;

public interface EventService {
    EventResponse createEvent(CreateEventRequest req);
    EventResponse getByCode(String code);
}
