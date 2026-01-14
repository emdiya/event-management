package com.kd.eventmanagement.backend.controller;
import com.kd.eventmanagement.backend.dto.request.RegisterAttendeeRequest;
import com.kd.eventmanagement.backend.dto.respone.TicketIssuedResponse;
import com.kd.eventmanagement.backend.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@SecurityRequirement(name = "bearer-jwt")
public class RegisterController {

    private final RegistrationService registrationService;

    @PostMapping
    @Operation(
            summary = "Register attendee to event",
            description = "Register an attendee to an event and issue a ticket with QR payload"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Registration successful",
                    content = @Content(schema = @Schema(implementation = TicketIssuedResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "409", description = "Business rule violation")
    })
    public ResponseEntity<TicketIssuedResponse> register(
            @Valid @RequestBody RegisterAttendeeRequest request
    ) {
        log.info("Register request for eventCode={}", request.eventCode());
        TicketIssuedResponse response = registrationService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
