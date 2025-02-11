import React, { useState, useEffect, useCallback, useRef } from "react";
import ManagerLeftNew from "@/components/manager/ManagerLeftStatistics";

import ApexCharts from 'react-apexcharts';

import Tab from '@/pages/manager/statistics/tabGroup/AccessTabCommon';

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

function ManagerStatisticsFile(props) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    // 현재 연도 & 월
    const currentYear = format(currentMonth, "yyyy");
    const currentMonthIndex = format(currentMonth, "M") - 1;

    const [menuIndex, setMenuIndex] = useState({ menu : 0});
    const tabMenuList = {
        0: <Tab/>,
        1: <Tab/>,
        2: <Tab/>,
    };

    const changeMenu = (menuIndex) => {
        setMenuIndex({
            menu: menuIndex
        });
    }


    const chartOptions = {
        chart: {
            id: 'bar',
        },
        //컬럼명
        xaxis: {
            categories: ['입주기업', '유관기관', '비입주기업', '컨설턴트'],
        },
    };

    const series = [
        {
            name: '사용자',
            data: [5600, 4600, 7600, 50],
        },
    ];

    return (
        <div id="container" className="container layout cms">
            <style>{`
                .tabs li{
                    font-size: 1rem;
                    font-weight: bold;
                    display: inline-block;
                    color: black;
                    padding: 1rem;
                    cursor: pointer;
                }
                .tabs li.tabActive{
                    background-color: #04819b;
                    height: 100%;
                    color: #efefef;
                }
                
                `}
            </style>
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>첨부자료이용통계</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">기간</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            defaultValue={currentYear}
                                            id="yearSelect"
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
                                            defaultValue={currentMonthIndex}
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
                    <div className="topBox">
                        <ul className="tabs">
                            <li className={`${menuIndex.menu === 0 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(0)}>공지사항
                            </li>
                            <li className={`${menuIndex.menu === 1 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(1)}>자료실
                            </li>
                            <li className={`${menuIndex.menu === 2 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(2)}>연구자료실
                            </li>
                        </ul>
                    </div>
                    <div>
                        {tabMenuList[menuIndex.menu]}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ManagerStatisticsFile;
