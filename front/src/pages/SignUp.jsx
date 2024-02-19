import React, { useState } from "react";
import Header from '../components/Header/header';
import Footer from "../components/Home/Footer";
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/SignUp.css";


const SignUp = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        id: "",
        pwd: "",
        cpwd: "",
        name: "",
        email: "",
        domain: "",
        phone: "",
        birth: "",
        age: "",
        bank: "",
        banknum: "",
    });

    const handlesubmit = async (e) => {
        e.preventDefault();  // 폼의 기본 동작을 막음
    
        if (user.pwd !== user.cpwd) {
            alert('비밀번호가 일치하지 않습니다');
            return;
        }

        if(!cid){
            alert('아이디 중복체크를 해주세요');
            return;
        }

        try {
            if (
                user.id.trim() === '' ||
                user.pwd.trim() === '' ||
                user.cpwd.trim() === '' ||
                user.name.trim() === '' ||
                user.email.trim() === '' ||
                user.domain.trim() === '' ||
                user.phone.trim() === '' ||
                user.birth.trim() === '' ||
                user.bank.trim() === '' ||
                user.banknum.trim() === ''
            ) {
                alert('모든 필드를 입력해주세요.');
                return;
            }
    
            const response = await axios.post('/register', user);
            console.log(user);
            console.log(response.data);
            alert("가입완료");
            navigate('/Login');
        } catch (error) {
            console.error('가입 실패:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        switch (name) {
            case 'email':
                if (name === 'email') {
                    setUser((preUser) => ({
                        ...preUser,
                        email: value,
                    }));
                } else if (name === 'domain') {
                    setUser((preUser) => ({
                        ...preUser,
                        domain: value,
                    }));
                }
                break;
            case 'phone':
                const phnum = value.replace(/\D/g, '');
                const phhypen = phonenum(phnum);
                setUser((preUser) => ({
                    ...preUser,
                    [name]: phhypen,
                }));
                break;
            case 'banknum':
                const banu = value.replace(/\D/g, '');
                setUser((preUser) => ({
                    ...preUser,
                    [name]: banu,
                }));
                break;
            case 'birth':
                const bnu = value.replace(/\D+/g, '');
                const age = Age(bnu);
                setUser((preUser) => ({
                    ...preUser,
                    [name]: value,
                    age: age
                }));
                break;
            default:
                setUser((preUser) => ({
                    ...preUser,
                    [name]: value,
                }));
                if (name === 'id') {
                    lenid(value);
                    setcid(false);
                }
                break;
        }
    };
    


    // 아이디 유효성 검사
    const [iid, setIid] = useState(false);
    const [cid, setcid] = useState(false);
    
    // 입력 가능한 글자 정하는 유효성
      const lenid = (id) => {
        const isValid = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(id);
        setIid(isValid);
      };

      const handleCheckId = async () => {
        console.log('handleCheckId 호출됨');
        try {
            const response = await axios.post('/checkId', { id: user.id });
            const isDuplicate = response.data.iddu;
    
            if (isDuplicate) {
                alert('이미 사용 중인 아이디입니다.');
                setIid(false);
                setUser((preUser) => ({
                    ...preUser,
                    id: '',
                }));
            } else {
                alert('사용 가능한 아이디입니다.');
                setcid(true);
            }
        } catch (error) {
            console.error('중복 체크 에러:', error);
        }
    };
    

//----------------------------------------------------------------

    // 비밀번호
    const [showpwd, setshowpwd] = useState(false);
    const showpass = () => {
        setshowpwd((showpassword) => !showpassword);
    }

//---------------------------------------------------------------

    // 이메일
    const domainChange = (e) => {
        const selectdomain = e.target.value;
        setUser((preUser) => ({
            ...preUser,
            domain: selectdomain === '직접입력' ? '' : selectdomain,
        }));
    };


//---------------------------------------------------------------

    // 전화번호
    const phonenum = (phnum) => {
        if (phnum.length < 4) {
          return phnum;
        } else if (phnum.length < 7) {
          return `${phnum.slice(0, 3)}-${phnum.slice(3)}`;
        } else {
          return `${phnum.slice(0, 3)}-${phnum.slice(3, 7)}${phnum.length > 7 ? `-${phnum.slice(7)}` : ''}`;
        }
      };

    //---------------------------------------------------------------

    // 나이 구하기
    const Age = (birth) => {
        const currentYear = new Date().getFullYear();
        const birthYear = parseInt(birth.substring(0,2),10) + 1900;
        return currentYear - birthYear + 1
    }
    
    return (
        <>
        <Header/>
        <div className="container">
            <h2>회원가입</h2>
            <p>회원이 되어 다양한 혜택을 경험해 보세요!!</p>
            <form onSubmit={handlesubmit}>
                <table className="fta">
                    <tbody>
                        <tr>
                            <td className="firtd">아이디</td>
                            <td className="firtd" style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    className="fin"
                                    type="text"
                                    id="id"
                                    name="id"
                                    value={user.id}
                                    onChange={handleChange}
                                    placeholder="영문과 숫자 최소 6글자"
                                />
                                {!cid && <button type="button" className="checkId" onClick={handleCheckId} disabled={!iid}>중복체크</button>}
                            </td>
                        </tr>
                        <tr>
                            <td className="firtd">비밀번호</td>
                            <td className="firtd" style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    className="fin"
                                    type={showpwd ? 'text' : 'password'}
                                    id="pwd"
                                    name="pwd"
                                    value={user.pwd}
                                    onChange={handleChange}
                                />
                                <button className="checkId" type="button" onClick={showpass}>
                                    {showpwd ? 'hide' : 'show'}
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="firtd">비밀번호 확인</td>
                            <td className="firtd" style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    className="fin"
                                    type={showpwd ? 'text' : 'password'}
                                    id="cpwd"
                                    name="cpwd"
                                    value={user.cpwd}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="firtd">이름</td>
                            <td className="firtd">
                                <input
                                    className="fin"
                                    type='text'
                                    id="name"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="firtd">이메일</td>
                            <td className="firtd">
                                <input
                                    className="fin"
                                    type='text'
                                    id="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                />@
                                <input
                                    className="fin"
                                    type='text'
                                    id="domain"
                                    name="domain"
                                    value={user.domain}
                                    onChange={handleChange}
                                    placeholder="직접입력"
                                />
                                <select className="fse" name="domain" onChange={domainChange}>
                                    <option>직접입력</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="google.com">google.com</option>
                                    <option value="daum.net">daum.net</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="firtd">전화번호</td>
                            <td className="firtd">
                                <input
                                    className="fin"
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={user.phone}
                                    onChange={handleChange}
                                    maxLength={13}
                                    placeholder="- 제외"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="firtd">생년월일</td>
                            <td className="firtd">
                                <input 
                                    className="fin" 
                                    type="text" 
                                    name="birth"
                                    maxLength={6} 
                                    placeholder="ex) 990101"
                                    value={user.birth}
                                    onChange={handleChange}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td className="firtd">계좌번호</td>
                            <td className="firtd">
                                <select className="fse"
                                        name="bank"
                                        value={user.bank}
                                        onChange={handleChange}
                                        >
                                    <option value="" disabled hidden>은행</option>
                                    <option value="한국은행">한국은행</option>
                                    <option value="KB국민은행">KB국민은행</option>
                                    <option value="우리은행">우리은행</option>
                                    <option value="하나은행">하나은행</option>
                                    <option value="SC은행">SC은행</option>
                                    <option value="한국씨티은행">한국씨티은행</option>
                                    <option value="케이뱅크">케이뱅크</option>
                                    <option value="카카오뱅크">카카오뱅크</option>
                                    <option value="토스뱅크">토스뱅크</option>
                                    <option value="농협은행">농협은행</option>
                                    <option value="대구은행">대구은행</option>
                                    <option value="부산은행">부산은행</option>
                                    <option value="경남은행">경남은행</option>
                                    <option value="전북은행">전북은행</option>
                                    <option value="제주은행">제주은행</option>
                                    <option value="새마을금고">새마을금고</option>
                                </select>
                                <input
                                    className="fin"
                                    type='text'
                                    id="banknum"
                                    name="banknum"
                                    value={user.banknum}
                                    maxLength={14}
                                    onChange={handleChange}
                                    placeholder="- 제외"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
				 <button className="submit" type="submit" onClick={handlesubmit}>가입하기</button>
            </form>
            </div>
        <Footer/>
        </>
    );
};

export default SignUp;
