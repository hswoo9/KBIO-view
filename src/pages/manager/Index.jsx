import React, { useState, useEffect, useCallback } from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
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
import Swal from "sweetalert2";
import moment from "moment";
import LoadingSpinner from "@/components/LoadingSpinner";

function Index(props) {
    const [isLoading, setIsLoading] = useState(true);  // 로딩 상태

// mngrAcsIpChk(useNavigate())
    const [status, setStatus] = useState({
        mvnEntCnt : 0,
        mbrType2Cnt : 0,
        mbrType4Cnt : 0,
        dfclCnt : 0,
        cnsltAply26Cnt : 0,
        cnsltAply27Cnt : 0,
        activeYCnt : 0,
        activeWCnt : 0,
        activeRCnt : 0,
        activeSCnt : 0,
    });
    const [pstList, setPstList] = useState([]);
    const [calendarDataList, setCalendarDataList] = useState([]);

    const [currentMonth, setCurrentMonth] = useState(new Date());

    // 연도 및 월 변경 핸들러
    const handleYearChange = (e) => {
        setCurrentMonth(setYear(currentMonth, parseInt(e.target.value, 10)));
    };

    const handleMonthChange = (e) => {
        setCurrentMonth(setMonth(currentMonth, parseInt(e.target.value, 10)));
    };

    const handlePrevNextChange = (type) => {
        if(type == "prev"){
            if(format(subMonths(currentMonth, 1), "M") == 12){
                setCurrentMonth(setYear(currentMonth, parseInt((format(currentMonth, "yyyy") - 1), 10)));
                document.getElementById("yearSelect").value = String(setYear(currentMonth, parseInt((format(currentMonth, "yyyy") - 1), 10)));
                setCurrentMonth(subMonths(currentMonth, 1));
            }else{
                setCurrentMonth(subMonths(currentMonth, 1));
            }
        }else{
            if(format(subMonths(currentMonth, 1), "M") == 1){
                setCurrentMonth(setYear(currentMonth, parseInt((format(currentMonth, "yyyy") - 1), 10)));
                document.getElementById("yearSelect").value = String(setYear(currentMonth, parseInt((format(currentMonth, "yyyy") - 1), 10)));
                setCurrentMonth(addMonths(currentMonth, 1));
            }else{
                setCurrentMonth(addMonths(currentMonth, 1));
            }
        }
    }

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
        const yyyyMMdd= moment(day).format('YYYY-MM-DD')
        if(thisMonthBlooean) {
            return (
                <p
                    className="date"
                    key={day}
                >
                    {returnDay}
                    <span className="list">
                        <NavLink to={URL.MANAGER_CONSULTING_MATCHING}>
                            <span>컨설팅의뢰</span>
                            <strong className="red">
                                {calendarDataList.find(item => item.day === yyyyMMdd && item.type === "consulting")?.cnt || 0}
                            </strong>
                        </NavLink>
                        <NavLink to={URL.MANAGER_SIMPLE_CONSULTING}>
                            <span>간편상담</span>
                            <strong className="red">{calendarDataList.find(item => item.day === yyyyMMdd && item.type === "simpleConsult")?.cnt || 0}</strong>
                        </NavLink>
                        <NavLink to={URL.MANAGER_DIFFICULTIES}>
                            <span>애로사항</span>
                            <strong className="red">{calendarDataList.find(item => item.day === yyyyMMdd && item.type === "dfclMttr")?.cnt || 0}</strong>
                        </NavLink>
                    </span>
                </p>
            )

        } else {
            return (
                <p className="date gray" key={day}>
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

    const getStatus = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: "",
        };

        EgovNet.requestFetch("/mMainApi/getStatus", requestOptions, (resp) => {
            setStatus(resp.result.mainStatus)
        });
    }

    const getPstList = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                pageIndex: 1,
                bbsSn : 2,
                actvtnYn : "Y",
                searchVal : "",
            })
        };
        EgovNet.requestFetch(
            "/pstApi/getPstList.do",
            requestOptions,
            (resp) => {
                let dataList = [];
                dataList.push(
                    <tr key="0">
                        <td colSpan="5">데이터가 없습니다.</td>
                    </tr>
                );

                resp.result.pstList.slice(0, 5).forEach(function (item, index) {
                    if (index === 0) dataList = []; // 목록 초기화
                    dataList.push(
                        <tr key={item.pstSn} fk={item.pstSn}>
                            <td>
                                <p>
                                    {item.pstClsfNm}
                                </p>
                            </td>
                            <td style={{textAlign: "left", paddingLeft: "15px"}}>
                                <Link to={URL.MANAGER_PST_QNA_DETAIL}
                                      mode={CODE.MODE_READ}
                                      state={{pstSn: item.pstSn}}
                                >
                                    <p>
                                        {item.pstTtl}
                                    </p>
                                </Link>
                            </td>
                            <td>
                                <p>
                                    {item.kornFlnm}
                                </p>
                            </td>
                            <td>
                                <p>
                                    {moment(item.frstCrtDt).format('YYYY-MM-DD')}
                                </p>
                            </td>
                            <td>
                                {item.answer === "Y" ?
                                    (<p className='complete'>답변완료</p>) : (<p className='waiting'>답변대기</p>)}
                            </td>
                        </tr>
                    );

                    if (index === 4) {
                        return false;
                    }
                });
                setPstList(dataList);
                setIsLoading(false);
            },
            function (resp) {

            }
        )
    };

    useEffect(() => {
        getStatus()
        getPstList()
    }, []);

    const getCalendarData = (currentMonth) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                year : format(currentMonth, "yyyy"),
                month : format(currentMonth, "MM")
            })
        };
        EgovNet.requestFetch("/mMainApi/getCalendarData.do", requestOptions, (resp) => {
            setCalendarDataList(resp.result.mainCalendar);
        })
    }

    useEffect(() => {
        getCalendarData(currentMonth);
    }, [currentMonth]);
    return (
        <div id="container" className="container layout home">

            {isLoading &&
                <LoadingSpinner />
            }

            <div className="inner">
                <div className="leftBox">
                    <div className="cont cont01">
                        <h2 className="pageTitle"><p>운영 지원 현황</p></h2>
                        <ul className="list">
                        <li>
                            <p className="tt1">입주기업</p>
                            <NavLink
                                to={URL.MANAGER_OPERATIONAL_SUPPORT}
                                className="tt2">
                                <span>{status.mvnEntCnt}</span>
                            </NavLink>
                        </li>
                        <li>
                            <p className="tt1">유관기관</p>
                            <NavLink
                                to={URL.MANAGER_RELATED_ORGANIZATION}
                                className="tt2">
                                <span>{status.relInstCnt}</span>
                            </NavLink>
                        </li>
                        <li>
                            <p className="tt1">비입주기업</p>
                            <NavLink
                                to={URL.MANAGER_NORMAL_MEMBER}
                                className="tt2">
                                <span>{status.mbrType4Cnt}</span>
                            </NavLink>
                        </li>
                        <li>
                            <p className="tt1">애로사항</p>
                            <NavLink
                                to={URL.MANAGER_DIFFICULTIES}
                                className="tt2">
                                <span>{status.dfclCnt}</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="cont cont02">
                    <h2 className="pageTitle"><p>컨설팅 지원 현황</p></h2>
                    <ul className="list">
                        <li>
                            <p className="tt1">전문가</p>
                            <NavLink
                                to={URL.MANAGER_CONSULTING_EXPERT}
                                className="tt2">
                                <span>{status.mbrType2Cnt}</span>
                            </NavLink>
                        </li>
                        <li>
                            <p className="tt1">컨설팅 의뢰</p>
                            <NavLink
                                to={URL.MANAGER_CONSULTING_MATCHING}
                                className="tt2">
                                <span>{status.cnsltAply26Cnt}</span>
                            </NavLink>
                        </li>
                        <li>
                            <p className="tt1">간편상담</p>
                            <NavLink
                                to={URL.MANAGER_SIMPLE_CONSULTING}
                                className="tt2">
                                <span>{status.cnsltAply27Cnt}</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="cont cont03">
                    <h2 className="pageTitle"><p>회원가입 현황</p></h2>
                    <ul className="list">
                        <li>
                            <p className="tt1">승인</p>
                            <NavLink
                                to={URL.MANAGER_APPROVAL_MEMBER}
                                className="tt2">
                                <span>{status.mbrSttsYCnt}</span>
                            </NavLink>
                        </li>
                        <li>
                            <p className="tt1">승인대기</p>
                            <NavLink
                                to={URL.MANAGER_WAIT_MEMBER}
                                className="tt2">
                                <span>{status.mbrSttsWCnt}</span>
                            </NavLink>
                        </li>
                        <li>
                            <p className="tt1">승인 거절</p>
                            <NavLink
                                to={URL.MANAGER_REJECT_MEMBER}
                                className="tt2">
                                <span>{status.mbrSttsRCnt}</span>
                            </NavLink>
                        </li>
                        <li>
                            <p className="tt1">이용 정지</p>
                            <NavLink
                                to={URL.MANAGER_STOP_MEMBER}
                                className="tt2">
                                <span>{status.mbrSttsSCnt}</span>
                            </NavLink>
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
                            {pstList}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="rightBox calendarWrap">
                <div className="topBox">
                    <button type="button" className="arrowBtn prevBtn"
                            onClick={() => handlePrevNextChange("prev")}
                    >
                        {/*onClick={() => {setCurrentMonth(subMonths(currentMonth, 1))}}*/}
                        <div className="icon"></div>
                    </button>
                    <div className="yearBox">
                        <div className="itemBox">
                            <select className="mainSelectGroup"
                                    value={currentYear}
                                    id="yearSelect"
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
                    <button type="button" className="arrowBtn nextBtn"
                            onClick={() => handlePrevNextChange("next")}
                    >
                        {/*onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}*/}
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
