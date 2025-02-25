import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import $ from 'jquery';
import React, { useEffect, useRef } from "react";
import { getSessionItem, setSessionItem } from "@/utils/storage";
import URL from "@/constants/url";
import CODE from "@/constants/code";

function ManagerLeftNew() {

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
          <div className="title"><p>CMS</p></div>
          <nav className="navBox">
            <div className="bg hover" ref={hoverRef}></div>
            <div className="bg active"></div>
            <ul className="dep">
              {/*<li>
                <NavLink
                    to={URL.MANAGER_NORMAL_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>회원관리</p>
                </NavLink>
              </li>*/}
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_MENU_MANAGEMENT}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>메뉴관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_MENU_CONTENT_MANAGEMENT}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>메뉴컨텐츠관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_MENU_AUTHORITY}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>메뉴권한관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_AUTHORITY_GROUP_USERS}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>권한사용자관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_ACCESS_LIST}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>접근관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_BBS_LIST}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>게시판관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_BBS_LIST2}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>게시글관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_BANNER_LIST}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>배너관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_POPUP_LIST}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>팝업관리</p>
                </NavLink>
              </li>
              <li onMouseOver={(e) => handleMouseOver(e)}>
                <NavLink
                    to={URL.MANAGER_CODE_GROUP}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>코드관리</p>
                </NavLink>
              </li>
              {/*<li>
                <NavLink
                    to={URL.MANAGER_NORMAL_MEMBER}
                    className={({isActive}) => (isActive ? "activeTag" : "")}
                >
                  <div className="icon"></div>
                  <p>일반회원관리</p>
                </NavLink>
              </li>*/}
            </ul>
          </nav>
        </div>
      </header>
  );
}

export default ManagerLeftNew;
