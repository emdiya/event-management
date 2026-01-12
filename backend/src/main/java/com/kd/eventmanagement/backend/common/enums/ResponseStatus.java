package com.kd.eventmanagement.backend.common.enums;

public enum ResponseStatus {
    SUCCESS("Success"),
    ERROR("Error"),
    WARNING("Warning"),
    INFO("Info");

    private final String message;

    ResponseStatus(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
