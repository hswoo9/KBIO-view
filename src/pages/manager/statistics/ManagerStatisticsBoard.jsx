import React, { useState, useEffect, useCallback, useRef } from "react";
import ManagerLeftNew from "@/components/manager/ManagerLeftStatistics";

import ApexCharts from 'react-apexcharts';

import Tab from '@/pages/manager/statistics/tabGroup/AccessTabPst';

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

function ManagerStatisticsBoard(props) {
    const [isLoading, setIsLoading] = useState(true);  // 로딩 상태
    const nowDate = new Date();

    const [searchDto, setSearchDto] = useState({
        searchYear : format(nowDate, "yyyy"),
        searchMonth : format(nowDate, "MM"),
        trgtTblNm: "tbl_bbs",
    });

    const currentYear = format(nowDate, "yyyy");

    const [menuIndex, setMenuIndex] = useState(0);
    const [tabRenderKey, setTabRenderKey] = useState(0);

    useEffect(() => {
        setTabRenderKey(prev => prev + 1);
    }, [menuIndex, searchDto]);

    const menuList = (callback) => ({
        0: <Tab key={menuIndex === 0 ? tabRenderKey : 0} searchDto={{ ...searchDto, trgtSn: 1}} onCallback={callback}/>,
        1: <Tab key={menuIndex === 1 ? tabRenderKey : 1} searchDto={{ ...searchDto, trgtSn: 8}} onCallback={callback}/>,
        2: <Tab key={menuIndex === 2 ? tabRenderKey : 2} searchDto={{ ...searchDto, trgtSn: 5}} onCallback={callback}/>,
        3: <Tab key={menuIndex === 3 ? tabRenderKey : 3} searchDto={{ ...searchDto, trgtSn: 7}} onCallback={callback}/>,
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
                <h2 className="pageTitle"><p>게시물접속통계</p></h2>
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
                                onClick={() => changeMenu(0)}>공지사항
                            </li>
                            <li className={`${menuIndex === 1 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(1)}>보도자료
                            </li>
                            <li className={`${menuIndex === 2 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(2)}>자료실
                            </li>
                            <li className={`${menuIndex === 3 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(3)}>연구자료실
                            </li>
                        </ul>
                    </div>
                    <div>
                        {menuList(handleCallback)[menuIndex]}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ManagerStatisticsBoard;
