import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import {getMenu } from "@/components/CommonComponents";
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
        const parentRect = parentElement.getBoundingClientRect();
        console.log(parentRect.left);
        hoverRef.current.style.width = `${parentRect.width}px`;
        hoverRef.current.style.height = `${parentRect.height}px`;
        hoverRef.current.style.left = `${parentRect.left - 30}px`;
        hoverRef.current.style.top = `0px`;
        hoverRef.current.style.opacity = `1`;
      }


    }
  }
  /* 팝업관련 */
  const [popUpList, setPopUpList] = useState([]);
  useEffect(() => {
    popUpList.forEach((popUp, i) => {
      if(!localStorage.getItem(popUp.bnrPopupSn) || Date.now() > localStorage.getItem(popUp.bnrPopupSn)){
        window.open(
            `/popup?bnrPopupSn=${popUp.bnrPopupSn}`, // 여기에 원하는 URL 입력
            `${popUp.bnrPopupSn}`,
            `width=${popUp.popupWdthSz},
            height=${popUp.popupVrtcSz},
            left=${popUp.popupPstnWdth},
            top=${popUp.popupPstnUpend}`
        );

        localStorage.removeItem(popUp.bnrPopupSn)
      }
    })
  }, [popUpList]);

  useEffect(() => {
    getPopUpList().then((data) => {
      setPopUpList(data);
    });

    getMenu(null, null, userSn).then((data) => {
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
      </div>
  );
}

export default EgovMainUser;
