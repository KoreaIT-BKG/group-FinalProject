import React from "react";
import "../css/DetailModal.css";
import axios from "axios";
import Swal from "sweetalert2";
import LocationMap from "./locationMap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EventDetailModal = ({ details, onClose }) => {
  const today = new Date().toISOString().split("T")[0];
  const [isMapVisible, setIsMapVisible] = useState(false);
  const navigate = useNavigate();
  const openMap = () => {
    setIsMapVisible(true);
  };

  const closeMap = () => {
    setIsMapVisible(false);
  };

  const handleCancel = async () => {
    let confirmText;
    let successText;
  
    if (details.userId === details.membersId) {
      // 모임장인 경우
      confirmText = "모임을 취소하시겠습니까?";
      successText = "모임이 취소되었습니다.";
    } else {
      // 모임원인 경우
      confirmText = "신청을 취소하시겠습니까?";
      successText = "신청이 취소되었습니다.";
    }

    const isConfirmed = await Swal.fire({
      icon: "question",
      title: confirmText,
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => result.isConfirmed);

    if (isConfirmed) {
      try {
        //
        await axios.delete(`/outGroup/${details.seq}`, {
          params: {
            meetingTitle: details.meetingTitle,
            userId: details.userId,
            membersId: details.membersId,
          },
        });

        Swal.fire({
          icon: "success",
          title: successText,
          confirmButtonText: "확인",
        });
        onClose();
      } catch (error) {
        console.error("서버 요청 실패", error);
      }
    }
  };

  const handleChatButtonClick = () => {
    // 채팅방 버튼 클릭 시 Chat 페이지로 이동
    navigate(`/Chat?groupnum=${details.seq}&title=${details.meetingTitle}`);
  };
  
  return (
    <div className="detailcustom-modal">
      <div className="detailmodal-content">
        <div className="detailmodal-header">
          <h5 className="detailmodal-title">{details.meetingTitle}</h5>
          <button type="button" className="detailclose" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        <div className="detailmodal-body">
          {details && (
            <table className="detailtable">
              <tbody>
                <tr>
                  <td>모임장 아이디</td>
                  <td>{details.userId}</td>
                </tr>
                <tr>
                  <td>카테고리</td>
                  <td>{details.category}</td>
                </tr>
                <tr>
                  <td>대면/비대면</td>
                  <td>{details.faceToFace}</td>
                </tr>
                <tr>
                  <td>비대면 프로그램</td>
                  <td>{details.program}</td>
                </tr>
                <tr>
                  <td>모임유형</td>
                  <td>{details.meetingType}</td>
                </tr>
                <tr>
                  <td>전체모집인원</td>
                  <td>{details.peopleNum}</td>
                </tr>
                <tr>
                  <td>현재모집인원</td>
                  <td>{details.joinPeople}</td>
                </tr>
                <tr>
                  <td>유료모임비</td>
                  <td>{details.meetingCost}</td>
                </tr>
                <tr>
                  <td>모집날짜</td>
                  <td>
                    {details.recruitments} - {details.recruitmentd}
                  </td>
                </tr>
                <tr>
                  <td>모임활동날짜</td>
                  <td>
                    {details.meetingDateStart} - {details.meetingDateEnd}
                  </td>
                </tr>
                <tr>
                  <td>모임장소</td>
                  <td>
                    {details.meetingLocation}
                    <button className="locationBtn" onClick={openMap}>
                      지도보기
                    </button>
                    {isMapVisible && (
                      <LocationMap
                        location={details.searchLocation}
                        onClose={closeMap}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>아이디</td>
                  <td>{details.membersId}</td>
                </tr>
                {/* <tr>
                <td>검색할 장소</td>
                <td>{details.searchLocation}</td>
              </tr> */}
              </tbody>
            </table>
          )}
        </div>
        <div className="detailmodal-footer">
          <button type="button" className="chatopen" onClick={handleChatButtonClick}>
              채팅방
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            닫기
          </button>
          {details.recruitmentd && details.recruitmentd >= today && details.userId !== details.membersId && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCancel}
            >
              신청 취소
            </button>
          )}
          {details.recruitmentd && details.recruitmentd >= today && details.userId === details.membersId && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCancel}
            >
              모임 취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;