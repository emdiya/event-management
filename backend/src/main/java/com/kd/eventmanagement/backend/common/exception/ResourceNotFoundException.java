package com.kd.eventmanagement.backend.common.exception;

import com.kd.eventmanagement.backend.common.enums.ErrorCode;

public class ResourceNotFoundException extends BusinessException {
    
    public ResourceNotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public ResourceNotFoundException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
