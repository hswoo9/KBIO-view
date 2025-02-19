import React, { createContext, useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import Swal from "sweetalert2";
import * as EgovNet from "@/api/egovFetch";
import {getSessionItem} from "./storage.js";
import {getUserMsgList} from "../components/CommonComponents.jsx";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const sessionUserSn = getSessionItem("loginUser") == null ? null : getSessionItem("loginUser").userSn;
  const [socket, setSocket] = useState(null);  // WebSocket 상태
  const [isConnected, setIsConnected] = useState(false); // 연결 상태
  const [notification, setNotification] = useState([]);
  const [userMsgList, setUserMsgList] = useState([]);
  const connectWebSocket = () => {
    if (!sessionUserSn) return;

    const socketInstance = new SockJS(`${window.location.protocol}//${window.location.hostname}:8080/ws?userSn=${sessionUserSn}`);

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
      getUserMsgList(sessionUserSn).then((data) => {
        setUserMsgList(data)
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
      getUserMsgList(sessionUserSn).then((data) => {
        setUserMsgList(data)
      })
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, notification, userMsgList, setUserMsgList,isConnected }}>
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
export const sendMessageFn = (sock, sendType, dsptchUserSn, rcptnUserSn, msgTtl, msgCn) => {
  if (sock && sock.readyState === WebSocket.OPEN) {
    if(sendType == "private" && (rcptnUserSn == null || rcptnUserSn == "")){
      Swal.fire("수신자를 입력해주세요.");
      return;
    }

    sock.send(JSON.stringify({
      sendType,
      dsptchUserSn,
      rcptnUserSn,
      msgTtl,
      msgCn,
    }));
  } else {
    console.log('WebSocket 연결이 열려 있지 않습니다.');
  }
};

