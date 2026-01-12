package com.kd.eventmanagement.backend.common.mapper;

import com.kd.eventmanagement.backend.dto.respone.CheckInResponse;
import com.kd.eventmanagement.backend.entity.Ticket;
import org.springframework.stereotype.Component;

@Component
public class CheckInMapper {

    public CheckInResponse toSuccessResponse(Ticket ticket) {
        if (ticket == null) {
            return null;
        }
        
        return new CheckInResponse(
                true,
                "Checked-in successfully",
                ticket.getAttendee().getFullName(),
                ticket.getTicketNo(),
                ticket.getCheckedInAt()
        );
    }
    
    public CheckInResponse toErrorResponse(String message, String attendeeName, String ticketNo, java.time.OffsetDateTime checkedInAt) {
        return new CheckInResponse(
                false,
                message,
                attendeeName,
                ticketNo,
                checkedInAt
        );
    }
}
