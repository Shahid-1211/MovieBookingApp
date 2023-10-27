package com.cts.adminservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cts.adminservice.model.Theater;

public interface TheaterRepository extends JpaRepository<Theater, String> {
	Optional<Theater> findByName(String name);
}
