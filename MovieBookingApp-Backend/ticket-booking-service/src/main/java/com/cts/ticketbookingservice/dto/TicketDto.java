package com.cts.ticketbookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TicketDto {
	private String ticketId;
	private String movieName;
	private String theatreName;
	private String posterUrl;
	private String showTime;
	private int numSeats;
	private String Status;
}
