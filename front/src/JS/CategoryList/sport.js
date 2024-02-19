import React, { useState, useContext } from "react";
import list from "../../JS/images";
import Modal from "../../components/Modal"; // 모달 컴포넌트 import
import axios from "axios";
import Site from "../../components/GroupJoin/Site";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { useNavigate } from "react-router-dom";


const SportGroup = ({ print, searchValue }) => {
  const { userInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 한 페이지에 표시되는 항목 수
  const handleSeq = (c) => {
    setSelectedData(c);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedData(null);
    setIsModalOpen(false);
  };
  const handleApply = async (data) => {
    console.log(userInfo)
    if(userInfo === ""|| userInfo===null){
      alert("로그인 해주세요")
      navigate("/Login")
    }
    if (data.meetingType === "무료") {
      try {
        const response = await axios.post("/api/content", selectedData, {
          params: {
            seq: userInfo.seq,
          },
        });
        console.log(response);
        if (response.data === "이미") {
          alert("신청한 그룹입니다");
        } else if (response.data === "기간") {
          alert("모집기간이 지났습니다");
        } else if (response.data === "인원") {
          alert("모집인원이 다 찼습니다");
        } else if (response.data === "신청") {
          alert("신청완료");
          navigate("/schedule")
        }
      } catch (error) {}
      setSelectedData(null);
      setIsModalOpen(false);

       window.location.reload();
    } else if (data.meetingType === "유료") {
      console.log("여기도 들어왔지?");
      console.log(selectedData)
      try {
        const response = await axios.post("/api/content", selectedData, {
          params: {
            seq: userInfo.seq,
          },
        });
        console.log(response);

        if (response.data === "이미") {
          alert("신청한 그룹입니다");
        } else if (response.data === "기간") {
          alert("모집기간이 지났습니다");
        } else if (response.data === "인원") {
          alert("모집인원이 다 찼습니다");
        } else if (response.data === "신청") {
          navigate("/payment", { state: { selectedData: selectedData } });
        }
      } catch (error) {}
      window.location.reload();
    }
  };
  const getImageByCategory = (category) => {
    const images = list[category] || [];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(print.length / itemsPerPage);

  // 이전 페이지 함수
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // 다음 페이지 함수
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // 현재 페이지에 해당하는 데이터 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrint = print.slice(startIndex, endIndex);

  
  if (print === "sport") {
    return (
      <div className="group-container">
        {!searchValue && <Site print={print} />}
      </div>
    );
  } else {
    return (
      <>
        <div className="group-container">
          {!searchValue && <Site print={print} />}
          {currentPrint.map((c, index) => (
            <div key={index} className="group-item">
              <div onClick={() => handleSeq(c)}>
                <img
                  className="group-item-img"
                  src={getImageByCategory(c.category)}
                  alt="Card"
                />
                <h4 className="group-item-h4">{c.category}</h4>
                <h4 className="group-item-h4">{c.meetingTitle}</h4>
                <h4 className="group-item-h4-end">
                {new Date(c.recruitmentd) < new Date() - 24 * 60 * 60 * 1000 || c.peopleNum === c.joinPeople
                    ? "모집종료"
                    : null}
                </h4>
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
        {/* 페이징 처리 */}
        <div className="pagination-container">
          <ul className="pagination">
            <li>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="page-link"
              >
                이전
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className="page-item">
                <a
                  href="#"
                  className={
                    currentPage === i + 1 ? "active page-link" : "page-link"
                  }
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="page-link"
              >
                다음
              </button>
            </li>
          </ul>
        </div>
      </>
    );
  }
};
export default SportGroup;
