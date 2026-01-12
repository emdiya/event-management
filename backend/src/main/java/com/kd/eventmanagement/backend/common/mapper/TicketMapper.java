package com.kd.eventmanagement.backend.common.mapper;

import com.kd.eventmanagement.backend.dto.respone.TicketIssuedResponse;
import com.kd.eventmanagement.backend.entity.Ticket;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public TicketIssuedResponse toIssuedResponse(Ticket ticket, String qrPayload) {
        if (ticket == null) {
            return null;
        }
        
        return new TicketIssuedResponse(
                ticket.getId(),
                ticket.getTicketNo(),
                ticket.getEvent().getCode(),
                qrPayload,
                ticket.getIssuedAt()
        );
    }
}
