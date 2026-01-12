package com.kd.eventmanagement.backend.controller;

import com.kd.eventmanagement.backend.dto.request.UpdateEventStatusRequest;
import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.dto.respone.EventStatsResponse;
import com.kd.eventmanagement.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> events = adminService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @PutMapping("/events/{eventId}/status")
    public ResponseEntity<EventResponse> updateEventStatus(
            @PathVariable UUID eventId,
            @Valid @RequestBody UpdateEventStatusRequest request) {
        EventResponse response = adminService.updateEventStatus(eventId, request.status());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID eventId) {
        adminService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/events/{eventId}/stats")
    public ResponseEntity<EventStatsResponse> getEventStats(@PathVariable UUID eventId) {
        long attendeeCount = adminService.getAttendeeCount(eventId);
        long checkedInCount = adminService.getCheckedInCount(eventId);
        double percentage = attendeeCount > 0 ? (checkedInCount * 100.0 / attendeeCount) : 0.0;

        // Get event details for response
        List<EventResponse> events = adminService.getAllEvents();
        EventResponse event = events.stream()
                .filter(e -> e.getId().equals(eventId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventStatsResponse stats = new EventStatsResponse(
                eventId,
                event.getCode(),
                event.getTitle(),
                attendeeCount,
                checkedInCount,
                percentage
        );

        return ResponseEntity.ok(stats);
    }
}
