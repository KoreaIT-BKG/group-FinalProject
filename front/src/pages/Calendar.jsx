// Calendar.jsx

import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../css/Calendar.css";
import Header from "../components/Header/header";
import Footer from "../components/Home/Footer";
import CalendarModal from "./CalendarModal";
import "../css/CalendarModal.css";
import axios from "axios";
import { LoginContext } from "../contexts/LoginContextProvider";
import EventDetailModal from "./EventDetailModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

class Calendar extends Component {
  static contextType = LoginContext; // 클래스 컴포넌트에서 contextType을 사용하여 context에 직접 액세스할 수 있게 합니다.
  state = {
    showData: false, // 상태 추가: 데이터를 보일지 여부를 결정하는 상태
    showJoinData: false,
    showModal: false,
    // modalDate: null,
    modalStartDate: null,
    modalEndDate: null,
    diff: null,
    events: [],
    groupInfo: [],
    joinInfo: [],
    details: null,
  };

  handleDetailClick = (event) => {
    // 클릭한 이벤트 정보를 상태에 저장
    this.setState({
      details: event,
    });
  };

  handleButtonClick = () => {
    // 버튼이 클릭될 때 상태를 토글
    this.setState((prevState) => ({
      showData: !prevState.showData,
      showJoinData: false,
    }));
  };

  handleButtonClick2 = () => {
    // 버튼이 클릭될 때 상태를 토글
    this.setState((prevState) => ({
      // prevState 현재 state상태
      showJoinData: !prevState.showJoinData, // showJoinData는 현재 showJoinData의 반대되는 값을 설정
      showData: false,
    }));
  };

  handleDateClick = (arg) => {
    this.setState({
      showModal: true,
      // modalDate: arg.dateStr,
      diff: "b",
    });
  };

  handleSelect = (arg) => {
    // 선택한 영역에 대한 작업을 수행
    console.log("Selected start date:", arg.startStr);
    const adjustedEndDate = new Date(arg.end.valueOf());
    // adjustedEndDate.setDate(adjustedEndDate.getDate());
    const adjustedEndStr = adjustedEndDate.toISOString().split("T")[0]; // 시간 정보 제외
    console.log("Selected end date:", adjustedEndStr);

    // 모달에 날짜 설정
    this.setState({
      showModal: true,
      modalStartDate: arg.startStr,
      modalEndDate: adjustedEndStr,
      diff: "b",
    });
  };

  handleEventClick = (info) => {
    // 일정이 있는 이벤트 클릭 시
    // 클릭한 이벤트 정보에 대한 작업을 수행
    console.log("Clicked event:", info.event);

    // 종료날짜 데이터변환 로직
    const adjustedEndDate = new Date(info.event.end.valueOf());
    // adjustedEndDate.setDate(adjustedEndDate.getDate());
    const adjustedEndStr = adjustedEndDate.toISOString().split("T")[0];

    // 모달에 날짜 설정
    this.setState(
      {
        showModal: true,
        modalStartDate: info.event.startStr,
        modalEndDate: info.event.endStr,
        diff: "c", // 이벤트 클릭을 나타내는 다른 값으로 변경
        selectedEventData: {
          // info.event = FullCalendar에서 이벤트를 나타내는 객체
          title: info.event.title,
          start: info.event.startStr,
          end: adjustedEndStr,
          memo: info.event.extendedProps.memo, // extendedProps : 객체 내에 있는 속성에 접근하기 위해서는 info.event.extendedProps.seq
          userId: info.event.extendedProps.userId,
          seq: info.event.extendedProps.seq,
          // 원하는 다른 이벤트 속성들 추가
        },
      },
      () => {
        console.log("Selected Event Data:", this.state.selectedEventData);
      }
    );
  };

  handleCloseModal = async () => {
    this.setState({
      showModal: false,
      // modalDate: null,
      modalStartDate: null,
      modalEndDate: null,
    });

    await this.fetchEvents();
  };
  // handleEventRender = (info) => {
  //   // info.el은 이벤트를 렌더링하는 HTML 엘리먼트입니다.
  //   // info.event는 풀캘린더 이벤트 객체입니다.

  //   // 선택한 색상을 배경색으로 적용
  //   info.el.style.backgroundColor = info.event.extendedProps.color;
  // };

