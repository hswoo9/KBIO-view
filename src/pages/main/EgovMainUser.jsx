import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import {getMenu, getMenuByUserSn } from "@/components/CommonComponents";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";

import simpleMainIng from "/assets/images/img_simple_main.png";
import initPage from "@/js/ui";
import logo from "@/assets/images/logo.svg";
import {getPopUpList} from "../../components/MainComponents.jsx";

function EgovMainUser(props) {
  const location = useLocation();

  /* 세션정보 */
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;
  const userSn = getSessionItem("userSn");

  /* 메뉴정보 */
  const [menuList, setMenuList] = useState([]);

  /* 메뉴 마우스 오버 이벤트 */
  const hoverRef = useRef(null);
  const handleMouseOver = (e, index) => {
    if(e.target === e.currentTarget){
      const element = e.currentTarget;
      const parentElement = element.parentElement;
      if(parentElement && hoverRef.current){
        const elementRect = element.getBoundingClientRect();
        const parentRect = parentElement.getBoundingClientRect();
        const left = parentRect.left - elementRect.left;
        console.log("elementRect : " + elementRect.left);
        console.log("parentRect : " + parentRect.left);
        const top = elementRect.top - parentRect.top;
        console.log(top);
        hoverRef.current.style.width = `${parentRect.width}px`;
        hoverRef.current.style.height = `${parentRect.height}px`;
        hoverRef.current.style.left = `${left}px`;
        hoverRef.current.style.top = `${top}px`;
        hoverRef.current.style.opacity = `1`;
      }


    }
  }
  /* 팝업관련 */
  const [popUpList, setPopUpList] = useState([]);
  useEffect(() => {
    popUpList.forEach((popUp, i) => {
      window.open(
          `/popup?bnrPopupSn=${popUp.bnrPopupSn}`, // 여기에 원하는 URL 입력
          `${popUp.bnrPopupSn}`,
          `width=${popUp.popupWdthSz},
          height=${popUp.popupVrtcSz},
          left=${popUp.popupPstnWdth},
          top=${popUp.popupPstnUpend}`
      );
    })
  }, [popUpList]);

  useEffect(() => {
    getPopUpList().then((data) => {
      setPopUpList(data);
    });

    /* 메뉴리스트 조회 */
    getMenuByUserSn(null, null, String(userSn)).then((data) => {
      console.log(data);
      let dataList = [];
      if(data != null){
        data.forEach(function(item, index){
          if (index === 0) dataList = [];
          if(item.menuType == "b"){
            dataList.push(
                <li key={item.menuSn}>
                  <NavLink
                      to={item.menuPathNm}
                      state={{
                        bbsSn: item.bbsSn
                      }}
                      onMouseOver={(e) => handleMouseOver(e, index)}
                  >
                    <span>{item.menuNm}</span>
                  </NavLink>
                </li>
            )
          }else if(item.menuType == "c"){
            dataList.push(
                <li key={item.menuSn}>
                  <NavLink
                      to={item.menuPathNm}
                      state={{
                        menuSn: item.menuSn
                      }}
                      onMouseOver={(e) => handleMouseOver(e, index)}
                  >
                    <span>{item.menuNm}</span>
                  </NavLink>
                </li>
            )
          }
        });
        setMenuList(dataList);
      }
    });


  }, []);

  return (
      <div id="container" className="container layout">
        <div className="inner">
          <div className="tabBox type1" data-aos="fade-up" data-aos-duration="1500">
            <div className="bg hover" ref={hoverRef}></div>
            <ul className="list">
              {menuList}
              {/*<li className="active"><a href="#"><span>공지사항</span></a></li>
              <li><a href="#"><span>Q&A</span></a></li>
              <li><a href="#"><span>FAQ</span></a></li>
              <li><a href="#"><span>자료실</span></a></li>
              <li><a href="#"><span>연구자료실</span></a></li>*/}
            </ul>
          </div>
        </div>
        <div className="loginModal modalCon">
          <div className="bg"></div>
          <div className="m-inner">
            <div className="boxWrap">
              <div className="close">
                <div className="icon"></div>
              </div>
              <form className="box">
                <figure className="logo"><img src={logo} alt="K k-Bio LabHub"/></figure>
                <ul className="inputWrap">
                  <li className="inputBox type2">
                    <span className="tt1">아이디</span>
                    <label className="input">
                      <input type="text" name="id" id="id" placeholder="아이디" title="아이디"/>
                    </label>
                  </li>
                  <li className="inputBox type2">
                    <span className="tt1">비밀번호</span>
                    <label className="input">
                      <input type="password" name="password" id="password" placeholder="비밀번호" title="비밀번호"/>
                    </label>
                  </li>
                </ul>
                <div className="stateBtn">
                  <label className="checkBox type2"><input type="checkbox" id="login_state" name="login_state"/><small>로그인
                    상태 유지</small></label>
                </div>
                <button type="button" className="loginBtn"><span>로그인</span></button>
                <ul className="botBtnBox">
                  <li>
                    <button type="button" className="idBtn"><span>아이디 찾기</span></button>
                  </li>
                  <li>
                    <button type="button" className="pwBtn"><span>비밀번호 찾기</span></button>
                  </li>
                  <li>
                    <button type="button" className="signUp"><span>회원가입</span></button>
                  </li>
                </ul>
                <div className="snsLoginBox">
                  <div className="or"><p>or</p></div>
                  <ul className="list">
                    <li className="kakao"><a href="#">
                      <div className="icon"></div>
                    </a></li>
                    <li className="google"><a href="#">
                      <div className="icon"></div>
                    </a></li>
                    <li className="naver"><a href="#">
                      <div className="icon"></div>
                    </a></li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default EgovMainUser;
