import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";

import simpleMainIng from "/assets/images/img_simple_main.png";
import initPage from "@/js/ui";
import logo from "@/assets/images/logo.svg";

function EgovMainUser(props) {
  console.group("EgovMain");
  console.log("[Start] EgovMain ------------------------------");
  console.log("EgovMain [props] : ", props);

  const location = useLocation();
  console.log("EgovMain [location] : ", location);

  

  console.log("------------------------------EgovMain [End]");
  console.groupEnd("EgovMainUser");

  return (
      <div id="container" className="container layout">
        <div className="inner">
          <div className="tabBox type1" data-aos="fade-up" data-aos-duration="1500">
            <div className="bg hover"></div>
            <ul className="list">
              <li className="active"><a href="#"><span>공지사항</span></a></li>
              <li><a href="#"><span>Q&A</span></a></li>
              <li><a href="#"><span>FAQ</span></a></li>
              <li><a href="#"><span>자료실</span></a></li>
              <li><a href="#"><span>연구자료실</span></a></li>
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