  checkTokenExpiration = async () => {
    const token = localStorage.getItem("accessToken");
    console.log("시작한다?");
    if (token) {
      try {
        const response = await axios.post("/getIdRole", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.seq);
        this.setState({ seq: response.data.seq }, () => {
          this.fetchEvents(this.state.seq);
        });
        this.setState({ seq: response.data.seq }, () => {
          this.fetchGroupEvents(this.state.seq);
        });
        this.setState({ seq: response.data.seq }, () => {
          this.fetchGroupJoin(this.state.seq);
        });

        console.log("왜 여기가 아노디?");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  async componentDidMount() {
    await this.checkTokenExpiration();
  }

  async componentDidUpdate(prevProps, prevState) {
    // 이전 상태와 현재 상태를 비교하여 필요한 조건을 확인
    if (prevState.showModal !== this.state.showModal) {
      // showModal 상태가 변경되었을 때만 데이터 다시 불러오기
      await this.fetchEvents(this.state.seq);
    } else if (prevState.details !== this.state.details) {
      await this.fetchGroupJoin(this.state.seq);
      await this.fetchGroupEvents(this.state.seq);
    }
  }

  fetchGroupJoin = async (seq) => {
    // 신청현황 랜더링
    try {
      console.log(seq);
      const response = await axios.post("/getGroupJoin", null, {
        params: { seq },
      });
      const eventData = response.data;
      console.log(eventData);

      const formatEvents = eventData.map((event) => ({
        seq: event.seq,
        userId: event.userId,
        meetingTitle: event.meetingTitle,
        category: event.category,
        faceToFace: event.faceToFace,
        program: event.program,
        meetingType: event.meetingType,
        peopleNum: event.peopleNum,
        joinPeople: event.joinPeople,
        meetingCost: event.meetingCost,
        recruitments: event.recruitments,
        recruitmentd: event.recruitmentd,
        meetingDateStart: event.meetingDateStart,
        meetingDateEnd: event.meetingDateEnd,
        meetingLocation: event.meetingLocation,
        membersId: event.membersId,
        searchLocation: event.searchLocation,
      }));

      this.setState({ joinInfo: formatEvents });
      console.log("내 가입현황 ", this.state.joinInfo);
    } catch (error) {
      console.log("일정 데이터 가져오기 실패", error);
    }
  };

  fetchGroupEvents = async (seq) => {
    // 신청현황 랜더링
    try {
      console.log(seq);
      const response = await axios.post("/getGroupEvents", null, {
        params: { seq },
      });
      const eventData = response.data;
      console.log(eventData);

      const formatEvents = eventData.map((event) => ({
        seq: event.seq,
        userId: event.userId,
        meetingTitle: event.meetingTitle,
        category: event.category,
        faceToFace: event.faceToFace,
        program: event.program,
        meetingType: event.meetingType,
        peopleNum: event.peopleNum,
        joinPeople: event.joinPeople,
        meetingCost: event.meetingCost,
        recruitments: event.recruitments,
        recruitmentd: event.recruitmentd,
        meetingDateStart: event.meetingDateStart,
        meetingDateEnd: event.meetingDateEnd,
        meetingLocation: event.meetingLocation,
        membersId: event.membersId,
        searchLocation: event.searchLocation,
      }));

      this.setState({ groupInfo: formatEvents });
      console.log("내 신청현황 ", this.state.groupInfo);
    } catch (error) {
      console.log("일정 데이터 가져오기 실패", error);
    }
  };

  fetchEvents = async (seq) => {
    try {
      console.log(seq);
      const response = await axios.post("/getEvents", { seq });
      const eventData = response.data;

      const formattedEvents = eventData.map((event) => ({
        title: event.scheduleTitle,
        start: event.startDate,
        end: event.endDate,
        memo: event.scheduleMemo,
        userId: event.userId,
        seq: event.seq,
        color: event.color,
      }));

      formattedEvents.forEach((event) => {
        const adjustedEndDate = new Date(event.end);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        event.end = adjustedEndDate.toISOString().split("T")[0]; // 시간 정보 제외
      });

      this.setState({ events: formattedEvents });
      console.log("확인용이다 : ", this.state.events);
    } catch (error) {
      console.log("일정 데이터 가져오기 실패", error);
    }
  };

  render() {
    return (
      <div className="App">
        <Header />
        <br />
        <div className="content-container">
          <div className="table-container">
            <button className="btn btn-light" onClick={this.handleButtonClick}>
              {this.state.showData ? "닫기" : "모임신청 현황"}
            </button>
            &nbsp;
            <button
              className="btn btn-secondary"
              onClick={this.handleButtonClick2}
            >
              {this.state.showJoinData ? "닫기" : "가입 현황"}
            </button>
            {this.state.showJoinData && (
              <table>
                <tbody>
                  <tr>
                    <th>내 모임 가입현황</th>
                  </tr>
                  {this.state.joinInfo.map((event, index) => (
                    <tr
                      key={index}
                      onClick={() => this.handleDetailClick(event)}
                      style={{
                        fontWeight:
                          event.userId === event.membersId ? "bold" : "normal",
                      }}
                    >
                      <td>
                        {event.userId === event.membersId && (
                          <FontAwesomeIcon
                            icon={faCrown}
                            style={{ marginRight: "5px", color: "gold" }}
                          />
                        )}
                        {event.meetingTitle}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {this.state.showData && (
              <table>
                <tbody>
                  <tr>
                    <th>내 모임 신청현황</th>
                  </tr>
                  {this.state.groupInfo.map((event, index) => (
                    <tr
                      key={index}
                      onClick={() => this.handleDetailClick(event)}
                      style={{
                        fontWeight:
                          event.userId === event.membersId ? "bold" : "normal",
                      }}
                    >
                      <td>
                        {event.userId === event.membersId && (
                          <FontAwesomeIcon
                            icon={faCrown}
                            style={{ marginRight: "5px", color: "gold" }}
                          />
                        )}
                        {event.meetingTitle}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="calendar">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek,dayGridDay",
              }}
              events={this.state.events}
              dateClick={this.handleDateClick}
              eventClick={this.handleEventClick} // 이벤트 클릭 핸들러 추가
              nextDayThreshold={"24:00:00"} // 마지막 날을 포함하도록 설정
              selectable={true} // 전체 캘린더를 선택 가능하게 만듬
              select={this.handleSelect} // 선택한 영역에 대한 콜백
            />
          </div>
        </div>
        {this.state.showModal && (
          <CalendarModal
            onClose={this.handleCloseModal}
            start={this.state.modalStartDate}
            end={this.state.modalEndDate}
            diff={this.state.diff}
            eventData={this.state.selectedEventData}
          />
        )}

        {this.state.details && (
          <EventDetailModal
            details={this.state.details}
            onClose={() => this.setState({ details: null })}
          />
        )}
        <Footer />
      </div>
    );
  }
}

export default Calendar;
