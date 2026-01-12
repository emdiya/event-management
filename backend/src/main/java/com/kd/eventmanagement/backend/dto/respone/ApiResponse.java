package com.kd.eventmanagement.backend.dto.respone;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"success", "message", "data", "path", "traceId"})
public class ApiResponse<T> {
    private String traceId;
    private boolean success;
    private T data;
    private String message;
    private String path;
}
