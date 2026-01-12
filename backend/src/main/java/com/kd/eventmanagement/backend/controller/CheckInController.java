package com.kd.eventmanagement.backend.controller;

import com.kd.eventmanagement.backend.dto.request.CheckInRequest;
import com.kd.eventmanagement.backend.dto.respone.CheckInResponse;
import com.kd.eventmanagement.backend.service.CheckInService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @PostMapping
    public ResponseEntity<CheckInResponse> checkIn(@Valid @RequestBody CheckInRequest request, 
                                                     Authentication authentication) {
        String staffUser = authentication != null ? authentication.getName() : "system";
        CheckInResponse response = checkInService.checkIn(request.qrPayload(), staffUser);
        return ResponseEntity.ok(response);
    }
}
