import React, { useState, useRef, useEffect } from 'react';
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
    const [currentMonth, setCurrentMonth] = useState(new Date());
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

    const renderWeeks = () => {
        const weeks = [];
        for (let i = 0; i < totalDays.length; i += 7) {
            const week = totalDays.slice(i, i + 7);
            weeks.push(
                <tr key={i}>
                    {week.map((day, idx) => (
                        <td key={idx} className={isSameMonth(day, currentMonth) ? "" : "noText"}>
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


        <div className="calendarWrap leftBox" data-aos="fade-left" data-aos-duration="1500">
            <div className="topBox">
                <button type="button" className="arrowBtn prevBtn" onClick={() => handlePrevNextChange("prev")}>
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
                <button type="button" className="arrowBtn nextBtn" onClick={() => handlePrevNextChange("next")}>
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
    );
}

export default MainCalendar;
