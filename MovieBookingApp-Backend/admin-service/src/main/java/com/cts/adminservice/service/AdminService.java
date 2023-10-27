package com.cts.adminservice.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.InvalidIsolationLevelException;

import com.cts.adminservice.dto.AddMovieRequest;
import com.cts.adminservice.dto.ShowingDto;
import com.cts.adminservice.dto.UpdateRequest;
import com.cts.adminservice.dto.ValidationDto;
import com.cts.adminservice.exceptions.InvalidTokenException;
import com.cts.adminservice.exceptions.ResourceNotFoundException;
import com.cts.adminservice.feign.AuthClient;
import com.cts.adminservice.model.Movie;
import com.cts.adminservice.model.Showing;
import com.cts.adminservice.model.Theater;
import com.cts.adminservice.model.TicketBooking;
import com.cts.adminservice.repository.MovieRepository;
import com.cts.adminservice.repository.ShowingRepository;
import com.cts.adminservice.repository.TheaterRepository;
import com.cts.adminservice.repository.TicketBookingRepository;

@Service
public class AdminService {
	@Autowired
	private AuthClient authClient;
	@Autowired
	private MovieRepository movieRepository;
	@Autowired
	private ShowingRepository showingRepository;
	@Autowired
	private TheaterRepository theaterRepository;
	@Autowired
	private TicketBookingRepository bookingRepository;
	@Autowired
	private MovieProducer movieProducer;

	public void updateTicketStatus(String token, String ticketId, String newStatus) {
		if (isAdmin(token)) {
			TicketBooking ticket = bookingRepository.findById(ticketId)
					.orElseThrow(() -> new ResourceNotFoundException("No ticket found with id: " + ticketId));
			ticket.setStatus(newStatus);
			bookingRepository.save(ticket);

		} else
			throw new InvalidTokenException("Only admin can update ticket status");
	}
	
	public void updateMovieTickets(String token, UpdateRequest request) {
		if(isAdmin(token)) {
			Movie movie = movieRepository.findByTitle(request.getMovieName())
					.orElseThrow(() -> new ResourceNotFoundException("The selected movie "+ request.getMovieName() + " not found"));
			Theater theater = theaterRepository.findByName(request.getTheatreName())
					.orElseThrow(() -> new ResourceNotFoundException("The selected theater "+ request.getTheatreName()+" not found"));

			Showing show = showingRepository.findByMovieIdAndTheaterIdAndShowTime(movie.getId(), theater.getId(), request.getShowTime())
					.orElseThrow(() -> new ResourceNotFoundException("The selected show is not found"));
			show.setTotalSeats(request.getTickets());
			show.setBookedSeats(0);
			if(request.getTickets() > 0) {
				show.setTicketStatus(ticketsStatus(request.getTickets()));
			}else {
				show.setTicketStatus("SOLD OUT");
			}
			showingRepository.save(show);
			}else
				throw new InvalidTokenException("Only admin can update tickets");
	}
	
	public void addShows(String token, UpdateRequest request) {
		if (isAdmin(token)) {
			Movie movie = movieRepository.findByTitle(request.getMovieName())
					.orElseThrow(() -> new ResourceNotFoundException("The selected movie "+ request.getMovieName() + " not found"));

			Theater theater = theaterRepository.findByName(request.getTheatreName())
					.orElseThrow(() -> new ResourceNotFoundException("The selected theater "+ request.getTheatreName()+" not found"));
			
			
			Showing show = Showing.builder().id("MT" + generateRandomId()).movie(movie).theater(theater)
						.showTime(request.getShowTime()).totalSeats(request.getTickets()).bookedSeats(0).ticketStatus(ticketsStatus(request.getTickets())).build();
				showingRepository.save(show);
		} else
			throw new InvalidTokenException("Only admin can add new shows");
	}
	
	public void deleteShow(String token, String showId) {
		if (isAdmin(token)) {
			Showing show = showingRepository.findById(showId)
					.orElseThrow(() -> new ResourceNotFoundException("No show found with id: " + showId));
			showingRepository.delete(show);
		} else
			throw new InvalidTokenException("Only admin can perform delete show action");
	}

	public void addMovie(String token, AddMovieRequest request) {
		if (isAdmin(token)) {
			Movie movie = Movie.builder().id("M" + generateRandomId()).title(request.getTitle())
					.description(request.getDescription()).releaseDate(request.getReleaseDate())
					.runtime(request.getRuntime()).genre(request.getGenre()).language(request.getLanguage())
					.country(request.getCountry()).director(request.getDescription()).cast(request.getCast())
					.rating(request.getRating()).posterUrl(request.getPosterUrl()).trailerUrl(request.getTrailerUrl())
					.build();

			movieRepository.save(movie);

			movieProducer.sendMessage("New movie created. Id: " + movie.getId());

			for (ShowingDto dto : request.getShows()) {
				Theater theater = theaterRepository.findById(dto.getTheaterId()).orElseThrow(
						() -> new ResourceNotFoundException("No theater found with id: " + dto.getTheaterId()));
				Showing show = Showing.builder().id("MT" + generateRandomId()).movie(movie).theater(theater)
						.showTime(dto.getShowTime()).totalSeats(dto.getTotalSeats()).bookedSeats(0).ticketStatus(ticketsStatus(dto.getTotalSeats())).build();
				showingRepository.save(show);
			}
		} else
			throw new InvalidTokenException("Only admin can add new movie");
	}

	public void deleteMovie(String token, String movieId) {
		if (isAdmin(token)) {
			Movie movie = movieRepository.findById(movieId)
					.orElseThrow(() -> new ResourceNotFoundException("No movie found with id: " + movieId));
			movieRepository.delete(movie);
			movieProducer.sendMessage2("Movie: " + movie.getTitle() + " is deleted. Message from kafka");
		} else
			throw new InvalidTokenException("Only admin can perform delete movie action");
	}

	private boolean isAdmin(String token) {
		ValidationDto authResponse = authClient.validateAuthToken(token);
		return authResponse.isStatus() && authResponse.getRole().equals("ADMIN");
	}

	private String generateRandomId() {
		return UUID.randomUUID().toString();
	}
	
	private String ticketsStatus(int tickets) {
		if(tickets>0) {
			return tickets>=15 ? "AVAILABLE":"BOOK ASAP";
		}
		return "SOLD OUT";
	}
}
