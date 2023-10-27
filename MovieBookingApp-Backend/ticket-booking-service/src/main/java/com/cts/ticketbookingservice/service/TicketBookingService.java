package com.cts.ticketbookingservice.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.ticketbookingservice.dto.BookTicketRequest;
import com.cts.ticketbookingservice.dto.Response;
import com.cts.ticketbookingservice.dto.TicketDto;
import com.cts.ticketbookingservice.dto.ValidationDto;
import com.cts.ticketbookingservice.exceptions.InvalidTokenException;
import com.cts.ticketbookingservice.exceptions.ResourceNotFoundException;
import com.cts.ticketbookingservice.feign.AuthClient;
import com.cts.ticketbookingservice.model.Showing;
import com.cts.ticketbookingservice.model.TicketBooking;
import com.cts.ticketbookingservice.model.User;
import com.cts.ticketbookingservice.repository.ShowingRepository;
import com.cts.ticketbookingservice.repository.TicketBookingRepository;
import com.cts.ticketbookingservice.repository.UserRepository;

@Service
public class TicketBookingService {
	@Autowired
	private AuthClient authClient;
	@Autowired
	private ShowingRepository showingRepository;
	@Autowired
	private TicketBookingRepository bookingRepository;
	@Autowired
	private UserRepository userRepository;

	@Transactional
	public Response bookTicket(String token, BookTicketRequest request) {
		String invalidMsg = "Invalid Token";
		try {
			ValidationDto authResponse = authClient.validateAuthToken(token);
			if (authResponse.isStatus()) {

				if (authResponse.getRole().equals("CUSTOMER") || authResponse.getRole().equals("ADMIN")) {

					Showing show = showingRepository.findById(request.getShowingId()).orElseThrow(
							() -> new ResourceNotFoundException("No show found with id: " + request.getShowingId()));

					int remainingSeats = show.getTotalSeats() - show.getBookedSeats();
					if (request.getSeats() <= remainingSeats) {
						show.setBookedSeats(show.getBookedSeats() + request.getSeats());
						if((show.getTotalSeats() - show.getBookedSeats())==0) {
							System.out.println("shahid");
							show.setTicketStatus("SOLD OUT");
						}else {
							System.out.println("akram");
							show.setTicketStatus(ticketsStatus(remainingSeats));
						}
						User user = userRepository.findById(authResponse.getUserId()).orElse(null);

						TicketBooking ticket = TicketBooking.builder().id(generateRandomId()).user(user)
								.numSeats(request.getSeats()).status("SUCCESS").movieName(show.getMovie().getTitle())
								.posterUrl(show.getMovie().getPosterUrl()).showTime(show.getShowTime()).name(show.getTheater().getName()).build();
						System.out.println(show.getTicketStatus());
						bookingRepository.save(ticket);
						showingRepository.save(show);

						return Response.builder().status("success").message("Ticket booking successfull").build();
					} else
						throw new RuntimeException("Ticket not available!");
				} else
					throw new InvalidTokenException("Access Denied");
			} else
				throw new InvalidTokenException(invalidMsg);
		} catch (Exception e) {
			throw e;
		}
	}

	private String generateRandomId() {
		return "TB" + UUID.randomUUID().toString();
	}
	
	private String ticketsStatus(int tickets) {
		return tickets>=15 ? "AVAILABLE":"BOOK ASAP";
	}
		
	public List<TicketDto> getTicketsByUserId(String userId) {
		User user = userRepository.findById(userId).orElse(null);
		List<TicketBooking> tickets = bookingRepository.findByUser(user);
		if (user == null || tickets == null || tickets.isEmpty()) {
          return Collections.emptyList();
      }
		List<TicketDto> ticketsBooked = new ArrayList<>();
		for(TicketBooking ticketBooking: tickets) {
			TicketDto ticket = new TicketDto();
			ticket.setTicketId(ticketBooking.getId());
			ticket.setMovieName(ticketBooking.getMovieName());
			ticket.setPosterUrl(ticketBooking.getPosterUrl());
			ticket.setNumSeats(ticketBooking.getNumSeats());
			ticket.setStatus(ticketBooking.getStatus());
			ticket.setShowTime(ticketBooking.getShowTime());
			ticket.setTheatreName(ticketBooking.getName());
			
			ticketsBooked.add(ticket);
		}
		return ticketsBooked;
      }
}


