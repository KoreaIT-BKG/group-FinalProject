
import { useState } from "react";
import "../../css/GroupCategory.css";
import GroupList from "./GroupList";

const GroupCategory = ({ onSearch }) => {
  const [group, setGroup] = useState("무료"); // group 값을 상태로 관리
  const [selectedCategory, setSelectedCategory] = useState("sport"); // 선택된 카테고리를 상태로 관리

  const handleGroup = (selectedGroup) => {
    setGroup(selectedGroup); // 클릭된 그룹으로 상태 업데이트
    setSelectedCategory("sport"); // 그룹이 변경될 때 선택된 카테고리 초기화
    onSearch(null, null, null, selectedGroup);
  };

  const handleCategory = (category) => {
    setSelectedCategory(category); // 선택된 카테고리로 상태 업데이트
    onSearch(null, null, category);
  };

  return (
    <>
      <div className="Group">
      <div
          className={"Group-div" + (group === "무료" ? " selected" : "")}
          onClick={() => handleGroup("무료")}
          style={{ marginLeft: "20%" }}
        >
          무료모임
        </div>
        <div
          className={"Group-div" + (group === "유료" ? " selected" : "")}
          onClick={() => handleGroup("유료")}
          style={{ marginRight: "20%" }}
        >
          유료모임
        </div>
      </div>
      <div className="category">
        <div
          className={"category-div" + (selectedCategory === "sport" ? " selected" : "")}
          onClick={() => handleCategory("sport")}
        >
          운동
        </div>
        <div
          className={"category-div" + (selectedCategory === "life" ? " selected" : "")}
          onClick={() => handleCategory("life")}
        >
          라이프스타일
        </div>
        <div
          className={"category-div" + (selectedCategory === "language" ? " selected" : "")}
          onClick={() => handleCategory("language")}
        >
          어학
        </div>
        <div
          className={"category-div" + (selectedCategory === "IT" ? " selected" : "")}
          onClick={() => handleCategory("IT")}
        >
          코딩/IT
        </div>
        <div
          className={"category-div" + (selectedCategory === "tour" ? " selected" : "")}
          onClick={() => handleCategory("tour")}
        >
          여행
        </div>
        <div
          className={"category-div" + (selectedCategory === "work" ? " selected" : "")}
          onClick={() => handleCategory("work")}
        >
          취업
        </div>
      </div>

      <GroupList />
    </>
  );
};

export default GroupCategory;
