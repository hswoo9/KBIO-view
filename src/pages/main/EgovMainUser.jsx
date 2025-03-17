import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import {getMenu } from "@/components/CommonComponents";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";

import simpleMainIng from "/assets/images/img_simple_main.png";
import initPage from "@/js/ui";
import logo from "@/assets/images/logo.svg";
import {getBnrPopupList, getMvnEntList, getPstList} from "@/components/main/MainComponents";


import Slider from 'react-slick';
import "@/css/slickCustom.css";
import "@/css/slickCustomTheme.css";
import "@/css/userMain.css";

import AOS from "aos";

import MainSwiper from "@/components/main/MainSwiper";
import MainBottomSwiper from "@/components/main/MainBottomSwiper";
import CommonSlider from "@/components/CommonSlider";
import MainSlider from "@/components/main/MainSlider";
import MainCalendar from "@/components/main/MainCalendar";
import MainFooterBanner from "@/components/main/MainFooterBanner";

import user_main_sec01_slide01 from "@/assets/images/user_main_sec01_slide01.jpg";
import user_main_sec01_icon01 from "@/assets/images/user_main_sec01_icon01.svg";
import user_main_sec01_icon02 from "@/assets/images/user_main_sec01_icon02.svg";
import user_main_sec01_icon03 from "@/assets/images/user_main_sec01_icon03.svg";
import user_main_sec01_icon04 from "@/assets/images/user_main_sec01_icon04.svg";
import moment from "moment/moment.js";

