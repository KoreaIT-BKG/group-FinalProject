package com.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import com.web.dto.GroupInfo;
import com.web.dto.GroupInfoView;
import com.web.dto.MemberDTO;
import com.web.dto.Review;
import com.web.persistence.GroupInfoRepository;
import com.web.persistence.GroupInfoViewRepository;
import com.web.persistence.GroupListRepository;
import com.web.persistence.MemberRepository;
import com.web.persistence.ReviewRepository;
import com.web.service.GroupInfoService;

@SpringBootTest
@Commit
public class GroupTest {
	
	@Autowired
	private GroupListRepository Grepo;
	@Autowired
	private GroupInfoService Inforepo;
	
	@Autowired
	private GroupInfoRepository repo;
	@Autowired
	private MemberRepository Memrepo;
	@Autowired
	private GroupInfoViewRepository gr;
	@Autowired
	private ReviewRepository rr;
	
	
	@Test
	public void tes1t() {
		GroupInfo g = new GroupInfo();
		g.setMeetingDateEnd("2024-02-09");
		g.setUserId("test123");
		g.setCategory("sport");
		g.setMeetingType("무료");
		g.setMeetingTitle("asdsadsal자");
		repo.save(g);
	} 
	@Test
	public void tes2t() {
		GroupInfo g = new GroupInfo();
		g.setMeetingDateEnd("2024-02-09");
		g.setUserId("test123");
		g.setCategory("sport");
		g.setMeetingType("무료");
		g.setMeetingTitle("asdsadsal자");
		repo.save(g);
	} 
	@Test
	public void tes3t() {
		GroupInfo g = new GroupInfo();
		g.setMeetingDateEnd("2024-02-09");
		g.setUserId("test123");
		g.setCategory("sport");
		g.setMeetingType("무료");
		g.setMeetingTitle("asdsadsal자");
		repo.save(g);
	} 
	@Test
	public void te4st() {
		GroupInfo g = new GroupInfo();
		g.setMeetingDateEnd("2024-02-09");
		g.setUserId("test123");
		g.setCategory("sport");
		g.setMeetingType("무료");
		g.setMeetingTitle("asdsadsal자");
		repo.save(g);
	} 
	@Test
	public void test() {
		GroupInfo g = new GroupInfo();
		g.setMeetingDateEnd("2024-02-09");
		g.setUserId("test123");
		g.setCategory("sport");
		g.setMeetingType("무료");
		g.setMeetingTitle("asdsadsal자");
		repo.save(g);
	} 
	
	
//	@Test
	//	public void test() {
	//Review r = new Review();
	//r.setLeaderId("test123");
	//r.setId("test20");
	//r.setMeetingTitle("우리집으로가자");
	//rr.save(r);
		
	//}

	
}
