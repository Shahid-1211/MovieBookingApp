package com.cts.moviecatalogservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.moviecatalogservice.dto.AllMovieResponse;
import com.cts.moviecatalogservice.dto.MovieDto;
import com.cts.moviecatalogservice.dto.ShowingDto;
import com.cts.moviecatalogservice.exceptions.ResourceNotFoundException;
import com.cts.moviecatalogservice.model.Movie;
import com.cts.moviecatalogservice.repository.MovieRepository;

@Service
public class MovieCatalogService {
	@Autowired
	private MovieRepository movieRepository;

	@Transactional(readOnly = true)
	public AllMovieResponse getAllMovies() {
		List<Movie> movies = movieRepository.findAll();
		
		List<MovieDto> dto = movies.stream()
				.map(m -> MovieDto.builder().id(m.getId()).title(m.getTitle()).description(m.getDescription())
						.releaseDate(m.getReleaseDate()).runtime(m.getRuntime()).genre(m.getGenre())
						.language(m.getLanguage()).country(m.getCountry()).director(m.getDirector()).cast(m.getCast())
						.rating(m.getRating()).posterUrl(m.getPosterUrl()).trailerUrl(m.getTrailerUrl()).build())
				.collect(Collectors.toList());
		return AllMovieResponse.builder().movies(dto).build();
	}

	@Transactional(readOnly = true)
	public MovieDto getMovieById(String movieId) {
		Movie movie = movieRepository.findById(movieId)
				.orElseThrow(() -> new ResourceNotFoundException("No movie found with id: " + movieId));
		
		List<ShowingDto> shows = movie.getShows().stream()
				.map(m -> ShowingDto.builder().id(m.getId()).name(m.getTheater().getName())
						.location(m.getTheater().getLocation()).showTime(m.getShowTime()).totalSeats(m.getTotalSeats())
						.bookedSeats(m.getBookedSeats()).ticketStatus(ticketsStatus(m.getTotalSeats()-m.getBookedSeats())).build())
				.collect(Collectors.toList());
		
		return MovieDto.builder().id(movie.getId()).title(movie.getTitle()).description(movie.getDescription())
				.releaseDate(movie.getReleaseDate()).runtime(movie.getRuntime()).genre(movie.getGenre())
				.language(movie.getLanguage()).country(movie.getCountry()).director(movie.getDirector())
				.cast(movie.getCast()).rating(movie.getRating()).posterUrl(movie.getPosterUrl())
				.trailerUrl(movie.getTrailerUrl()).shows(shows).build();
	}
	
	private String ticketsStatus(int tickets) {
		
		if(tickets>0) {
			System.out.println("shahid");
			return tickets>=15 ? "AVAILABLE":"BOOK ASAP";
		}
		System.out.println("akram");
		return "SOLD OUT";
	}

}
