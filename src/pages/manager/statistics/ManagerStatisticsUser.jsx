import React, { useState, useEffect, useCallback, useRef } from "react";
import ManagerLeftNew from "@/components/manager/ManagerLeftStatistics";
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

function ManagerStatisticsUser(props) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handleYearChange = (e) => {
        console.log(setYear(currentMonth, parseInt(e.target.value, 10)));
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

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>사용자통계</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">기간</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            value={currentYear}
                                            id="yearSelect"
                                            onChange={handleYearChange}
                                    >
                                        {Array.from({length: 10}, (_, i) => (
                                            <option key={i} value={2020 + i}>
                                                {2020 + i}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <div className="itemBox">
                                    <select className="selectGroup"
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
                            </li>
                        </ul>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">

                </div>
            </div>
        </div>
    );
}

export default ManagerStatisticsUser;
