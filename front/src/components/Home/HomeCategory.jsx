// Category.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../../css/HomeCategory.css"; // CSS 파일 불러오기

const Category = () => {
  const categories = [
    { id: "sport", title: "즐거운 운동" },
    { id: "life", title: "즐거운 라이프 스타일" },
    { id: "language", title: "즐거운 어학" },
    { id: "IT", title: "즐거운 코딩/IT" },
    { id: "tour", title: "즐거운 여행" },
    { id: "work", title: "즐거운 취업" },
  ];

  return (
    <div className="Body">
      <div className="Hy">
        {categories.map((category) => (
          <NavLink key={category.id} to={`/GroupJoin/${category.id}`} className="CardContainer">
            <div className="CardStyle">
              <img className="CardStyle-img" src={`/Image/homecategory/${category.id}.jpg`} alt="Card" />
              <div>
                <p className="CardStyle-p"></p>
                <h4 className="CardStyle-h4">{category.title}</h4>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Category;
