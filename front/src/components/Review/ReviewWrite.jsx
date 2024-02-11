import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";
import "../../css/ReviewModal.css"; // CSS 파일 불러오기
import axios from "axios";

const ReviewWrite = ({ showModal, toggleModalClose }) => {
  const { userInfo } = useContext(LoginContext);
  const [seq, setSeq] = useState(userInfo.seq);
  const [tableData, setTableData] = useState([]);
  const [selectedMeetingTitle, setSelectedMeetingTitle] = useState("");
  const [selectedMeetingId, setSelectedMeetingId] = useState(""); // 선택한 모임장의 ID 추가
  const [selectedMeetinguserId, setSelectedMeetinguserId] = useState(""); // 선택한 모임의 ID 추가
  const [reviewContent, setReviewContent] = useState("");
  const [reviewScore, setReviewScore] = useState(5); // 기본값으로 5 설정

  const review = async () => {
    try {
      const response = await axios.post("/api/reviewwrite", seq);
      console.log(response);
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    review();
  }, []);

  const sendReview = async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지
    console.log("Selected Meeting Title:", selectedMeetingTitle);
    console.log("Selected Meeting ID:", selectedMeetingId);
    console.log("Review Content:", reviewContent);
    console.log("Review Score:", reviewScore);
    console.log("id  : ", selectedMeetinguserId)
    try {
      const response = await axios.post("/api/sendReview", {
        leaderId: selectedMeetingId,
        meetingTitle: selectedMeetingTitle,
        context: reviewContent,
        point: reviewScore,
        id: selectedMeetinguserId,
      });
      console.log("Review sent successfully:", response.data);
      if(response.data === "성공"){
        alert("작성완료")
        toggleModalClose();
        window.location.reload();
      }
      // 리뷰 작성 후 필요한 작업 수행
    } catch (error) {
      console.error("Error sending review:", error);
    }
  };

  const handleReviewContentChange = (e) => {
    setReviewContent(e.target.value);
  };

  const handleReviewScoreChange = (e) => {
    setReviewScore(parseInt(e.target.value)); // 문자열을 정수로 변환하여 설정
  };

  // 선택한 모임의 ID를 설정하는 함수
  const handleMeetingIdSelection = (meetingTitle) => {
    const selectedMeeting = tableData.find(
      (item) => item.meetingTitle === meetingTitle
    );
    if (selectedMeeting) {
        console.log("확인할꺼지롱")
        console.log(selectedMeeting.userId)
      setSelectedMeetingId(selectedMeeting.userId);
      setSelectedMeetinguserId(selectedMeeting.membersId);
    }
  };

  return (
    <div className={showModal ? "modal" : "modal-hidden"}>
      <div className="review-modal">
        <h2>리뷰 작성</h2>
        <form className="review-modal-form" onSubmit={sendReview}>
          <table className="review-modal-table">
            <tbody>
              <tr className="review-modal-tr">
                <td className="review-modal-td">
                  <select
                    value={selectedMeetingTitle}
                    onChange={(e) => {
                      setSelectedMeetingTitle(e.target.value);
                      handleMeetingIdSelection(e.target.value); // 선택한 모임의 ID 설정
                    }}
                  >
                    <option value="">모임을 선택하세요</option>
                    {tableData.map((item, index) => (
                      <option key={index}>{item.meetingTitle}</option>
                    ))}
                  </select>
                </td>
                <td className="review-modal-td">
                  {/* 선택된 meetingTitle에 해당하는 userId 표시 */}
                  {tableData
                    .filter(
                      (filteredItem) =>
                        filteredItem.meetingTitle === selectedMeetingTitle
                    )
                    .map((filteredItem, index) => (
                      <p key={index}>{filteredItem.userId}</p>
                    ))}
                </td>
              </tr>
              <tr className="review-modal-tr">
                <td className="review-modal-td">점수</td>
                <td className="review-modal-td">
                  <select
                    value={reviewScore}
                    onChange={handleReviewScoreChange}
                  >
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </select>
                </td>
              </tr>
              <tr className="review-modal-tr">
                <td className="review-modal-td" colSpan={2}>
                  <textarea
                    value={reviewContent}
                    onChange={handleReviewContentChange}
                    className="review-modal-textarea"
                    placeholder="리뷰 내용을 입력하세요"
                  ></textarea>
                </td>
              </tr>
              {/* 폼 요소들 */}
              <tr className="review-modal-tr">
                <td className="review-modal-td">
                  <button className="review-modal-write" type="submit">
                    작성 완료
                  </button>
                </td>
                <td className="review-modal-td">
                  <button className="close" onClick={() => toggleModalClose()}>
                    닫기
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default ReviewWrite;
