package com.web.jwt;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.dto.CustomUserDetails;
import com.web.dto.JoinDTO;
import com.web.dto.MemberDTO;
import com.web.service.MemberService;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

	private final AuthenticationManager authenticationManager;

	private final JWTUtil jwtUtil;

	public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		try {
			// request의 body에서 데이터 추출
			JoinDTO loginRequest = new ObjectMapper().readValue(request.getInputStream(), JoinDTO.class);

			String username = loginRequest.getUsername();
			String password = loginRequest.getPassword();
			// 나머지 로직은 그대로 유지
			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password,
					null);

			return authenticationManager.authenticate(authToken);

		} catch (IOException e) {
			throw new AuthenticationServiceException("Failed to parse login request body", e);
		}
	}

	// 로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authentication) {

		CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

		String username = customUserDetails.getUsername();

		Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
		Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
		GrantedAuthority auth = iterator.next();

		String role = auth.getAuthority();

		String token = jwtUtil.createJwt(username, role, 1000 * 60* 1L);
		System.out.println("성공 로그인");
		response.addHeader("Authorization", "Bearer " + token);

	}

	// 로그인 실패시 실행하는 메소드
	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException failed) {
		System.out.println("실패 로그");
		response.setStatus(401);

	}

}
