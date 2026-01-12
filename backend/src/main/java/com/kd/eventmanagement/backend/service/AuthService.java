package com.kd.eventmanagement.backend.service;

import com.kd.eventmanagement.backend.dto.request.LoginRequest;
import com.kd.eventmanagement.backend.dto.respone.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
