
import React, { useEffect } from "react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../contexts/LoginContextProvider";
import "../../css/Calendar.css";

const Payment = () => {
  const getRandomString = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 10; // 문자열 길이 지정
    return Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join(""); // length만큼의 길이를 가진 배열을 생성
  }; // 0 이상 1 미만의 난수를 생성하여 characters.length와 곱하여 소수점을 버림으로써 characters 문자열중에서 랜던 인덱스 번호를 얻는다
  // join("") - 생성된 배열을 문자열로 결합

  const navigate = useNavigate();
  const { userInfo } = useContext(LoginContext);

  const location = useLocation();
  const selectedData = location.state.selectedData;
  console.log(selectedData);
  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    // const tossScript = document.createElement("script");
    // tossScript.src = "https://cdn.iamport.kr/v1/iamport.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    // document.head.appendChild(tossScript);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
      // document.head.removeChild(tossScript);
    };
  }, []);

  const onClickPayment = (props) => {
    const { IMP } = window;
    IMP.init("imp70842813");
    let data = {};
    if (props === "카드") {
      data = {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: `mid_${getRandomString()}_${new Date().getTime()}`,
        name: "모임비",
        amount: "5000",
        custom_data: {
          name: "부가정보",
          desc: "세부 부가정보",
        },
        buyer_name: "홍길동",
        buyer_tel: "01012345678",
        buyer_email: "14279625@gmail.com",
        buyer_addr: "구천면로 000-00",
        buyer_postalcode: "01234",
      };
    } else if (props === "휴대폰") {
      data = {
        pg: "html5_inicis",
        pay_method: "phone",
        merchant_uid: `mid_${getRandomString()}_${new Date().getTime()}`,
        name: "모임비",
        amount: "5000",
        custom_data: {
          name: "부가정보",
          
          desc: "세부 부가정보",
        },
        buyer_name: "홍길동",
        buyer_tel: "01012345678",
        buyer_email: "14279625@gmail.com",
        buyer_addr: "구천면로 000-00",
        buyer_postalcode: "01234",
      };
    } else if (props === "카카오") {
      data = {
        pg: "kakaopay.TC0ONETIME",
        merchant_uid: `mid_${getRandomString()}_${new Date().getTime()}`, // 상점에서 생성한 고유 주문번호
        name: "모임비",
        amount: 5000,
        buyer_email: "test@portone.io",
        buyer_name: "구매자이름",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시 강남구 삼성동",
        buyer_postcode: "123-456",
        m_redirect_url: "{모바일에서 결제 완료 후 리디렉션 될 URL}",
      };
    } else if (props === "토스") {
      data = {
        pg: "uplus.tlgdacomxpay",
        pay_method: "trans",
        merchant_uid: `mid_${getRandomString()}_${new Date().getTime()}`, //상점에서 생성한 고유 주문번호
        name: "주문명:결제테스트",
        amount: 5000,
        buyer_email: "test@portone.io",
        buyer_name: "구매자이름",
        buyer_tel: "010-2471-6134",
        buyer_addr: "서울특별시 강남구 삼성동",
        buyer_postcode: "123-456",
        m_redirect_url: "{모바일에서 결제 완료 후 리디렉션 될 URL}",
        appCard: true, // 설정시 신용카드 결제모듈에서 앱카드 결제만 활성화됩니다.
      };
    }

    IMP.request_pay(data, callback);
  };

  const callback = async (response) => {
    console.log(response);
    const {
      success,
      error_msg,
      imp_uid,
      merchant_uid,
      pay_method,
      paid_amount,
      status,
      resultCode,
    } = response;
    if (success || status === "paid" || resultCode === "SUCCESS") {
      try {
        const response = await axios.post("/api/contentpay", selectedData, {
          params: {
            seq: userInfo.seq,
          },
        });
        alert("신청 완료");
        navigate("/schedule");
      } catch (error) {}
    } else {
      console.log("결제 실패 : ", imp_uid, merchant_uid, status);
      alert(`결제 실패: ${error_msg}`);
      navigate("/GroupJoin");
    }
  };

  return (
    <>
      <div className="payment-modaloverlay">
        <div className="payment-container">
          <div className="payment-buttons-row">
            <div className="payment-button-container">
            <label className="payment-label">카드</label>
            <button
              className="payment-button"
              onClick={() => onClickPayment("카드")}
            >
              <img className="logo-image" src="kg_inicis.jpg" alt="Card Logo" />
            </button>
            </div>
            <div className="payment-button-container">
            <label>휴대폰</label>
            <button
              className="payment-button"
              onClick={() => onClickPayment("휴대폰")}
            >
              <img
                className="logo-image"
                src="kg_inicis.jpg"
                alt="Phone Logo"
              />
            </button>
            </div>
          </div>

          <div className="payment-buttons-row">
          <div className="payment-button-container">
            <label>카카오페이</label>
            <button
              className="payment-button"
              onClick={() => onClickPayment("카카오")}
            >
              <img className="logo-image" src="kakaopay.jpg" alt="Kakao Logo" />
            </button>
            </div>
            <div className="payment-button-container">
            <label>토스(계좌)</label>
            <button
              className="payment-button"
              onClick={() => onClickPayment("토스")}
            >
              <img className="logo-image" src="toss.jpg" alt="Toss Logo" />
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Payment;