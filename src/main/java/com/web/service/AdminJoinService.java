package com.web.service;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.mapping.Array;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.web.dto.JoinDTO;
import com.web.dto.MemberDTO;
import com.web.dto.SiteDTO;
import com.web.persistence.MemberRepository;
import com.web.persistence.ReviewRepository;
import com.web.persistence.SiteRepository;

@Service
public class AdminJoinService {

	@Autowired
	private SiteRepository Srepo;

	@Autowired
	private ReviewRepository viewrepo;
	
	private final MemberRepository mRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	public AdminJoinService(MemberRepository mRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {

		this.mRepository = mRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}

	public void joinProcess(JoinDTO joinDTO) {

		String username = joinDTO.getUsername();
		String password = joinDTO.getPassword();

		MemberDTO data = new MemberDTO();

		data.setId(username);
		data.setPwd(bCryptPasswordEncoder.encode(password));
		data.setRole("ROLE_ADMIN");

		mRepository.save(data);
	}

	public void siteinsert(SiteDTO site) {
		Srepo.save(site);
	}

	public List<SiteDTO> sitesearch() {
		List<SiteDTO> list = new ArrayList<>();
		list = Srepo.findAll();
		return list;
	}
	public void delete(String seq) {
		seq = seq.replace("=", "");
    	Long seq2 = Long.parseLong(seq);
		Srepo.deleteById(seq2);		
	}

}
