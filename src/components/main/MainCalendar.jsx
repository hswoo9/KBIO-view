import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, NavLink, useNavigate } from "react-router-dom";
import { getBbsInPst } from "@/components/CommonComponents";
import { getSessionItem } from "@/utils/storage";
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
import moment from "moment/moment.js";

function MainCalendar() {
    const navigate = useNavigate();
    const sessionUser = getSessionItem("loginUser");
    const userSn = getSessionItem("userSn");
    const [calendarList, setCalendarList] = useState([]);
    const [menuList, setMenuList] = useState([]);
    const [bbsList, setBbsList] = useState([]);
    const [tabList, setTabList] = useState([]);
    const tdRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [selectDate, setSelectDate] = useState(new Date());

    const [selectMonth, setSelectMonth] = useState(format(currentMonth, "M"));
    const [selectDay, setSelectDay] = useState(format(currentMonth, "dd"));
    const currentYear = format(currentMonth, "yyyy");
    const currentMonthIndex = format(currentMonth, "M");
    const startMonth = startOfMonth(currentMonth);
    const endMonth = endOfMonth(currentMonth);
    let startDate = startOfWeek(startMonth);
    let totalDays = [];
    let day = startDate;
    while (totalDays.length < 35) {
        totalDays.push(day);
        day = addDays(day, 1);
    }

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const handleTabClick = (index) => {

        const tabLiClass = document.querySelector(".tabLi.active");
        if(tabLiClass){
            tabLiClass.classList.remove("active");
        }
        const tabContClass = document.querySelector(".tabCont.active");
        if(tabContClass){
            tabContClass.classList.remove("active");
        }
        const tabClass = document.querySelectorAll(".tab" + index);
        if(tabClass){
            tabClass.forEach(function(item, index){
                item.classList.add("active");
            })
        }

    };

    const leapYear = isLeapYear(currentMonth);

    const monthInputRef = useRef(null);
    const handleMonthClick = () => {
        if(monthInputRef.current){
            monthInputRef.current.showPicker();
        }
    }

    const monthChangeEvent = (e) => {
        const inputYear = e.target.value.split("-")[0];
        const inputMonth = e.target.value.split("-")[1];
        setCurrentMonth( (prevMonth) => {
            let updatedMonth = setYear(prevMonth, parseInt(inputYear, 10));
            updatedMonth = setMonth(updatedMonth, parseInt((inputMonth - 1), 10));
            return updatedMonth;
        });
    }

    const handlePrevNextChange = (type) => {
        if(type == "prev"){
            if(format(subMonths(currentMonth, 1), "M") == 12){
                setCurrentMonth(setYear(currentMonth, parseInt((format(currentMonth, "yyyy") - 1), 10)));
                setCurrentMonth(subMonths(currentMonth, 1));
            }else{
                setCurrentMonth(subMonths(currentMonth, 1));
            }
        }else{
            if(format(subMonths(currentMonth, 1), "M") == 1){
                setCurrentMonth(setYear(currentMonth, parseInt((format(currentMonth, "yyyy") - 1), 10)));
                setCurrentMonth(addMonths(currentMonth, 1));
            }else{
                setCurrentMonth(addMonths(currentMonth, 1));
            }
        }
    }

    const dayClick = (e) => {
        const tdElement = e.target.closest("td");
        if(tdElement){
            const day = tdElement.getAttribute("day");
            setSelectDay(day);
            setSelectDate(format(currentMonth, "yyyy-MM") + "-" + String(day).padStart(2, '0'))
        }
    }

    const dayPstCnt = (day) => {
        const pstCnt =  calendarList.filter(event =>
            moment(day).format('YYYYMMDD') >= event.ntcBgngDt && moment(day).format('YYYYMMDD') <= event.ntcEndDate
        ).length;

        return pstCnt ? pstCnt + "건" : ""
    }

    const renderWeeks = () => {
        const weeks = [];
        for (let i = 0; i < totalDays.length; i += 7) {
            const week = totalDays.slice(i, i + 7);
            weeks.push(
                <tr key={i}>
                    {week.map((day, idx) => (
                        <td
                            key={idx}
                            className={isSameMonth(day, currentMonth) ? selectDay == format(day, "d") ? "click" : "" : "noText"}
                            onClick={isSameMonth(day, currentMonth) ? dayClick : undefined} day={format(day, "d")}
                        >
                            {
                                isSameMonth(day, currentMonth) ? (
                                    <>
                                        <strong className="num">
                                            {format(day, "d")}
                                        </strong>
                                        <p className="case">
                                            {dayPstCnt(day)}
                                        </p>
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </td>
                    ))}
                </tr>
            );
        }

        return weeks;
    };

    const pstDetailHandler = (pst) => {
        let state = {
            pstSn : pst.pstSn,
            menuSn : 32
        };

        if(pst.bbsSn == "1"){
            state.thisMenuSn = 38
            state.menuNmPath = "커뮤니티 > 공지사항"
        }else if(pst.bbsSn == "5"){
            state.thisMenuSn = 35
            state.menuNmPath = "커뮤니티 > 자료실"
        }else if(pst.bbsSn == "7"){
            state.thisMenuSn = 37
            state.menuNmPath = "커뮤니티 > 연구자료실"
        }else if(pst.bbsSn == "8"){
            state.thisMenuSn = 62
            state.menuNmPath = "커뮤니티 > 보도자료"
        }

        navigate(
            { pathname: URL.COMMON_PST_NORMAL_DETAIL },
            { state: state },
            { mode:  CODE.MODE_READ}
        );
    };

    const makerPstLi = (list) => {
        let resultList = [];
        resultList.push(
            <li
                key="no_data"
                className="mouseCursor"
            >
                <a>
                    <p>게시글이 없습니다.</p>
                </a>
            </li>
        )


        list.forEach(function (item, index) {
            if (index === 0) resultList = [];
            if(moment(selectDate).format('YYYYMMDD') >= item.ntcBgngDt && moment(selectDate).format('YYYYMMDD') <= item.ntcEndDate){
                resultList.push(
                    <li
                        onClick={() => {
                            pstDetailHandler(item);
                        }}
                        key={item.pstSn}
                        className="mouseCursor"
                    >
                        <a>
                            <p>{item.pstTtl}</p>
                        </a>
                    </li>
                )
            }
        })

        if(resultList.length == 0){
            resultList.push(
                <li
                    key="no_data"
                    className="mouseCursor"
                >
                    <a>
                        <p>게시글이 없습니다.</p>
                    </a>
                </li>
            )
        }

        return resultList;
    }

    useEffect(() => {
        getBbsInPst(null, "0", "Y", userSn, format(selectDate, "yyyy-MM-dd")).then((data) => {
            let bbsList = [];
            let tabList = [];
            let calList = [];

            if(data){
                data.forEach(function(item, index){
                    bbsList.push(
                        <li
                            className={index === 0 ? `tabLi tab${index} active` : `tabLi tab${index}`}
                            onClick={() => handleTabClick(index)}
                            key={index}
                        >
                            <NavLink>
                                <span>{item.bbsNm}</span>
                            </NavLink>
                        </li>
                    )


                    tabList.push(
                        <div className={`tabCont tab${index} ${index === 0 ? 'active' : ''}`} key={`${index}_sub`}>
                            <ul className="list">
                                {makerPstLi(item.tblPstList)}
                            </ul>
                        </div>
                    )

                    calList = [...calList, ...item.tblPstList]
                })
            }

            setBbsList(bbsList);
            setTabList(tabList);
            setCalendarList(calList)
        });
    }, [selectDate]);

    useEffect(() => {
        setSelectDate(format(currentMonth, "yyyy-MM-dd"))
    }, [currentMonth]);

    return (
        <section className="sec sec03" data-aos="fade-in">
            <div className="inner">
                <h2 className="secTitle">일정현황</h2>
                <div className="boxWrap">
                    <div className="calendarWrap leftBox" data-aos="fade-right" data-aos-duration="1500">
                        <div className="topBox">
                            <button type="button" className="arrowBtn prevBtn"
                                    onClick={() => handlePrevNextChange("prev")}>
                                <div className="icon"></div>
                            </button>
                            <div className="date"><strong>{currentYear}년 {currentMonthIndex}월</strong>
                                <label htmlFor="month-input" className="visually-hidden">날짜 선택</label>
                                <div className="icon" onClick={handleMonthClick}>
                                    <input
                                        type="month"
                                        id="month-input"
                                        name="month"
                                        ref={monthInputRef}
                                        className="customMonth"
                                        onChange={monthChangeEvent}
                                    />
                                </div>
                            </div>
                            <button type="button" className="arrowBtn nextBtn"
                                    onClick={() => handlePrevNextChange("next")}>
                            <div className="icon"></div>
                            </button>
                        </div>
                        <div className="calendarBox">
                            <table>
                                <caption>달력</caption>
                                <thead>
                                <tr>
                                    <th><p>일요일</p></th>
                                    <th><p>월요일</p></th>
                                    <th><p>화요일</p></th>
                                    <th><p>수요일</p></th>
                                    <th><p>목요일</p></th>
                                    <th><p>금요일</p></th>
                                    <th><p>토요일</p></th>
                                </tr>
                                </thead>
                                <tbody>
                                {renderWeeks()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="rightBox tabContWrap" data-aos="fade-right" data-aos-duration="1500">
                        <div className="topBox">
                            <strong className="date">{currentMonthIndex}월 {selectDay}일</strong>
                            <div className="tabBox type1">
                                <div className="bg hover"></div>
                                <ul className="list">
                                    {bbsList}
                                </ul>
                            </div>
                        </div>
                        {tabList}
                    </div>
                </div>
            </div>
        </section>

    );
}

export default MainCalendar;
