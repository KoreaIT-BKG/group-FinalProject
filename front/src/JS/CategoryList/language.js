import React, { useState } from "react";
import list from "../../JS/images";
import Modal from "../../components/Modal"; // 모달 컴포넌트 import

const LanguageGroup = ({ print }) => {

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

  const getImageByCategory = (category) => {
    const images = list[category] || [];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };


  return (
    <div className="group-container">
      {print &&
        print.map((c, index) => (
          <div key={index} className="group-item">
            <div onClick={() => handleSeq(c)}>
              <img
                className="group-item-img"
                src={getImageByCategory(c.category)}
                alt="Card"
              />
              <h4 className="group-item-h4">{c.category}</h4>
              <h4 className="group-item-h4">{c.title}</h4>
            </div>
          </div>
        ))}
              {/* 모달 컴포넌트를 사용하여 모달을 렌더링 */}
      <Modal isOpen={isModalOpen} handleClose={handleCloseModal} data={selectedData}/>
    </div>
  );
};

export default LanguageGroup;