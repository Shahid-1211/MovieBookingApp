package com.cts.adminservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cts.adminservice.model.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {
	Optional<Movie> findByTitle(String title);
}
