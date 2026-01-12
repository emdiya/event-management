package com.kd.eventmanagement.backend.common.wrapper;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"success", "message", "data", "pagination", "timestamp", "traceId"})
public class PaginationResponse<T> {
    private boolean success;
    private String message;
    private List<T> data;
    private PaginationMetadata pagination;
    private OffsetDateTime timestamp;
    private String traceId;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaginationMetadata {
        private int currentPage;
        private int pageSize;
        private long totalItems;
        private int totalPages;
        private boolean hasNext;
        private boolean hasPrevious;
    }

    public static <T> PaginationResponse<T> success(List<T> data, PaginationMetadata pagination) {
        return PaginationResponse.<T>builder()
                .success(true)
                .message("Success")
                .data(data)
                .pagination(pagination)
                .timestamp(OffsetDateTime.now())
                .build();
    }

    public static <T> PaginationResponse<T> success(List<T> data, PaginationMetadata pagination, String message) {
        return PaginationResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .pagination(pagination)
                .timestamp(OffsetDateTime.now())
                .build();
    }

    public static <T> PaginationResponse<T> success(List<T> data, PaginationMetadata pagination, String message, String traceId) {
        return PaginationResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .pagination(pagination)
                .timestamp(OffsetDateTime.now())
                .traceId(traceId)
                .build();
    }

    public static <T> PaginationResponse<T> success(List<T> data, int currentPage, int pageSize, long totalItems) {
        int totalPages = (int) Math.ceil((double) totalItems / pageSize);
        PaginationMetadata pagination = PaginationMetadata.builder()
                .currentPage(currentPage)
                .pageSize(pageSize)
                .totalItems(totalItems)
                .totalPages(totalPages)
                .hasNext(currentPage < totalPages)
                .hasPrevious(currentPage > 1)
                .build();

        return success(data, pagination);
    }
}
