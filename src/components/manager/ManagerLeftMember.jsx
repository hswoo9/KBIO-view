import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import $ from 'jquery';
import React, { useEffect, useRef } from "react";
import { getSessionItem, setSessionItem } from "@/utils/storage";
import URL from "@/constants/url";
import CODE from "@/constants/code";

function ManagerLeftMember() {

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

  const hoverRef = useRef(null);
  const handleMouseOver = (e) => {
    const closestParentDiv = document.querySelector(".leftHeader .navBox");
    const closestParentDivRect = closestParentDiv.getBoundingClientRect();
    if(e.target!== e.currentTarget) {
      const closestElement = e.target.closest("li");
      if (closestElement) {
        const closestElementRect = closestElement.getBoundingClientRect();
        
        hoverRef.current.style.width = `${closestElementRect.width}px`;
        hoverRef.current.style.height = `${closestElementRect.height}px`;
        hoverRef.current.style.top = `${closestElementRect.top - closestParentDivRect.top}px`;
        hoverRef.current.style.opacity = `1`;
      }
    }
  }

  useEffect(() => {
    const activeTag = document.getElementsByClassName('activeTag');
    if(activeTag.length){
      const parentTag = activeTag[0].parentElement;
      if(parentTag){
        parentTag.className = "active";
      }
    }

    if(sessionUser == null
    ||
        (sessionUserSn == null || sessionUserSn == "")
    ){
      logInHandler();
    }else{

    }



  }, []);
  

  return (
      <header>
        <div className="hInner leftHeader">
          <div className="title"><p>회원관리</p></div>
          <nav className="navBox">
            <div className="bg hover" ref={hoverRef}></div>
            <div className="bg active"></div>
            <ul className="dep">
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_NORMAL_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>전체회원</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_APPROVAL_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>승인회원</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_WAIT_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>승인대기</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_REJECT_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>승인반려</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_STOP_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>이용정지</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_CANCEL_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>탈퇴회원</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_MESSAGE_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>문자발송</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
  );
}

export default ManagerLeftMember;
