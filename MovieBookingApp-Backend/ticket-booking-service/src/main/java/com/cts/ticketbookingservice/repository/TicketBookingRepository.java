package com.cts.ticketbookingservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cts.ticketbookingservice.model.TicketBooking;
import com.cts.ticketbookingservice.model.User;

@Repository
public interface TicketBookingRepository extends JpaRepository<TicketBooking, String>{
	List<TicketBooking> findByUser(User user);
}
