import React, { useState, useEffect, useCallback, useRef } from "react";
import ManagerLeftNew from "@/components/manager/ManagerLeftStatistics";

import ApexCharts from 'react-apexcharts';

import Tab1 from '@/pages/manager/statistics/tabGroup/AccessTabAll';
import Tab2 from '@/pages/manager/statistics/tabGroup/AccessTabMoveIn';

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

function ManagerStatisticsAccess(props) {
    const nowDate = new Date();

    const [searchDto, setSearchDto] = useState({
        searchYear : format(nowDate, "yyyy"),
        searchMonth : format(nowDate, "MM"),
    });

    const currentYear = format(nowDate, "yyyy");

    const [menuIndex, setMenuIndex] = useState(0);
    const [tabRenderKey, setTabRenderKey] = useState(0);

    useEffect(() => {
        setTabRenderKey(prev => prev + 1);
    }, [menuIndex, searchDto]);

    const menuList = () => ({
        0: <Tab1 key={menuIndex === 0 ? tabRenderKey : 0} searchDto={searchDto} />,
        1: <Tab2 key={menuIndex === 1 ? tabRenderKey : 1} pageName="입주기업" searchDto={{ ...searchDto, mbrType: 1 }} />,
        2: <Tab2 key={menuIndex === 2 ? tabRenderKey : 2} pageName="유관기관" searchDto={{ ...searchDto, mbrType: 3 }} />,
        3: <Tab2 key={menuIndex === 3 ? tabRenderKey : 3} pageName="비입주기업" searchDto={{ ...searchDto, mbrType: 4 }} />,
        4: <Tab2 key={menuIndex === 4 ? tabRenderKey : 4} pageName="컨설턴트" searchDto={{ ...searchDto, mbrType: 2 }} />,
    });

    const changeMenu = (menuIndex) => {
        setMenuIndex(menuIndex);
    }

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
                    width : auto;
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
                <h2 className="pageTitle"><p>접속통계</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">기간</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="searchYear"
                                            defaultValue={searchDto.searchYear}
                                            onChange={(e) => {
                                                setSearchDto(prev => ({
                                                    ...prev,
                                                    searchYear: e.target.value
                                                }));
                                            }}
                                    >
                                        {Array.from({length: Math.max(0, currentYear - 2025) + 1}, (_, i) => (
                                            <option key={i} value={currentYear - i}>
                                                {currentYear - i}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="searchMonth"
                                            defaultValue={searchDto.searchMonth}
                                            onChange={(e) => {
                                                setSearchDto(prev => ({
                                                    ...prev,
                                                    searchMonth: e.target.value
                                                }));
                                            }}
                                    >
                                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((month, index) => (
                                            <option key={index} value={String(month).padStart(2, '0')}>
                                                {String(month).padStart(2, '0')}
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
                            <li className={`${menuIndex === 0 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(0)}>전체
                            </li>
                            <li className={`${menuIndex === 1 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(1)}>입주기업 회원
                            </li>
                            <li className={`${menuIndex === 2 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(2)}>유관기관 회원
                            </li>
                            <li className={`${menuIndex === 3 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(3)}>비입주기업 회원
                            </li>
                            <li className={`${menuIndex === 4 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(4)}>컨설턴트 회원
                            </li>
                        </ul>
                    </div>
                    <div>
                        {menuList()[menuIndex]}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ManagerStatisticsAccess;
