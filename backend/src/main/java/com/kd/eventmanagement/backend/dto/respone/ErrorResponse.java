package com.kd.eventmanagement.backend.dto.respone;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"status", "error", "message", "path", "timestamp", "traceId"})
public class ErrorResponse {
    private String traceId;
    private int status;
    private String error;
    private String message;
    private String path;
    private OffsetDateTime timestamp;
}
