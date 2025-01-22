import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
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
    }
  }, [location.pathname]);

  return (
      <div className="commonTop">
        <div className="lnbBox">
          <div className="bg hover"></div>
          <div className="bg active"></div>
          <ul className="dep">
            <li><a href="#"><p>운영 지원</p></a></li>
            <li><a href="#"><p>컨설팅 지원</p></a></li>
            <li><a href="#"><p>회원</p></a></li>
            <li><a href="#"><p>홈페이지</p></a></li>
            <li><a href="#"><p>커뮤니티</p></a></li>
            <li><a href="#"><p>관리자</p></a></li>
            <li><a href="#"><p>통계</p></a></li>
            <li className="active"><a href="#"><p>CMS</p></a></li>
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
