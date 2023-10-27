package com.cts.adminservice.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.assertj.core.util.Arrays;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

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
import com.mysql.cj.x.protobuf.MysqlxDatatypes.Array;

class AdminServiceTest {
	
	@Mock
	private AuthClient authClient;
	
	@Mock
	private TicketBookingRepository bookingRepository;
	
	@Mock
	private MovieRepository movieRepository;
	
	@Mock
	private TheaterRepository theaterRepository;
	
	@Mock
	private ShowingRepository showingRepository;
	
	@Mock
	private MovieProducer movieProducer;
	
	@InjectMocks
	private AdminService service;
	
	@BeforeEach
	void init(){
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void updateTicketStatusTest() {
		TicketBooking ticket = new TicketBooking();
		when(authClient.validateAuthToken(Mockito.anyString())).thenReturn(new ValidationDto(true, "user","ADMIN"));
		when(bookingRepository.findById(Mockito.anyString())).thenReturn(Optional.of(ticket));
		service.updateTicketStatus("token", "ticket", "CANCEL" );
		assertEquals(ticket.getStatus(),"CANCEL");
	}
	
	@Test
	void updateTicketStatusTest_NoTicketFound() {
		TicketBooking ticket = new TicketBooking();
		when(authClient.validateAuthToken(Mockito.anyString())).thenReturn(new ValidationDto(true, "user","ADMIN"));
		when(bookingRepository.findById(Mockito.anyString())).thenReturn(Optional.empty());
		assertThrows(ResourceNotFoundException.class, () -> service.updateTicketStatus("token", "ticket", "CANCEL" ));
	}
	
	@Test
	void updateTicketStatusTest_NotAdmin() {
		TicketBooking ticket = new TicketBooking();
		when(authClient.validateAuthToken(Mockito.anyString())).thenReturn(new ValidationDto(true, "user","CUSTOMER"));
		when(bookingRepository.findById(Mockito.anyString())).thenReturn(Optional.empty());
		assertThrows(InvalidTokenException.class, () -> service.updateTicketStatus("token", "ticket", "CANCEL" ));
	}
	
	@Test
	void updateMovieTicketsTest() {
		Showing show = new Showing();
		Movie movie = new Movie();
		movie.setId("movieId");
		Theater theater = new Theater();
		theater.setId("theaterId");
		when(authClient.validateAuthToken(Mockito.anyString())).thenReturn(new ValidationDto(true, "user","ADMIN"));
		when(movieRepository.findByTitle(Mockito.anyString())).thenReturn(Optional.of(movie));
		when(theaterRepository.findByName(Mockito.anyString())).thenReturn(Optional.of(theater));
		when(showingRepository.findByMovieIdAndTheaterIdAndShowTime(Mockito.anyString(),Mockito.anyString(),Mockito.anyString())).thenReturn(Optional.of(show));
		service.updateMovieTickets("token", new UpdateRequest("movie", "theater", "5:00pm", 20) );
		assertEquals(show.getTicketStatus(),"AVAILABLE");
	}
	
	@Test
	void updateMovieTicketsTest_notAdmin() {
		Showing show = new Showing();
		Movie movie = new Movie();
		movie.setId("movieId");
		Theater theater = new Theater();
		theater.setId("theaterId");
		when(authClient.validateAuthToken(Mockito.anyString())).thenReturn(new ValidationDto(true, "user","CUSTOMER"));
		when(movieRepository.findByTitle(Mockito.anyString())).thenReturn(Optional.of(movie));
		when(theaterRepository.findByName(Mockito.anyString())).thenReturn(Optional.of(theater));
		when(showingRepository.findByMovieIdAndTheaterIdAndShowTime(Mockito.anyString(),Mockito.anyString(),Mockito.anyString())).thenReturn(Optional.of(show));
		assertThrows(InvalidTokenException.class, () -> service.updateMovieTickets("token", new UpdateRequest("movie", "theater", "5:00pm", 20) ));
	}
	
	@Test
	void addMovieTest() {
		Theater theater = new Theater();
		when(authClient.validateAuthToken(Mockito.anyString())).thenReturn(new ValidationDto(true, "user","ADMIN"));
		when(theaterRepository.findById(Mockito.anyString())).thenReturn(Optional.of(theater));
		doNothing().when(movieProducer).sendMessage(Mockito.anyString());
		List<ShowingDto> shows = new ArrayList<>();
		shows.add(new ShowingDto("theaterId","5:00pm",10));
		AddMovieRequest request = new AddMovieRequest("title","desc",LocalDate.of(2023, 10, 25), 35,"genre","eng","ind","director","cast","rating","url","url",shows);
		service.addMovie("token", request);
		Mockito.verify(movieRepository, times(1)).save(Mockito.any());
	}
	
	@Test
	void testDeleteMovie() {
		when(authClient.validateAuthToken(Mockito.anyString())).thenReturn(new ValidationDto(true, "user","ADMIN"));
		when(movieRepository.findById(Mockito.anyString())).thenReturn(Optional.of(new Movie()));
		service.deleteMovie("token", "movieId");
		Mockito.verify(movieRepository, times(1)).delete(Mockito.any());
	}
	
	@Test
	void testDeleteMovie_notAdmin() {
		when(authClient.validateAuthToken(Mockito.anyString())).thenReturn(new ValidationDto(false, "user","CUSTOMER"));
		when(movieRepository.findById(Mockito.anyString())).thenReturn(Optional.of(new Movie()));
		assertThrows(InvalidTokenException.class, () -> service.deleteMovie("token", "movieId"));
	}

}
