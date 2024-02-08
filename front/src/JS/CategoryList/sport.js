import React, { useState, useContext } from "react";
import list from "../../JS/images";
import Modal from "../../components/Modal"; // 모달 컴포넌트 import
import axios from "axios";
import Site from "../../components/GroupJoin/Site";
import { LoginContext } from "../../contexts/LoginContextProvider";



const SportGroup = ({ print, searchValue }) => {

  const { userInfo } = useContext(LoginContext);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
if(print === "sport"){
  return (
    <div className="group-container">
     {!searchValue &&<Site print={print}/>}
    </div>
      );
}else{
  return (
    <div className="group-container">
      {!searchValue &&<Site print={print}/>}
      {print && print.length > 0 &&
        print.map((c, index) => (
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
      <Modal isOpen={isModalOpen} handleClose={handleCloseModal} data={selectedData} handleApply={handleApply}/>
    </div>
  );
}
    
};

export default SportGroup;
