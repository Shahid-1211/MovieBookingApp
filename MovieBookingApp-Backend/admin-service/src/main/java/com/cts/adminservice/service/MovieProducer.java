package com.cts.adminservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class MovieProducer {
	@Value("${spring.kafka.topic.name}")
	private String topicName;
	
	@Value("${spring.kafka.topic.name2}")
	private String topicName2;

	@Autowired
	private KafkaTemplate<String, String> kafkaTemplate;

	public void sendMessage(String message) {
		kafkaTemplate.send(topicName, message);
	}
	
	public void sendMessage2(String message) {
		kafkaTemplate.send(topicName2, message);
	}
}
