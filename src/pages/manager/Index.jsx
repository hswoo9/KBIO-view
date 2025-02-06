import React, { useState, useEffect, useCallback } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import {mngrAcsIpChk} from "@/components/CommonComponents.jsx";

function Index(props) {
    // mngrAcsIpChk(useNavigate())

  return (
    <div id="container" className="container layout home">
        <div className="inner">
            <div className="inner">
                <div className="leftBox">
                    <div className="cont cont01">
                        <h2 className="pageTitle"><p>운영 지원 현황</p></h2>
                        <ul className="list">
                            <li>
                                <p className="tt1">입주기업</p>
                                <a href="#" className="tt2"><span>15</span></a>
                            </li>
                            <li>
                                <p className="tt1">유관기업</p>
                                <a href="#" className="tt2"><span>3</span></a>
                            </li>
                            <li>
                                <p className="tt1">비입주기업</p>
                                <a href="#" className="tt2"><span>4</span></a>
                            </li>
                            <li>
                                <p className="tt1">애로사항</p>
                                <a href="#" className="tt2"><span>20</span></a>
                            </li>
                        </ul>
                    </div>
                    <div className="cont cont02">
                        <h2 className="pageTitle"><p>컨설팅 지원 현황</p></h2>
                        <ul className="list">
                            <li>
                                <p className="tt1">전문가</p>
                                <a href="#" className="tt2"><span>79</span></a>
                            </li>
                            <li>
                                <p className="tt1">컨설팅 의뢰</p>
                                <a href="#" className="tt2"><span>57</span></a>
                            </li>
                            <li>
                                <p className="tt1">간편상담</p>
                                <a href="#" className="tt2"><span>18</span></a>
                            </li>
                        </ul>
                    </div>
                    <div className="cont cont03">
                        <h2 className="pageTitle"><p>회원가입 현황</p></h2>
                        <ul className="list">
                            <li>
                                <p className="tt1">승인</p>
                                <a href="#" className="tt2"><span>483</span></a>
                            </li>
                            <li>
                                <p className="tt1">승인대기</p>
                                <a href="#" className="tt2"><span>96</span></a>
                            </li>
                            <li>
                                <p className="tt1">승인 거절</p>
                                <a href="#" className="tt2"><span>17</span></a>
                            </li>
                            <li>
                                <p className="tt1">이용 정지</p>
                                <a href="#" className="tt2"><span>6</span></a>
                            </li>
                        </ul>
                    </div>
                    <div className="cont cont04">
                        <h2 className="pageTitle"><p>Q&A</p></h2>
                        <div className="tableBox type1">
                            <table>
                                <caption>게시판</caption>
                                <thead>
                                <tr>
                                    <th className="th1"><p>분류</p></th>
                                    <th className="th2"><p>제목</p></th>
                                    <th className="th3"><p>성명</p></th>
                                    <th className="th4"><p>등록일</p></th>
                                    <th className="th5"><p>상태</p></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><p>분류값</p></td>
                                    <td><p>제목입니다.제목입니다.제목입니다.제목입니다.</p></td>
                                    <td><p>김철수</p></td>
                                    <td><p>2025. 01. 28.</p></td>
                                    <td><p className="waiting">답변대기</p></td>
                                </tr>
                                <tr>
                                    <td><p>분류값</p></td>
                                    <td><p>제목입니다.</p></td>
                                    <td><p>김철수</p></td>
                                    <td><p>2025. 01. 28.</p></td>
                                    <td><p className="waiting">답변대기</p></td>
                                </tr>
                                <tr>
                                    <td><p>분류값</p></td>
                                    <td><p>제목입니다.</p></td>
                                    <td><p>김철수</p></td>
                                    <td><p>2025. 01. 28.</p></td>
                                    <td><p className="complete">답변완료</p></td>
                                </tr>
                                <tr>
                                    <td><p>분류값</p></td>
                                    <td><p>제목입니다.</p></td>
                                    <td><p>김철수</p></td>
                                    <td><p>2025. 01. 28.</p></td>
                                    <td><p className="complete">답변완료</p></td>
                                </tr>
                                <tr>
                                    <td><p>분류값</p></td>
                                    <td><p>제목입니다.</p></td>
                                    <td><p>김철수</p></td>
                                    <td><p>2025. 01. 28.</p></td>
                                    <td><p className="complete">답변완료</p></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="rightBox calendarWrap">
                    <div className="topBox">
                        <button type="button" className="arrowBtn prevBtn">
                            <div className="icon"></div>
                        </button>
                        <div className="yearBox">
                            <div className="itemBox">
                                <select className="mainSelectGroup"
                                    defaultValue="2025"
                                >
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                    <option value="2030">2030</option>
                                </select>
                            </div>
                        </div>
                        <div className="monthBox">
                            <div className="itemBox">
                                <select className="mainSelectGroup"
                                    defaultValue="2"
                                >
                                    <option value="1">01</option>
                                    <option value="2">02</option>
                                    <option value="3">03</option>
                                    <option value="4">04</option>
                                    <option value="5">05</option>
                                    <option value="6">06</option>
                                    <option value="7">07</option>
                                    <option value="8">08</option>
                                    <option value="9">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
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
                                <td><p className="date gray">29</p></td>
                                <td><p className="date gray">30</p></td>
                                <td><p className="date gray">31</p></td>
                                <td>
                                    <p className="date">1</p>
                                    <div className="list">
                                        {/*링크 사용 안 하게 되면 div 로 변경해주세요*/}
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">2</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">3</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">4</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="date">5</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">6</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">7</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">8</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">9</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">10</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">11</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="date">12</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">13</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">14</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">15</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">16</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">17</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">18</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="date">19</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">20</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">21</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">22</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date today">23</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">24</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">25</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="date">26</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">27</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">28</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">29</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">30</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td>
                                    <p className="date">31</p>
                                    <div className="list">
                                        <a href="#"><p>컨설팅의뢰</p><strong className="red">99</strong></a>
                                        <a href="#"><p>간편상담</p><strong className="red">99</strong></a>
                                        <a href="#"><p>승인 대기</p><strong className="red">99</strong></a>
                                        <a href="#"><p>애로사항</p><strong className="red">99</strong></a>
                                    </div>
                                </td>
                                <td><p className="date gray">1</p></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Index;
