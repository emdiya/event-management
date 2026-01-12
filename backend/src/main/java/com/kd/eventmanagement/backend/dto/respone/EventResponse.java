package com.kd.eventmanagement.backend.dto.respone;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EventResponse {

    private String hashId;
    private String code;
    private String title;
    private String description;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    private String status;
}
