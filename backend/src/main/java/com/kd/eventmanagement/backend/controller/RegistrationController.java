package com.kd.eventmanagement.backend.controller;

import com.kd.eventmanagement.backend.dto.request.RegisterAttendeeRequest;
import com.kd.eventmanagement.backend.dto.respone.TicketIssuedResponse;
import com.kd.eventmanagement.backend.service.impl.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
@Tag(name = "Registration", description = "Event registration APIs")
public class RegistrationController {
    private final RegistrationService registrationService;
    
    @PostMapping
    @Operation(summary = "Register attendee", description = "Register an attendee for an event and issue a ticket")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Registration successful",
                    content = @Content(schema = @Schema(implementation = TicketIssuedResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<TicketIssuedResponse> registerAttendee(@Valid @RequestBody RegisterAttendeeRequest request) {
        TicketIssuedResponse response = registrationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
