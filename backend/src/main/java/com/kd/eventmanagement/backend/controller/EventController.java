package com.kd.eventmanagement.backend.controller;
import com.kd.eventmanagement.backend.common.wrapper.PaginationResponse;
import com.kd.eventmanagement.backend.dto.request.CreateEventRequest;
import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Event management APIs")
public class EventController {
    private final EventService eventService;
    @GetMapping
    @Operation(summary = "Get all events", description = "Retrieve events with pagination and filtering")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Events retrieved successfully")
    })
    public ResponseEntity<PaginationResponse<EventResponse>> getAllEvents(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search by title") @RequestParam(required = false) String title,
            @Parameter(description = "Filter by status") @RequestParam(required = false) Event.EventStatus status) {
        
        Page<EventResponse> eventPage = eventService.getAllEvents(page, size, title, status);
        
        PaginationResponse.PaginationMetadata pagination = PaginationResponse.PaginationMetadata.builder()
                .currentPage(eventPage.getNumber() + 1)
                .pageSize(eventPage.getSize())
                .totalItems(eventPage.getTotalElements())
                .totalPages(eventPage.getTotalPages())
                .hasNext(eventPage.hasNext())
                .hasPrevious(eventPage.hasPrevious())
                .build();

        PaginationResponse<EventResponse> response = PaginationResponse.success(
                eventPage.getContent(),
                pagination,
                "Events retrieved successfully"
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Create event", description = "Create a new event (Admin/Staff only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Event created successfully",
                    content = @Content(schema = @Schema(implementation = EventResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody CreateEventRequest request) {
        EventResponse response = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{code}")
    @Operation(summary = "Get event by code", description = "Retrieve event details by event code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Event found",
                    content = @Content(schema = @Schema(implementation = EventResponse.class))),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<EventResponse> getEventByCode(
            @Parameter(description = "Event code", required = true) @PathVariable String code) {
        EventResponse response = eventService.getByCode(code);
        return ResponseEntity.ok(response);
    }


    @PatchMapping("/{codeOrHash}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Update event", description = "Update event by code or hashid (Admin/Staff only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Event updated successfully",
                    content = @Content(schema = @Schema(implementation = EventResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<EventResponse> updateEvent(
            @Parameter(description = "Event code or hashid", required = true)
            @PathVariable String codeOrHash,
            @Valid @RequestBody CreateEventRequest request
    ) {
        log.info("Updating event: {}", codeOrHash);
        EventResponse response = eventService.updateEvent(codeOrHash, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{codeOrHash}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "Delete event", description = "Delete event by code or hashid (Admin/Staff only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<Void> deleteEvent(
            @Parameter(description = "Event code or hashid", required = true)
            @PathVariable String codeOrHash
    ) {
        log.warn("Deleting event: {}", codeOrHash);
        eventService.deleteEvent(codeOrHash);
        return ResponseEntity.noContent().build();
    }


}
