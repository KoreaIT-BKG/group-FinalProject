package com.web.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.web.dto.MemberDTO;
import com.web.jwt.JWTUtil;
import com.web.service.MemberService;

@RestController
public class TokenController {

	@Autowired
	public JWTUtil jwtUtil;

	@Autowired
	public MemberService Mservice;

	// 로그인해서 토큰 생성해서 보내주는거
	// 토큰에 회원 권한이랑 회원 번호
	@PostMapping("/getIdRole")
	public Map<String, Object> getCurrentMember(
			@RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String token) {
		Map<String, Object> search = new HashMap<>();
		if (token != null && token.startsWith("Bearer ")) {
			String jwtToken = token.substring(7);

			// 아이디로 멤버 정보 전체 반환
			String username = jwtUtil.getUsername(jwtToken);
			System.out.println("확인하자 아이디");
			System.out.println(username);
			System.out.println("확인하자 아이디");

			MemberDTO member = Mservice.search(username);
			System.out.println(member.getPoint());
			System.out.println(member.getId());
			if (member.getPoint() >= 80) {
				Mservice.roleMemberSave(member);
			}
			if (member != null) {
				search.put("seq", member.getSeq());
				search.put("role", member.getRole());
				return search;
			}
		}
		return null;

	}

}
