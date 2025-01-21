import { Link, NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";

import * as EgovNet from "@/api/egovFetch";

import URL from "@/constants/url";
import CODE from "@/constants/code";

import { getSessionItem, setSessionItem } from "@/utils/storage";
import Swal from 'sweetalert2';

import '@/css/manager/aos.css';
import '@/css/manager/page.css';
import '@/css/manager/pretendard.css';
import '@/css/manager/reset.css';
import '@/css/manager/Rubik.css';
import '@/css/manager/swiper-bundle.min.css';
import '@/css/manager/user.css';

import userJs from "@/js/userCustom";

import logoWhite from "@/assets/images/logo_white.svg";

function EgovHeader() {
  console.group("EgovHeader");
  console.log("[Start] EgovHeader ------------------------------");

  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;


  const navigate = useNavigate();

  const logInHandler = () => {
    // 로그인 정보 없을 시
    navigate(URL.LOGIN);
    // PC와 Mobile 열린메뉴 닫기
    document.querySelector(".all_menu.WEB").classList.add("closed");
    document.querySelector(".btnAllMenu").classList.remove("active");
    document.querySelector(".btnAllMenu").title = "전체메뉴 닫힘";
    document.querySelector(".all_menu.Mobile").classList.add("closed");
  };
  const logOutHandler = () => {
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
        navigate(URL.MAIN);
      }
    });
  };

  console.log("------------------------------EgovHeader [End]");
  console.groupEnd("EgovHeader");

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
  
  useEffect(() => {
    userJs();
  });

  return (
      // <!-- header -->
      <header>
        <div className="hInner">
          <div className="hTop inner">
            <div className="logBox">
              <button type="button" className="loginBtn"><span>로그인</span></button>
              <button type="button" className="signUpBtn"><span>회원가입</span></button>
            </div>
            <div className="langBox">
              <div className="itemBox">
                <select>
                  <option value="0">KR</option>
                  <option value="1">EN</option>
                </select>
              </div>
            </div>
          </div>
          <div className="hBot inner">
            <div className="top">
              <h1><a href="javascript:;"><img src={logoWhite} alt="images"/><span className="hidden">K BIO LabHub</span></a>
              </h1>
              <nav className="navBox">
                <ul className="dep">
                  <li><a href="javascript:;"><p>기관소개</p></a></li>
                  <li><a href="javascript:;"><p>컨설팅</p></a></li>
                  <li><a href="javascript:;"><p>커뮤니티</p></a></li>
                  <li><a href="javascript:;"><p>k-BioLabHub</p></a></li>
                </ul>
              </nav>
              <div className="rightBox">
                <button type="button" className="searchBtn">
                  <div className="icon"></div>
                </button>
                <button type="button" className="sitemapBtn">
                  <div className="icon"></div>
                </button>
              </div>
            </div>
            <div className="bot">
              <ul className="lnbBox">
                <li className="home"><a href="javascript">
                  <div className="icon"></div>
                  <span>홈</span></a></li>
                <li><p>커뮤니티</p></li>
              </ul>
              <h2 className="pageTitle">커뮤니티</h2>
            </div>
          </div>
        </div>
      </header>
  );
}

export default EgovHeader;
