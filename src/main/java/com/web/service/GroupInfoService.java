package com.web.service;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.web.dto.GroupInfo;
import com.web.dto.GroupInfoView;
import com.web.dto.MemberDTO;
import com.web.persistence.GroupInfoRepository;
import com.web.persistence.GroupInfoViewRepository;
import com.web.persistence.MemberRepository;

@Service
public class GroupInfoService {
	
	@Autowired
	GroupInfoRepository groupRepo;
	
	@Autowired
	GroupInfoViewRepository groupViewRepo;
	
	@Autowired
	MemberRepository memberRepo;
	
	public void insertGroup(GroupInfo groupInfo, String searchLocation) {
		GroupInfoView group = new GroupInfoView();
		group.setUserId(groupInfo.getUserId());
		group.setMeetingTitle(groupInfo.getMeetingTitle());
		group.setCategory(groupInfo.getCategory());
		group.setFaceToFace(groupInfo.getFaceToFace());
		group.setProgram(groupInfo.getProgram());
		group.setMeetingType(groupInfo.getMeetingType());
		group.setPeopleNum(groupInfo.getPeopleNum());
		group.setJoinPeople(groupInfo.getJoinPeople());
		group.setMeetingCost(groupInfo.getMeetingCost());
		group.setRecruitments(groupInfo.getRecruitments());
		group.setRecruitmentd(groupInfo.getRecruitmentd());
		group.setMeetingDateStart(groupInfo.getMeetingDateStart());
		group.setMeetingDateEnd(groupInfo.getMeetingDateEnd());
		group.setMeetingLocation(groupInfo.getMeetingLocation());
		group.setMembersId(groupInfo.getUserId());
		group.setSearchLocation(searchLocation);
		
		
		groupViewRepo.save(group);
		groupRepo.save(groupInfo);
	}
	
    public List<GroupInfoView> getGroupEventsById(String id) {
    	 // 현재 날짜 구하기
        LocalDate currentDate = LocalDate.now();

        String currentDateStr = currentDate.format(DateTimeFormatter.ISO_DATE); // LocalDate를 String으로 변환
        // 종료날짜가 현재 날짜와 같거나 높은 데이터만 조회 (신청현황)
        return groupViewRepo.findByMembersIdAndRecruitmentdGreaterThanEqual(id, currentDateStr);
    }
    
    public List<GroupInfoView> getGroupJoinById(String id) {
   	 // 현재 날짜 구하기
       LocalDate currentDate = LocalDate.now();

       String currentDateStr = currentDate.format(DateTimeFormatter.ISO_DATE); // LocalDate를 String으로 변환
       // 종료날짜가 현재 날짜와 같거나 높은 데이터만 조회 (신청현황)
       return groupViewRepo.findByMembersIdAndRecruitmentdLessThan(id, currentDateStr);
   }
    
