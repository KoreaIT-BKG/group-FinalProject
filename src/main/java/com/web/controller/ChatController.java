package com.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web.dto.ChatMessage;
import com.web.service.ChatMessageService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class ChatController {

	@Autowired
	private ChatMessageService cms;
	
	@PostMapping("/sendChatMessage")
    public ResponseEntity<?> sendChatMessage(@RequestBody ChatMessage message) {
		System.out.println(message);
        cms.saveChatMessage(message);
        return ResponseEntity.ok().build();
    }
	
	@PostMapping("/chatMessages")
	public List<ChatMessage> getAllChatMessages(@RequestBody ChatMessage message) {
	   System.out.println("여기지?");
	    System.out.println(message.getTitle());

		
		//return null;
		return cms.getAllChatMessages(message.getTitle());
	}
	
}