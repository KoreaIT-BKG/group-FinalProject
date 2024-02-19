package com.web.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.web.dto.GroupInfoView;
import com.web.dto.MemberDTO;
import com.web.dto.Review;
import com.web.persistence.GroupInfoViewRepository;
import com.web.persistence.MemberRepository;
import com.web.persistence.ReviewRepository;

@Service
public class ReviewService {

	@Autowired
	private GroupInfoViewRepository GIVrepo;

	@Autowired
	private MemberRepository mr;
	
	@Autowired
	private ReviewRepository rr;

	public List<GroupInfoView> select(String seq) {
		seq = seq.replace("=", "");
		Long seq2 = Long.parseLong(seq);
		MemberDTO dto = mr.findById(seq2).get();
		List<GroupInfoView> list = new ArrayList<>();
		List<GroupInfoView> list2 = new ArrayList<>();
		List<Review> list3 = new ArrayList<>();
		list3 = rr.findAll();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		list = GIVrepo.findByMembersId(dto.getId());

		if (!list.isEmpty()) {
			LocalDate currentDate = LocalDate.now();
			for (GroupInfoView groupInfoView : list) {
				try {
					Date date = dateFormat.parse(groupInfoView.getMeetingDateEnd());
					LocalDate meetingDateEnd = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
					if (currentDate.isAfter(meetingDateEnd)) {
						list2.add(groupInfoView);
					}
				
				} catch (ParseException e) {
					// 파싱에 실패한 경우 예외 처리를 수행합니다.
					e.printStackTrace(); // 또는 다른 처리 방법을 선택할 수 있습니다.
				}

			}

		}
		 for (Iterator<GroupInfoView> iterator = list2.iterator(); iterator.hasNext();) {
		        GroupInfoView groupInfoView = iterator.next();
		        for (Review review : list3) {
		            if (groupInfoView.getMeetingTitle().equals(review.getMeetingTitle()) && groupInfoView.getMembersId().equals(review.getId())) {
		            	iterator.remove(); // 일치하는 경우 제거
		            }
		        }
		    }

		 Iterator<GroupInfoView> iterator = list2.iterator();
		 while (iterator.hasNext()) {
		     GroupInfoView groupInfoView = iterator.next();
		     if (groupInfoView.getMembersId().equals(groupInfoView.getUserId())) {
		         iterator.remove(); // 안전하게 요소 제거
		     }
		 }

		return list2;

	}
	
	
	public String insertReview(Review r) {
		System.out.println("여기 들어왔니?");
		System.out.println(r);
		rr.save(r);
		MemberDTO dto = mr.findById(r.getLeaderId());
		dto.setCount(dto.getCount()+1);
		dto.setPoint(dto.getPoint()+r.getPoint());
		dto.setEvp(dto.getPoint()*20/dto.getCount());
		mr.save(dto);
		
		return"성공";
	}
	
	public List<Review> getReview(){
		List<Review> list = new ArrayList<>();
		list = rr.findAll(Sort.by(Sort.Direction.DESC, "seq"));
		return list;
	}
	
	public List<Review> idSearch(String id){
		List<Review> list = new ArrayList<>();
		list = rr.findByLeaderId(id);
		return list;
		
		
	}
	
	
	
}
