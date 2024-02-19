package com.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import com.web.dto.GroupInfo;
import com.web.dto.GroupInfoView;
import com.web.dto.MemberDTO;
import com.web.persistence.GroupInfoViewRepository;
import com.web.persistence.GroupListRepository;
import com.web.persistence.MemberRepository;
import com.web.service.GroupInfoService;

@SpringBootTest
@Commit
public class GroupTest {
	
	@Autowired
	private GroupListRepository Grepo;
	@Autowired
	private GroupInfoService Inforepo;
	@Autowired
	private GroupInfoViewRepository gvrepo;
	@Autowired
	private MemberRepository Memrepo;
	
	@Autowired
	private GroupInfoService gs;
	
	@Test
	public void add() {
		try {
			GroupInfoView groupinfo = new GroupInfoView();
			groupinfo.setUserId("tmfrl1");
			groupinfo.setMeetingTitle("공부나해볼까요?");
			groupinfo.setCategory("work");
			groupinfo.setFaceToFace("대면");
			groupinfo.setProgram("x");
			groupinfo.setMeetingType("무료");
			groupinfo.setPeopleNum(5);
			groupinfo.setJoinPeople(5);
			groupinfo.setMeetingCost(0);
			groupinfo.setRecruitments("2024-02-01");
			groupinfo.setRecruitmentd("2024-02-02");
			groupinfo.setMeetingDateStart("2024-02-03");
			groupinfo.setMeetingDateEnd("2024-02-04");
			groupinfo.setMeetingLocation("서울시 강남구");
			groupinfo.setMembersId("jkuilo153");
			String str = "우리집 강아지";
			gvrepo.save(groupinfo);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	
//
//	@Test
//	public void test() {
//		try {
//			gs.cleanGroup();	
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		
//	}
	
}
