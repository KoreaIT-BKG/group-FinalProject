package com.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import com.web.dto.GroupInfo;
import com.web.dto.GroupInfoView;
import com.web.persistence.GroupInfoRepository;
import com.web.persistence.GroupInfoViewRepository;
import com.web.persistence.MemberRepository;

@SpringBootTest
@Commit
public class SchduleTest {

	@Autowired
	GroupInfoViewRepository groupView;
	
	@Autowired
	GroupInfoRepository groupInfo;
	
	@Autowired
	MemberRepository mr;
	
	@Test
	public void add() {
		try {
			
			GroupInfo gi = new GroupInfo();
			gi.setUserId("user123");
			gi.setMeetingTitle("독서 동아리");
			gi.setCategory("life");
			gi.setFaceToFace("대면");
			gi.setProgram("X");
			gi.setMeetingType("무료");
			gi.setPeopleNum(4);
			gi.setJoinPeople(1);
			gi.setMeetingCost(0);
			gi.setRecruitments("2024-02-19");
			gi.setRecruitmentd("2024-02-21");
			gi.setMeetingDateStart("2024-02-27");
			gi.setMeetingDateEnd("2024-02-27");
			gi.setMeetingLocation("서울 용산구  후암로 37-1(후암동)/2층 독서실");
			groupInfo.save(gi);
			
			GroupInfoView group = new GroupInfoView();
			group.setUserId("user123");
			group.setMeetingTitle("독서 동아리");
			group.setCategory("life");
			group.setFaceToFace("대면");
			group.setProgram("X");
			group.setMeetingType("무료");
			group.setPeopleNum(4);
			group.setJoinPeople(1);
			group.setMeetingCost(0);
			group.setRecruitments("2024-02-19");
			group.setRecruitmentd("2024-02-21");
			group.setMeetingDateStart("2024-02-27");
			group.setMeetingDateEnd("2024-02-27");
			group.setMeetingLocation("서울 용산구  후암로 37-1(후암동)/2층 독서실");
			group.setMembersId("user123");
			group.setSearchLocation("서울 용산구  후암로 37-1(후암동)");
			groupView.save(group);
			
			GroupInfo gi1 = new GroupInfo();
			gi1.setUserId("user123");
			gi1.setMeetingTitle("독서 토론");
			gi1.setCategory("life");
			gi1.setFaceToFace("대면");
			gi1.setProgram("X");
			gi1.setMeetingType("무료");
			gi1.setPeopleNum(4);
			gi1.setJoinPeople(1);
			gi1.setMeetingCost(0);
			gi1.setRecruitments("2024-02-19");
			gi1.setRecruitmentd("2024-02-21");
			gi1.setMeetingDateStart("2024-02-27");
			gi1.setMeetingDateEnd("2024-02-27");
			gi1.setMeetingLocation("서울 용산구  후암로 37-1(후암동)/2층 독서실");
			groupInfo.save(gi);
			
			GroupInfoView group1 = new GroupInfoView();
			group1.setUserId("user123");
			group1.setMeetingTitle("독서 토론");
			group1.setCategory("life");
			group1.setFaceToFace("대면");
			group1.setProgram("X");
			group1.setMeetingType("무료");
			group1.setPeopleNum(4);
			
			group1.setJoinPeople(1);
			group1.setMeetingCost(0);
			group1.setRecruitments("2024-02-19");
			group1.setRecruitmentd("2024-02-21");
			group1.setMeetingDateStart("2024-02-27");
			group1.setMeetingDateEnd("2024-02-27");
			group1.setMeetingLocation("서울 용산구  후암로 37-1(후암동)/2층 독서실");
			group1.setMembersId("user123");
			group1.setSearchLocation("서울 용산구  후암로 37-1(후암동)");
			groupView.save(group);
			
			

			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
//	@Test
//	public void delete() {
//	    String meetingTitleToDelete = "30~40대 조기축구 모집해요~";
//	    try {
//	        groupInfo.deleteByMeetingTitle(meetingTitleToDelete);
//	    } catch (Exception e) {
//	        e.printStackTrace();
//	    }
//}
}
