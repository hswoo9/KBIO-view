import React, {useEffect, useRef, useState} from "react";
import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavTemplates";
import {useWebSocket, sendMessageFn} from "@/utils/WebSocketProvider";
import {getSessionItem} from "@/utils/storage";
import {fileUpload} from "@/components/CommonComponents";

const WebSocketNotification = () => {
    const sessionUser = getSessionItem("loginUser");
    const { socket, isConnected } = useWebSocket();
    const userSnRef = useRef("");
    const privateTitleRef = useRef("");
    const privateContentRef = useRef("");

    const [dataList, setDataList] = useState([]);
    const fileInputRef = useRef(null); // 파일 입력을 위한 ref 생성



    const sendNotification = (sendType) => {
        if (isConnected) {
            sendMessageFn(
                socket,
                sendType,
                sessionUser.userSn,
                Number(userSnRef.current.value),
                privateTitleRef.current.value,
                privateContentRef.current.value,
            );  // 연결된 상태에서만 메시지 전송
        } else {
            console.log("WebSocket 연결이 열려 있지 않습니다.");
        }
    };

    const excelUpload = () => {
        fileUpload(fileInputRef.current.files[0]).then((data) => {
            setDataList(data)
        });
    }

  return (
      <div className="container">
          <div className="c_wrap">
              <div className="layout">
                  {/* <!-- Navigation --> */}
                  <EgovLeftNav/>
                  {/* <!--// Navigation --> */}

                  <h1>엑셀 데이터 추출</h1>

                  <div>
                      <input type="file" accept=".xlsx, .xls" ref={fileInputRef}/>
                      <button onClick={() => {excelUpload()}}>업로드</button>
                      <h3>엑셀 데이터 목록</h3>
                      <ul>
                          {dataList.map((item, index) => (
                              <li key={index}>
                                  {index == 0 && ("[")}
                                  {JSON.stringify(item)}
                                  {index != dataList.length-1 ? "," : "]"}
                              </li>
                          ))}
                      </ul>
                  </div>

                  <h1>WebSocket 알림</h1>
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
                          style={{border: "1px solid black"}}
                          id="content"
                          ref={privateContentRef}
                          onChange={(e) => {
                              privateContentRef.current.value = e.target.value;
                          }}
                      />
                      <button
                          onClick={() => sendNotification("all")}
                          style={{border: "1px solid black"}}>
                          전체알림 보내기
                      </button>
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