    @Transactional
	public void outGroup(Long seq, String meetingTitle, String userId, String membersId) {
    	


		if(userId.equals(membersId)) {
			
	    	List<GroupInfoView> gri = groupViewRepo.findAllByMeetingTitle(meetingTitle);
	    	groupViewRepo.deleteAllInBatch(gri);
	    	
	    	List<GroupInfo> gr = groupRepo.findAllByMeetingTitle(meetingTitle);
	    	groupRepo.deleteAllInBatch(gr);
	    	
	    	
			
			
//			groupRepo.deleteByMeetingTitle(meetingTitle);
//			groupViewRepo.deleteAllByMeetingTitle(meetingTitle);
			System.out.println("됫냐 ?");
		} else {
			GroupInfo dao = groupRepo.findByMeetingTitle(meetingTitle);
			dao.setJoinPeople(dao.getJoinPeople()-1);
			if(dao.getMeetingType().equals("유료")) {
				dao.setMeetingCost(dao.getMeetingCost()-5000);
			}
			
			groupRepo.save(dao);
			
			List<GroupInfoView> list = new ArrayList<>();
			list = groupViewRepo.findAllByMeetingTitle(dao.getMeetingTitle());
			for (int i = 0; i < list.size(); i++) {
				list.get(i).setJoinPeople(dao.getJoinPeople());
				groupViewRepo.save(list.get(i));
			}
			
	        GroupInfoView groupView = groupViewRepo.findById(seq) 
	                .orElseThrow(() -> new IllegalArgumentException("해당 일정이 존재하지 않습니다.")); // 조회된 일정이 없을경우 예외 발생
	        
	        groupViewRepo.delete(groupView);
		}

	}
			
	
	public void updateGroup(GroupInfo dao, String id) {
		dao = groupRepo.findBySeq(dao.getSeq());
		dao.setJoinPeople(dao.getJoinPeople()+1);
		if(dao.getMeetingType().equals("유료")) {
			dao.setMeetingCost(dao.getMeetingCost()+5000);
		}
		String[] addr = dao.getMeetingLocation().split("/");
		System.out.println(addr[0]);
		GroupInfoView group = new GroupInfoView();
		if(dao.getMeetingType().equals("유료")) {
			group.setMeetingCost(5000);
		} else if(dao.getMeetingType().equals("무료")) {
			group.setMeetingCost(0);
		}
		group.setUserId(dao.getUserId());
		group.setMeetingTitle(dao.getMeetingTitle());
		group.setCategory(dao.getCategory());
		group.setFaceToFace(dao.getFaceToFace());
		group.setProgram(dao.getProgram());
		group.setMeetingType(dao.getMeetingType());
		group.setPeopleNum(dao.getPeopleNum());
		group.setJoinPeople(dao.getJoinPeople());
		group.setRecruitments(dao.getRecruitments());
		group.setRecruitmentd(dao.getRecruitmentd());
		group.setMeetingDateStart(dao.getMeetingDateStart());
		group.setMeetingDateEnd(dao.getMeetingDateEnd());
		group.setMeetingLocation(dao.getMeetingLocation());
		group.setMembersId(id);
		group.setSearchLocation(addr[0]);
		
		
		groupViewRepo.save(group);
		List<GroupInfoView> list = new ArrayList<>();
		list = groupViewRepo.findAllByMeetingTitle(dao.getMeetingTitle());
		for (int i = 0; i < list.size(); i++) {
			list.get(i).setJoinPeople(dao.getJoinPeople());
			groupViewRepo.save(list.get(i));
		}
		
		groupRepo.save(dao);
	}
	
	public String findUserById(Long seq) {
	    Optional<MemberDTO> optionalMember = memberRepo.findById(seq);

	    if (optionalMember.isPresent()) {
	        MemberDTO member = optionalMember.get();
	        return member.getId();
	    } else {
	    	
	        return "못찾았다";
	    }
	}
	
	public List<GroupInfoView> checkJoin(String title){
		List<GroupInfoView> list = new ArrayList<>();
		list = groupViewRepo.findAllByMeetingTitle(title);
		return list;
	}

//    @Scheduled(cron = "0 0 0 * * *") // 매일 자정마다 실행되도록 설정
//	public void cleanGroup() {
//		List<GroupInfo> list = groupRepo.findAll();
//		List<GroupInfoView> list2 = groupViewRepo.findAll();
//
//		Date currentDate = new Date(); // 현재 날짜를 가져옵니다.
//		Calendar calendar = Calendar.getInstance(); // 캘린더 객체를 생성합니다.
//		calendar.setTime(currentDate); // 현재 날짜를 캘린더 객체에 설정합니다.
//	    calendar.add(Calendar.DATE, -30); // 오늘 날짜로부터 30일 이전의 날짜를 계산합니다.
//	    Date thirtyDaysAgoDate = calendar.getTime(); // 30일 이전의 날짜를 구합니다.
//
//	    // 그룹 정보를 순회하면서 30일 이전의 모임 종료 날짜를 가진 그룹을 삭제합니다.
//	    for (GroupInfo groupInfo : list) { // 그룹 정보를 순회합니다.
//	        try {
//	            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd"); // 날짜 형식을 지정합니다.
//	            Date meetingDateEnd = dateFormat.parse(groupInfo.getMeetingDateEnd()); // 모임 종료 날짜를 Date 객체로 변환합니다.
//
//	            if (meetingDateEnd.before(thirtyDaysAgoDate)) { // 모임 종료 날짜가 30일 이전인지 확인합니다.
//	                groupRepo.delete(groupInfo); // 그룹을 삭제합니다.
//	            }
//	        } catch (ParseException e) { // 날짜 형식이 잘못된 경우에 대한 예외 처리
//	            System.err.println("날짜 형식이 잘못되었습니다: " + e.getMessage());
//	        }
//	    }
//        for (GroupInfoView groupInfoview : list2) {
//            try {
//                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//                Date meetingDateEnd = dateFormat.parse(groupInfoview.getMeetingDateEnd());
//
//                if (meetingDateEnd.before(thirtyDaysAgoDate)) {
//                    groupViewRepo.delete(groupInfoview);
//                }
//            } catch (ParseException e) {
//                System.err.println("날짜 형식이 잘못되었습니다: " + e.getMessage());
//            }
//        }
//
//
//	}

}



































