import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getBnrPopupList} from "@/components/main/MainComponents";
import AOS from "aos";

function KBioLabHub(props) {
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
      <div id="container" className="container organization">
        <div className="inner">
          <CommonSubMenu/>
          <div className="inner2">
            <div className="organizationBox" data-aos="fade-up" data-aos-duration="1500">
              <div className="text1">
                <div className="text type1 move">
                  <strong className="title">사업추진단 협의체</strong>
                  <p className="text">중소벤처기업부 - 인천광역시 - 연세대학교</p>
                </div>
              </div>
              <div className="textWrap">
                <div className="text type2 text3">
                  <p className="text">건축 TF</p>
                </div>
                <div className="textWrap2">
                  <div className="text type1 text2">
                    <strong className="title">사업추진단 협의체</strong>
                    <p className="text">단장</p>
                  </div>
                  <ul className="textWrap3">
                    <li className="text type2 text4">
                      <p className="text">전략기획팀</p>
                    </li>
                    <li className="text type2 text5">
                      <p className="text">경영지원팀</p>
                    </li>
                    <li className="text type2 text6">
                      <p className="text">프로그램관리팀</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="searchFormWrap type1" data-aos="fade-up" data-aos-duration="1500">
              <form>
                <div className="itemBox type2">
                  <select
                      className="niceSelectCustom"
                  >
                    <option value="0" selected>부서</option>
                    <option value="1">예시1</option>
                    <option value="2">예시2</option>
                  </select>
                </div>
                <div className="searchBox">
                  <div className="itemBox type2">
                    <select
                        className="niceSelectCustom"
                    >
                      <option value="0">전체</option>
                      <option value="1">분류</option>
                      <option value="2">제목</option>
                    </select>
                  </div>
                  <div className="inputBox type1">
                    <label className="input">
                      <input type="text"
                             id="board_search"
                             name="board_search"
                             placeholder="검색어를 입력해주세요."
                      />
                    </label>
                  </div>
                  <button type="button" className="searchBtn">
                    <div className="icon"></div>
                  </button>
                </div>
              </form>
            </div>
            <div className="tableCont type1" data-aos="fade-up" data-aos-duration="1500">
              <table>
                <caption>게시판</caption>
                <thead>
                <tr>
                  <th className="th1"><p>소속</p></th>
                  <th className="th1"><p>직책</p></th>
                  <th className="th1"><p>이름</p></th>
                  <th className="th3"><p>담당업무</p></th>
                  <th className="th2"><p>전화번호</p></th>
                  <th className="th2"><p>이메일</p></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td><p>전략기획팀</p></td>
                  <td><p>단장</p></td>
                  <td><p>홍길동</p></td>
                  <td><p>업무분야 내용입니다.</p></td>
                  <td><a href="tel:02-3780-0221"><span>02-3780-0221</span></a></td>
                  <td><a href="mailto:hong@tipa.or.kr"><span>hong@tipa.or.kr</span></a></td>
                </tr>
                <tr>
                  <td><p>전략기획팀</p></td>
                  <td><p>단장</p></td>
                  <td><p>홍길동</p></td>
                  <td><p>업무분야 내용입니다.</p></td>
                  <td><a href="tel:02-3780-0221"><span>02-3780-0221</span></a></td>
                  <td><a href="mailto:hong@tipa.or.kr"><span>hong@tipa.or.kr</span></a></td>
                </tr>
                <tr>
                  <td><p>전략기획팀</p></td>
                  <td><p>단장</p></td>
                  <td><p>홍길동</p></td>
                  <td><p>업무분야 내용입니다.</p></td>
                  <td><a href="tel:02-3780-0221"><span>02-3780-0221</span></a></td>
                  <td><a href="mailto:hong@tipa.or.kr"><span>hong@tipa.or.kr</span></a></td>
                </tr>
                <tr>
                  <td><p>전략기획팀</p></td>
                  <td><p>단장</p></td>
                  <td><p>홍길동</p></td>
                  <td><p>업무분야 내용입니다.</p></td>
                  <td><a href="tel:02-3780-0221"><span>02-3780-0221</span></a></td>
                  <td><a href="mailto:hong@tipa.or.kr"><span>hong@tipa.or.kr</span></a></td>
                </tr>
                <tr>
                  <td><p>전략기획팀</p></td>
                  <td><p>단장</p></td>
                  <td><p>홍길동</p></td>
                  <td><p>업무분야 내용입니다.</p></td>
                  <td><a href="tel:02-3780-0221"><span>02-3780-0221</span></a></td>
                  <td><a href="mailto:hong@tipa.or.kr"><span>hong@tipa.or.kr</span></a></td>
                </tr>
                <tr>
                  <td><p>전략기획팀</p></td>
                  <td><p>단장</p></td>
                  <td><p>홍길동</p></td>
                  <td><p>업무분야 내용입니다.</p></td>
                  <td><a href="tel:02-3780-0221"><span>02-3780-0221</span></a></td>
                  <td><a href="mailto:hong@tipa.or.kr"><span>hong@tipa.or.kr</span></a></td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="pageWrap">
              <ul className="pageList">
                <li className="first arrow disabled"><a href="javascript:;"><span>처음</span></a></li>
                <li className="prev arrow disabled"><a href="javascript:;"><span>이전</span></a></li>
                <li className="now num"><a href="javascript:;"><span>1</span></a></li>
                <li className="num"><a href="javascript:;"><span>2</span></a></li>
                <li className="num"><a href="javascript:;"><span>3</span></a></li>
                <li className="next arrow"><a href="javascript:;"><span>다음</span></a></li>
                <li className="last arrow"><a href="javascript:;"><span>마지막</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}

export default KBioLabHub;
