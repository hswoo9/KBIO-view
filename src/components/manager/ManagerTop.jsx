import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback, useRef } from "react";
import * as EgovNet from "@/api/egovFetch";
import {getMenu } from "@/components/CommonComponents";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import LogoImg from "@/assets/images/logo_admin.svg";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import Swal from "sweetalert2";

function ManagerTop( ) {
  const location = useLocation();
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;
  const sessionGroupSn = sessionUser?.authrtGroupSn;
  const userSn = getSessionItem("userSn");
  const navigate = useNavigate();

  console.log(sessionGroupSn);

  const [topMenuList, setTopMenuList] = useState([]);
  const [nowLi, setNowLi] = useState(null);
  useEffect(() => {
    const allLiList = document.querySelectorAll(".lnbBox .dep li a");
    allLiList.forEach((item) => {
      item.closest("li").classList.remove("active");

      const currentPath = location.pathname;

      const group1 = [URL.MANAGER_OPERATIONAL_SUPPORT, URL.MANAGER_RELATED_ORGANIZATION, URL.MANAGER_DIFFICULTIES]; // 운영지원, 유관기관, 애로사항
      const group2 = [URL.MANAGER_NORMAL_MEMBER, URL.MANAGER_APPROVAL_MEMBER, URL.MANAGER_WAIT_MEMBER, URL.MANAGER_REJECT_MEMBER, URL.MANAGER_STOP_MEMBER]; // 비입주기업, 승인 관련
      const group3 = [URL.MANAGER_CONSULTING_EXPERT, URL.MANAGER_CONSULTING_MATCHING, URL.MANAGER_SIMPLE_CONSULTING]; // 컨설팅 관련

      let targetURL = currentPath;

      if (group1.includes(currentPath)) {
        targetURL = URL.MANAGER_OPERATIONAL_SUPPORT;
      } else if (group2.includes(currentPath)) {
        targetURL = URL.MANAGER_NORMAL_MEMBER;
      } else if (group3.includes(currentPath)) {
        targetURL = URL.MANAGER_CONSULTING_EXPERT;
      }

      if (item.getAttribute("data-url") === targetURL) {
        setNowLi(item.closest("li"));
      }
    });

    if (nowLi) {
      nowLi.classList.add("active");

      const closestParentDiv = document.querySelector(".commonTop .navBox .lnbBox");
      const closestParentDivRect = closestParentDiv.getBoundingClientRect();
      const closestElementRect = nowLi.getBoundingClientRect();

      activeRef.current.style.width = `${closestElementRect.width}px`;
      activeRef.current.style.height = `5px`;
      activeRef.current.style.left = `${closestElementRect.left - closestParentDivRect.left}px`;
      activeRef.current.style.opacity = `1`;

      if (hoverRef.current) {
        hoverRef.current.removeAttribute("style");
      }
    }
  }, [location.pathname, nowLi]);


  useEffect(() => {
    const sessionUser = getSessionItem("loginUser");
    console.log("로그인된 사용자 정보:", sessionUser);
  }, []);

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
    const liElement = e.target.closest("li");
    setNowLi(liElement);
    navigate({ pathname: url }, { state: { selectMenuNm: selectMenuNm } });
  };

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
                  data-url={URL.MANAGER}
                  onClick={ (e) => {onClickHandle(e, URL.MANAGER, "홈")}}
                  className="cursorTag"
                >
                  <p>홈</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    data-url={URL.MANAGER_OPERATIONAL_SUPPORT}
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_OPERATIONAL_SUPPORT, "운영지원")}}
                    className="cursorTag"
                >
                  <p>운영지원</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    data-url={URL.MANAGER_CONSULTING_EXPERT}
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_CONSULTING_EXPERT, "컨설팅지원")}}
                    className="cursorTag"
                >
                  <p>컨설팅지원</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    data-url={URL.MANAGER_NORMAL_MEMBER}
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_NORMAL_MEMBER, "회원")}}
                    className="cursorTag"
                >
                  <p>회원</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    data-url={URL.MANAGER_ALARM}
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_ALARM, "홈페이지")}}
                    className="cursorTag"
                >
                  <p>홈페이지</p>
                </a>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <a
                    data-url={URL.MANAGER_STATISTICS_USER}
                    onClick={ (e) => {onClickHandle(e, URL.MANAGER_STATISTICS_USER, "통계")}}
                    className="cursorTag"
                >
                  <p>통계</p>
                </a>
              </li>
              { (sessionGroupSn === 2 || sessionGroupSn === 3) && (
                  <li onMouseOver={(e) => handleMouseOver(e)}>
                    <a
                        data-url={URL.MANAGER_MENU_MANAGEMENT}
                        onClick={(e) => onClickHandle(e, URL.MANAGER_MENU_MANAGEMENT, "CMS")}
                        className="cursorTag"
                    >
                      <p>CMS</p>
                    </a>
                  </li>
              )}
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
