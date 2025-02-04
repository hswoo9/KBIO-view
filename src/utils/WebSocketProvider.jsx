import React, { createContext, useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import Swal from "sweetalert2";
import {getSessionItem} from "./storage.js";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const sessionUser = getSessionItem("loginUser");
  const [socket, setSocket] = useState(null);  // WebSocket 상태
  const [isConnected, setIsConnected] = useState(false); // 연결 상태
  const [notifications, setNotifications] = useState([]);
  const connectWebSocket = () => {
    if (!sessionUser.userSn) return;

    const socketInstance = new SockJS(`${window.location.protocol}//${window.location.hostname}:8080/ws?userSn=${sessionUser?.userSn}`);

    socketInstance.onopen = () => {
      console.log('WebSocket 연결됨');
      setIsConnected(true);
    };

    socketInstance.onclose = () => {
      setIsConnected(false);
      connectWebSocket();
    };

    socketInstance.onmessage = (e) => {
      const notification = JSON.parse(e.data);
      setNotifications((prev) => [...prev, notification]);
      alert(
          "알림왔습니다.\n" +
          "제목 : " +
          notification.msgTtl +
          "\n" +
          "내용 : " +
          notification.msgCn
      );
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

  return (
      <WebSocketContext.Provider value={{ socket, notifications, isConnected }}>
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
