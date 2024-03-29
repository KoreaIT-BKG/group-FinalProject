package com.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web.dto.Calendar;
import com.web.dto.GroupInfo;
import com.web.dto.GroupInfoView;
import com.web.dto.MemberDTO;
import com.web.service.GroupInfoService;


@RestController
public class GroupController {
	
	@Autowired
	GroupInfoService groupService;

	@PostMapping("/groupInsert") // 그룹추가
	public GroupInfo groupInsert(@RequestBody GroupInfo formData, @RequestParam String searchLocation) {
		System.out.println(searchLocation);
		System.out.println(formData);
		groupService.insertGroup(formData, searchLocation);
		return formData;
	}
	
	@PostMapping("/getGroupEvents") // 신청현황 불러오기
	public List<GroupInfoView> getGroupEvents(@RequestParam Long seq) {
		System.out.println("안녕" + seq);
		String id = groupService.findUserById(seq);
		System.out.println(id);
				
		return groupService.getGroupEventsById(id);

	}
	
	@PostMapping("/getGroupJoin") // 가입현황 불러오기
	public List<GroupInfoView> getGroupJoin(@RequestParam Long seq) {
		System.out.println("안녕" + seq);
		String id = groupService.findUserById(seq);
		System.out.println(id);
				
		return groupService.getGroupJoinById(id);
	}
	

	@PostMapping("/findUserId") // 로그인 아이디값 불러오기
	public ResponseEntity<String> findUserId(@RequestBody MemberDTO member) {
	System.out.println("들어왔냐");
	System.out.println(member.getSeq());
	System.out.println(member.getClass().getTypeName());
//	seq = seq.replace("=", "");
//	Long seq2 = Long.parseLong(seq);
		
		String id = groupService.findUserById(member.getSeq());
		System.out.println(id);
		if(id != null) {
			
			return ResponseEntity.ok(id);
		} else {
			return ResponseEntity.notFound().build();
	
		}
		
	}
	
	@DeleteMapping("/outGroup/{seq}")
	public ResponseEntity<String> deleteCalnedar(@PathVariable Long seq, @RequestParam String meetingTitle,
																		 @RequestParam String userId,
																		 @RequestParam String membersId) {
		System.out.println(seq);
		System.out.println(meetingTitle);
		System.out.println(userId);
		System.out.println(membersId);
		try {
			groupService.outGroup(seq, meetingTitle, userId, membersId);
			return new ResponseEntity<>("OK", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}	
	

	

}

