import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getBnrPopupList} from "@/components/main/MainComponents";
import AOS from "aos";

function KbioLocation(props) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
      <div id="container" className="container location">
        <div className="inner">
          <CommonSubMenu/>
          <div className="inner2">
            <div className="titleWrap type2" data-aos="flip-up" data-aos-duration="1000">
              <p className="tt1">오시는길</p>
            </div>
            <div className="mapBox" data-aos="fade-up" data-aos-duration="1000">
              <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6340.543807153608!2d126.66629589579395!3d37.38340155356639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b77f5212deb81%3A0x2fbd0ed40e59d8e2!2z7Jew7IS464yA7ZWZ6rWQIOq1reygnOy6oO2NvOyKpCDsooXtlanqtIA!5e0!3m2!1sko!2skr!4v1739756633646!5m2!1sko!2skr"
                  width="100%" height="100%" style={{border: "0px"}} allowFullScreen="" loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div className="box box01">
              <div className="titleWrap type2 left" data-aos="flip-up" data-aos-duration="1000">
                <p className="tt1">대중교통 이용안내</p>
              </div>
              <ul className="listBox">
                <li className="subway traffic" data-aos="fade-in">
                  <div className="leftBox">
                    <div className="icon"></div>
                    <p className="text">지하철</p></div>
                  <div className="textBox">
                    <ul className="list">
                      <li>
                        <strong className="tt1">계양역(홍대입구방면)</strong>
                        <p className="tt2">첫차 05:36 / 막차 24:13</p>
                      </li>
                      <li>
                        <strong className="tt1">계양역(캠퍼스타운역방면)</strong>
                        <p className="tt2">첫차 05:49 / 막차 24:05</p>
                      </li>
                      <li>
                        <strong className="tt1">캠퍼스타운역(부평역방면)</strong>
                        <p className="tt2">첫차 05:39 / 막차 24:16</p>
                      </li>
                      <li>
                        <strong className="tt1">부평역(캠퍼스타운역방면)</strong>
                        <p className="tt2">첫차 05:37 / 막차 24:27</p>
                      </li>
                    </ul>
                    <p>캠퍼스타운역(인천지하철 1호선) ↔ 부평역(서울지하철 1호선 환승) ↔ 신도림(서울지하철 2호선환승) ↔ 신촌역</p>
                    <p>캠퍼스타운역(인천지하철 1호선) ↔ 계양역(공항철도 환승) ↔ 홍대입구역(서울지하철 2호선 환승) ↔ 신촌역</p>
                  </div>
                </li>
                <li className="bus traffic" data-aos="fade-in">
                  <div className="leftBox">
                    <div className="icon"></div>
                    <p className="text">버스</p></div>
                  <ul className="textBox list">
                    <li>
                      <strong className="num">6-3 </strong>
                      <div className="text">
                        <p className="tt1">송공영차고지 ↔ 송도공영차고지</p>
                        <span className="tt2">첫차 05:30 / 막차 23:30 / 배차간격 23분</span>
                      </div>
                    </li>
                    <li>
                      <strong className="num">M6724</strong>
                      <div className="text">
                        <p className="tt1">송도 ↔ 신촌(연세대학교 정문) </p>
                        <span className="tt2">첫차 05:00 / 막차 23:10 / 배차간격 20분</span>
                      </div>
                    </li>
                    <li>
                      <strong className="num">9201</strong>
                      <div className="text">
                        <p className="tt1">성호아파트↔ 강남역</p>
                        <span className="tt2">첫차 05:00 / 막차 23:00 / 배차간격 23분</span>
                      </div>
                    </li>
                    <li>
                      <strong className="num">16</strong>
                      <div className="text">
                        <p className="tt1">무지개아파트 ↔ 가좌동차고지 </p>
                        <span className="tt2">첫차 04:40 / 막차 22:30 / 배차간격 16~22분</span>
                      </div>
                    </li>
                    <li>
                      <strong className="num">91(순환)</strong>
                      <div className="text">
                        <p className="tt1">송도공영차고지 ↔ 송도스포츠센터</p>
                        <span className="tt2">첫차 05:30 / 막차 23:00 / 배차간격 19분</span>
                      </div>
                    </li>
                    <li>
                      <strong className="num">92(순환) </strong>
                      <div className="text">
                        <p className="tt1">송도공영차고지 ↔ 엑스포빌리지 10단지</p>
                        <span className="tt2">첫차 05:30/ 막차 23:00 / 배차간격 19분</span>
                      </div>
                    </li>
                    <li>
                      <strong className="num">81</strong>
                      <div className="text">
                        <p className="tt1">석남동차고지 ↔ 복합환승센타투모로우시티 </p>
                        <span className="tt2">첫차 05:00 / 막차 22:30 / 배차간격 19분</span>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="box box02">
              <div className="titleWrap type2 left" data-aos="flip-up" data-aos-duration="1000">
                <p className="tt1">자가용 이용안내</p>
              </div>
              <div className="traffic car" data-aos="fade-in">
                <div className="leftBox">
                  <div className="icon"></div>
                  <p className="text">자동차</p></div>
                <ul className="textBox list">
                  <li>
                    <strong className="tt1">인천공항고속도로</strong>
                    <p className="tt2">공항신도시 JC에서 송도 방면으로 진출 → 인천대교 통과 → 송도IC로 진출(송도 방면) → 송도1교(고가차도)아래에서 우회전 → 센트럴로
                      교차로에서 연세대학교 방면으로 좌회전 → 직진 후 좌회전하여 캠퍼스 진입</p>
                  </li>
                  <li>
                    <strong className="tt1">제2경인고속도로</strong>
                    <p className="tt2">문학IC로 진출(송도국제도시 방면) → 문학터널/청량터널/동춘터널 통과 후 직진 → 송도국제도시로 진입 → 쉐라톤인천호텔 사거리에서 좌회전 →
                      계속 직진 후 송도국제대로 교차로 통과 → 직진 후 좌회전하여 캠퍼스 진입</p>
                  </li>
                  <li>
                    <strong className="tt1">제1경인고속도로</strong>
                    <p className="tt2">인천IC(제1경인고속도로 종점)에서 좌회전 → 아암대로 진입 후 직진(송도국제도시 방면) → 송도1교(고가차도)아래에서 우회전 → 센트럴로
                      교차로에서 연세대학교 방면으로 좌회전 → 직진 후 좌회전하여 캠퍼스 진입</p>
                  </li>
                  <li>
                    <strong className="tt1">제3경인고속도로</strong>
                    <p className="tt2">월곶JC에서 인천공항 방면 진입 후 직진 → 고잔 톨게이트 통과 → 송도4교(고가차도)아래에서 좌회전 → 송도바이오대로 교차로에서 연세대학교
                      방면으로 우회전 → 직진 후 우회전하여 캠퍼스 진입7</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default KbioLocation;
