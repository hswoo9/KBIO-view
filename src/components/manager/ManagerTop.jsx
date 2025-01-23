import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback, useRef } from "react";
import * as EgovNet from "@/api/egovFetch";

import URL from "@/constants/url";
import CODE from "@/constants/code";

import { getSessionItem, setSessionItem } from "@/utils/storage";
import Swal from "sweetalert2";

function ManagerTop() {
  const location = useLocation();
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;


  const navigate = useNavigate();

  const logInHandler = () => {
    navigate(URL.MANAGER_LOGIN);
  };
  const logOutHandler = () => {
    // 로그인 정보 존재할 때
    const logOutUrl = "/loginApi/logoutAction";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body : JSON.stringify({userSn : sessionUserSn})
    };

    EgovNet.requestFetch(logOutUrl, requestOptions, function (resp) {
      if(resp.resultCode == "200"){
        setSessionItem("loginUser", { userSn: "" });
        setSessionItem("jToken", null);
        Swal.fire("로그아웃되었습니다!");
        navigate(URL.MANAGER_LOGIN);
      }
    });
  };

  useEffect(() => {
    if(location.pathname.split("/")[1] === "manager"){
      import('../../css/manager/admin.css');

      const fileName = "user.css";
      const styleTags = document.querySelectorAll("style");
      styleTags.forEach((style) => {
        const devId = style.getAttribute("data-vite-dev-id");
        if(devId != null){
          if(devId.includes(fileName)){
            style.remove();
          }
        }

      });
    }
  }, [location.pathname]);


  //자동 로그아웃
  const logoutTimer = useRef(null);
  const idleTimeLimit = 30 * 60 * 1000;

  const resetTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    // 일정 시간이 지나면 로그아웃 처리
    logoutTimer.current = setTimeout(() => {
      handleLogout();
    }, idleTimeLimit);
  };

  const handleLogout = () => {
    Swal.fire('30분 이상 액션이 없어<br/>자동 로그아웃 처리됩니다.');
    navigate("/");
  };

  useEffect(() => {
    // 이벤트 리스너 추가
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer) );
    // 초기 타이머 설정
    resetTimer();

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 및 타이머 초기화
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, []);

  return (
      <div className="commonTop" id="commonTop">
        <div className="lnbBox">
          <div className="bg hover"></div>
          <div className="bg active"></div>
          <ul className="dep">
            <li>
              <a
                 onClick={() => {
                   navigate({pathname: URL.MANAGER_OPERATIONAL_SUPPORT}, {state: {selectMenuNm: "운영지원"}});
                 }}
                 className="cursorClass"
              ><p>운영지원</p>
              </a>
            </li>
            <li>
              <a
                 onClick={() => {
                   navigate({pathname: URL.MANAGER_CONSULTING_EXPERT}, {state: {selectMenuNm: "컨설팅지원"}});
                 }}
                 className="cursorClass"
              ><p>컨설팅지원</p>
              </a>
            </li>
            <li>
              <a
                 onClick={() => {
                   navigate({pathname: URL.MANAGER_NORMAL_MEMBER}, {state: {selectMenuNm: "회원"}});
                 }}
                 className="cursorClass"
              ><p>회원</p>
              </a>
            </li>
            <li>
              <a
                 onClick={() => {
                   navigate({pathname: URL.MANAGER_HOMEPAGE_MAIN_VIEW}, {state: {selectMenuNm: "홈페이지"}});
                 }}
                 className="cursorClass"
              ><p>홈페이지</p>
              </a>
            </li>
            {/*
            게시글 관리로 쓰면 될듯
            <li>
              <a
                 onClick={() => {
                   navigate({pathname: URL.MANAGER_COMMUNITY}, {state: {selectMenuNm: "커뮤니티"}});
                 }}
                 className="cursorClass"
              ><p>커뮤니티</p>
              </a>
            </li>*/}
            <li>
              <a
                 onClick={() => {
                   navigate({pathname: URL.MANAGER_CMS}, {state: {selectMenuNm: "통계"}});
                 }}
                 className="cursorClass"
              ><p>통계</p>
              </a>
            </li>
            <li className="active">
              <a
                 onClick={() => {
                   navigate({pathname: URL.MANAGER_CMS}, {state: {selectMenuNm: "CMS"}});
                 }}
                 className="cursorClass"
              >
                <p>CMS</p>
              </a>
            </li>
          </ul>
        </div>
        <div className="rightBox">
          <p className="tt1">{sessionUserName}님, 안녕하세요</p>
          <button type="button" className="logoutBtn" onClick={logOutHandler}><span>로그아웃</span>
            <div className="icon"></div>
          </button>
        </div>
      </div>
  );
  
}

export default ManagerTop;