function EgovMainUser(props) {
  const location = useLocation();

  /* 세션정보 */
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;
  const userSn = getSessionItem("userSn");

  const [popUpList, setPopUpList] = useState([]);


  const [mvnEntList, setMvnEntList] = useState([]);
  const [notiList, setNotiList] = useState([]);
  const [pressReleaseList , setPressReleaseList] = useState([]);

  useEffect(() => {
    popUpList.forEach((e, i) => {
      const popUp = e.tblBnrPopup;
      if(!localStorage.getItem(popUp.bnrPopupSn) || Date.now() > localStorage.getItem(popUp.bnrPopupSn)){
        window.open(
            `/popup?bnrPopupSn=${popUp.bnrPopupSn}`,
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
    getBnrPopupList("popup").then((data) => {
      setPopUpList(data.filter(e => e.tblBnrPopup.bnrPopupKnd == "popup"));
    });

    getPstList(1).then((data) => {
      setNotiList(data.pstList);
    });

    getPstList(8).then((data) => {
      setPressReleaseList(data.pstList);
    });

    AOS.init();
  }, []);

  return (
      <div id="container" className="container main">
        <div className="sec01">
          <div className="bg bgSlide">
            <div className="slide" style={{height : "100%"}}><img src={user_main_sec01_slide01} alt="images" loading="lazy"/></div>
          </div>
          <div className="inner">
            <MainSlider/>
            <div className="rightBox">
              <ul className="list">
                <li>
                  <a href="#" style={{pointerEvents: "none"}} className="mainCard">
                    <strong className="tt1">연구개발 장비 구축</strong>
                    <p className="tt2">바이오 연구개발 장비 및 <br/>시설 구축 오퍼레이터 상주 및 <br/>장비운용 관리</p>
                    <figure className="icon"><img src={user_main_sec01_icon01} alt="연구개발 장비 구축" loading="lazy"/>
                    </figure>
                  </a>
                </li>
                <li>
                  <a href="#" style={{pointerEvents: "none"}} className="mainCard">
                    <strong className="tt1">네트워킹 플랫폼</strong>
                    <p className="tt2">산,학,연,병 업무 협력 <br/>플랫폼 운용 기술교류회 <br/>IR, 포럼 등 개최</p>
                    <figure className="icon"><img src={user_main_sec01_icon02} alt="i네트워킹 플랫폼" loading="lazy"/>
                    </figure>
                  </a>
                </li>
                <li>
                  <a href="#" style={{pointerEvents: "none"}} className="mainCard">
                    <strong className="tt1">입주시설 구축</strong>
                    <p className="tt2">기업성장단계를 고려한 <br/>기업별 사무공간 및 <br/>공용 실험공간</p>
                    <figure className="icon"><img src={user_main_sec01_icon03} alt="입주시설 구축" loading="lazy"/>
                    </figure>
                  </a>
                </li>
                <li>
                  <a href="#" style={{pointerEvents: "none"}} className="mainCard">
                    <strong className="tt1">프로그램 운영</strong>
                    <p className="tt2">스타트업 기술사업화, <br/>편딩 및 투자 지원과 관련된 <br/>5개 프로그램 운영</p>
                    <figure className="icon"><img src={user_main_sec01_icon04} alt="프로그램 운영" loading="lazy"/>
                    </figure>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <section className="sec sec02" data-aos="fade-in">
          <div className="inner">
            <div className="titleBox">
              <h2 className="secTitle">기관소개</h2>
              <p className="secText"><strong className="kBio">K- Bio Labhub</strong>는 바이오산업 기업을 위한 서비스를 제공하고있습니다</p>
            </div>
            <div className="institution_swiper swiper" data-aos="fade-up" data-aos-duration="1500">
              <MainSwiper/>
            </div>
          </div>
        </section>
        <MainCalendar/>
        <section className="sec sec04" data-aos="fade-in">
          <div className="inner">
            <MainBottomSwiper/>
            <div className="box noticeBox" data-aos="fade-in">
              <div className="topBox" data-aos="fade-in" data-aos-duration="1500">
                <h2 className="secTitle">공지사항</h2>
                <NavLink
                    to={URL.COMMON_PST_NORMAL_LIST}
                    state={{
                      menuSn: 32,
                      thisMenuSn: 38,
                      bbsSn: 1,
                      menuNmPath: "커뮤니티 > 공지사항"
                    }}
                    className="plusBtn">
                   <span className="visually-hidden">공지사항</span>
                  <div className="icon"></div>
                </NavLink>
              </div>
              <ul className="listBox" data-aos="fade-up" data-aos-duration="1500">
                {notiList.length > 0 && notiList.map((pst, index) => (
                    <li key={pst.pstSn}>
                      <NavLink
                          to={URL.COMMON_PST_NORMAL_DETAIL}
                          state={{
                            pstSn: pst.pstSn,
                            menuSn: 32,
                            thisMenuSn: 38,
                            menuNmPath: "커뮤니티 > 공지사항"
                          }}
                      >
                        {pst.upendNtcYn == "Y" ?
                            <span className="cate">공지</span> :
                            <span className="cate etc">일반</span>
                        }
                        <div className="titleBox">
                          <h3 className="title">{pst.pstTtl}</h3>
                          <p className="date">{moment(pst.frstCrtDt).format('YYYY-MM-DD')}</p>
                        </div>
                        <div className="textBox">
                          <p style={{minHeight: "77px"}}
                             dangerouslySetInnerHTML={{__html: pst.pstCn.replace(/<\/?[^>]+(>|$)/g, " ")}}></p>
                        </div>
                      </NavLink>
                    </li>
                ))}
              </ul>
            </div>
            <div className="box pressBox" data-aos="fade-in">
              <div className="topBox" data-aos="fade-in" data-aos-duration="1500">
                <h2 className="secTitle">보도자료</h2>
                <NavLink
                    to={URL.COMMON_PST_NORMAL_LIST}
                    state={{
                      menuSn: 32,
                      thisMenuSn: 62,
                      bbsSn: 8,
                      menuNmPath: "커뮤니티 > 보도자료"
                    }}
                    className="plusBtn"
                >
                  <div className="icon"></div>
                  <span className="visually-hidden">공지사항</span>
                </NavLink>
              </div>
              <ul className="listBox" data-aos="fade-up" data-aos-duration="1500">
                {pressReleaseList.length > 0 && pressReleaseList.map((pst, index) => (
                    <li key={pst.pstSn}>
                      <NavLink
                          to={URL.COMMON_PST_NORMAL_DETAIL}
                          state={{
                            pstSn: pst.pstSn,
                            menuSn: 32,
                            thisMenuSn: 62,
                            menuNmPath: "커뮤니티 > 보도자료"
                          }}
                      >
                        {pst.upendNtcYn == "Y" ?
                            <span className="cate">공지</span> :
                            <span className="cate etc">일반</span>
                        }
                        <div className="titleBox">
                          <h3 className="title">{pst.pstTtl}</h3>
                          <p className="date">{moment(pst.frstCrtDt).format('YYYY-MM-DD')}</p>
                        </div>
                        <div className="textBox">
                          <p style={{minHeight: "77px"}}
                             dangerouslySetInnerHTML={{__html: pst.pstCn.replace(/<\/?[^>]+(>|$)/g, " ")}}></p>
                        </div>
                      </NavLink>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <MainFooterBanner/>
      </div>
  );
}

export default EgovMainUser;
