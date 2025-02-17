import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getBnrPopupList} from "@/components/main/MainComponents";
import AOS from "aos";

import user_business_overview_box01_img from "@/assets/images/user_business_overview_box01_img.jpg";
import user_business_overview_box02_logo from "@/assets/images/user_business_overview_box02_logo.png";
import user_business_overview_box02_icon01 from "@/assets/images/user_business_overview_box02_icon01.png";
import user_business_overview_box02_icon02 from "@/assets/images/user_business_overview_box02_icon02.png";
import user_business_overview_box02_icon03 from "@/assets/images/user_business_overview_box02_icon03.png";
import user_business_overview_box02_icon04 from "@/assets/images/user_business_overview_box02_icon04.png";
import user_business_overview_box05_icon01 from "@/assets/images/user_business_overview_box05_icon01.png";
import user_business_overview_box05_icon02 from "@/assets/images/user_business_overview_box05_icon02.png";
import user_business_overview_box05_icon03 from "@/assets/images/user_business_overview_box05_icon03.png";
import user_business_overview_box05_icon04 from "@/assets/images/user_business_overview_box05_icon04.png";
import user_business_overview_box05_icon05 from "@/assets/images/user_business_overview_box05_icon05.png";
import user_business_overview_box05_icon06 from "@/assets/images/user_business_overview_box05_icon06.png";



