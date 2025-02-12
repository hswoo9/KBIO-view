import { useState, useEffect, useCallback, useRef } from "react";
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

import CommonSlider from "@/components/CommonSlider";
import MainSlider from "@/components/main/MainSlider";

import user_main_sec01_slide01 from "@/assets/images/user_main_sec01_slide01.jpg";
import user_main_sec01_icon01 from "@/assets/images/user_main_sec01_icon01.svg";
import user_main_sec01_icon02 from "@/assets/images/user_main_sec01_icon02.svg";
import user_main_sec01_icon03 from "@/assets/images/user_main_sec01_icon03.svg";
import user_main_sec01_icon04 from "@/assets/images/user_main_sec01_icon04.svg";

import user_main_sec04_banner01 from "@/assets/images/user_main_sec04_banner01.jpg";

import user_main_sec02_logo01 from "@/assets/images/user_main_sec02_logo01.png";
import user_main_sec02_logo02 from "@/assets/images/user_main_sec02_logo02.png";
import user_main_sec02_logo03 from "@/assets/images/user_main_sec02_logo03.png";
import user_main_sec02_logo04 from "@/assets/images/user_main_sec02_logo04.png";
import user_main_sec02_logo05 from "@/assets/images/user_main_sec02_logo05.png";

import user_main_rolling_logo01 from "@/assets/images/user_main_rolling_logo01.svg";
import user_main_rolling_logo02 from "@/assets/images/user_main_rolling_logo02.svg";
import user_main_rolling_logo03 from "@/assets/images/user_main_rolling_logo03.svg";
import user_main_rolling_logo04 from "@/assets/images/user_main_rolling_logo04.svg";
import user_main_rolling_logo05 from "@/assets/images/user_main_rolling_logo05.svg";


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
  const [mainSlidesList, setMainSlidesList] = useState([]);
  const [footerSlidesList, setFooterSlidesList] = useState([]);
  useEffect(() => {
    console.log(mainSlidesList);
  }, [mainSlidesList]);

  const [mvnEntList, setMvnEntList] = useState([]);
  const [pstList, setPstList] = useState([]);

  useEffect(() => {
    popUpList.forEach((e, i) => {
      const popUp = e.tblBnrPopup;
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
    getBnrPopupList("popup").then((data) => {
      setPopUpList(data.filter(e => e.tblBnrPopup.bnrPopupKnd == "popup"));
    });

    getBnrPopupList("bnr").then((data) => {
      setMainSlidesList(data.filter(e => e.tblBnrPopup.bnrPopupFrm == "mainSlides"));
    });

    getMvnEntList().then((data) => {
      setMvnEntList(data);
    });

    AOS.init();
  }, []);

  return (
      <div id="container" className="container main">
        {/*<CommonSlider data={mainSlidesList} />*/}
        <div className="sec01">
          <div className="bg bgSlide">
            <div className="slide"><img src={user_main_sec01_slide01} alt="images" loading="lazy"/></div>
          </div>
          <div className="inner">
            <MainSlider/>
            <div className="rightBox">
              <ul className="list">
                <li>
                  <a href="#">
                    <strong className="tt1">연구개발 장비 구축</strong>
                    <p className="tt2">바이오 연구개발 장비 및 <br/>시설 구축 오퍼레이터 상주 및 <br/>장비운용 관리</p>
                    <figure className="icon"><img src={user_main_sec01_icon01} alt="icon image" loading="lazy"/></figure>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <strong className="tt1">네트워킹 플랫폼</strong>
                    <p className="tt2">산,학,연,병 업무 협력 <br/>플랫폼 운용 기술교류회 <br/>IR, 포럼 등 개최</p>
                    <figure className="icon"><img src={user_main_sec01_icon02} alt="icon image" loading="lazy"/></figure>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <strong className="tt1">입주시설 구축</strong>
                    <p className="tt2">기업성장단계를 고려한 <br/>기업별 사무공간 및 <br/>공용 실험공간</p>
                    <figure className="icon"><img src={user_main_sec01_icon03} alt="icon image" loading="lazy"/></figure>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <strong className="tt1">프로그램 운영</strong>
                    <p className="tt2">스타트업 기술사업화, <br/>편딩 및 투자 지원과 관련된 <br/>5개 프로그램 운영</p>
                    <figure className="icon"><img src={user_main_sec01_icon04} alt="icon image" loading="lazy"/></figure>
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
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo01} alt="서울 바이오 허브" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">서울 바이오 허브</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo02} alt="대웅제약" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">대웅제약</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo03} alt="바이오넥스" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">바이오넥스</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo04} alt="동화약품" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">동화약품</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo05} alt="GC 녹십자" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">GC 녹십자</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo01} alt="서울 바이오 허브" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">서울 바이오 허브</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo02} alt="대웅제약" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">대웅제약</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo03} alt="바이오넥스" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">바이오넥스</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo04} alt="동화약품" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">동화약품</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
                <div className="swiper-slide">
                  <figure className="logoBox"><img src={user_main_sec02_logo05} alt="GC 녹십자" loading="lazy"/></figure>
                  <div className="textBox">
                    <h3 className="tt1">GC 녹십자</h3>
                    <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                  </div>
                  <a href="#" className="linkBtn"><span>바로가기</span></a>
                </div>
              </div>
              <div className="slideControl blue">
                <button type="button" className="arrowBtn prevBtn">
                  <div className="icon"></div>
                </button>
                <button type="button" className="pauseBtn">
                  <div className="icon"></div>
                </button>
                <button type="button" className="arrowBtn nextBtn">
                  <div className="icon"></div>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="sec sec03" data-aos="fade-in">
          <div className="inner">
            <h2 className="secTitle">일정현황</h2>
            <div className="boxWrap">
              <div className="calendarWrap leftBox" data-aos="fade-left" data-aos-duration="1500">
                <div className="topBox">
                  <button type="button" className="arrowBtn prevBtn">
                    <div className="icon"></div>
                  </button>
                  <div className="date"><strong>2024년 6월</strong>
                    <div className="icon"></div>
                  </div>
                  <button type="button" className="arrowBtn nextBtn">
                    <div className="icon"></div>
                  </button>
                </div>
                <div className="calendarBox">
                  <table>
                    <caption>달력</caption>
                    <thead>
                    <tr>
                      <th><p>일</p></th>
                      <th><p>월</p></th>
                      <th><p>화</p></th>
                      <th><p>수</p></th>
                      <th><p>목</p></th>
                      <th><p>금</p></th>
                      <th><p>토</p></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td className="noText"></td>
                      <td><strong className="num">1</strong><p className="case">13건</p></td>
                      <td className="click"><strong className="num">2</strong><p className="case">13건</p></td>
                      <td><strong className="num">3</strong><p className="case">13건</p></td>
                      <td><strong className="num">4</strong><p className="case">13건</p></td>
                      <td><strong className="num">5</strong><p className="case">13건</p></td>
                      <td><strong className="num">6</strong><p className="case">13건</p></td>
                    </tr>
                    <tr>
                      <td><strong className="num">7</strong></td>
                      <td><strong className="num">8</strong><p className="case">13건</p></td>
                      <td><strong className="num">9</strong><p className="case">13건</p></td>
                      <td><strong className="num">10</strong><p className="case">13건</p></td>
                      <td><strong className="num">11</strong><p className="case">13건</p></td>
                      <td><strong className="num">12</strong><p className="case">13건</p></td>
                      <td><strong className="num">13</strong><p className="case">13건</p></td>
                    </tr>
                    <tr>
                      <td><strong className="num">14</strong><p className="case">13건</p></td>
                      <td><strong className="num">15</strong><p className="case">13건</p></td>
                      <td><strong className="num">16</strong><p className="case">13건</p></td>
                      <td><strong className="num">17</strong><p className="case">13건</p></td>
                      <td><strong className="num">18</strong><p className="case">13건</p></td>
                      <td><strong className="num">19</strong><p className="case">13건</p></td>
                      <td><strong className="num">20</strong><p className="case">13건</p></td>
                    </tr>
                    <tr>
                      <td><strong className="num">21</strong><p className="case">13건</p></td>
                      <td><strong className="num">22</strong><p className="case">13건</p></td>
                      <td><strong className="num">23</strong><p className="case">13건</p></td>
                      <td><strong className="num">24</strong><p className="case">13건</p></td>
                      <td><strong className="num">25</strong><p className="case">13건</p></td>
                      <td><strong className="num">26</strong><p className="case">13건</p></td>
                      <td><strong className="num">27</strong><p className="case">13건</p></td>
                    </tr>
                    <tr>
                      <td><strong className="num">28</strong><p className="case">13건</p></td>
                      <td><strong className="num">29</strong><p className="case">13건</p></td>
                      <td><strong className="num">30</strong><p className="case">13건</p></td>
                      <td><strong className="num">31</strong><p className="case">13건</p></td>
                      <td className="noText"></td>
                      <td className="noText"></td>
                      <td className="noText"></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="rightBox tabContWrap" data-aos="fade-right" data-aos-duration="1500">
                <div className="topBox">
                  <strong className="date">06월 02일</strong>
                  <div className="tabBox type1">
                    <div className="bg hover"></div>
                    <ul className="list">
                      <li className="active"><a href="#"><span>공지사항</span></a></li>
                      <li><a href="#"><span>자료실</span></a></li>
                    </ul>
                  </div>
                </div>
                <div className="tabCont tab01 active">
                  <ul className="list">
                    <li><a href="#"><p>2024 한-덴 의약바이오 & CMC 혁신 기술포럼 개최 안내 (11.20, 수)</p></a></li>
                    <li><a href="#"><p>K-바이오랩허브 소개자료(최종)</p></a></li>
                    <li><a href="#"><p>[한국혁신의약품컨소시엄] KIMCo 2024년도 하반기 공동투자·육성사업 참가기업 모집</p></a></li>
                    <li><a href="#"><p>[서울바이오허브] 「2024 헬스엑스챌린지 서울」 모집공고 및 참가 수상기업 안내</p></a></li>
                    <li><a href="#"><p>[서울경제진흥원] 2024년 I'M Challenge(아임 챌린지) 참여 스타트업 모집</p></a></li>
                    <li><a href="#"><p>[서울경제진흥원] 마곡의료아카데미(6월) 교육 참여기업 모집공고 안내</p></a></li>
                    <li><a href="#"><p>2024 한-덴 의약바이오 & CMC 혁신 기술포럼 개최 안내 (11.20, 수)</p></a></li>
                    <li><a href="#"><p>K-바이오랩허브 소개자료(최종)</p></a></li>
                    <li><a href="#"><p>[한국혁신의약품컨소시엄] KIMCo 2024년도 하반기 공동투자·육성사업 참가기업 모집</p></a></li>
                    <li><a href="#"><p>[서울바이오허브] 「2024 헬스엑스챌린지 서울」 모집공고 및 참가 수상기업 안내</p></a></li>
                    <li><a href="#"><p>[서울경제진흥원] 2024년 I'M Challenge(아임 챌린지) 참여 스타트업 모집</p></a></li>
                    <li><a href="#"><p>[서울경제진흥원] 마곡의료아카데미(6월) 교육 참여기업 모집공고 안내</p></a></li>
                  </ul>
                </div>
                <div className="tabCont tab02">
                  <ul className="list">
                    <li><a href="#"><p>2024 한-덴 의약바이오 & CMC 혁신 기술포럼 개최 안내 (11.20, 수)</p></a></li>
                    <li><a href="#"><p>K-바이오랩허브 소개자료(최종)</p></a></li>
                    <li><a href="#"><p>[한국혁신의약품컨소시엄] KIMCo 2024년도 하반기 공동투자·육성사업 참가기업 모집</p></a></li>
                    <li><a href="#"><p>[서울바이오허브] 「2024 헬스엑스챌린지 서울」 모집공고 및 참가 수상기업 안내</p></a></li>
                    <li><a href="#"><p>[서울경제진흥원] 2024년 I'M Challenge(아임 챌린지) 참여 스타트업 모집</p></a></li>
                    <li><a href="#"><p>[서울경제진흥원] 마곡의료아카데미(6월) 교육 참여기업 모집공고 안내</p></a></li>
                    <li><a href="#"><p>2024 한-덴 의약바이오 & CMC 혁신 기술포럼 개최 안내 (11.20, 수)</p></a></li>
                    <li><a href="#"><p>K-바이오랩허브 소개자료(최종)</p></a></li>
                    <li><a href="#"><p>[한국혁신의약품컨소시엄] KIMCo 2024년도 하반기 공동투자·육성사업 참가기업 모집</p></a></li>
                    <li><a href="#"><p>[서울바이오허브] 「2024 헬스엑스챌린지 서울」 모집공고 및 참가 수상기업 안내</p></a></li>
                    <li><a href="#"><p>[서울경제진흥원] 2024년 I'M Challenge(아임 챌린지) 참여 스타트업 모집</p></a></li>
                    <li><a href="#"><p>[서울경제진흥원] 마곡의료아카데미(6월) 교육 참여기업 모집공고 안내</p></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="sec sec04" data-aos="fade-in">
          <div className="inner">
            <div className="box bannerBox" data-aos="fade-in">
              <div className="topBox" data-aos="fade-in" data-aos-duration="1500">
                <h2 className="secTitle">일정현황</h2>
                <div className="slideControl">
                  <button type="button" className="arrowBtn prevBtn">
                    <div className="icon"></div>
                  </button>
                  <button type="button" className="pauseBtn">
                    <div className="icon"></div>
                  </button>
                  <button type="button" className="arrowBtn nextBtn">
                    <div className="icon"></div>
                  </button>
                </div>
              </div>
              <div className="bannerSwiper swiper" data-aos="fade-up" data-aos-duration="1500">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="bg"><img src={user_main_sec04_banner01} alt="images" loading="lazy"/></div>
                    <div className="textBox">
                      <h2 className="text">사업 기획부터 연구 개발, 펀딩 투자를 지원하는</h2>
                      <p className="title">BIO <br/>특화프로그램 지원</p>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="bg"><img src={user_main_sec04_banner01} alt="images" loading="lazy"/></div>
                    <div className="textBox">
                      <h2 className="text">사업 기획부터 연구 개발, 펀딩 투자를 지원하는</h2>
                      <p className="title">BIO <br/>특화프로그램 지원</p>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="bg"><img src={user_main_sec04_banner01} alt="images" loading="lazy"/></div>
                    <div className="textBox">
                      <h2 className="text">사업 기획부터 연구 개발, 펀딩 투자를 지원하는</h2>
                      <p className="title">BIO <br/>특화프로그램 지원</p>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="bg"><img src={user_main_sec04_banner01} alt="images" loading="lazy"/></div>
                    <div className="textBox">
                      <h2 className="text">사업 기획부터 연구 개발, 펀딩 투자를 지원하는</h2>
                      <p className="title">BIO <br/>특화프로그램 지원</p>
                    </div>
                  </div>
                </div>
                <div className="swiper-pagination"></div>
              </div>
            </div>
            <div className="box noticeBox" data-aos="fade-in">
              <div className="topBox" data-aos="fade-in" data-aos-duration="1500">
                <h2 className="secTitle">공지사항</h2>
                <a href="#" className="plusBtn">
                  <div className="icon"></div>
                </a>
              </div>
              <ul className="listBox" data-aos="fade-up" data-aos-duration="1500">
                <li>
                  <a href="#">
                    <span className="cate">일반</span>
                    <div className="titleBox">
                      <h3 className="title">2024년 TIPA 대국민 혁신아이디어 공모전</h3>
                      <p className="date">2022.12.30</p>
                    </div>
                    <div className="textBox">
                      <p>중소기업기술정보진흥원(TIPA)은 국민이 체감할 수 있는 공공서비스 <br/>혁신을 위하여 국민 여러분의 소중한 의견을 듣고자 합니다. <br/>국민 여러분의 아이디어를
                        기관
                        운영에 적극적으로 반영하고자 하오니,공모전에 많은 관심과 참여 부탁드립니다.</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="cate etc">기타</span>
                    <div className="titleBox">
                      <h3 className="title">[서울바이오허브] 「2024 헬스엑스챌린지 서울」 모집공고 및 참가 수상기업 안내</h3>
                      <p className="date">2022.12.30</p>
                    </div>
                    <div className="textBox">
                      <p>서울특별시가 조성하고 한국과학기술연구원·고려대학교가 운영하는 ‘서울바이오허브’에서 국내 유망 바이오 기업의 글로벌 시장 진출 경쟁력 강화를 위해 「2024 헬스엑스챌린지
                        서울」을 운영합니다. 다음과 같이 바이오 및 헬스케어 분야의 혁신 기술을 보유한 참여기업을 모집하오니 많은 신청 바랍니다.</p>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div className="box pressBox" data-aos="fade-in">
              <div className="topBox" data-aos="fade-in" data-aos-duration="1500">
                <h2 className="secTitle">보도자료</h2>
                <a href="#" className="plusBtn">
                  <div className="icon"></div>
                </a>
              </div>
              <ul className="listBox" data-aos="fade-up" data-aos-duration="1500">
                <li>
                  <a href="#">
                    <span className="cate etc">기타</span>
                    <div className="titleBox">
                      <h3 className="title">[한국보건복지인재원] 국가인적자원개발 컨소시엄 사업 및 찾아가는 교육 안내</h3>
                      <p className="date">2022.12.30</p>
                    </div>
                    <div className="textBox">
                      <p>한국보건복지인재원에서 국가인적자원개발 컨소시엄 사업의 일환으로 <br/>제약, 화장품, 의료기기 등 바이오헬스 관련 기업의 재직자를 대상으로 직무향상 <br/>교육을
                        무료로 제공하고 있습니다. 많은 관심 부탁드립니다.</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="cate">일반</span>
                    <div className="titleBox">
                      <h3 className="title">2024 한-덴 의약바이오 & CMC 혁신 기술포럼 개최 안내 (11.20, 수)</h3>
                      <p className="date">2022.12.30</p>
                    </div>
                    <div className="textBox">
                      <p>한국과 덴마크의 바이오텍 및 제약 분야 전문가들이 모여 CMC분야의 최신 동향을 살펴보고, 다양한 혁신 주체 간의 소통을 통해 글로벌 협력 방안을 논의할
                        예정입니다. <br/>많은 관심과 참여 부탁드립니다.</p>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <div className="rollingWrap">
          <div className="moveWrap">
            <ul className="imgMove">
              {/*<MainFooterBnr data={footerSlidesList} />*/}
              <li><img src={user_main_rolling_logo01} alt="SAMSUNG BIOLOGICS" loading="lazy"/></li>
              <li><img src={user_main_rolling_logo02} alt="동화약품" loading="lazy"/></li>
              <li><img src={user_main_rolling_logo03} alt="GC녹십자" loading="lazy"/></li>
              <li><img src={user_main_rolling_logo04} alt="DAEWOONG" loading="lazy"/></li>
              <li><img src={user_main_rolling_logo05} alt="서울바이오허브" loading="lazy"/></li>
              <li><img src={user_main_rolling_logo01} alt="SAMSUNG BIOLOGICS" loading="lazy"/></li>
              <li><img src={user_main_rolling_logo02} alt="동화약품" loading="lazy"/></li>
              <li><img src={user_main_rolling_logo03} alt="GC녹십자" loading="lazy"/></li>
              <li><img src={user_main_rolling_logo04} alt="DAEWOONG" loading="lazy"/></li>
              <li><img src={user_main_rolling_logo05} alt="서울바이오허브" loading="lazy"/></li>
            </ul>
          </div>
        </div>
      </div>
  );
}

export default EgovMainUser;
