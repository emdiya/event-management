package com.kd.eventmanagement.backend.common.mapper;

import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.common.helper.HashidsHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventMapper {

    private final HashidsHelper hashidsHelper;

    public EventResponse toResponse(Event event) {
        if (event == null) {
            return null;
        }
        
        String hashId = null;
        if (event.getId() != null) {
            hashId = hashidsHelper.encode(event.getId());
        }
        
        return new EventResponse(
                hashId != null ? hashId : "",
                event.getCode(),
                event.getTitle(),
                event.getDescription(),
                event.getLocation(),
                event.getStartAt(),
                event.getEndAt(),
                event.getStatus().name()
        );
    }
}
