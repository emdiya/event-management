package com.kd.eventmanagement.backend.common.enums;

public enum ErrorCode {
    // General
    INTERNAL_SERVER_ERROR(5000, "Internal server error"),
    BAD_REQUEST(4000, "Bad request"),
    UNAUTHORIZED(4001, "Unauthorized"),
    FORBIDDEN(4003, "Forbidden"),
    NOT_FOUND(4004, "Resource not found"),
    METHOD_NOT_ALLOWED(4005, "Method not allowed"),
    INVALID_INPUT(4006, "Invalid input provided"),
    
    // Authentication
    INVALID_CREDENTIALS(4010, "Invalid username or password"),
    TOKEN_EXPIRED(4011, "Token has expired"),
    TOKEN_INVALID(4012, "Invalid token"),
    ACCOUNT_DISABLED(4013, "Account is disabled"),
    
    // Event
    EVENT_NOT_FOUND(4100, "Event not found"),
    EVENT_CLOSED(4101, "Event is closed"),
    EVENT_NOT_ACTIVE(4102, "Event is not active"),
    DUPLICATE_EVENT_CODE(4103, "Event code already exists"),
    
    // Ticket
    TICKET_NOT_FOUND(4200, "Ticket not found"),
    TICKET_REVOKED(4201, "Ticket has been revoked"),
    TICKET_ALREADY_CHECKED_IN(4202, "Ticket already checked in"),
    INVALID_QR_CODE(4203, "Invalid QR code"),
    
    // Attendee
    DUPLICATE_REGISTRATION(4300, "Already registered for this event"),
    ATTENDEE_NOT_FOUND(4301, "Attendee not found"),
    
    // Validation
    VALIDATION_ERROR(4400, "Validation failed");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
