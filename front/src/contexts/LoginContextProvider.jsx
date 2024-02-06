import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

const LoginContextProvider = ({ children }) => {
    // 로그인 여부, 로그아웃 함수
    const [isLogin, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState("");
    const navigate = useNavigate();
    // 토큰 만료 여부를 확인하는 함수
    const isTokenExpired = (token) => {
      const expirationDate = jwtDecode(token).exp;
      const currentTimestamp = Math.floor(new Date().getTime() / 1000);
      return expirationDate < currentTimestamp;
    };
  
    // 토큰을 체크하고 만료되었을 경우 로그아웃
    const checkTokenExpiration = async () => {
      const token = localStorage.getItem("accessToken");

      
      if (token) {
        setLogin(true);
  
        if (isTokenExpired(token)) {
          // 토큰이 만료되었을 경우
          setLogin(false);
          localStorage.removeItem("accessToken");
          setUserInfo(null);
          alert("로그아웃 되었습니다");

        } else {
          try {
            const response = await axios.post("/getIdRole", null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUserInfo(response.data || null);
            console.log(response.data.role);
            console.log(response.data.no);
            setUserInfo(response.data);
            console.log("왜 여기가 아노디?");
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      }
    };
  
    useEffect(() => {
      // 최초 실행
      checkTokenExpiration();

      // 주기적으로 실행 (예: 5분마다)
      const interval = setInterval(() => {
        checkTokenExpiration();
      }, 1 * 60 * 1000); // 5분마다 체크
  
      return () => {
        clearInterval(interval); // 컴포넌트 언마운트 시 interval 해제
      };
    }, [setLogin, setUserInfo]);
  
  const logout = () => {
    setLogin(false);
    localStorage.removeItem("accessToken");
    navigate("/")
  };

  return (
    <LoginContext.Provider value={{ isLogin, setLogin, logout, userInfo }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
