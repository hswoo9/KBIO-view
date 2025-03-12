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
import LoadingSpinner from "@/components/LoadingSpinner";
import moment from "moment/moment.js";

function ManagerStatisticsAccess(props) {
    const [isLoading, setIsLoading] = useState(true);  // 로딩 상태

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

    const menuList = (callback) => ({
        0: <Tab1 key={menuIndex === 0 ? tabRenderKey : 0} searchDto={searchDto} onCallback={callback}  />,
        1: <Tab2 key={menuIndex === 1 ? tabRenderKey : 1} pageName="입주기업" searchDto={{ ...searchDto, mbrType: 1 }} onCallback={callback}  />,
        2: <Tab2 key={menuIndex === 2 ? tabRenderKey : 2} pageName="유관기관" searchDto={{ ...searchDto, mbrType: 3 }} onCallback={callback}  />,
        3: <Tab2 key={menuIndex === 3 ? tabRenderKey : 3} pageName="비입주기업" searchDto={{ ...searchDto, mbrType: 4 }} onCallback={callback}  />,
        4: <Tab2 key={menuIndex === 4 ? tabRenderKey : 4} pageName="컨설턴트" searchDto={{ ...searchDto, mbrType: 2 }} onCallback={callback}  />,
    });

    const handleCallback = (e) => {
        if(e == "isLoading"){
            setIsLoading(true);
        }else{
            setIsLoading(false);
        }
    };

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

            {isLoading &&
                <LoadingSpinner />
            }

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
                                                {currentYear - i}년
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
                                                    searchMonth: e.target.value,
                                                    searchDate:"",
                                                    lastDate:""

                                                }));
                                            }}
                                    >
                                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((month, index) => (
                                            <option key={index} value={String(month).padStart(2, '0')}>
                                                {String(month).padStart(2, '0')}월
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>

                            {/* 주간 시작일 선택 */}
                            <li className="inputBox type1">
                                <div className="input">
                                    <input type="date"
                                           id="searchDate"
                                           name="searchDate"

                                           onChange={(e) => {
                                               const selectedDate = moment(e.target.value);
                                               const lastDate = selectedDate.clone().add(6, 'days'); // 선택한 날짜로부터 6일 후 (총 7일)

                                               setSearchDto({
                                                   ...searchDto,
                                                   searchDate: selectedDate.format('YYYY-MM-DD'),
                                                   lastDate: lastDate.format('YYYY-MM-DD') // 일주일 후 날짜
                                               });
                                           }}
                                    />
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
                </div>
                {menuList(handleCallback)[menuIndex]}
            </div>
        </div>
    );
}

export default ManagerStatisticsAccess;