function BusinessOverview(props) {
  const location = useLocation();
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;
  const userSn = getSessionItem("userSn");

  const [popUpList, setPopUpList] = useState([]);

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
    AOS.init();
  }, []);

  return (
      <div id="container" className="container business_overview">
        <div className="inner">
          <CommonSubMenu/>
          <div className="inner2">
            <div className="box box01" data-aos="fade-in">
              <div className="titleWrap type2" data-aos="flip-up" data-aos-duration="1000">
                <p className="tt1">사업개요</p>
                <strong className="tt2">의약바이오 분야 창업기업이 글로벌 혁신기업으로 빠르게 성장할 수 있도록 특화지원(후보물질 발굴&gt;사업화) 체계 구축</strong>
              </div>
              <div className="textBox">
                <p>사업기간: ‘23~31’년(9년), *’32년 이후 자립</p>
                <p>총예산 : 2,726억원(정부:1,095/인천시:1,550/민간:81)</p>
                <p>시설/장비: 바이오 연구시설〮장비, 입주공간, 공동커뮤니티 시설</p>
              </div>
              <figure className="imgBox"><img src={user_business_overview_box01_img} alt="image"/>
              </figure>
            </div>
            <div className="box box02" data-aos="fade-in">
              <div className="titleWrap type2" data-aos="flip-up" data-aos-duration="1000">
                <p className="tt1">사업내용</p>
                <strong className="tt2">단백질 의약품, 치료용 항체, 백신, 효소 의약품, 세포 및 조직 치료제, 유전자 체료제, 저분자 의약품, 약물전달시스템 분야 등 8대 분야
                  신약개발 창업기업</strong>
              </div>
              <div className="listWrap">
                <div className="logoBox"><img src={user_business_overview_box02_logo} alt="Bio LabHub"/>
                </div>
                <ul className="listBox">
                  <li>
                    <div className="textBox">
                      <strong className="title">입주시설 구축</strong>
                      <p className="text">기업 성장단계를 고려한 기업별 사무공간 및 <br/>공용실험공간</p>
                    </div>
                    <figure className="iconBox"><img src={user_business_overview_box02_icon01}
                                                     alt="icon image"/></figure>
                  </li>
                  <li>
                    <figure className="iconBox"><img src={user_business_overview_box02_icon02}
                                                     alt="icon image"/></figure>
                    <div className="textBox">
                      <strong className="title">연구개발 장비 구축</strong>
                      <p className="text">바이오 연구개발 장비 및 시설구축 오퍼레이터 상주 및 장비운용관리</p>
                    </div>
                  </li>
                  <li>
                    <div className="textBox">
                      <strong className="title">프로그램 운영</strong>
                      <p className="text">스타트업 기술사업화, 펀딩 및 투자 지원과 관련된 <br/>5개 프로그램 운영</p>
                    </div>
                    <figure className="iconBox"><img src={user_business_overview_box02_icon03}
                                                     alt="icon image"/></figure>
                  </li>
                  <li>
                    <figure className="iconBox"><img src={user_business_overview_box02_icon04}
                                                     alt="icon image"/></figure>
                    <div className="textBox">
                      <strong className="title">네트워킹 플랫폼</strong>
                      <p className="text">스타트업 기술사업화, 펀딩 및 투자 지원과 관련된 <br/>5개 프로그램 운영</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="box box03" data-aos="fade-in">
              <div className="titleWrap type2 left" data-aos="flip-up" data-aos-duration="1500">
                <p className="tt1">운영개요</p>
              </div>
              <ul className="listBox">
                <li>
                  <strong className="title">제공방칙</strong>
                  <p className="text">입주공간 임대, R&D시설장비, 프로그램 지원</p>
                </li>
                <li>
                  <strong className="title">입주기간</strong>
                  <p className="text">3+1 연장가능 <br/>성과평가,입주상황 등 종합평가에 연장 결정</p>
                </li>
                <li>
                  <strong className="title">입주대상</strong>
                  <p className="text">단백질 의약품, 치료용 항체, 백신, 효소 의약품, 세포 및 조직 치료제, 유전자 치료제, 저분자의약품, 약물전달시스템 등 8대 연구분야</p>
                </li>
                <li>
                  <strong className="title">입주자격</strong>
                  <p className="text">의약바이오 창업10년 미만 기업으로 입주시 선정 절차를 통과한 기업</p>
                </li>
                <li>
                  <strong className="title">선발시기</strong>
                  <p className="text">*26년 후반부터 예산 및 입주공간을 고려하여 연중 모집</p>
                </li>
                <li>
                  <strong className="title">선발기업</strong>
                  <p className="text"><strong>정기모집</strong> 창업 초기기업 및 성장기업 60개사 <br/><strong>수시모집</strong> 지원예산 및 입주공간 공실
                    등을 고려하여 소수선발</p>
                </li>
              </ul>
            </div>
            <div className="box box04" data-aos="fade-in">
              <div className="titleWrap type2 left" data-aos="flip-up" data-aos-duration="1500">
                <p className="tt1">제공서비스</p>
              </div>
              <ul className="listBox">
                <li>
                  <strong className="title">입주공간 & 실험실 제공</strong>
                  <div className="textBox">
                    <p>창업기업초기기업</p>
                    <p>오픈랩 및 개별사무실 제공</p>
                    <p>창업성장기업</p>
                    <p>개별 사무실 및 실험실 제공</p>
                    <p>커뮤니티시설</p>
                    <p>네트워킹, 휴식공간</p>
                  </div>
                </li>
                <li>
                  <strong className="title">연구개발 장비시설 제공</strong>
                  <div className="textBox">
                    <p><strong>연구장비</strong><br/>장비 특성 및 활용성 고려한 장비지원</p>
                    <p><strong>운용전문가</strong><br/>입주외부기업을 위한 장비 사용 교육, 분석서비스 및 장비 운용 관리 업무 수행</p>
                  </div>
                </li>
                <li>
                  <strong className="title">바이오 특화지원 프로그램 운영</strong>
                  <div className="textBox">
                    <p>산, 학, 연병 연계 R&D 스피드 업 프로그램</p>
                    <p>기술이전 및 오픈 이노베이션을 통한 핵심기술 확보 및 안정적 성장 지원</p>
                    <p>의약바이오 애로기술 솔루션 프로그램</p>
                    <p>개발과정에서 전문가 의견 및 솔류션 확보를 위한 외부연구그룹과의 연계 및 신기술 도입 지원</p>
                    <p>바이오특화 비즈니스(BM) 모델 구축 지원</p>
                    <p>기술의 사업화 전략수립과 비즈니스 모델 수립 지원</p>
                    <p>IP-RA R&D 전략 프로그램</p>
                    <p>의약바이오 분야 특허를 활용한 연구개발 및 특허 등 지식재산권 확보지원</p>
                    <p>바이오 스타트업Scale-up펀딩 프로그램</p>
                    <p>VC대상 IR등 컨설팅을 통해 기업 맞춤형 투자 유치하고 기업의 IR역량 강화 지원</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="box box05" data-aos="fade-in">
              <div className="titleWrap type2 left" data-aos="flip-up" data-aos-duration="1500">
                <p className="tt1">제공장비</p>
              </div>
              <ul className="listBox">
                <li>
                  <figure className="icon"><img src={user_business_overview_box05_icon01} alt="image"/>
                  </figure>
                  <strong className="title">기초실험</strong>
                  <p className="text">HPLC, MPLC, Centrifuge, Sonicator, Microplate reader, Autolave 등</p>
                </li>
                <li>
                  <figure className="icon"><img src={user_business_overview_box05_icon02} alt="image"/>
                  </figure>
                  <strong className="title">세포배양</strong>
                  <p className="text">실시간세포관찰분석시스템(incucyte), <br/>BSC,CO2 Incubator, 형광현미경 등</p>
                </li>
                <li>
                  <figure className="icon"><img src={user_business_overview_box05_icon03} alt="image"/>
                  </figure>
                  <strong className="title">세포분석</strong>
                  <p className="text">FACS(Cell sorter ,analyzer), 세포주선별장치, cell-based HTS 등</p>
                </li>
                <li>
                  <figure className="icon"><img src={user_business_overview_box05_icon04} alt="image"/>
                  </figure>
                  <strong className="title">이미징</strong>
                  <p className="text">형광 Spheroid 이미징, confocalmicroscope, Sem 등</p>
                </li>
                <li>
                  <figure className="icon"><img src={user_business_overview_box05_icon05} alt="image"/>
                  </figure>
                  <strong className="title">분석서비스</strong>
                  <p className="text">500M, NMR, 질량분석장비(MALDI, Orbitrap IQ, Orbitrap Eclipse), SPR 등</p>
                </li>
                <li>
                  <figure className="icon"><img src={user_business_overview_box05_icon06} alt="image"/>
                  </figure>
                  <strong className="title">AI-활용 모델링</strong>
                  <p className="text">AI 신약모델링 시스템(dual Xeon processor, 8RTX GPU)</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
);
}

export default BusinessOverview;
