import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, NavLink } from "react-router-dom";
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

function MainCalendar() {
    const tdRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
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

    const [activeTabIndex, setActiveTabIndex] = useState(1);
    const handleTabClick = (index) => {
        setActiveTabIndex(index);
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
        }
    }

    const renderWeeks = () => {
        document.querySelectorAll(".click").forEach((el) => el.classList.remove("click"));
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
                                    <><strong className="num">{format(day, "d")}</strong><p className="case">13건</p></>
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

    return (
        <section className="sec sec03" data-aos="fade-in">
            <div className="inner">
                <h2 className="secTitle">일정현황</h2>
                <div className="boxWrap">
                    <div className="calendarWrap leftBox" data-aos="fade-left" data-aos-duration="1500">
                        <div className="topBox">
                            <button type="button" className="arrowBtn prevBtn"
                                    onClick={() => handlePrevNextChange("prev")}>
                                <div className="icon"></div>
                            </button>
                            <div className="date"><strong>{currentYear}년 {currentMonthIndex}월</strong>
                                <div className="icon" onClick={handleMonthClick}>
                                    <input
                                        type="month"
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
                    <div className="rightBox tabContWrap" data-aos="fade-right" data-aos-duration="1500">
                        <div className="topBox">
                            <strong className="date">{currentMonthIndex}월 {selectDay}일</strong>
                            <div className="tabBox type1">
                                <div className="bg hover"></div>
                                <ul className="list">
                                    <li className={activeTabIndex === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}><NavLink><span>공지사항</span></NavLink></li>
                                    <li className={activeTabIndex === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}><NavLink><span>자료실</span></NavLink></li>
                                </ul>
                            </div>
                        </div>
                        <div className={`tabCont tab01 ${activeTabIndex === 1 ? 'active' : ''}`}>
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
                        <div className={`tabCont tab02 ${activeTabIndex === 2 ? 'active' : ''}`}>
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

    );
}

export default MainCalendar;
