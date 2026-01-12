package com.kd.eventmanagement.backend.service;

import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    List<EventResponse> getAllEvents();
    EventResponse updateEventStatus(UUID eventId, Event.EventStatus status);
    void deleteEvent(UUID eventId);
    long getAttendeeCount(UUID eventId);
    long getCheckedInCount(UUID eventId);
}
