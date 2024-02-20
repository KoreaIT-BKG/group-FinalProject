import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header/header";
import Footer from "../components/Home/Footer";
import { LoginContext } from "../contexts/LoginContextProvider";
import "../css/SignUp.css";

const Userdata = () => {
  const { userInfo } = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const [pwdModal, setPwdModal] = useState(false);
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/userdata", { seq: userInfo.seq });
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userInfo]);

  const handleOpenModal = () => {
    setPwdModal(true);
  };

  const handleCloseModal = (e) => {
    if (!e.target.closest('.modal-content')) {
      setPwdModal(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/checkpassword", { id: user.id, pwd });
      if (response.data === "success") {
        window.location.href = "/UserUpdate";
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <Header />
      <div className="container">
        <h1>회원정보</h1>
        <form>
          <table className="fta">
            <tbody>
              <tr>
                <td className="firtd">아이디</td>
                <td className="firtd" style={{ display: "flex", alignItems: "center" }}>
                  <input className="fin" type="text" id="id" name="id" value={user ? user.id : ""} readOnly />
                </td>
              </tr>
              <tr>
                <td className="firtd">이름</td>
                <td className="firtd">
                  <input className="fin" type="text" id="name" name="name" value={user ? user.name : ""} readOnly />
                </td>
              </tr>
              <tr>
                <td className="firtd">이메일</td>
                <td className="firtd">
                  <input
                    className="fin"
                    type="text"
                    id="email"
                    name="email"
                    value={user ? `${user.email}@${user.domain}` : ""}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td className="firtd">전화번호</td>
                <td className="firtd">
                  <input className="fin" type="text" id="phone" name="phone" value={user ? user.phone : ""} readOnly />
                </td>
              </tr>
              <tr>
                <td className="firtd">생년월일</td>
                <td className="firtd">
                  <input className="fin" type="text" id="birth" name="birth" value={user ? user.birth : ""} readOnly />
                </td>
              </tr>
              <tr>
                <td className="firtd">계좌번호</td>
                <td className="firtd">
                  <input className="fse" name="bank" value={user ? user.bank : ""} readOnly />
                  <input className="fin" type="text" id="banknum" name="banknum" value={user ? user.banknum : ""} readOnly />
                </td>
              </tr>
              <tr>
                <td className="firtd">점수</td>
                <td className="firtd">
                  <input className="fse" name="evp" value={user ? user.evp : ""} readOnly />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <br/>
                <button className="submit" onClick={handleOpenModal}>수정하기</button>
                <div className="br"></div>
        {/* 모달 */}
        {pwdModal && (
          <div className="modal" onClick={handleCloseModal}>
            <div className="modal-content">
              <h2>비밀번호 확인</h2>
              <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
              <button onClick={handleSubmit}>확인</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Userdata;
