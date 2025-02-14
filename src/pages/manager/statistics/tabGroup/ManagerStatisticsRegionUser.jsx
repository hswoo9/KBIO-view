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
import * as EgovNet from "../../../../api/egovFetch.js";

function ManagerStatisticsRegionUser(props) {
    const nowDate = new Date();
    const korRegion = {
        "Seoul" : 0,
        "Busan" : 1,
        "Daegu" : 2,
        "Incheon" : 3,
        "Gwangju" : 4,
        "Daejeon" : 5,
        "Ulsan" : 6,
        "Sejong City" : 7,
        "Gyeonggi-do" : 8,
        "Gangwon-do" : 9,
        "Chungcheongbuk-do" : 10,
        "Chungcheongnam-do" : 11,
        "Jeonbuk State" : 12,
        "Jeollanam-do" : 13,
        "Gyeongsangbuk-do" : 14,
        "Gyeongsangnam-do" : 15,
        "Jeju-do" : 16,
    }
    const [regionUserList, setRegionUserList] = useState([]);

    const [chartData, setChartData] = useState({})
    const [chartLabels, setChartLabels] = useState([])
    const [categories, setCategories] = useState([]);

    const currentYear = format(nowDate, "yyyy");

    const [searchDto, setSearchDto] = useState({
        startMonth : format(nowDate, "yyyy-MM"),
        endMonth : format(nowDate, "yyyy-MM"),
        startDate : format(nowDate, "yyyy-MM-dd"),
        endDate : format(nowDate, "yyyy-MM-dd"),
        page : "regionUser",
        metrics : JSON.stringify(["totalUsers", "activeUsers"]),
        dimensions : JSON.stringify(["region"])
    });

    const searchCategoryChange = (e, i) => {
        document.querySelectorAll(".region .dateDiv" + i).forEach(value => {
            value.style.display = "none"
        })

        document.querySelector(".region .dateDiv" + i + "#" + e + "Div").style.display = "block"
    }

    const dateChange = (t, v) => {
        const startDate = document.querySelector(".region li#" + t + "Div #startDate");
        const endDate = document.querySelector(".region li#" + t + "Div #endDate");
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
            type: 'pie',
        },
        colors: [
            '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099',
            '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395',
            '#994499', '#22aa99', '#aaaa11', '#aa1111'
        ],
        labels : categories,
        title: {
            text: '지역별 사용자',
            align: 'left'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const series = chartData;

    const getStatistics = () => {
        const searchCategory = document.querySelector(".region #searchCategory").value;
        const startDt = document.querySelector(".region li#" + searchCategory + "Div #startDate").value;
        const endDt = document.querySelector(".region li#" + searchCategory + "Div #endDate").value;

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
                endDate : endDate
            }),
        };

        EgovNet.requestFetch("/statisticsApi/getStatistics.do", requestOptions, function (resp) {
            console.log(resp)
            resp.result.rs.sort(function(a, b) {
                var indexA = korRegion[a.region]; // a의 지역 인덱스
                var indexB = korRegion[b.region]; // b의 지역 인덱스

                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;

                return indexA - indexB; // 인덱스에 따라 정렬
            });

            regionUserListMake(resp.result.rs);
        });
    }

    const regionUserListMake = (rs) => {
        setCategories([])
        setChartLabels([])
        setChartData({})

        let dataList = [];
        dataList.push(
            <tr>
                <td colSpan="10">검색된 결과가 없습니다.</td>
            </tr>
        );
        let totalVisitors = 0;
        let totalActiveUsers = 0;
        let totalMbrType1 = 0;
        let totalMbrType2 = 0;
        let totalMbrType3 = 0;
        let totalMbrType4 = 0;

        let newCategories = [];
        let newChartData = [];

        rs.forEach(function (item, index) {
            if (index === 0) dataList = []; // 목록 초기화
            if (korRegion[item.region] !== undefined) {
                const totalUsers = Number(item.totalUsers || 0);
                const activeUsers = Number(item.activeUsers || 0);
                const mbrType1Cnt = Number(item.newUserCnt.mbrType1Cnt || 0);
                const mbrType2Cnt = Number(item.newUserCnt.mbrType2Cnt || 0);
                const mbrType3Cnt = Number(item.newUserCnt.mbrType3Cnt || 0);
                const mbrType4Cnt = Number(item.newUserCnt.mbrType4Cnt || 0);

                totalVisitors += totalUsers;
                totalActiveUsers += activeUsers;
                totalMbrType1 += mbrType1Cnt;
                totalMbrType2 += mbrType2Cnt;
                totalMbrType3 += mbrType3Cnt;
                totalMbrType4 += mbrType4Cnt;

                dataList.push(
                    <tr key={item.region}>
                        <td>{item.korRegionName}</td>
                        <td>{totalUsers.toLocaleString()}</td>
                        <td>{activeUsers.toLocaleString()}</td>

                        <td>{mbrType1Cnt.toLocaleString()}</td>
                        <td>{mbrType3Cnt.toLocaleString()}</td>
                        <td>{mbrType4Cnt.toLocaleString()}</td>
                        <td>{mbrType2Cnt.toLocaleString()}</td>


                        <td>
                            {(
                                totalUsers +
                                activeUsers +
                                mbrType1Cnt +
                                mbrType2Cnt +
                                mbrType3Cnt +
                                mbrType4Cnt
                            ).toLocaleString()}
                        </td>
                    </tr>
                );
                newCategories.push(item.korRegionName);
                newChartData.push(
                    mbrType1Cnt +
                    mbrType2Cnt +
                    mbrType3Cnt +
                    mbrType4Cnt
                )
            }

        });
        dataList.push(
            <tr key="total">
                <td>총합</td>
                <td>{totalVisitors.toLocaleString()}</td>
                <td>{totalActiveUsers.toLocaleString()}</td>
                <td>{totalMbrType1.toLocaleString()}</td>
                <td>{totalMbrType3.toLocaleString()}</td>
                <td>{totalMbrType4.toLocaleString()}</td>
                <td>{totalMbrType2.toLocaleString()}</td>
                <td>{(totalMbrType1 + totalMbrType2 + totalMbrType3 + totalMbrType4).toLocaleString()}</td>
                <td colSpan="2"></td>
            </tr>
        );

        setCategories(newCategories);
        setChartData(newChartData);
        setRegionUserList(dataList);
    }

    useEffect(() => {
        getStatistics();
    }, [searchDto]);

    return (
        <div>
            <style>
            {`
                .region .apexcharts-tooltip span {
                    color: #ffffff;
                }
            `}
            </style>
            <h2 className="pageTitle"><p>지역별 사용자</p></h2>
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
                <div className="topBox"></div>
                <div className="tableBox type1">
                    <ApexCharts options={chartOptions} series={series} type="pie" height={350}/>

                    <table>
                        <caption>지역별 사용자</caption>
                        <thead>
                        <tr>
                            <th rowSpan="2">지역</th>
                            <th rowSpan="2">방문자 수</th>
                            <th rowSpan="2">활성사용자 수</th>
                            <th colSpan="4" style={{textAlign: "center"}}>신규가입자 수</th>
                            <th rowSpan="2">소계</th>
                        </tr>
                        <tr>
                            <th>입주기업</th>
                            <th>유관기관</th>
                            <th>비입주기업</th>
                            <th>컨설턴트</th>
                        </tr>
                        </thead>
                        <tbody>
                        {regionUserList}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManagerStatisticsRegionUser;
