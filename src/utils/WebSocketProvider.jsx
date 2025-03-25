import React, { createContext, useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import Swal from "sweetalert2";
import * as EgovNet from "@/api/egovFetch";
import {getSessionItem} from "./storage.js";
import {getUserMsgTopList} from "../components/CommonComponents.jsx";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const sessionUserSn = getSessionItem("loginUser") == null ? null : getSessionItem("loginUser").userSn;
  const [socket, setSocket] = useState(null);  // WebSocket 상태
  const [isConnected, setIsConnected] = useState(false); // 연결 상태
  const [notification, setNotification] = useState([]);
  const [userMsgTopList, setUserMsgTopList] = useState([]);
  const connectWebSocket = () => {
    if (!sessionUserSn) return;

    let hostName = window.location.hostname;
    let apiPortUrl = ":" + import.meta.env.VITE_APP_API_PORT
    let apiUrl = ""
    if(hostName == "133.186.146.192"){
      hostName = "127.0.0.1"
      apiPortUrl = "/api"
    }


    const socketInstance = new SockJS(`${window.location.protocol}//${hostName}${apiPortUrl}/ws?userSn=${sessionUserSn}`);

    socketInstance.onopen = () => {
      console.log('WebSocket 연결됨');
      setIsConnected(true);
    };

    socketInstance.onclose = () => {
      setIsConnected(false);
      connectWebSocket();
    };

    socketInstance.onmessage = (e) => {
      setNotification(JSON.parse(e.data));
      getUserMsgTopList(sessionUserSn).then((data) => {
        setUserMsgTopList(data)
      })
      document.getElementById("alarmDot").style.display = "block"
    };

    setSocket(socketInstance);
  }

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []); // 컴포넌트가 마운트될 때만 실행

  useEffect(() => {
    if (sessionUserSn){
      getUserMsgTopList(sessionUserSn).then((data) => {
        setUserMsgTopList(data)
      })
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, notification, userMsgTopList, setUserMsgTopList,isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// WebSocketContext를 사용하는 커스텀 훅
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

/**
 *
 * @param sock
 * @param sendType = 발송타입 (all = 전체, private = 개인)
 * @param dsptchUserSn = 발신사용자일련번호
 * @param rcptnUserSn = 수신사용자일련번호(sendType 이 private 일때 필수
 * @param title = 제목
 * @param content = 내용
 */
export const sendMessageFn = (sock, sendType, dsptchUserSn, rcptnUserSns, msgTtl, msgCn) => {
  if (sock && sock.readyState === WebSocket.OPEN) {
    if(sendType == "private" && (rcptnUserSns == null || rcptnUserSns == "")){
      Swal.fire("수신자를 입력해주세요.");
      return;
    }

    sock.send(JSON.stringify({
      sendType,
      dsptchUserSn,
      rcptnUserSns,
      msgTtl,
      msgCn,
    }));

    // 메시지가 전송된 후 서버에서 응답을 받으면 알림 표시
    sock.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.status === "success") {
        Swal.fire("메시지가 전송되었습니다.");
      } else {
        Swal.fire("메시지 전송에 실패했습니다.");
      }
    };
  } else {
    console.log('WebSocket 연결이 열려 있지 않습니다.');
  }
};

