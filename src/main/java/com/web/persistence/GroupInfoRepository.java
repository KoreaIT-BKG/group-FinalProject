package com.web.persistence;

import java.util.Date;
import java.util.List;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.web.dto.GroupInfo;
import com.web.dto.GroupInfoView;

public interface GroupInfoRepository extends JpaRepository<GroupInfo, Long> {

	GroupInfo findBySeq(Long seq);


	List<GroupInfo> findAllByMeetingTitle(String meetingTitle);

	void deleteByMeetingTitle(String meetingTitle);

	GroupInfo findByMeetingTitle(String meetingTitle);



	List<GroupInfo> findByMeetingDateEndBefore(Date currentDate);

	void delete(GroupInfo groupInfo);

}
