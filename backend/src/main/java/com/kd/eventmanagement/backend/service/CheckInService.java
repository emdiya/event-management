package com.kd.eventmanagement.backend.service;

import com.kd.eventmanagement.backend.dto.respone.CheckInResponse;

public interface CheckInService {
    CheckInResponse checkIn(String qrPayload, String staffUser);
}
