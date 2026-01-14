package com.kd.eventmanagement.backend.controller;

import com.kd.eventmanagement.backend.dto.request.CreateEventRequest;
import com.kd.eventmanagement.backend.dto.request.UpdateEventStatusRequest;
import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.dto.respone.EventStatsResponse;
import com.kd.eventmanagement.backend.common.wrapper.ItemResponse;
import com.kd.eventmanagement.backend.common.wrapper.PaginationResponse;
import com.kd.eventmanagement.backend.service.AdminService;
import com.kd.eventmanagement.backend.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management APIs")
@SecurityRequirement(name = "bearer-jwt")
public class AdminController {
    private final AdminService adminService;
    private final EventService eventService;

    @GetMapping("/events")
    @Operation(summary = "Get all events", description = "Retrieve all events (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Events retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<PaginationResponse<EventResponse>> getAllEvents() {
        List<EventResponse> events = adminService.getAllEvents();
        PaginationResponse<EventResponse> response = PaginationResponse.success(
                events,
                1,
                events.size(),
                events.size()
        );
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/events/{hashId}/status")
    @Operation(summary = "Update event status", description = "Update the status of an event (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Event status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ItemResponse<EventResponse>> updateEventStatus(
            @Parameter(description = "Event hash ID", required = true) @PathVariable String hashId,
            @Valid @RequestBody UpdateEventStatusRequest request) {
        EventResponse eventResponse = adminService.updateEventStatus(hashId, request.status());
        ItemResponse<EventResponse> response = ItemResponse.success(eventResponse, "Event status updated successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/events/{hashId}")
    @Operation(summary = "Delete event", description = "Delete an event by hash ID (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Void> deleteEvent(
            @Parameter(description = "Event hash ID", required = true) @PathVariable String hashId) {
        adminService.deleteEvent(hashId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/events/{hashId}/stats")
    @Operation(summary = "Get event statistics", description = "Get attendance statistics for an event (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ItemResponse<EventStatsResponse>> getEventStats(
            @Parameter(description = "Event hash ID", required = true) @PathVariable String hashId) {
        long attendeeCount = adminService.getAttendeeCount(hashId);
        long checkedInCount = adminService.getCheckedInCount(hashId);
        double percentage = attendeeCount > 0 ? (checkedInCount * 100.0 / attendeeCount) : 0.0;

        // Get event details for response
        List<EventResponse> events = adminService.getAllEvents();
        EventResponse event = events.stream()
                .filter(e -> e.getHashId().equals(hashId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventStatsResponse stats = new EventStatsResponse(
                hashId,
                event.getCode(),
                event.getTitle(),
                attendeeCount,
                checkedInCount,
                percentage
        );

        ItemResponse<EventStatsResponse> response = ItemResponse.success(stats, "Event statistics retrieved successfully");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/events/{codeOrHash}")
    @Operation(summary = "Update event", description = "Update an event by code or hash ID (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Event updated successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ItemResponse<EventResponse>> updateEvent(
            @Parameter(description = "Event code or hash ID", required = true) @PathVariable String codeOrHash,
            @Valid @RequestBody CreateEventRequest request
    ) {
        log.info("Admin updating event: {}", codeOrHash);
        EventResponse eventResponse = eventService.updateEvent(codeOrHash, request);
        ItemResponse<EventResponse> response = ItemResponse.success(eventResponse, "Event updated successfully");
        return ResponseEntity.ok(response);
    }


}
