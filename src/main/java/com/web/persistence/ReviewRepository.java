package com.web.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.web.dto.Review;

public interface ReviewRepository extends JpaRepository<Review, Long>{

}
