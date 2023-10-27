package com.cts.ticketbookingservice.controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cts.ticketbookingservice.dto.BookTicketRequest;
import com.cts.ticketbookingservice.dto.Response;
import com.cts.ticketbookingservice.dto.TicketDto;
import com.cts.ticketbookingservice.model.TicketBooking;
import com.cts.ticketbookingservice.service.TicketBookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Ticket Booking", description = "ticket booking API")
@RestController
@CrossOrigin
public class TicketBookingController {
	@Autowired
	private TicketBookingService bookingService;

	@Operation(summary = "Book ticket", description = "Book ticket for an upcoming show")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Ticket booking successful", content = @Content(schema = @Schema(implementation = Response.class))),
			@ApiResponse(responseCode = "400", description = "Bad request", content = @Content(schema = @Schema(implementation = Response.class))),
			@ApiResponse(responseCode = "404", description = "Movie not found", content = @Content(schema = @Schema(implementation = Response.class))),
			@ApiResponse(responseCode = "401", description = "Unauthorize. Only a customer can perform this operation", content = @Content(schema = @Schema(implementation = Response.class))) })
	@PostMapping("/book")
	public ResponseEntity<Response> bookTicket(
			@Parameter(description = "JWT auth token of the application user", required = true) @RequestHeader(name = "Authorization") String token,
			@Parameter(description = "Book ticket request including show id and no of seats", required = true) @RequestBody @Valid BookTicketRequest request,
			BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return errorResponse(bindingResult.getAllErrors());
		}
		return ResponseEntity.ok(bookingService.bookTicket(token, request));
	}

	private ResponseEntity<Response> errorResponse(List<ObjectError> errors) {
		String errorMsg = errors.stream().map(ObjectError::getDefaultMessage).collect(Collectors.joining(". "));
		return new ResponseEntity<>(Response.builder().status("error").message(errorMsg).build(),
				HttpStatus.BAD_REQUEST);
	}
	
	@ApiResponses(value = {
		    @ApiResponse(responseCode = "200", description = "Tickets retrieved successfully", content = @Content(schema = @Schema(implementation = List.class))),
		    @ApiResponse(responseCode = "404", description = "No tickets found for the given user ID", content = @Content(schema = @Schema(implementation = Response.class))
		    )
		})
	@GetMapping("/tickets")
	public ResponseEntity<List<TicketDto>> getTicketsByUserId(
			@Parameter(description = "JWT auth token of the application user", required = true) @RequestHeader(name = "Authorization") String token,
			@RequestParam("userId") String userId) {
	    List<TicketDto> tickets = bookingService.getTicketsByUserId(userId);

	    if (tickets.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    } else {
	        return ResponseEntity.ok(tickets);
	    }
	}
	
}
