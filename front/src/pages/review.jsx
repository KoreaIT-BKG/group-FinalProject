import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../contexts/LoginContextProvider";
import Header from "../components/Header/header";
import Footer from "../components/Home/Footer";
import ReviewWrite from "../components/Review/ReviewWrite";
import axios from "axios";
import "../css/Review.css"; // CSS 파일 불러오기

const Review = () => {
  const { userInfo } = useContext(LoginContext);
  const [showModal, setShowModal] = useState(false); // 모달 상태를 관리합니다.
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [reviewsPerPage] = useState(5); // 페이지 당 리뷰 수

  // 모달을 열기 위한 함수
  const toggleModal = () => {
    setShowModal(true); // showModal 상태를 true로 설정하여 모달을 엽니다.
  };

  const toggleModalClose = () => {
    setShowModal(false); // showModal 상태를 true로 설정하여 모달을 엽니다.
  };

  const get = async () => {
    try {
      const response = await axios.post("/api/getReview");
      console.log(response);
      setReviews(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    get();
  }, []);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 현재 페이지에 해당하는 리뷰 목록
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // 페이지 네비게이션 생성
  const pageNumbers = [];
  const maxPages = Math.ceil(reviews.length / reviewsPerPage);
  const maxDisplayedPages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
  let endPage = Math.min(startPage + maxDisplayedPages - 1, maxPages);

  if (endPage - startPage < maxDisplayedPages - 1) {
    startPage = Math.max(1, endPage - maxDisplayedPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      {/* header */}
      <Header />
      {/* End header */}
      {/* Main */}
      <div className="review-container">
        <button onClick={toggleModal}>리뷰 작성</button>
        {/* 모달 */}
        {showModal && (
          <ReviewWrite
            showModal={showModal}
            setShowModal={setShowModal}
            toggleModalClose={toggleModalClose}
          />
        )}
        {/* 리뷰 목록 출력 */}
        {currentReviews.map((review, index) => (
          <div className="reviews-div" key={index}>
            <table className="reviews-table">
            <tr className="reviews-div-tr">
              <td className="reviews-div-td1">그룹장 아이디</td>
              <td className="reviews-div-td2">{review.leaderId}</td>
              <td className="reviews-div-td3">점수</td>
              <td className="reviews-div-td4">
                {[...Array(review.point)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </td>
            </tr>
            <tr className="reviews-div-tr">
              <td className="reviews-div-td1">후기</td>
              <td className="reviews-div-td2" colSpan={3}>{review.context}</td>
            </tr>
            </table>
          </div>
        ))}
        {/* 페이지 네비게이션 출력 */}
        <ul className="pagination">
          {currentPage > 1 && (
            <li className="ul-li" key="prev">
              <a
                className="ul-li-a"
                onClick={() => paginate(currentPage - 1)}
                href="#"
              >
                이전
              </a>
            </li>
          )}
          {pageNumbers.map((number) => (
            <li className="ul-li" key={number}>
              <a
                className={
                  number === currentPage ? "active ul-li-a" : "ul-li-a"
                }
                onClick={() => paginate(number)}
                href="#"
              >
                {number}
              </a>
            </li>
          ))}
          {currentPage < Math.ceil(reviews.length / reviewsPerPage) && (
            <li className="ul-li" key="next">
              <a
                className="ul-li-a"
                onClick={() => paginate(currentPage + 1)}
                href="#"
              >
                다음
              </a>
            </li>
          )}
        </ul>
      </div>
      {/* End Main */}
      {/* Start footer */}
      <Footer />
      {/* End footer */}
    </>
  );
};

export default Review;
