import React from "react";
import "../css/Modal.css"
const Modal = ({ isOpen, handleClose, data, handleApply }) => {
  // 모달이 열려 있지 않으면 null 반환할꺼양
  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 모달 내용 18줄까지 가능*/}
        <h3>모집기간 : {data.recruitments} ~ {data.recruitmentd}</h3>
        <h2>{data.meetingTitle}</h2>
        <h3>모임방식 : {data.faceToFace}</h3>
        {data.faceToFace === '비대면' ? <h3>공유프로그램 : {data.program}</h3> : null}
        <h3>모임기간 : {data.meetingDateStart} ~ {data.meetingDateEnd}</h3>
        <h3>모집인원 : {data.joinPeople}/{data.peopleNum}</h3>
        <h3>모임장소 : {data.meetingLocation}</h3>

        {/* 기타 데이터 출력 */}
        <div className="modal-buttons">
          <button className="modal-content-but" onClick={()=>handleApply(data)}>
            신청
          </button>
          <button className="modal-content-but" onClick={handleClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;