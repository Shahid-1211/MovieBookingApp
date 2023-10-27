package com.cts.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UpdateRequest {
	private String movieName;
	private String theatreName;
	private String showTime;
	private int tickets;
}
