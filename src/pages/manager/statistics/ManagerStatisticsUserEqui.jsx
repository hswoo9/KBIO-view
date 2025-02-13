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

function ManagerStatisticsUser(props) {
    const nowDate = new Date();

    const [userCnt, setUserCnt] = useState([])
    const [mbrTypeUserCnt, setMbrTypeUserCnt] = useState([]);

    const [searchDto, setSearchDto] = useState({
        searchYear : format(nowDate, "yyyy"),
        searchMonth : format(nowDate, "MM"),
    });

    const currentYear = format(nowDate, "yyyy");

    const chartOptions = {
        chart: {
            id: 'basic-bar',
        },
        xaxis: {
            categories: ['입주기업', '유관기관', '비입주기업', '컨설턴트'],
        },
    };
    const series = [
        {
            name: '사용자',
            data: userCnt,
        },
    ];

    const getStatisticsUser = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch("/statisticsApi/getStatisticsUser.do", requestOptions, function (resp) {
            setMbrTypeUserCnt(resp.result.statisticsUser);
            setUserCnt([]);
            resp.result.statisticsUser.forEach(function(v, i){
                setUserCnt(userCnt => [...userCnt, v.cnt])
            })
        });
    }

    useEffect(() => {
        getStatisticsUser()
    }, [searchDto]);

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
                                        id="searchYear"
                                        defaultValue={searchDto.searchYear}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchYear: e.target.value})
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
                                                setSearchDto({...searchDto, searchMonth: e.target.value})
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
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>회원 수</caption>
                            <thead>
                            <tr>
                                <th>입주기업 회원</th>
                                <th>유관기관 회원</th>
                                <th>비입주기업 회원</th>
                                <th>컨설턴트 회원</th>
                                <th>총합</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    {mbrTypeUserCnt.find(e => e.mbrType == 1) ? (
                                        mbrTypeUserCnt.find(e => e.mbrType == 1).cnt.toLocaleString()
                                    ) : 0}
                                </td>
                                <td>
                                    {mbrTypeUserCnt.find(e => e.mbrType == 3) ? (
                                        mbrTypeUserCnt.find(e => e.mbrType == 3).cnt.toLocaleString()
                                    ) : 0}
                                </td>
                                <td>
                                    {mbrTypeUserCnt.find(e => e.mbrType == 4)? (
                                        mbrTypeUserCnt.find(e => e.mbrType == 4).cnt.toLocaleString()
                                    ) : 0}
                                </td>
                                <td>
                                    {mbrTypeUserCnt.find(e => e.mbrType == 2) ? (
                                        mbrTypeUserCnt.find(e => e.mbrType == 2).cnt.toLocaleString()
                                    ) : 0}
                                </td>
                                <td> {[
                                    mbrTypeUserCnt.find(e => e.mbrType == 1) ?.cnt || 0,
                                    mbrTypeUserCnt.find(e => e.mbrType == 3) ?.cnt || 0,
                                    mbrTypeUserCnt.find(e => e.mbrType == 4) ?.cnt || 0,
                                    mbrTypeUserCnt.find(e => e.mbrType == 2) ?.cnt || 0
                                ].reduce((total, cnt) => total + cnt, 0).toLocaleString()}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="tableBox type1">
                    <ApexCharts options={chartOptions} series={series} type="bar" height={350}/>
                </div>
            </div>
        </div>
    );
}

export default ManagerStatisticsUser;
