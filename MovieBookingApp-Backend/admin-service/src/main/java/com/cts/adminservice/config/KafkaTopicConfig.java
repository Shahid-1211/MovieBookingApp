package com.cts.adminservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {
	@Value("${spring.kafka.topic.name}")
	private String topicName;
	
	@Value("${spring.kafka.topic.name2}")
	private String topicName2;

	@Bean
	NewTopic topic() {
		return TopicBuilder.name(topicName).build();
	}

	@Bean
	NewTopic topic2() {
		return TopicBuilder.name(topicName2).build();
	}
}
