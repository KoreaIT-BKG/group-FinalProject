import React, { useState, useEffect, useContext } from "react";
import Select from "../components/Home/Select";
import Header from '../components/Header/header';
import Footer from "../components/Home/Footer";
import GroupCategory from "../components/GroupJoin/GroupCategory";
import ImageSlide from "../components/Home/ImageSlide";
import { useLocation, useParams } from "react-router-dom";
import GroupList from "../components/GroupJoin/GroupList";
import axios from "axios";
import { LoginContext } from "../contexts/LoginContextProvider";

const GroupJoin = () => {
  let { hsearch, hselected } = useParams();
  if(hsearch=="null"){
    hsearch=null;
  }
  if(hselected=="null"){
    hselected=null;
  }
  const { search, selected, categoryProps, category, groupprops } = useParams();
  const [searchValue, setSearchValue] = useState(search || hsearch);
  const [selectedValue, setSelectedValue] = useState(selected || hselected);
  const [categoryValue, setCategoryValue] = useState(categoryProps || category || selected || 'sport');
  const [groupValue, setGroupValue] = useState(groupprops);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { userInfo } = useContext(LoginContext);    // 로그인값 받는거(유저 번호, 권한)
  const token = localStorage.getItem('accessToken');
  const [serverData, setServerData]= useState(null);

  const handleSearch = (search, selected, category, group) => {
  
    setSearchValue(search);
    setSelectedValue(selected);
    setCategoryValue(category);
    if (group) {
      setGroupValue(group);
      setCategoryValue('sport')
    }
    setIsSelectOpen(true); // 검색 시 Select 컴포넌트 열기
    
  };


  const [print, setPrint] = useState();
    // fetchDataAndResetValues 함수 정의
    const fetchData = async () => {
      try {
        // axios를 사용하여 데이터 가져오기
        const response = await axios.post("/api/test", {
          groupValue, categoryValue, searchValue, selectedValue
        });
        // 데이터 출력
        if(response.data.length === 0){
          setPrint(categoryValue || selectedValue);
        }else{
          setPrint(response.data);
        }


      } catch (error) {
        console.log(error);
      }
    };
  useEffect(() => {
    // fetchDataAndResetValues 함수 실행
    fetchData();

  }, [searchValue, selectedValue, categoryValue, groupValue]);


  const fetchDataAndResetValues = () =>{
    fetchData();

    // 다음 로직 수행 후 상태값 초기화
    setSearchValue(null);
    setSelectedValue(null);
  }
  return (
    <>
      {/* header */}
      <Header />
      {/* End header */}
      {/* Main */}
      <ImageSlide />
      {/* onSearch 함수를 Select 컴포넌트로 전달 */}
      <Select onSearch={handleSearch} />
      <div style={{ marginTop: "40px" }} />
      {/* search와 selected 값을 GroupCategory로 전달 */}
      <GroupCategory onSearch={handleSearch}/>
      <GroupList print={print} searchValue={searchValue}/>
      {/* End Main */}
      {/* Footer */}
      <Footer />
      {/* End footer */}
    </>
  );
};
export default GroupJoin;
