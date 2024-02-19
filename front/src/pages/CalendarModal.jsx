// CalendarModal.js

import React from 'react';
import '../css/CalendarModal.css'
import axios from 'axios';
import Swal from 'sweetalert2';
import EditModal from './EditModal';
import { SketchPicker } from 'react-color';
import { LoginContext } from "../contexts/LoginContextProvider";


class CalendarModal extends React.Component {

  static contextType = LoginContext; // 클래스 컴포넌트에서 contextType을 사용하여 context에 직접 액세스할 수 있게 합니다.
  
  state = {
    scheduleTitle: '',
    scheduleMemo: '',
    startDate: this.props.start,
    endDate: this.props.end,
    userId: '',
    isEditModalOpen: false,  // 수정모달을 열기 위한 상태 추가
    displayColorPicker: false, // 컬러 피커의 표시 여부를 관리
    color: '#4a90e2'  // 선택된 컬러를 저장하는 상태 추가
  };

  async componentDidMount() { // 컴포넌트가 화면에 랜더링되어 마운트된 직후에 호출
                        // 따라서 이 메서드 안에서 수행하는 작업들은 컴포넌트가 처음으로 화면에 나타날 때 한번만 실행됩니다

    try {
      const { userInfo } = this.context;  // context에서 userInfo를 가져옵니다.

      const response = await axios.post('/findUserId', {
        seq: userInfo.seq
      })


      const findId = response.data

      // seq에 해당하는 사용자의 아이디를 userId에 설정합니다.
      this.setState({
        userId: findId,
      })
    } catch (error) {
      console.error('서버 요청 실패', error);
    }
  }
  handleTitleChange = (e) => {
    this.setState({ scheduleTitle: e.target.value });
  };

  handleMemoChange = (e) => {
    this.setState({ scheduleMemo: e.target.value });
  };

