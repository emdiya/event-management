package com.kd.eventmanagement.backend.service;

import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;

import java.util.List;

public interface AdminService {
    List<EventResponse> getAllEvents();
    EventResponse updateEventStatus(String hashId, Event.EventStatus status);
    void deleteEvent(String hashId);
    long getAttendeeCount(String hashId);
    long getCheckedInCount(String hashId);
}
