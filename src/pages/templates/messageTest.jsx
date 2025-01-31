import React, {useEffect, useRef, useState} from "react";
import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavTemplates";
import {useWebSocket, sendMessageFn} from "../../utils/WebSocketProvider.jsx";
const WebSocketNotification = () => {
    const { socket, isConnected } = useWebSocket();
    const userSnRef = useRef("");
    const titleRef = useRef("");
    const contentRef = useRef("");
    const privateTitleRef = useRef("");
    const privateContentRef = useRef("");

    const sendNotification = (sendType) => {
        if (isConnected) {
            sendMessageFn(
                socket,
                sendType,
                userSnRef.current.value,
                privateTitleRef.current.value,
                privateContentRef.current.value
            );  // 연결된 상태에서만 메시지 전송
        } else {
            console.log("WebSocket 연결이 열려 있지 않습니다.");
        }
    };


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
                  onClick={() =>  sendNotification("all")}
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
                  onClick={() => sendNotification("private")}
                  style={{border: "1px solid black"}}>
                개인알림 보내기
              </button>
            </div>
            <h2>Notifications:</h2>
          </div>
        </div>
      </div>
  );
};

export default WebSocketNotification;