  handleColorPickerOpen = () => { // displayColorPicker 반대값 즉, True (초기값은 False) 컬러 팔레트 열고 닫는 기능
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorChange = (color) => { // 컬러를 선택하면 선택된 컬러로 컴포넌트 상태 저장
    this.setState({ color: color.hex }); // 
  };

  handleColorPickerClose = () => {
    
    this.setState({ 
      displayColorPicker: false,
      color: '#4a90e2', 
    });
  };


  
  // handleEdit 및 handleDelete 메서드 추가
  handleEdit = () => {
    this.setState({ isEditModalOpen: true }); 
    
  };

  handleDelete = async () => {
    const { eventData } = this.props;

    const isConfirmed = await Swal.fire({
      icon: 'question',
      title: '정말 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((result) => result.isConfirmed)

    if (isConfirmed) {
      try {
        // 삭제작업
        await axios.delete(`/deleteCalendar/${eventData.seq}`);
        
        Swal.fire({
          icon: 'success',
          title: '일정이 삭제되었습니다.',
          confirmButtonText: '확인'
        });
  
        this.props.onClose();
      } catch (error) {
        console.error('서버 요청 실패', error);
      }
    }
  }
  handleColorPickerConfirm = () => {
    this.handleColorPickerClose(); // 팔레트를 닫습니다.
    this.setState({ // 선택한 색상 적용
      color: this.state.color
    })
  };


  handleFormSubmit = async (e) => {
    e.preventDefault();
    // 여기서 저장 또는 다른 작업 수행
    console.log('제목:', this.state.scheduleTitle);
    console.log('메모:', this.state.scheduleMemo);



    if(this.state.scheduleTitle.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: '제목을 입력해주세요.',
        confirmButtonText: '확인'
      })
    } else {
      try {


        const response = await axios.post("/Calendar", {
          scheduleTitle: this.state.scheduleTitle,
          scheduleMemo: this.state.scheduleMemo,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          userId: this.state.userId,
          color: this.state.color
        })
        console.log("결과 :", response.data)
        Swal.fire({
          icon: 'success',
          title: '일정이 추가되었습니다.',
          confirmButtonText: '확인'
        })
        this.props.onClose(); // 폼 제출 후 모달 닫기
      } catch (error) {
        console.error("서버 요청 실패", error)
      }
    }
   
  };

  render() {
    const { diff, eventData } = this.props;
    return (
      <div className="modal-overlay">
        <div className="modal-content">

      {this.props.diff === 'b' && ( // 빈 일정클릭 시 열리는 모달
            <>

            <form onSubmit={this.handleFormSubmit} className="form-container">
              <table className="form-table">
                <tbody>
                <input type="hidden" name="userId" value={this.state.userId} />
                  <tr>
                    <td className="label">날짜</td>
                    <td className="value">{this.state.startDate} - {this.state.endDate}</td>
                  </tr>
   
                  <tr>
                    <td className="label">제목:</td>
                    <td className="value">
                      <input
                        type="text"
                        value={this.state.scheduleTitle}
                        onChange={this.handleTitleChange}
                        className="input-field"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="label">메모:</td>
                    <td className="value">
                      <textarea
                        value={this.state.scheduleMemo}
                        onChange={this.handleMemoChange}
                        className="textarea-field"
                      />
                    </td>
                  </tr>
                  <tr>
                  <td colSpan="2">
                    <br/>
                  <div className='colorBtn'>
                  <button type="button" className="colorBtn" onClick={this.handleColorPickerOpen}>
                    색상 추가
                  </button>
                  <button type="submit" className="submit-button">일정 추가</button>
                  </div>                  
                  </td>
                  </tr>
                </tbody>
              </table>
            </form>
            </>   
          )}
      {this.state.displayColorPicker ? ( // displayColorPicker  상태가 'true'이면 랜더링 아니면 null
        <div className='color-picker-modal'>
          <div className="color-picker-cover" onClick={this.handleColorPickerClose} />
          <div className="color-picker-content">
            <SketchPicker color={this.state.color} onChange={this.handleColorChange} />
            <div className="color-preview" style={{ backgroundColor: this.state.color }}></div>
            <div className="color-picker-buttons">
              <button type="button" onClick={this.handleColorPickerConfirm}>확인</button>
              <span className="button-gap" />
              <button type="button" onClick={this.handleColorPickerClose}>취소</button>
            </div>
          </div>
        </div>
      ) : null}
{diff === 'c' && ( // 일정이있는 데이터 클릭했을 때 열리는 모달 
            <>

                <table className="form-table">
                  <tbody>
                    <tr>
                    <td className="label">날짜</td>
                    <td className="value">{eventData.start} - {eventData.end}</td>
                    </tr>
                    <tr>
                      <td className="label">제목:</td>
                      <td className="value">
                        {eventData.title}
                      </td>
                    </tr>
                    <tr>
                      <td className="label">메모:</td>
                      <td className="value">
                      <textarea
                        value={eventData.memo}
                        className="textarea-field"
                        readOnly
                      />
                    </td>
                    </tr>
                    {/* <tr>
                      <td className="label">사용자 ID:</td>
                      <td className="value">{eventData.userId}</td>
                    </tr> */}
                    <tr>
                      <td colSpan="2">
                        <div className='button_line'>
                        <button className='button-container' onClick={this.handleEdit}>수정</button>
                        <span className="button-gap" />
                        <button className='button-container' onClick={this.handleDelete}>삭제</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* 수정 모달 열기 */}
              
                {this.state.isEditModalOpen && ( // isEditModalOpen값이 true인 경우에만 EditModal 컴포넌트 랜더
                  <EditModal
                  onClose={() => {                              // 컴포넌트 상태를 업데이트하여 isEditModalOpend을 false로 설정하는 함수를 전달하고
                    this.setState({ isEditModalOpen: false });   // EditModal 컴포넌트를 랜더링하면서 'onClose' prop에는 현재 
                    this.props.onClose();                         // eventData prop에는 현재 일정 데이터를 전달합니다
                  }}                  
                  eventData={eventData}
                  displayColorPicker={this.state.displayColorPicker}
                  handleColorPickerOpen={this.handleColorPickerOpen}
                  handleColorPickerConfirm={this.handleColorPickerConfirm}
                  handleColorPickerClose={this.handleColorPickerClose}
                />                                                                                                                                                  
                )}
            </>
          )}
          <button className= "closeBtn" onClick={this.props.onClose}>모달 닫기</button>
        </div>
      </div>
    );
  }
}

export default CalendarModal;