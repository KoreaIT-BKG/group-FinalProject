package com.web.dto;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "reviews")
public class Review {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long seq;
	private String id;
	private String leaderId;
	private int point;
	@Column(insertable = false, updatable = false, columnDefinition = "date default sysdate")
	private Date reviewDate;
	private String meetingTitle;
	private String context;

}
