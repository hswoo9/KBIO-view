import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import $ from 'jquery';
import React, { useEffect, useRef } from "react";
import { getSessionItem, setSessionItem } from "@/utils/storage";
import URL from "@/constants/url";
import CODE from "@/constants/code";

function ManagerLeftHomepage() {

  const location = useLocation();
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;

  const navigate = useNavigate();
  const hoverRef = useRef(null);
  const logInHandler = () => {
    navigate(URL.MANAGER_LOGIN);
  };

  const handleMouseOver = (e) => {
    const closestParentDiv = document.querySelector(".leftHeader .navBox");
    const closestParentDivRect = closestParentDiv.getBoundingClientRect();
    if(e.target!== e.currentTarget) {
      const closestElement = e.target.closest("li");
      if (closestElement) {
        const closestElementRect = closestElement.getBoundingClientRect();
        console.log(closestElementRect);
        console.log(closestParentDivRect);
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

    if(sessionUser == null || (sessionUserSn == null || sessionUserSn == "")){
      logInHandler();
    }
  }, []);
  

  return (
      <header>
        <div className="hInner leftHeader">
          <div className="title"><p>홈페이지 관리</p></div>
          <nav className="navBox">
            <div className="bg hover" ref={hoverRef}></div>
            <div className="bg active"></div>
            <ul className="dep">
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_ALARM}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>알림관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_HOMEPAGE_ORGANIZATION_CHART_LIST}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>조직도관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_HOMEPAGE_PRIVACY_POLICY}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>개인정보처리방침</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_HOMEPAGE_TERMS_AGREEMENT}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>이용약관</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
  );
}

export default ManagerLeftHomepage;
