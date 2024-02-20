package com.web.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.internal.build.AllowSysOut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web.dto.GroupInfo;
import com.web.dto.GroupInfoView;
import com.web.dto.GroupListDTO2;
import com.web.dto.MemberDTO;
import com.web.dto.SiteDTO;
import com.web.persistence.GroupListRepository;
import com.web.service.GroupInfoService;
import com.web.service.GroupListService;
import com.web.service.SiteService;

@RestController
public class GroupListController {

	@Autowired
	public GroupListService Gservice;

	@Autowired
	public GroupInfoService InfoService;

	@Autowired
	public SiteService Sservice;
	

	
	// 그룹 참가하기 페이지에 그룹 출력
	@PostMapping("/api/test")
	public List<GroupInfo> test2(@RequestBody GroupListDTO2 dto2) {
		
		if (dto2.getGroupValue() == null) {
			dto2.setGroupValue("무료");
		}

		List<GroupInfo> list = new ArrayList<>();

		list = Gservice.ShowGroupList(dto2);

		return list;
	}

	// 그룹 신청
	@PostMapping("/api/content")
	public String test(@RequestBody GroupInfo dao, @RequestParam(name="seq") Long seq) {
		String id = InfoService.findUserById(seq);
		LocalDate today = LocalDate.now();
		System.out.println(id);
		List<GroupInfoView> list = new ArrayList<>();
		list = InfoService.checkJoin(dao.getMeetingTitle());
		boolean isIdIncluded = list.stream()
                .anyMatch(GroupInfoView -> GroupInfoView.getMembersId().equals(id));
		if(isIdIncluded) {
			System.out.println("여기지롱");
			
			return "이미";
		}

		try {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
			LocalDate recruitmentDate = LocalDate.parse(dao.getRecruitmentd(), formatter);
			if (today.isAfter(recruitmentDate)) {
				return "기간";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (dao.getJoinPeople() == dao.getPeopleNum()) {
			return "인원";
		}
		if(dao.getMeetingType().equals("무료")) {
			
			InfoService.updateGroup(dao, id);
		}
		return "신청";
	}
	
	@PostMapping("/api/contentpay")
	public void testpay(@RequestBody GroupInfo dao, @RequestParam(name="seq") Long seq) {
		String id = InfoService.findUserById(seq);
		System.out.println(id);

		InfoService.updateGroup(dao, id);
	}
	
	@PostMapping("/groupjoin/siteCSearch")
	public List<SiteDTO> siteCSearch(@RequestBody String category){

		category = category.replace("=", "");
    	System.out.println(category);
		List<SiteDTO> list = new ArrayList<>();
		list = Sservice.siteCSearch(category);
		System.out.println(list);
		return list;
		
	}
	
}






















