package com.kd.eventmanagement.backend.controller;

import com.kd.eventmanagement.backend.dto.request.RegisterAttendeeRequest;
import com.kd.eventmanagement.backend.dto.respone.TicketIssuedResponse;
import com.kd.eventmanagement.backend.service.impl.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService registrationService;
    @PostMapping
    public ResponseEntity<TicketIssuedResponse> registerAttendee(@Valid @RequestBody RegisterAttendeeRequest request) {
        TicketIssuedResponse response = registrationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
