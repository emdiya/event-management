package com.kd.eventmanagement.backend.service;

import com.kd.eventmanagement.backend.dto.request.RegisterAttendeeRequest;
import com.kd.eventmanagement.backend.dto.respone.TicketIssuedResponse;

public interface RegistrationService {
    TicketIssuedResponse register(RegisterAttendeeRequest req);
}
