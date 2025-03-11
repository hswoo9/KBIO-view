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
import * as EgovNet from "@/api/egovFetch";
import LoadingSpinner from "@/components/LoadingSpinner";

function ManagerStatisticsUser(props) {
    const [isLoading, setIsLoading] = useState(true);  // 로딩 상태
    const nowDate = new Date();
    const currentYear = format(nowDate, "yyyy");
    const [searchDto, setSearchDto] = useState({
        searchYear : format(nowDate, "yyyy"),
        searchMonth : format(nowDate, "MM"),
    });

    const year = parseInt(searchDto.searchYear, 10);
    const month = parseInt(searchDto.searchMonth, 10);
    const lastDay = new Date(year, month, 0).getDate();

    const [userList, setUserList] = useState([]);
    const categories = Array.from({ length: lastDay }, (_, i) => String(i + 1 + "일").padStart(2, '0'));
    const [mbrType1UserCnt, setMbrType1UserCnt] = useState([])
    const [mbrType3UserCnt, setMbrType3UserCnt] = useState([])
    const [mbrType4UserCnt, setMbrType4UserCnt] = useState([])
    const [mbrType2UserCnt, setMbrType2UserCnt] = useState([])


    const chartOptions = {
        chart: {
            id: '사용자통계',
        },
        xaxis: {
            categories: categories
        },
    };

    const series = [
        {
            name: '입주기업',
            data: mbrType1UserCnt,
        }, {
            name: '유관기관',
            data: mbrType3UserCnt,
        }, {
            name: '비입주기업',
            data: mbrType4UserCnt,
        }, {
            name: '컨설턴트',
            data: mbrType2UserCnt,
        }
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
            const today = new Date().toISOString().split("T")[0];

            const statisticsMap = new Map(
                resp.result.statisticsUser.map(item => [item.day.split("-")[2], item])
            );

            let type1CntList = [];
            let type2CntList = [];
            let type3CntList = [];
            let type4CntList = [];

            const dataList = categories.map(day => {
                const dayFormat = day.slice(0, -1).padStart(2, '0');

                const isFuture = searchDto.searchYear + "-" + searchDto.searchMonth  + "-" + dayFormat > today;
                const item = isFuture ? {day, mbrType1Cnt: 0, mbrType2Cnt: 0, mbrType3Cnt: 0, mbrType4Cnt: 0 }
                    : statisticsMap.get(dayFormat) || {day, mbrType1Cnt: 0, mbrType2Cnt: 0, mbrType3Cnt: 0, mbrType4Cnt: 0 };

                type1CntList.push(item.mbrType1Cnt);
                type2CntList.push(item.mbrType2Cnt);
                type3CntList.push(item.mbrType3Cnt);
                type4CntList.push(item.mbrType4Cnt);

                return (
                    <tr key={day}>
                        <td className="th1">{day}</td>
                        <td>{Number(item.mbrType1Cnt).toLocaleString()} 명</td>
                        <td>{Number(item.mbrType3Cnt).toLocaleString()} 명</td>
                        <td>{Number(item.mbrType4Cnt).toLocaleString()} 명</td>
                        <td>{Number(item.mbrType2Cnt).toLocaleString()} 명</td>
                        <td>
                            {Number(item.mbrType1Cnt + item.mbrType2Cnt + item.mbrType3Cnt + item.mbrType4Cnt).toLocaleString()} 명
                        </td>
                    </tr>
                );
            });

            const lastItem = [...statisticsMap.values()].pop() || {
                mbrType1Cnt: 0,
                mbrType2Cnt: 0,
                mbrType3Cnt: 0,
                mbrType4Cnt: 0,
            };

            dataList.push(
                <tr key="total">
                    <td className="th1">총합</td>
                    <td>{Number(lastItem.mbrType1Cnt).toLocaleString()} 명</td>
                    <td>{Number(lastItem.mbrType3Cnt).toLocaleString()} 명</td>
                    <td>{Number(lastItem.mbrType4Cnt).toLocaleString()} 명</td>
                    <td>{Number(lastItem.mbrType2Cnt).toLocaleString()} 명</td>
                    <td>
                        {
                            Number(
                                lastItem.mbrType1Cnt +
                                lastItem.mbrType2Cnt +
                                lastItem.mbrType3Cnt +
                                lastItem.mbrType4Cnt
                            ).toLocaleString()
                        } 명
                    </td>
                </tr>
            );

            setMbrType1UserCnt(type1CntList);
            setMbrType2UserCnt(type2CntList);
            setMbrType3UserCnt(type3CntList);
            setMbrType4UserCnt(type4CntList);
            setUserList(dataList);

            setIsLoading(false);
        });
    }

    useEffect(() => {
        setIsLoading(true);
        getStatisticsUser()
    }, [searchDto]);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>

            {isLoading &&
                <LoadingSpinner/>
            }

            <style>
                {`
                #item1 thead tr th:not(:nth-child(1)) {
                    text-align : center !important;
                }
                #item1 tbody tr td:nth-child(1) {
                    text-align : left !important;
                }
                #item1 tbody tr td:nth-child(2), #item1 tbody tr td:nth-child(3),
                 #item1 tbody tr td:nth-child(4), #item1 tbody tr td:nth-child(5),
                 #item1 tbody tr td:nth-child(6){
                    text-align : right;
                } 
            `}
            </style>

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
                                                setSearchDto({...searchDto, searchMonth: e.target.value})
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
                        </ul>
                    </form>
                </div>
                <div className="tableBox type1">
                    <ApexCharts options={chartOptions} series={series} type="bar" height={350}/>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="tableBox type1">
                        <div id="item1">
                            <table>
                                <caption>회원 수</caption>
                                <thead className="fixed-thead">
                                <tr>
                                    <th className="th1">일자</th>
                                    <th>입주기업</th>
                                    <th>유관기관</th>
                                    <th>비입주기업</th>
                                    <th>컨설턴트</th>
                                    <th>총합</th>
                                </tr>
                                </thead>
                                <tbody className="scrollable-tbody">
                                {userList}
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
