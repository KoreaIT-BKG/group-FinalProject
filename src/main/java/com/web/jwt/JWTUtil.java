package com.web.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.web.dto.MemberDTO;
import com.web.service.MemberService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SecretJwk;

@Component
public class JWTUtil {

	
	private SecretKey secretKey;

	public JWTUtil(@Value("${spring.jwt.secret}") String secret) {

		this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
				Jwts.SIG.HS256.key().build().getAlgorithm());

	}

	public String getUsername(String token) {

		return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username",
				String.class);
	}

	public String getRole(String token) {

		return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role",
				String.class);
	}

	public Boolean isExpired(String token) {

		return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration()
				.before(new Date());
	}

    public String createJwt(String username, String role, Long expiredMs) {

        return Jwts.builder()
                .claim("username", username) // 유저 아이디
                .claim("role", role)    // 권한
                .issuedAt(new Date(System.currentTimeMillis()))  // 발행 시간
                .expiration(new Date(System.currentTimeMillis() + expiredMs)) // 발행시간 + 소멸시간정해주는거
                .signWith(secretKey)  // 암호화진행
                .compact();	//토큰 발행
    }
	
}


 





















