package com.kd.eventmanagement.backend.common.wrapper;

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
@JsonPropertyOrder({"success", "message", "data", "timestamp", "traceId"})
public class ItemResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private OffsetDateTime timestamp;
    private String traceId;

    public static <T> ItemResponse<T> success(T data) {
        return ItemResponse.<T>builder()
                .success(true)
                .message("Success")
                .data(data)
                .timestamp(OffsetDateTime.now())
                .build();
    }

    public static <T> ItemResponse<T> success(T data, String message) {
        return ItemResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(OffsetDateTime.now())
                .build();
    }

    public static <T> ItemResponse<T> success(T data, String message, String traceId) {
        return ItemResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(OffsetDateTime.now())
                .traceId(traceId)
                .build();
    }
}
