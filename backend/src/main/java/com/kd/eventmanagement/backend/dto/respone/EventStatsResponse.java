package com.kd.eventmanagement.backend.dto.respone;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EventStatsResponse {
    private String hashId;
    private String eventCode;
    private String eventTitle;
    private long totalAttendees;
    private long checkedInCount;
    private double checkedInPercentage;
}
