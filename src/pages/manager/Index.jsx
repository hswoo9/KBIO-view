import React, { useState, useEffect, useCallback } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isToday,
    setMonth,
    setYear,
    isLeapYear,
    subMonths,
    addMonths,
} from "date-fns";

import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import {mngrAcsIpChk} from "@/components/CommonComponents.jsx";

function Index(props) {
// mngrAcsIpChk(useNavigate())
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // 연도 및 월 변경 핸들러
    const handleYearChange = (e) => {
        setCurrentMonth(setYear(currentMonth, parseInt(e.target.value, 10)));
    };

    const handleMonthChange = (e) => {
        setCurrentMonth(setMonth(currentMonth, parseInt(e.target.value, 10)));
    };

    // 현재 연도 & 월
    const currentYear = format(currentMonth, "yyyy");
    const currentMonthIndex = format(currentMonth, "M") - 1;

    // 현재 월의 시작과 끝
    const startMonth = startOfMonth(currentMonth);
    const endMonth = endOfMonth(currentMonth);
    let startDate = startOfWeek(startMonth);
    let totalDays = [];
    let day = startDate;

    // 최대 5주(35일) 채우기
    while (totalDays.length < 35) {
        totalDays.push(day);
        day = addDays(day, 1);
    }

    // 윤년 체크
    const leapYear = isLeapYear(currentMonth);

    const makerDayEvent = (day, thisMonthBlooean) => {
        let returnDay = format(day, "d");
        if(thisMonthBlooean) {
            return (
                <p
                    className="date"
                >
                    {returnDay}
                    <div className="list">
                        <a href="#"><p>컨설팅의뢰</p><strong className="red">0</strong></a>
                        <a href="#"><p>간편상담</p><strong className="red">0</strong></a>
                        <a href="#"><p>승인 대기</p><strong className="red">0</strong></a>
                        <a href="#"><p>애로사항</p><strong className="red">0</strong></a>
                    </div>
                </p>
            )

        } else {
            return (
                <p className="date gray">
                    {returnDay}
                </p>
            )
        }
    }

    const renderWeeks = () => {
        const weeks = [];
        for (let i = 0; i < totalDays.length; i += 7) {
            const week = totalDays.slice(i, i + 7);

            weeks.push(
                <tr key={i}>
                    {week.map((day, idx) => (
                        <td key={idx}>
                        {makerDayEvent(day, isSameMonth(day, currentMonth))}
                        </td>
                    ))}
                </tr>
            );
        }
        return weeks;
    };

    return (
    <div id="container" className="container layout home">
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
                    <button type="button" className="arrowBtn prevBtn" onClick={() => {setCurrentMonth(subMonths(currentMonth, 1))}}>
                        <div className="icon"></div>
                    </button>
                    <div className="yearBox">
                        <div className="itemBox">
                            <select className="mainSelectGroup"
                                    defaultValue="2025"
                                    onChange={handleYearChange}
                            >
                                {Array.from({ length: 10 }, (_, i) => (
                                    <option key={i} value={2020 + i}>
                                        {2020 + i}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="monthBox">
                        <div className="itemBox">
                            <select className="mainSelectGroup"
                                    value={currentMonthIndex}
                                    onChange={handleMonthChange}
                            >
                                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((month, index) => (
                                    <option key={index} value={index}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="button" className="arrowBtn nextBtn"onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
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
                            {renderWeeks()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Index;
