package com.web.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.web.dto.GroupInfo;
import com.web.dto.GroupListDTO2;
import com.web.dto.SiteDTO;
import com.web.persistence.GroupInfoRepository;
import com.web.persistence.GroupListRepository;

@Service
public class GroupListService {

	@Autowired
	public GroupListRepository Grepo;
	
	@Autowired
	public GroupInfoRepository GIRepo;
	
	public List<GroupInfo> ShowGroupList(GroupListDTO2 dto) {
		List<GroupInfo> list = new ArrayList<>();
		if ("무료".equals(dto.getGroupValue())) {
			if(dto.getCategoryValue() == null && dto.getSearchValue() == null && dto.getSelectedValue() == null) {
				list =  Grepo.findAllByMeetingTypeAndCategoryOrderBySeqDesc("무료","sport");
			}
			if(dto.getSelectedValue() != null) {
				if(dto.getSearchValue() == null) {
					list = Grepo.findAllByMeetingTypeAndCategoryOrderBySeqDesc("무료",dto.getSelectedValue());	
				}else {
					list = Grepo.findAllByMeetingTypeAndCategoryContainingAndMeetingTitleContainingOrderBySeqDesc("무료",dto.getSelectedValue(), dto.getSearchValue());
				}
				
			}else if(dto.getSelectedValue() == null && dto.getSearchValue() != null) {
				list = Grepo.findAllByMeetingTypeAndMeetingTitleContainingOrderBySeqDesc("무료",dto.getSearchValue());
			}
			if(dto.getCategoryValue() != null) {
				list = Grepo.findAllByMeetingTypeAndCategoryOrderBySeqDesc("무료",dto.getCategoryValue());
			}
			return list;	
		}else if ("유료".equals(dto.getGroupValue())) {
			if(dto.getCategoryValue() == null && dto.getSearchValue() == null && dto.getSelectedValue() == null) {
				list =  Grepo.findAllByMeetingTypeAndCategoryOrderBySeqDesc("유료","sport");
			}
			if(dto.getSelectedValue() != null) {
				if(dto.getSearchValue() == null) {
					list = Grepo.findAllByMeetingTypeAndCategoryOrderBySeqDesc("유료",dto.getSelectedValue());	
				}else {
					list = Grepo.findAllByMeetingTypeAndCategoryContainingAndMeetingTitleContainingOrderBySeqDesc("유료",dto.getSelectedValue(), dto.getSearchValue());
				}
				
			}else if(dto.getSelectedValue() == null && dto.getSearchValue() != null) {
				list = Grepo.findAllByMeetingTypeAndMeetingTitleContainingOrderBySeqDesc("유료",dto.getSearchValue());
			}
			if(dto.getCategoryValue() != null) {
				list = Grepo.findAllByMeetingTypeAndCategoryOrderBySeqDesc("유료",dto.getCategoryValue());
			}
			return list;	
		}
		return list;
		
	}
	
	public List<GroupInfo> searchGroup(){
		
		List<GroupInfo> list = GIRepo.findAll();
		return list;
	}
	
	public void delete(String seq) {
		seq = seq.replace("=", "");
    	Long seq2 = Long.parseLong(seq);
    	GIRepo.deleteById(seq2);
	}
	

	
	

	
}


































