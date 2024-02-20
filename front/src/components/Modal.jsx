import React from "react";
import "../css/Modal.css";
const Modal = ({ isOpen, handleClose, data, handleApply }) => {
  // 모달이 열려 있지 않으면 null 반환할꺼양
  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 모달 내용 18줄까지 가능*/}
        <table className="modal-table">
          <tr className="modal-table-tr">
            <td colSpan={2}>
              <h2 className="modal-h2">{data.meetingTitle}</h2>
            </td>
          </tr>
          <tr className="modal-table-tr">
            <td>
              <h3 className="modal-h31">모집기간 :</h3>
            </td>
            <td>
              <h3 className="modal-h3">
                {data.recruitments} ~ {data.recruitmentd}
              </h3>
            </td>
          </tr>
          <tr className="modal-table-tr">
            <td>
              <h3 className="modal-h31">모임방식 :</h3>
            </td>
            <td>
              <h3 className="modal-h3"> {data.faceToFace}</h3>
            </td>
          </tr>
          <tr className="modal-table-tr">
            {data.faceToFace === "비대면" ? (
              <>
                <td>
                  <h3 className="modal-h31">공유프로그램 : </h3>
                </td>
                <td>
                  <h3 className="modal-h3">{data.program}</h3>
                </td>
              </>
            ) : null}
          </tr>
          <tr className="modal-table-tr">
            <td>
              <h3 className="modal-h31">모임기간 :</h3>
            </td>
            <td>
              <h3 className="modal-h3">
                {data.meetingDateStart} ~ {data.meetingDateEnd}
              </h3>
            </td>
          </tr>
          <tr className="modal-table-tr">
            <td>
              <h3 className="modal-h31">모집인원 :</h3>
            </td>
            <td>
              <h3 className="modal-h3">
                {data.joinPeople}/{data.peopleNum}
              </h3>
            </td>
          </tr>
          <tr className="modal-table-tr">
            <td>
              <h3 className="modal-h31">모임장소 : </h3>
            </td>
            <td>
              <h3 className="modal-h3">{data.meetingLocation}</h3>
            </td>
          </tr>
          <tr className="modal-table-tr">
            {data.meetingType === "유료" ? (
              <>
                <td>
                  <h3 className="modal-h31">참기비용 : </h3>
                </td>
                <td>
                  <h3 className="modal-h3"> 5000원</h3>
                </td>
              </>
            ) : null}
          </tr>
        </table>

        {/* 기타 데이터 출력 */}
        <div className="modal-buttons">
          <button
            className="modal-content-but"
            onClick={() => handleApply(data)}
          >
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
