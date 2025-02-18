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
import * as EgovNet from "../../../../api/egovFetch.js";
import LoadingSpinner from "../../../../components/LoadingSpinner.jsx";

function ManagerStatisticsPeriodUser(props) {
    const nowDate = new Date();

    const [periodUserList, setPeriodUserList] = useState([]);

    const [chartData, setChartData] = useState({})
    const [chartLabels, setChartLabels] = useState([])
    const [categories, setCategories] = useState([]);

    const currentYear = format(nowDate, "yyyy");

    const [searchDto, setSearchDto] = useState({
        startMonth : format(nowDate, "yyyy-MM"),
        endMonth : format(nowDate, "yyyy-MM"),
        startDate : format(nowDate, "yyyy-MM-dd"),
        endDate : format(nowDate, "yyyy-MM-dd"),
        page : "userSts",
        metrics : JSON.stringify(["totalUsers", "activeUsers", "screenPageViews", "averageSessionDuration"]),
        dimensions : ""
    });

    const searchCategoryChange = (e, i) => {
        document.querySelectorAll(".period .dateDiv" + i).forEach(value => {
            value.style.display = "none"
        })

        document.querySelector(".period .dateDiv" + i + "#" + e + "Div").style.display = "block"
    }

    const dateChange = (t, v) => {
        const startDate = document.querySelector(".period li#" + t + "Div #startDate");
        const endDate = document.querySelector(".period li#" + t + "Div #endDate");
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

    const chartOptions = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        colors: ['rgba(74, 126, 187)', 'rgba(190, 75, 72)', 'rgba(125, 96, 160)', '#1db93e'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: '기간별 사용자',
            align: 'left'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        markers: {
            size: 5
        },
        xaxis: {
            categories: categories,
        },
        yaxis: {
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetY: -25,
            offsetX: -5
        }
    };

    const series = [
        {
            name: "입주기업",
            data: chartLabels.map(label => chartData[label]?.mbrType1Cnt || 0)
        },
        {
            name: "유관기관",
            data: chartLabels.map(label => chartData[label]?.mbrType3Cnt || 0)
        },
        {
            name: "비입주기업",
            data: chartLabels.map(label => chartData[label]?.mbrType4Cnt || 0)
        },
        {
            name: "컨설턴트",
            data: chartLabels.map(label => chartData[label]?.mbrType2Cnt || 0)
        }
    ];

    const getStatistics = () => {
        props.onCallback("isLoading");
        const searchCategory = document.querySelector("#searchCategory").value;
        const startDt = document.querySelector(".period li#" + searchCategory + "Div #startDate").value;
        const endDt = document.querySelector(".period li#" + searchCategory + "Div #endDate").value;

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

        let dimensions = "";
        if(searchCategory == "day"){
            dimensions = JSON.stringify(["date"]);
        }else if(searchCategory == "month"){
            dimensions = JSON.stringify(["year", "month"]);
        }else if(searchCategory == "year"){
            dimensions = JSON.stringify(["year"]);
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                ...searchDto,
                dimensions : dimensions,
                startDate : startDate,
                endDate : endDate
            }),
        };

        EgovNet.requestFetch("/statisticsApi/getStatistics.do", requestOptions, function (resp) {
            resp.result.rs.sort(function(a, b) {
                var dateA = new Date(a.date.slice(0, 4) + '-' + a.date.slice(4, 6) + '-' + a.date.slice(6, 8));  // a의 날짜를 Date 객체로 변환
                var dateB = new Date(b.date.slice(0, 4) + '-' + b.date.slice(4, 6) + '-' + b.date.slice(6, 8));  // b의 날짜를 Date 객체로 변환
                return dateA - dateB;          // 오름차순 정렬
            });

            periodUserListMake(resp.result.rs);
        });
    }

    const periodUserListMake = (rs) => {
        setCategories([])
        setChartLabels([])
        setChartData({})

        let dataList = [];
        dataList.push(
            <tr>
                <td colSpan="10">검색된 결과가 없습니다.</td>
            </tr>
        );

        const searchCategory = document.querySelector(".period #searchCategory").value;
        let totalMbrType1 = 0;
        let totalMbrType2 = 0;
        let totalMbrType3 = 0;
        let totalMbrType4 = 0;

        let newCategories = [];
        let newChartLabels = [];
        let newChartData = {};

        rs.forEach(function (item, index) {
            if (index === 0) dataList = []; // 목록 초기화

            totalMbrType1 += item.newUserCnt.mbrType1Cnt;
            totalMbrType2 += item.newUserCnt.mbrType2Cnt;
            totalMbrType3 += item.newUserCnt.mbrType3Cnt;
            totalMbrType4 += item.newUserCnt.mbrType4Cnt;

            let formarDate = "";
            if (searchCategory == "day") {
                formarDate = item.date.slice(0, 4) + '-' + item.date.slice(4, 6) + '-' + item.date.slice(6, 8)
            } else if (searchCategory == "month") {
                formarDate = item.date.slice(0, 4) + '-' + item.date.slice(4, 6)
            } else if (searchCategory == "year") {
                formarDate = item.date
            }

            dataList.push(
                <tr key={item.date}>
                    <td>{formarDate}</td>
                    <td>{Number(item.totalUsers).toLocaleString()}</td>
                    <td>{Number(item.activeUsers).toLocaleString()}</td>
                    <td>{Number(item.newUserCnt.mbrType1Cnt).toLocaleString()}</td>
                    <td>{Number(item.newUserCnt.mbrType3Cnt).toLocaleString()}</td>
                    <td>{Number(item.newUserCnt.mbrType4Cnt).toLocaleString()}</td>
                    <td>{Number(item.newUserCnt.mbrType2Cnt).toLocaleString()}</td>
                    <td>
                        {Number(
                            item.newUserCnt.mbrType1Cnt +
                            item.newUserCnt.mbrType2Cnt +
                            item.newUserCnt.mbrType3Cnt +
                            item.newUserCnt.mbrType4Cnt
                        ).toLocaleString()}
                    </td>
                    <td>{Number(item.screenPageViews).toLocaleString()}</td>
                    <td>{Number(Math.round(item.averageSessionDuration)).toLocaleString()}s</td>
                </tr>
            );

            newCategories.push(formarDate);
            newChartLabels.push(formarDate);
            newChartData[formarDate] = {
                mbrType1Cnt: item.newUserCnt.mbrType1Cnt,
                mbrType3Cnt: item.newUserCnt.mbrType3Cnt,
                mbrType4Cnt: item.newUserCnt.mbrType4Cnt,
                mbrType2Cnt: item.newUserCnt.mbrType2Cnt,
            };
        });

        dataList.push(
            <tr key="total">
                <td colSpan="3">총합</td>
                <td>{totalMbrType1.toLocaleString()}</td>
                <td>{totalMbrType3.toLocaleString()}</td>
                <td>{totalMbrType4.toLocaleString()}</td>
                <td>{totalMbrType2.toLocaleString()}</td>
                <td>{(totalMbrType1 + totalMbrType2 + totalMbrType3 + totalMbrType4).toLocaleString()}</td>
                <td colSpan="2"></td>
            </tr>
        );

        setCategories(newCategories);
        setChartLabels(newChartLabels);
        setChartData(newChartData);
        setPeriodUserList(dataList);
        props.onCallback();
    }

    useEffect(() => {
        getStatistics();
    }, [searchDto]);

    return (
        <div>
            <h2 className="pageTitle"><p>사용자분석</p></h2>
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
                                    onClick={getStatistics}>
                                <div className="icon"></div>
                            </button>
                        </li>
                    </ul>
                </form>
            </div>
            <div className="contBox board type1 customContBox">
                <div className="tableBox type1">
                    <ApexCharts options={chartOptions} series={series} type="line" height={350}/>

                    <table>
                        <caption>기간별 사용자</caption>
                        <thead>
                        <tr>
                            <th rowSpan="2">일자</th>
                            <th rowSpan="2">방문자 수</th>
                            <th rowSpan="2">활성사용자 수</th>
                            <th colSpan="4" style={{textAlign: "center"}}>신규가입자 수</th>
                            <th rowSpan="2">총 화원수</th>
                            <th rowSpan="2">페이지조회수</th>
                            <th rowSpan="2">평균이용시간</th>
                        </tr>
                        <tr>
                            <th>입주기업</th>
                            <th>유관기관</th>
                            <th>비입주기업</th>
                            <th>컨설턴트</th>
                        </tr>
                        </thead>
                        <tbody>
                        {periodUserList}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManagerStatisticsPeriodUser;
