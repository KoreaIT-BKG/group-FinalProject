import React, { useCallback, useRef, useState, useEffect, useContext } from "react";
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import "../css/Chat.css";
import { LoginContext } from "../contexts/LoginContextProvider";
import Header from "../components/Header/header";
import Footer from "../components/Home/Footer";
import axios from "axios";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

const Chat = () => {
    const { userInfo } = useContext(LoginContext);
    const [user, setUser] = useState("");
    const [message, setMessage] = useState("");
    const [chatt, setChatt] = useState([]);
    const [chkLog, setChkLog] = useState(false);
    const [groupnum, setGroupnum] = useState("");
    const [title, setTitle] = useState("");

    const ws = useRef("");
    const chatEndRef = useRef("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if(token){
            setChkLog(true);
        }
        // WebSocket 연결 설정
        ws.current = new WebSocket("ws://localhost:8080/chatt");

        // WebSocket 메시지 수신 처리
        ws.current.onmessage = (message) => {
            const dataSet = JSON.parse(message.data);
            setChatt(prevChatt => [...prevChatt, dataSet]);
        };
        
        // 컴포넌트 언마운트 시 WebSocket 연결 종료
        return () => {
            ws.current.close();
        };
    }, []);

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

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const groupnumber = urlParams.get('groupnum');
        const Title = urlParams.get('title');
        setTitle(Title);
        setGroupnum(groupnumber);
        const fetchData = async() => {
            try {
                const chatMessages = await axios.post("/chatMessages",{ title: Title });
                setChatt(chatMessages.data); // 채팅 메시지 상태에 저장
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    },[]);

    const GlobalStyle = createGlobalStyle`
        ${reset}
    `;

    const onText = event => {
        setMessage(event.target.value);
    };

    const send = () => {
        if (!chkLog) {
            alert("로그인 정보를 가져올 수 없습니다.");
            return;
        }

        if (message.trim() !== '') {
            const data = {
                id: user.id,
                name: user.name,
                title: title,
                message,
                groupnum,
                chatdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            axios.post('/sendChatMessage', data)
            .then(response => {
                console.log('전송', response);
            })
            .catch(error => {
                console.log('실패', error);
            });
            const temp = JSON.stringify(data);

            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(temp);
            }
        } else {
            alert("메세지를 입력하세요");
            document.getElementById("msg").focus();
        }
        setMessage("");
    };

    const sendButtonDisabled = !chkLog || message.trim() === ''; // 전송 버튼 비활성화 여부

    useEffect(() => {
        // 맨 아래로 스크롤 이동
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatt]);

    const msgBox = chatt.map((item, idx) => (
        <li key={idx} className={item.name === user.name ? 'd-flex flex-row-reverse align-items-end my-3' : 'd-flex flex-row align-items-end my-3'}>
            {item.name !== user.name && <span className="chat-name">{item.name}</span>}
            <span className={item.name === user.name ? "chat-box me-1" : "chat-box other-1"}>{item.message}</span>
            <span className="tx-small">{item.chatdate}</span> {/* 채팅 메시지의 시간을 표시하는 부분 */}
        </li>
    ));

    return (
        <>
            <Header/>
            <GlobalStyle />
            <div id="chat-wrap">
                <div id='chatt' className="chatt">
                    <h3 id="title" className="title">{title}</h3>
                    <div id='talk' className="talk">
                        <div className='talk-shadow'></div>
                        <ul className="msg-list">
                            {msgBox}
                            <div ref={chatEndRef}></div> {/* 채팅 화면의 맨 아래를 가리키는 참조 */}
                        </ul>
                    </div>
                    <div id='sendZone' className="send-zone">
                        <textarea id='msg' value={message} onChange={onText} onKeyDown={(ev) => { if (ev.keyCode === 13) { send(); } }} className="msg-textarea"></textarea>
                        <button onClick={send} disabled={sendButtonDisabled} className="send-button">전송</button>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Chat;
