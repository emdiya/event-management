package com.kd.eventmanagement.backend.config;

import com.kd.eventmanagement.backend.common.wrapper.ApiResponse;
import com.kd.eventmanagement.backend.common.wrapper.ItemResponse;
import com.kd.eventmanagement.backend.common.wrapper.PaginationResponse;
import org.slf4j.MDC;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import java.util.UUID;

@RestControllerAdvice
public class ResponseTraceIdAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                   Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                   ServerHttpRequest request, ServerHttpResponse response) {

        // Skip wrapping if already wrapped or is an error response
        if (body == null || 
            body.getClass().getName().contains("ErrorResponse") || 
            body instanceof ApiResponse ||
            body instanceof ItemResponse ||
            body instanceof PaginationResponse) {
            
            // Add traceId to wrapper responses if they don't have one
            String traceId = MDC.get("traceId");
            if (traceId == null) {
                traceId = UUID.randomUUID().toString();
            }
            
            if (body instanceof ItemResponse<?> itemResponse) {
                if (itemResponse.getTraceId() == null) {
                    itemResponse.setTraceId(traceId);
                }
            } else if (body instanceof PaginationResponse<?> paginationResponse) {
                if (paginationResponse.getTraceId() == null) {
                    paginationResponse.setTraceId(traceId);
                }
            } else if (body instanceof ApiResponse apiResponse) {
                if (apiResponse.getTraceId() == null) {
                    apiResponse.setTraceId(traceId);
                }
            }
            
            return body;
        }
        
        // Get trace ID from MDC
        String traceId = MDC.get("traceId");
        if (traceId == null) {
            traceId = UUID.randomUUID().toString();
        }
        
        // Get request path
        String path = request.getURI().getPath();
        
        // Wrap successful responses with ApiResponse
        return ApiResponse.builder()
                .traceId(traceId)
                .success(true)
                .data(body)
                .message("Success")
                .path(path)
                .build();
    }
}
