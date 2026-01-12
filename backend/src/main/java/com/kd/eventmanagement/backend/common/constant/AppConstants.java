package com.kd.eventmanagement.backend.common.constant;

public class AppConstants {
    
    // Security
    public static final String JWT_TOKEN_PREFIX = "Bearer ";
    public static final String JWT_HEADER_STRING = "Authorization";
    public static final String TRACE_ID_HEADER = "X-Trace-Id";
    public static final String TRACE_ID_MDC_KEY = "traceId";
    
    // Hashids Configuration
    public static final String HASHIDS_SALT = "event-management-secret-salt-2026";
    public static final int HASHIDS_MIN_LENGTH = 10;
    
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";
    
    // Validation
    public static final int MIN_PASSWORD_LENGTH = 8;
    public static final int MAX_PASSWORD_LENGTH = 100;
    public static final int MAX_USERNAME_LENGTH = 100;
    public static final int MAX_EVENT_TITLE_LENGTH = 200;
    public static final int MAX_EVENT_DESCRIPTION_LENGTH = 2000;
    
    // Status
    public static final String STATUS_SUCCESS = "SUCCESS";
    public static final String STATUS_ERROR = "ERROR";
    
    // Time
    public static final int TOKEN_EXPIRATION_HOURS = 24;
    public static final int REFRESH_TOKEN_EXPIRATION_DAYS = 30;
    
    private AppConstants() {
        throw new IllegalStateException("Constants class");
    }
}
