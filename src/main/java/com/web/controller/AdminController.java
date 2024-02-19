package com.web.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.web.dto.GroupInfo;
import com.web.dto.GroupInfoDAO;
import com.web.dto.MemberDTO;
import com.web.dto.SiteDTO;
import com.web.persistence.SiteRepository;
import com.web.service.AdminJoinService;
import com.web.service.GroupInfoService;
import com.web.service.GroupListService;
import com.web.service.MemberService;

@Controller
@ResponseBody
public class AdminController {

	@Autowired
	public AdminJoinService as;

	@Autowired
	public MemberService ms;

	@Autowired
	public GroupListService gs;

	// 관리자페이지에서 회원 전체 목록 조회
	@PostMapping("/admin/memberSearch")
	public List<MemberDTO> MemberSearch() {
		List<MemberDTO> allmember = new ArrayList<>();
		allmember = ms.allmember();

		return allmember;
	}

	// 관리자페이지에서 회원 삭제
	@PostMapping("/admin/delete")
	public void deleteMember(@RequestBody String seq) {
		ms.delete(seq);

	}

	// 관리자페이지에서 회원 권한 수정
	@PostMapping("/admin/updateRole")
	public void updateRole(@RequestBody MemberDTO dto) {
		System.out.println("확인해줘");
		System.out.println(dto);
		ms.roleSeq(dto);
	}

	// 관리자 페이지에서 회원 포인트 수정
	@PostMapping("/admin/updatePoint")
	public void updatePoint(@RequestBody MemberDTO dto) {
		System.out.println("실해앟자");
		System.out.println(dto);
		ms.pointSeq(dto);

	}

	// 관리자 페이지에서 전체 그룹 조회
	@PostMapping("/admin/groupSearch")
	public List<GroupInfo> groupSearch() {
		List<GroupInfo> list = new ArrayList<>();
		list = gs.searchGroup();
		System.out.println(list);
		return list;
	}

	// 관리자 페이지에서 그룹 삭제
	@PostMapping("/admin/groupdelete")
	public void deleteGroup(@RequestBody String seq) {
		System.out.println(seq);
		gs.delete(seq);
	}

	// 관리자 페이지에서 사이트 추가
	@PostMapping("/admin/insertSite")
	public String insertSite(@RequestParam("siteName") String siteName, @RequestParam("category") String category,
			@RequestParam("sitetalk") String sitetalk, @RequestParam("address") String address,
			@RequestParam("file") MultipartFile file) {
		SiteDTO site = new SiteDTO();
		site.setAddress(address);
		site.setCategory(category);
		site.setSitetalk(sitetalk);
		site.setSiteName(siteName);
		site.setFilePath(file.getOriginalFilename());
		if (!file.isEmpty()) {
			try {
				// 파일 저장 경로 설정 (원하는 경로로 수정 필요)
				String uploadPath = "C:\\Users\\qkrwn\\git\\group-FinalProject\\front\\public\\Image\\site\\"+ file.getOriginalFilename();

				// 파일을 저장할 경로 설정
				String filePath = uploadPath;

				as.siteinsert(site);
				// 파일 저장
				file.transferTo(new File(filePath));


				// 파일 저장이 성공하면 성공 메시지를 리턴
				return "파일 업로드 성공";
			} catch (Exception e) {
				e.printStackTrace();
				return "파일 업로드 실패";
			}
		} else {
			return "파일이 비어있습니다.";
		}
	}

	@PostMapping("/admin/siteSearch")
	public List<SiteDTO> sitesearch() {
		List<SiteDTO> list = new ArrayList<>();
		list = as.sitesearch();
		return list;
	}

	@PostMapping("/admin/sitedelete")
	public void deletesite(@RequestBody String seq) {
		as.delete(seq);

	}
}
