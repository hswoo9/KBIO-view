import React, { useState, useEffect, useCallback, useRef } from "react";
import ManagerLeftNew from "@/components/manager/ManagerLeftStatistics";

import ApexCharts from 'react-apexcharts'

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
import {Link} from "react-router-dom";
import * as EgovNet from "../../../api/egovFetch.js";
import {forEach} from "react-bootstrap/ElementChildren";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";

function ManagerStatisticsUser(props) {
    const [isLoading, setIsLoading] = useState(true);

    const nowDate = new Date();

    const [devicesList, setDevicesList] = useState([]);
    const [pcOperatingList, setPcOperatingList] = useState([]);
    const [mobileOperatingList, setMobileOperatingList] = useState([]);

    const currentYear = format(nowDate, "yyyy");

    const [searchDto, setSearchDto] = useState({
        startMonth : format(nowDate, "yyyy-MM"),
        endMonth : format(nowDate, "yyyy-MM"),
        startDate : format(nowDate, "yyyy-MM-dd"),
        endDate : format(nowDate, "yyyy-MM-dd"),
        metrics : JSON.stringify(["sessions"]),
    });

    const searchCategoryChange = (e, i) => {
        document.querySelectorAll(".dateDiv" + i).forEach(value => {
            value.style.display = "none"
        })

        document.querySelector(".dateDiv" + i + "#" + e + "Div").style.display = "block"
    }

    const dateChange = (t, v) => {
        const startDate = document.querySelector("li#" + t + "Div #startDate");
        const endDate = document.querySelector("li#" + t + "Div #endDate");
        if(v == "startDate"){
            if(startDate.value > endDate.value){
                endDate.value = startDate.value
            }
        }else{
            if(endDate.value < startDate.value){
                startDate.value = endDate.value
            }
        }
    }

    const getEquiStatistics = () => {
        getStatistics("devices", JSON.stringify(["deviceCategory"]))
        getStatistics("operating", JSON.stringify(["operatingSystem"]))
    }

    const getStatistics = (p, d) => {
        setIsLoading(true);
        const searchCategory = document.querySelector("#searchCategory").value;
        const startDt = document.querySelector("li#" + searchCategory + "Div #startDate").value;
        const endDt = document.querySelector("li#" + searchCategory + "Div #endDate").value;

        let startDate = "";
        let endDate = "";
        if(searchCategory == "day"){
            startDate = startDt;
            endDate = endDt
        }else if(searchCategory == "month"){
            startDate = startDt + "-01";
            var date = new Date(endDt.split("-")[0], endDt.split("-")[1], 0)
            endDate = endDt + "-" + date.getDate();;
        }else if(searchCategory == "year"){
            startDate = startDt + "-01-01";
            endDate = endDt + "-12-31";
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                ...searchDto,
                startDate : startDate,
                endDate : endDate,
                page : p,
                dimensions : d
            }),
        };

        EgovNet.requestFetch("/statisticsApi/getStatistics.do", requestOptions, function (resp) {
            resp.result.rs.sort(function(a, b) {
                return b.sessions - a.sessions;
            });

            if(p == "devices"){
                devicesListMake(resp.result.rs);
            }else{
                operatingListMake(resp.result.rs);
            }
        });
    }

    const devicesListMake = (rs) => {
        let dataList = [];
        dataList.push(
            <tr>
                <td colSpan="4">검색된 결과가 없습니다.</td>
            </tr>
        );

        if(rs.length > 0){
            const totalSessions = rs.reduce((sum, item) => sum + Number(item.sessions), 0);
            rs.forEach(function (item, index) {
                if (index === 0) dataList = []; // 목록 초기화

                dataList.push(makeHtml(index, item.deviceCategory, item.sessions, totalSessions));
            });

            dataList.push(
                <tr key="total">
                    <td colSpan="2">총합</td>
                    <td>{totalSessions.toLocaleString()}</td>
                    <td></td>
                </tr>
            );
        }

        setDevicesList(dataList);
        setIsLoading(false);
    }

    const operatingListMake = (rs) => {
        let dataList = [];
        dataList.push(
            <tr>
                <td colSpan="4">검색된 결과가 없습니다.</td>
            </tr>
        );

        let isMobile = true;
        for(let i = 0; i < 2; i++){
            if(i != 0){
                isMobile = false;
            }

            const filterCondition = isMobile
                ? (item) => item.operatingSystem.includes("Android") || item.operatingSystem.includes("iOS")
                : (item) => !item.operatingSystem.includes("Android") && !item.operatingSystem.includes("iOS");

            const filteredData = rs.filter(filterCondition);
            if (filteredData.length > 0) {
                dataList = [];

                const total = filteredData.reduce((sum, item) => sum + Number(item.sessions), 0);
                filteredData.forEach((item, index) => {
                    dataList.push(makeHtml(index, item.operatingSystem, item.sessions, total));
                });

                dataList.push(
                    <tr key="total">
                        <td colSpan="2">총합</td>
                        <td>{total.toLocaleString()}</td>
                        <td></td>
                    </tr>
                );
            }

            if(isMobile){
                setMobileOperatingList(dataList);
            }else{
                setPcOperatingList(dataList);
            }
        }
    }

    const makeHtml = (index, operatingSystem, sessions, total) => {
        return <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{operatingSystem}</td>
                    <td>{Number(sessions).toLocaleString()}</td>
                    <td>{((Number(sessions) / total) * 100).toFixed(1)}%</td>
                </tr>
    }
    useEffect(() => {
        getStatistics("devices", JSON.stringify(["deviceCategory"]))
        getStatistics("operating", JSON.stringify(["operatingSystem"]))
    }, [searchDto]);


    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>

            {isLoading &&
                <LoadingSpinner />
            }

            <div className="inner">
                <h2 className="pageTitle"><p>사용자통계</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <div className="itemBox">
                                    <select
                                        id="searchCategory"
                                        className="selectGroup"
                                        onChange={(e) => {
                                            searchCategoryChange(e.target.value, '');
                                            setSearchDto({...searchDto, searchCategory: e.target.value})
                                        }}
                                    >
                                        <option value="month">월별</option>
                                        <option value="day">일자별</option>
                                        <option value="year">연도별</option>
                                    </select>
                                </div>
                            </li>

                            <li className="inputBox type1 dateDiv" id="dayDiv"
                                style={{maxWidth: "340px", display: "none"}}>
                                <div className="itemBox" style={{display: "flex", alignItems: "center"}}>
                                    <input
                                        type="date"
                                        id="startDate"
                                        className="selectGroup"
                                        style={{background: "white", width: "48%"}}
                                        defaultValue={searchDto.startDate}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, startDate: e.target.value})
                                            dateChange("day", "startDate")
                                        }}
                                    /> <p>~</p>
                                    <input
                                        type="date"
                                        id="endDate"
                                        className="selectGroup"
                                        style={{background: "white", width: "48%"}}
                                        defaultValue={searchDto.endDate}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, endDate: e.target.value})
                                            dateChange("day", "endDate")
                                        }}
                                    />
                                </div>
                            </li>

                            <li className="inputBox type1 dateDiv" id="monthDiv" style={{maxWidth: "340px"}}>
                                <div className="itemBox" style={{display: "flex", alignItems: "center"}}>
                                    <input
                                        type="month"
                                        id="startDate"
                                        className="selectGroup"
                                        style={{background: "white", width: "48%"}}
                                        defaultValue={searchDto.startMonth}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, startDate: e.target.value})
                                            dateChange("month", "startDate")
                                        }}
                                    /> <p>~</p>
                                    <input
                                        type="month"
                                        id="endDate"
                                        className="selectGroup"
                                        style={{background: "white", width: "48%"}}
                                        defaultValue={searchDto.endMonth}
                                        onChange={(e) => {
                                            const date = new Date(e.target.value.split("-")[0], e.target.value.split("-")[1])
                                            setSearchDto({...searchDto, endDate: e.target.value + "-" + date.getDate()})
                                            dateChange("month", "endDate")
                                        }}
                                    />
                                </div>
                            </li>

                            <li className="inputBox type1 dateDiv" id="yearDiv"
                                style={{maxWidth: "340px", display: "none"}}>
                                <div className="itemBox" style={{display: "flex", alignItems: "center"}}>
                                    <select className="selectGroup"
                                            id="startDate"
                                            defaultValue={searchDto.startDate}
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, startDate: e.target.value + "-01-01"})
                                                dateChange("year", "startDate")
                                            }}
                                    >
                                        {Array.from({length: Math.max(0, currentYear - 2025) + 1}, (_, i) => (
                                            <option key={i} value={currentYear - i}>
                                                {currentYear - i}
                                            </option>
                                        ))}
                                    </select>
                                    <p>~</p>
                                    <select className="selectGroup"
                                            id="endDate"
                                            defaultValue={searchDto.endDate}
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, endDate: e.target.value + "-12-31"})
                                                dateChange("year", "endDate")
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
                            <li className="inputBox type1 rightBtn">
                                <button type="button" className="searchBtn btn btn1 point"
                                        onClick={getEquiStatistics}>
                                    <div className="icon"></div>
                                </button>
                            </li>
                        </ul>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <h2 className="pageTitle"><p>사용자기기</p></h2>
                    <div className="tableBox type1">
                        <table>
                            <caption>사용자기기</caption>
                            <thead>
                            <tr>
                                <th>순위</th>
                                <th>기기</th>
                                <th>유입수</th>
                                <th>비율</th>
                            </tr>
                            </thead>
                            <tbody>
                            {devicesList}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{display: "flex", gap:"7%"}}>
                    <div className="contBox board type1 customContBox" style={{width: "50%"}}>
                        <h2 className="pageTitle"><p>PC 운영체제</p></h2>
                        <div className="tableBox type1">
                            <table style={{minWidth : "unset"}}>
                                <caption>PC 운영체제</caption>
                                <thead>
                                <tr>
                                    <th>순위</th>
                                    <th>운영체제</th>
                                    <th>유입수</th>
                                    <th>비율</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pcOperatingList}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="contBox board type1 customContBox" style={{width: "50%"}}>
                        <h2 className="pageTitle"><p>모바일 운영체제</p></h2>
                        <div className="tableBox type1">
                            <table style={{minWidth: "unset"}}>
                                <caption>모바일 운영체제</caption>
                                <thead>
                                <tr>
                                    <th>순위</th>
                                    <th>운영체제</th>
                                    <th>유입수</th>
                                    <th>비율</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mobileOperatingList}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ManagerStatisticsUser;
