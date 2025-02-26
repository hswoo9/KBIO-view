import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback, useRef } from "react";
import * as EgovNet from "@/api/egovFetch";
import {getMenu } from "@/components/CommonComponents";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import LogoImg from "@/assets/images/logo_admin.svg";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import Swal from "sweetalert2";

function ManagerTop() {
  const location = useLocation();
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;
  const userSn = getSessionItem("userSn");
  const navigate = useNavigate();

  const [topMenuList, setTopMenuList] = useState([]);
  const [nowLi, setNowLi] = useState(null);
  useEffect(() => {
    if(nowLi){
      const allLiList = document.querySelectorAll(".lnbBox .dep li");
      allLiList.forEach(function(item, index){
        item.classList.remove("active");
      });
      nowLi.classList.add("active");

      const closestParentDiv = document.querySelector(".commonTop .navBox .lnbBox");
      const closestParentDivRect = closestParentDiv.getBoundingClientRect();
      if (nowLi) {
        const closestElementRect = nowLi.getBoundingClientRect();
        activeRef.current.style.width = `${closestElementRect.width}px`;
        activeRef.current.style.height = `5px`;
        activeRef.current.style.left = `${closestElementRect.left - closestParentDivRect.left}px`;
        activeRef.current.style.opacity = `1`;
        if(hoverRef.current){
          hoverRef.current.removeAttribute("style");
        }
      }


    }
  }, [nowLi])

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
        removeSessionItem("loginUser");
        removeSessionItem("jToken");
        removeSessionItem("userSn");
        // Swal.fire("로그아웃되었습니다!");
        navigate(URL.MANAGER_LOGIN);
      }
    });
  };

  useEffect(() => {
    if (location.pathname.split("/")[1] === "manager") {
      import('../../css/manager/admin.css');
      import('../../css/manager/customAdmin.css');

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

    // const requestOptions = {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify({userSn : userSn}),
    // };
    //
    // EgovNet.requestFetch("/commonApi/getDuplicateLogin.do", requestOptions, (resp) => {
    //   if(resp.result != null){
    //     if(resp.result.duplicateLogin == "Y"){
    //       removeSessionItem("loginUser");
    //       removeSessionItem("jToken");
    //       removeSessionItem("userSn");
    //       navigate(
    //           { pathname : URL.COMMON_ERROR},
    //           { state : {
    //               redirectPath : URL.MANAGER_LOGIN,
    //               errorCode: resp.resultCode,
    //               errorMessage: resp.resultMessage,
    //               errorSubMessage : "메인으로 이동합니다."
    //             }
    //           }
    //       );
    //
    //     }
    //   }
    //
    // });
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
    logOutHandler();
  };

  const activeRef = useRef(null);
  const hoverRef = useRef(null);
  const handleMouseOver = (e) => {
    const closestParentDiv = document.querySelector(".commonTop .navBox .lnbBox");
    const closestParentDivRect = closestParentDiv.getBoundingClientRect();
    if(e.target !== e.currentTarget) {
      const closestElement = e.target.closest("li");
      if (closestElement) {
        const closestElementRect = closestElement.getBoundingClientRect();
        hoverRef.current.style.width = `${closestElementRect.width}px`;
        hoverRef.current.style.height = `5px`;
        hoverRef.current.style.left = `${closestElementRect.left - closestParentDivRect.left}px`;
        hoverRef.current.style.opacity = `1`;
      }
    }
  }

  const onClickHandle = (e, url, selectMenuNm) => {
    setNowLi(e.target.closest("li"));
    navigate({pathname: url}, {state: {selectMenuNm: selectMenuNm}});
  }

  const onClickMainImgHandle = (url, selectMenuNm) => {
    const firstLi = document.querySelector(".lnbBox .dep li:first-child");
    if(firstLi){
      setNowLi(firstLi);
    }
    navigate({pathname: url}, {state: {selectMenuNm: selectMenuNm}});
  }

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
        <h1>
          <a onClick={ (e) => {onClickMainImgHandle(URL.MANAGER, "홈")}} className="cursorTag">
            <img src={LogoImg} alt="images"/>
            <span className="hidden">K BIO LabHub</span>
        </a>
        </h1>
        <div className="navBox" onMouseLeave={(e) => { if(hoverRef.current) hoverRef.current.removeAttribute("style") }}>
          <div className="lnbBox">
            <div className="bg hover" ref={hoverRef}></div>
            <div className="bg active" ref={activeRef}></div>
            <ul className="dep">
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                  onClick={ (e) => {onClickHandle(e, URL.MANAGER, "홈")}}
                  className="cursorTag"
                >
                  <p>홈</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_OPERATIONAL_SUPPORT, "운영지원")}}
                    className="cursorTag"
                >
                  <p>운영지원</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_CONSULTING_EXPERT, "컨설팅지원")}}
                    className="cursorTag"
                >
                  <p>컨설팅지원</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_NORMAL_MEMBER, "회원")}}
                    className="cursorTag"
                >
                  <p>회원</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_ALARM, "홈페이지")}}
                    className="cursorTag"
                >
                  <p>홈페이지</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_STATISTICS_USER, "통계")}}
                    className="cursorTag"
                >
                  <p>통계</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_MENU_MANAGEMENT, "CMS")}}
                    className="cursorTag"
                >
                  <p>CMS</p>
                </a>
              </li>
            </ul>
          </div>
          <div className="rightBox">
            <p className="tt1">{sessionUserName}</p>
            <button type="button" className="logoutBtn" onClick={logOutHandler}><span>로그아웃</span>
              <div className="icon"></div>
            </button>
          </div>
        </div>
      </div>
  );

}

export default ManagerTop;
