package com.kd.eventmanagement.backend.common.util;

import com.kd.eventmanagement.backend.dto.respone.ApiResponse;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ResponseWrapper {

    public <T> ApiResponse<T> success(T data) {
        return success(data, "Success");
    }

    public <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .traceId(getTraceId())
                .success(true)
                .data(data)
                .message(message)
                .build();
    }

    public <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .traceId(getTraceId())
                .success(false)
                .data(null)
                .message(message)
                .build();
    }

    private String getTraceId() {
        String traceId = MDC.get("traceId");
        return traceId != null ? traceId : UUID.randomUUID().toString();
    }
}
