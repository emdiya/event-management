package com.kd.eventmanagement.backend.controller;

import com.kd.eventmanagement.backend.dto.request.CheckInRequest;
import com.kd.eventmanagement.backend.dto.respone.CheckInResponse;
import com.kd.eventmanagement.backend.service.CheckInService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
@Tag(name = "Check-In", description = "Ticket check-in APIs")
@SecurityRequirement(name = "bearer-jwt")
public class CheckInController {

    private final CheckInService checkInService;

    @PostMapping
    @Operation(summary = "Check-in attendee", description = "Check-in an attendee by scanning QR code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Check-in successful or failed with details",
                    content = @Content(schema = @Schema(implementation = CheckInResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid QR code"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<CheckInResponse> checkIn(@Valid @RequestBody CheckInRequest request, 
                                                     Authentication authentication) {
        String staffUser = authentication != null ? authentication.getName() : "system";
        CheckInResponse response = checkInService.checkIn(request.qrPayload(), staffUser);
        return ResponseEntity.ok(response);
    }
}
