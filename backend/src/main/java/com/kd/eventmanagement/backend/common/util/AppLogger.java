package com.kd.eventmanagement.backend.common.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

/**
 * Custom logger with additional success level
 */
public class AppLogger {
    
    private final Logger logger;
    private static final Marker SUCCESS_MARKER = MarkerFactory.getMarker("SUCCESS");
    
    private AppLogger(Logger logger) {
        this.logger = logger;
    }
    
    public static AppLogger getLogger(Class<?> clazz) {
        return new AppLogger(LoggerFactory.getLogger(clazz));
    }
    
    public static AppLogger getLogger(String name) {
        return new AppLogger(LoggerFactory.getLogger(name));
    }
    
    // Success level (uses INFO with SUCCESS marker)
    public void success(String message) {
        logger.info(SUCCESS_MARKER, "✓ " + message);
    }
    
    public void success(String format, Object arg) {
        logger.info(SUCCESS_MARKER, "✓ " + format, arg);
    }
    
    public void success(String format, Object arg1, Object arg2) {
        logger.info(SUCCESS_MARKER, "✓ " + format, arg1, arg2);
    }
    
    public void success(String format, Object... arguments) {
        logger.info(SUCCESS_MARKER, "✓ " + format, arguments);
    }
    
    // Standard levels
    public void trace(String message) {
        logger.trace(message);
    }
    
    public void trace(String format, Object arg) {
        logger.trace(format, arg);
    }
    
    public void trace(String format, Object arg1, Object arg2) {
        logger.trace(format, arg1, arg2);
    }
    
    public void trace(String format, Object... arguments) {
        logger.trace(format, arguments);
    }
    
    public void debug(String message) {
        logger.debug(message);
    }
    
    public void debug(String format, Object arg) {
        logger.debug(format, arg);
    }
    
    public void debug(String format, Object arg1, Object arg2) {
        logger.debug(format, arg1, arg2);
    }
    
    public void debug(String format, Object... arguments) {
        logger.debug(format, arguments);
    }
    
    public void info(String message) {
        logger.info(message);
    }
    
    public void info(String format, Object arg) {
        logger.info(format, arg);
    }
    
    public void info(String format, Object arg1, Object arg2) {
        logger.info(format, arg1, arg2);
    }
    
    public void info(String format, Object... arguments) {
        logger.info(format, arguments);
    }
    
    public void warn(String message) {
        logger.warn(message);
    }
    
    public void warn(String format, Object arg) {
        logger.warn(format, arg);
    }
    
    public void warn(String format, Object arg1, Object arg2) {
        logger.warn(format, arg1, arg2);
    }
    
    public void warn(String format, Object... arguments) {
        logger.warn(format, arguments);
    }
    
    public void warn(String message, Throwable t) {
        logger.warn(message, t);
    }
    
    public void error(String message) {
        logger.error(message);
    }
    
    public void error(String format, Object arg) {
        logger.error(format, arg);
    }
    
    public void error(String format, Object arg1, Object arg2) {
        logger.error(format, arg1, arg2);
    }
    
    public void error(String format, Object... arguments) {
        logger.error(format, arguments);
    }
    
    public void error(String message, Throwable t) {
        logger.error(message, t);
    }
    
    // Check if levels are enabled
    public boolean isTraceEnabled() {
        return logger.isTraceEnabled();
    }
    
    public boolean isDebugEnabled() {
        return logger.isDebugEnabled();
    }
    
    public boolean isInfoEnabled() {
        return logger.isInfoEnabled();
    }
    
    public boolean isWarnEnabled() {
        return logger.isWarnEnabled();
    }
    
    public boolean isErrorEnabled() {
        return logger.isErrorEnabled();
    }
}
