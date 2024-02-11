package com.web.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web.dto.GroupInfoView;
import com.web.dto.MemberDTO;
import com.web.dto.Review;
import com.web.service.ReviewService;

@RestController
public class ReviewController {

	@Autowired
	private ReviewService rs;
	
	@PostMapping("/api/reviewwrite")
	 public List<GroupInfoView> select(@RequestBody String seq){
		List<GroupInfoView> list = rs.select(seq); 
		System.out.println(list);
		
//		System.out.println(dto.getSeq());
		
		return list;
	}
	
	@PostMapping("/api/sendReview")
	public String insertReview(@RequestBody Review review) {
		System.out.println(review);
		String success =  rs.insertReview(review);
		return success;
	}
	
	@PostMapping("/api/getReview")
	public List<Review> getReview(){
		List<Review> list = new ArrayList<>();
		list = rs.getReview();
		System.out.println(list);
		return list;
		
	}
	
	
}

