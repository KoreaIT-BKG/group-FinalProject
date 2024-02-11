import React, { useContext, useState } from "react";
import list from "../../JS/images";
import Modal from "../../components/Modal"; // 모달 컴포넌트 import

import axios from "axios";
import Site from "../../components/GroupJoin/Site";
import { LoginContext } from "../../contexts/LoginContextProvider";
const SportGroup = ({ print, searchValue }) => {

  const { userInfo } = useContext(LoginContext);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호 상태 추가
  const itemsPerPage = 5; // 한 페이지에 표시되는 아이템 수
  const pagesToShow = 5; // 페이징 컨트롤러에 표시되는 페이지 수
  const handleSeq = (c) => {
    setSelectedData(c);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedData(null);
    setIsModalOpen(false);
  };
  const handleApply = async (data) => {
    if(data.meetingType==="무료"){ 
    try {

      const response = await axios.post("/api/content", selectedData,{
        params:{
        seq:userInfo.seq
      }} );
      console.log(response)


      if(response.data === "기간"){
        alert("모집기간이 지났습니다");
      }else if(response.data === "인원"){
        alert("모집인원이 다 찼습니다")
      }else if(response.data === "신청"){
        alert("신청완료")
      }
      
    } catch (error) {
      
    }
    setSelectedData(null);
    setIsModalOpen(false);

    window.location.reload();
  }else if(data.meetingType==="유료"){
    console.log("여기도 들어왔지?")
    try {
      const response = await axios.post("/api/content", selectedData,{
        params:{
        seq:userInfo.seq
      }} );
      console.log(response)


      if(response.data === "기간"){
        alert("모집기간이 지났습니다");
      }else if(response.data === "인원"){
        alert("모집인원이 다 찼습니다")
      }else if(response.data === "신청"){
        window.location.assign('/payment');
      }
    } catch (error) {
    
    }
  }
}
  const getImageByCategory = (category) => {
    const images = list[category] || [];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(print.length / itemsPerPage);

  // 페이지 네비게이션을 위한 범위 계산
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  // 만약 현재 페이지가 가장 앞쪽에 가깝다면 뒤로 밀어서 pagesToShow 개수를 유지
  if (totalPages - currentPage < Math.floor(pagesToShow / 2)) {
    startPage = totalPages - pagesToShow + 1;
    endPage = totalPages;
  }

  // 현재 페이지에 해당하는 데이터 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = print.slice(startIndex, endIndex);

  // 페이지 네비게이션 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }



if(print === "work"){
  return (
    <div className="group-container">
     {!searchValue &&<Site print={print}/>}
    </div>
      );
}else{
  return (
    <>
      <div className="group-container">
        {!searchValue && <Site print={print} />}
        {currentItems.map((c, index) => (
          <div key={index} className="group-item">
            <div onClick={() => handleSeq(c)}>
              <img
                className="group-item-img"
                src={getImageByCategory(c.category)}
                alt="Card"
              />
              <h4 className="group-item-h4">{c.category}</h4>
              <h4 className="group-item-h4">{c.meetingTitle}</h4>
            </div>
          </div>
        ))}
        {/* 모달 컴포넌트를 사용하여 모달을 렌더링 */}
        <Modal
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          data={selectedData}
          handleApply={handleApply}
        />
      </div>
      {/* 페이지 네비게이션 렌더링 */}
      <ul className="pagination">
        {startPage > 1 && (
          <li className="page-item">
            <a
              href="#"
              className="page-link"
              onClick={() => setCurrentPage(startPage - 1)}
            >
              이전
            </a>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a
              href="#"
              className={number === currentPage ? "active page-link" : "page-link"}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </a>
          </li>
        ))}
        {endPage < totalPages && (
          <li className="page-item">
            <a
              href="#"
              className="page-link"
              onClick={() => setCurrentPage(endPage + 1)}
            >
              다음
            </a>
          </li>
        )}
      </ul>
    </>
  );
};
}

export default SportGroup;
