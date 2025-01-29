import React, {useEffect, useRef, useState} from "react";
import SockJS from "sockjs-client";
import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavTemplates";

const WebSocketNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const sock = new SockJS("http://localhost:8080/ws");
  const userSnRef = useRef("");
  const titleRef = useRef("");
  const contentRef = useRef("");
  const privateTitleRef = useRef("");
  const privateContentRef = useRef("");
  const sendMessageFn = (sendType) => {
    sock.send(JSON.stringify({
      sendType : sendType,
      userSn : userSnRef.current.value,
      title : sendType == "all" ? titleRef.current.value : privateTitleRef.current.value,
      content : sendType == "all" ? contentRef.current.value : privateContentRef.current.value
    }));
  }

  sock.addEventListener("message", e => {
    const notification = JSON.parse(e.data);
    setNotifications((prev) => [...prev, notification]);
  });

  return (
      <div className="container">
        <div className="c_wrap">
          <div className="layout">
            {/* <!-- Navigation --> */}
            <EgovLeftNav />
            {/* <!--// Navigation --> */}

            <h1>WebSocket 알림</h1>
            <div>
              <input
                  type="text"
                  style={{border: "1px solid black"}}
                  id="title"
                  ref={titleRef}
                  onChange={(e) => {
                    titleRef.current.value = e.target.value;
                  }}
              />
              <input
                  type="text"
                  style={{border: "1px solid black"}}
                  id="content"
                  ref={contentRef}
                  onChange={(e) => {
                    contentRef.current.value = e.target.value;
                  }}
              />
              <button
                  onClick={() => sendMessageFn("all")}
                  style={{border: "1px solid black"}}>
                전체알림 보내기
              </button>
            </div>
            <div>
              <input
                  type="text"
                  style={{border: "1px solid black"}}
                  id="userSn"
                  ref={userSnRef}
                  onChange={(e) => {
                    userSnRef.current.value = e.target.value;
                  }}
              />
              <input
                  type="text"
                  style={{border: "1px solid black"}}
                  id="title"
                  ref={privateTitleRef}
                  onChange={(e) => {
                    privateTitleRef.current.value = e.target.value;
                  }}
              />
              <input
                  type="text"
                  style={{border : "1px solid black"}}
                  id="content"
                  ref={privateContentRef}
                  onChange={(e) => {
                    privateContentRef.current.value = e.target.value;
                  }}
              />

              <button
                  onClick={() => sendMessageFn("private")}
                  style={{border: "1px solid black"}}>
                개인알림 보내기
              </button>
            </div>
            <h2>Notifications:</h2>
            <ul>
              {notifications.map((notification, index) => (
                  <li key={index}>
                    <strong>{notification.title}</strong>: {notification.content}
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default WebSocketNotification;
