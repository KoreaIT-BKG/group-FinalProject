package com.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class SocialGroupProjectApplication {

    
	public static void main(String[] args) {
		SpringApplication.run(SocialGroupProjectApplication.class, args);
	}


}
