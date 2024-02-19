// import Button from 'react-bootstrap/Button';
import KakaoMap from "../KakaoMap";
import Header from "../components/Header/header";
import "../css/InsertForm.css";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import DaumPost from "../DaumPost";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContextProvider";
import Footer from "../components/Home/Footer"
function InsertForm() {
  // 현재 날짜 추출('YYYY-MM-DD')

  const { userInfo } = useContext(LoginContext);
  const navigation = useNavigate();

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = currentDate.getDate();
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };
  const [formData, setFormData] = useState({
    // meetingNumber: '',
    userId: "",
    meetingTitle: "",
    category: "",
    faceToFace: "",
    program: "",
    peopleNum: "",
    recruitments: getCurrentDate(),
    recruitmentd: "",
    meetingDateStart: "",
    meetingDateEnd: "",
    meetingLocation: "",
    meetingLocation2: "",
    customProgram: "",
    meetingType: "",
    meetingCost: 0,
    joinPeople: 1,
  });
  const [showDaumPost, setShowDaumPost] = useState(false);

  const [addressObj, setAddressObj] = useState({
    areaAddress: "",
    townAddress: "",
  });
  const [mapCenter, setMapCenter] = useState({
    lat: 37.50006335700178,
    lng: 127.03558085159663,
  });

  const handleAddressChange = (newAddressObj) => {
    setAddressObj(newAddressObj);

    // 주소가 변경되면 중심 좌표 업데이트
    setMapCenter({
      lat: newAddressObj.lat,
      lng: newAddressObj.lng,
    });
    // 주소가 변경되면 meetingLocation을 업데이트
    setFormData({
      ...formData,
      meetingLocation: `${newAddressObj.areaAddress} ${newAddressObj.townAddress}`,
    });
    console.log(newAddressObj);
  };

  const handleDaumPostClick = () => {
    alert("주소찾기 버튼을 이용해주세요.");
    setShowDaumPost(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange2 = (e) => {
    // 대면 OR 비대면 (faceToFace)
    const { name, value } = e.target;
    console.log("Radio Change 2:", name, value); // 콘솔에 출력
    const programValue = value === "대면" ? "X" : formData.program;
    setFormData({
      ...formData,
      [name]: value,
      program: programValue,
    });
  };

  const handleRadioChange3 = (e) => {
    // program
    const { name, value } = e.target;
    console.log("Radio Change 3:", name, value); // 콘솔에 출력

    if (value === "other") {
      setFormData({
        ...formData,
        [name]: value,
        customProgram: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    const findUserId = async () => {
      try {
        console.log("userInfo.seq:", userInfo.seq);

        const response = await axios.post("/findUserId", { seq: userInfo.seq });

        console.log("response.data:", response.data);

        setFormData((prevFormData) => ({
          ...prevFormData,
          userId: response.data,
        }));
      } catch (error) {
        console.error("axios 에러", error);
      }
    };

    if (userInfo.seq) {
      findUserId();
    }
  }, [userInfo.seq]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      meetingLocation: `${formData.meetingLocation}/${formData.meetingLocation2}`,
      program:
        formData.program === "other"
          ? formData.customProgram
          : formData.program, // 추가된 부분
      meetingType: formData.meetingType,
    };
    const currentDate = new Date();
    const currentDateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (formData.meetingType.trim() === "") {
      alert("모임타입을 설정해주세요."); // 알림 창 표시
      document.getElementById("free").focus();
    } else if (
      formData.recruitmentd.trim() === "" ||
      new Date(formData.recruitmentd) < currentDateWithoutTime
    ) {
      alert("올바른 모집 기간 날짜를 입력해주세요.");
      const recruitmentd = document.getElementById("recruitmentd");
      recruitmentd.scrollIntoView({ behavior: "auto", block: "center" });
      setTimeout(() => {
        recruitmentd.focus();
      }, 100);
    } else if (formData.userId.trim() === "") {
      alert("아이디를 입력하세요."); // 알림 창 표시
      const userId = document.getElementById("userId");
      userId.scrollIntoView({ behavior: "auto", block: "center" });
      setTimeout(() => {
        userId.focus();
      }, 100);
    } else if (formData.meetingTitle.trim() === "") {
      alert("모임명을 입력하세요."); // 알림 창 표시
      const meetingTitle = document.getElementById("meetingTitle");
      meetingTitle.scrollIntoView({ behavior: "auto", block: "center" });
      setTimeout(() => {
        meetingTitle.focus();
      }, 100);
      console.log(userInfo);
    } else if (formData.category.trim() === "") {
      alert("모임종류를 선택해주세요."); // 알림 창 표시
      document.getElementById("sports").focus();
    } else if (formData.faceToFace.trim() === "") {
      alert("모임방식을 선택해주세요."); // 알림 창 표시
      document.getElementById("Yface").focus();
    } else if (
      formData.faceToFace.trim() === "비대면" &&
      formData.program.trim() === ""
    ) {
      alert("공유프로그램을 선택해주세요."); // 알림 창 표시
      document.getElementById("Zoom").focus();
    } else if (formData.peopleNum.trim() === "") {
      alert("모집인원을 입력하세요."); // 알림 창 표시
      const peopleNum = document.getElementById("peopleNum");
      peopleNum.scrollIntoView({ behavior: "auto", block: "center" });
      setTimeout(() => {
        peopleNum.focus();
      }, 100);
    } else if (
      formData.meetingDateStart.trim() === "" ||
      new Date(formData.meetingDateStart) <= new Date(formData.recruitmentd)
    ) {
      alert("올바른 모임 시작 날짜를 입력하세요."); // 알림 창 표시
      document.getElementById("meetingDateStart").focus();
    } else if (
      formData.meetingDateEnd.trim() === "" ||
      new Date(formData.meetingDateEnd) <= currentDate
    ) {
      alert("올바른 모임 종료 날짜를 입력하세요."); // 알림 창 표시
      document.getElementById("meetingDateEnd").focus();
    } else if (
      new Date(formData.meetingDateEnd) < new Date(formData.meetingDateStart)
    ) {
      alert("올바른 모임 종료 날짜를 입력하세요."); // 알림 창 표시
      document.getElementById("meetingDateEnd").focus();
    } else if (formData.meetingLocation.trim() === "") {
      alert("모임장소를 입력해주세요."); // 알림 창 표시
      document.getElementById("meetingLocation").focus();
      handleDaumPostClick();
    } else {
      try {
        const response = await axios.post("/groupInsert", updatedFormData, {
          params: {
            searchLocation: formData.meetingLocation,
          },
        });
        console.log(response.data);
        // setFormData(response.data)
        console.log(
          "Updated meetingLocation:",
          updatedFormData.meetingLocation
        );
        alert("그룹개설이 완료되었습니다.");
        navigation("/"); // 이동하고자 하는 경로로 변경
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
  };

  return (
    <>
      <Header />

      <div className="insert-form-container">
        <form className="insert-form" onSubmit={handleSubmit}>
          <h2>그룹 개설</h2>
          <table>
            <tbody>
              <tr>
                <div className="radio-label">
                  <label htmlFor="free" className="insertLabel">
                    무료
                    <input
                      className="inputRadio"
                      type="radio"
                      name="meetingType"
                      value="무료"
                      id="free"
                      onChange={handleChange}
                      checked={formData.meetingType === "무료"}
                    />
                  </label>
                  &nbsp;&nbsp;
                  {userInfo.role === "ROLE_MUSER" ? (
                    <label htmlFor="nofree" className="insertLabel">
                      유료
                      <input
                        className="inputRadio"
                        type="radio"
                        name="meetingType"
                        value="유료"
                        id="nofree"
                        onChange={handleChange}
                        checked={formData.meetingType === "유료"}
                      />
                    </label>
                  ) : null}
                </div>
              </tr>
              <tr>
                <label className="insertLabel">
                  {/* <td>아이디 :&nbsp;</td>  */}
                  <td>
                    <input
                      className="insertInput"
                      type="hidden"
                      name="meetingCost"
                      id="meetingCost"
                      value={formData.meetingCost}
                      onChange={handleChange}
                    />
                  </td>
                </label>
              </tr>
              <tr>
                <label className="insertLabel">
                  <td>
                    <input
                      className="insertInput"
                      type="hidden"
                      name="joinPeople"
                      id="joinPeople"
                      value={formData.joinPeople}
                      onChange={handleChange}
                    />
                  </td>
                </label>
              </tr>
              <tr>
                <label className="Datelabel">
                  <td>모집기간 :&nbsp;</td>
                  <td>
                    <input
                      className="inputDate"
                      type="date"
                      name="recruitments"
                      id="recruitments"
                      value={formData.recruitments}
                      onChange={handleChange}
                      disabled
                    />{" "}
                    &nbsp;-&nbsp;&nbsp;
                    <input
                      className="inputDate"
                      type="date"
                      name="recruitmentd"
                      id="recruitmentd"
                      value={formData.recruitmentd}
                      onChange={handleChange}
                    />
                  </td>
                </label>
              </tr>
              <tr>
                <label className="insertLabel">
                  <td>아이디 :&nbsp;</td>
                  <td>
                    <input
                      className="insertInput"
                      type="text"
                      name="userId"
                      id="userId"
                      value={formData.userId}
                      readOnly
                    />
                  </td>
                </label>
              </tr>
              <tr>
                <label className="insertLabel">
                  <td>모임명 :&nbsp;</td>
                  <td>
                    <input
                      className="insertInput"
                      type="text"
                      name="meetingTitle"
                      id="meetingTitle"
                      value={formData.meetingTitle}
                      onChange={handleChange}
                    />
                  </td>
                </label>
              </tr>
              <tr>
                <td colSpan="2">
                  모임종류 : &nbsp;
                  <br />
                  <div className="radio-label">
                    <label htmlFor="sports" className="insertLabel">
                      운동
                      <input
                        className="inputRadio"
                        type="radio"
                        name="category"
                        value="sport"
                        id="sports"
                        onChange={handleChange}
                        checked={formData.category === "sport"}
                      />
                    </label>
                    <label htmlFor="hobby" className="insertLabel">
                      &nbsp;&nbsp;라이프 스타일
                      <input
                        className="inputRadio"
                        type="radio"
                        name="category"
                        value="life"
                        id="hobby"
                        onChange={handleChange}
                        checked={formData.category === "life"}
                      />
                    </label>
                    <label htmlFor="travel" className="insertLabel">
                      &nbsp;&nbsp;여행
                      <input
                        className="inputRadio"
                        type="radio"
                        name="category"
                        value="tour"
                        id="travel"
                        onChange={handleChange}
                        checked={formData.category === "tour"}
                      />
                    </label>
                    <label htmlFor="employment" className="insertLabel">
                      &nbsp;&nbsp;취업
                      <input
                        className="inputRadio"
                        type="radio"
                        name="category"
                        value="work"
                        id="employment"
                        onChange={handleChange}
                        checked={formData.category === "work"}
                      />
                    </label>
                    <label htmlFor="language" className="insertLabel">
                      &nbsp;&nbsp;어학
                      <input
                        className="inputRadio"
                        type="radio"
                        name="category"
                        value="language"
                        id="language"
                        onChange={handleChange}
                        checked={formData.category === "language"}
                      />
                    </label>
                    <label htmlFor="coding" className="insertLabel">
                      &nbsp;&nbsp;코딩
                      <input
                        className="inputRadio"
                        type="radio"
                        name="category"
                        value="IT"
                        id="coding"
                        onChange={handleChange}
                        checked={formData.category === "IT"}
                      />
                    </label>
                  </div>
                </td>
              </tr>
              <br />
              모임방식 :<br />
              <tr>
                <div className="radio-label">
                  <label htmlFor="Yface" className="insertLabel">
                    대면
                    <input
                      className="inputRadio"
                      type="radio"
                      name="faceToFace"
                      id="Yface"
                      value="대면"
                      onChange={handleRadioChange2}
                      checked={formData.faceToFace === "대면"}
                    />
                  </label>
                  &nbsp;&nbsp;
                  <label htmlFor="noFace" className="insertLabel">
                    비대면
                    <input
                      className="inputRadio"
                      type="radio"
                      name="faceToFace"
                      id="noFace"
                      value="비대면"
                      onChange={handleRadioChange2}
                      checked={formData.faceToFace === "비대면"}
                    />
                  </label>
                </div>
              </tr>
              <br />
              <tr>
                공유 프로그램 : <br />
                <div className="radio-label">
                  <label htmlFor="Zoom" className="insertLabel">
                    Zoom
                    <input
                      className="inputRadio"
                      type="radio"
                      name="program"
                      value="Zoom"
                      id="Zoom"
                      onChange={handleRadioChange3}
                      checked={formData.program === "Zoom"}
                      disabled={formData.faceToFace === "대면"}
                    />
                  </label>
                  &nbsp;&nbsp;
                  <label htmlFor="Skype" className="insertLabel">
                    &nbsp;&nbsp;Skype
                    <input
                      className="inputRadio"
                      type="radio"
                      name="program"
                      value="Skype"
                      id="Skype"
                      onChange={handleRadioChange3}
                      checked={formData.program === "Skype"}
                      disabled={formData.faceToFace === "대면"}
                    />
                  </label>
                  &nbsp;&nbsp;
                  <label htmlFor="Discord" className="insertLabel">
                    &nbsp;&nbsp;Discord
                    <input
                      className="inputRadio"
                      type="radio"
                      name="program"
                      value="Discord"
                      id="Discord"
                      onChange={handleRadioChange3}
                      checked={formData.program === "Discord"}
                      disabled={formData.faceToFace === "대면"}
                    />
                  </label>
                  <label htmlFor="other" className="insertLabel">
                    &nbsp;&nbsp;etc(기타)
                    <input
                      className="inputRadio"
                      type="radio"
                      name="program"
                      value="other"
                      id="other"
                      onChange={handleRadioChange3}
                      checked={formData.program === "other"}
                      disabled={formData.faceToFace === "대면"}
                    />
                  </label>
                  {formData.program === "other" && (
                    <label htmlFor="customProgram" className="insertLabel">
                      <input
                        className="inputRadio"
                        type="text"
                        name="customProgram"
                        id="customProgram"
                        value={formData.customProgram}
                        onChange={handleRadioChange3}
                      />
                    </label>
                  )}
                </div>
                <br />
              </tr>
              <tr>
                <label htmlFor="peopleNum" className="insertLabel">
                  <td>모집인원 :&nbsp;</td>
                  <td>
                    <input
                      className="insertInput"
                      type="number"
                      name="peopleNum"
                      id="peopleNum"
                      min="0"
                      value={formData.peopleNum}
                      onChange={handleChange}
                    />
                  </td>
                </label>
              </tr>
              <tr>
                <label className="Datelabel">
                  <td>모임날짜 :&nbsp;</td>
                  <td>
                    <input
                      className="inputDate"
                      type="date"
                      name="meetingDateStart"
                      id="meetingDateStart"
                      value={formData.meetingDateStart}
                      onChange={handleChange}
                    />{" "}
                    &nbsp;-&nbsp;&nbsp;
                    <input
                      className="inputDate"
                      type="date"
                      name="meetingDateEnd"
                      id="meetingDateEnd"
                      value={formData.meetingDateEnd}
                      onChange={handleChange}
                    />
                  </td>
                </label>
              </tr>
              <tr className="insertLabel">
                <label className="insertLabel">
                  <td>장소 :&nbsp;&nbsp;</td>

                  <td>
                    <input
                      className="insertLocation1"
                      type="text"
                      name="meetingLocation"
                      id="meetingLocation"
                      value={formData.meetingLocation}
                      onChange={handleChange}
                      onClick={handleDaumPostClick}
                      readOnly
                    />
                    <div className="findLocation">
                      {showDaumPost && (
                        <DaumPost
                          setAddressObj={handleAddressChange}
                          setMapCenter={setMapCenter}
                        />
                      )}
                    </div>
                  </td>
                </label>
              </tr>
              <label className="insertLabel">
                <td>상세주소 :</td>
                <td>
                  <input
                    className="insertLocation2"
                    type="text"
                    name="meetingLocation2"
                    id="meetingLocation2"
                    value={formData.meetingLocation2}
                    onChange={handleChange}
                  />
                </td>
              </label>
            </tbody>
          </table>
          <KakaoMap center={mapCenter} />
          <br />
          <input className="inputSubmit" type="submit" value="그룹개설" />
        </form>
      </div>
      {/* Footer */}
      <Footer />
      {/* End footer */}
    </>
  );
}

export default InsertForm;
