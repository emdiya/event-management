package com.kd.eventmanagement.backend.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class EventStatsResponse {
    private UUID eventId;
    private String eventCode;
    private String eventTitle;
    private long totalAttendees;
    private long checkedInCount;
    private double checkedInPercentage;
}
