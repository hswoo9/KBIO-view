import React, { createContext, useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);  // WebSocket 상태
  const [isConnected, setIsConnected] = useState(false); // 연결 상태
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // WebSocket 객체 생성
    const socketInstance = new SockJS(`http://${window.location.hostname}:8080/ws`);

    // WebSocket 연결이 열리면 상태 업데이트
    socketInstance.onopen = () => {
      console.log('WebSocket 연결됨');
      setIsConnected(true);
    };

    // WebSocket 연결 종료 시 상태 업데이트
    socketInstance.onclose = () => {
      console.log('WebSocket 연결 종료됨');
      setIsConnected(false);
    };

    // WebSocket에서 메시지가 도착하면 notifications 상태 업데이트
    socketInstance.onmessage = (e) => {
      const notification = JSON.parse(e.data);
      setNotifications((prev) => [...prev, notification]);
      alert(
          "알림왔습니다.\n" +
          "제목 : " +
          notification.title +
          "\n" +
          "내용 : " +
          notification.content
      );
    };

    // socket 상태 설정
    setSocket(socketInstance);

    // Cleanup: 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      if (socketInstance) {
        socketInstance.close();
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

export const sendMessageFn = (sock, sendType, userSn, title, content) => {
  if (sock && sock.readyState === WebSocket.OPEN) {
    sock.send(JSON.stringify({
      sendType,
      userSn,
      title,
      content
    }));
  } else {
    console.log('WebSocket 연결이 열려 있지 않습니다.');
  }
};
