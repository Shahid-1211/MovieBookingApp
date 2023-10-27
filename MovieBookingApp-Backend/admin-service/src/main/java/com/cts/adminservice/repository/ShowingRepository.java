package com.cts.adminservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cts.adminservice.model.Showing;

@Repository
public interface ShowingRepository extends JpaRepository<Showing, String> {
	@Query("SELECT s FROM Showing s " +
	           "WHERE s.movie.id = :movieId " +
	           "AND s.theater.id = :theaterId " +
	           "AND s.showTime = :showTime")
	    Optional<Showing> findByMovieIdAndTheaterIdAndShowTime(@Param("movieId") String movieId, 
	                                                 @Param("theaterId") String theaterId, 
	                                                 @Param("showTime") String showTime);
}
