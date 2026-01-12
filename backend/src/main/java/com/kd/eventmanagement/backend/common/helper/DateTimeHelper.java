package com.kd.eventmanagement.backend.common.helper;

import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DateTimeHelper {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    private static final DateTimeFormatter DISPLAY_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public String format(OffsetDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DISPLAY_FORMATTER);
    }

    public String formatIso(OffsetDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(ISO_FORMATTER);
    }

    public OffsetDateTime parse(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.isEmpty()) {
            return null;
        }
        return OffsetDateTime.parse(dateTimeString, ISO_FORMATTER);
    }

    public boolean isBetween(OffsetDateTime dateTime, OffsetDateTime start, OffsetDateTime end) {
        if (dateTime == null || start == null || end == null) {
            return false;
        }
        return !dateTime.isBefore(start) && !dateTime.isAfter(end);
    }

    public boolean isExpired(OffsetDateTime expiryTime) {
        if (expiryTime == null) {
            return true;
        }
        return OffsetDateTime.now().isAfter(expiryTime);
    }
}
