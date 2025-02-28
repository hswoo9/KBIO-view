import React, { useState, useEffect, useCallback, useRef } from "react";
import ApexCharts from 'react-apexcharts'
import * as EgovNet from "@/api/egovFetch";

function AccessTabMoveIn(props) {
    const [searchDto, setSearchDto] = useState(
        props.searchDto || {
            searchYear: "",
            searchMonth: "",
            mbrType : ""
        }
    );

    const year = parseInt(searchDto.searchYear, 10);
    const month = parseInt(searchDto.searchMonth, 10);
    const lastDay = new Date(year, month, 0).getDate();

    const categories = Array.from({ length: lastDay }, (_, i) => String(i + 1 + "일").padStart(2, '0'));
    const [userAccessList, setUserAccessList] = useState([]);
    const [userCnt, setUserCnt] = useState([])

    const getStatisticsUserAccess = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch("/statisticsApi/getStatisticsUserAccess.do", requestOptions, function (resp) {
            setUserCnt([])

            const statisticsMap = new Map(
                resp.result.statisticsUserAccess.map(item => [item.day.split("-")[2], item])
            );

            let totalAccessCnt = 0;
            const dataList = categories.map(day => {
                const dayFormat = day.slice(0, -1);

                /** chart Item */
                const chartItem =  statisticsMap.get(dayFormat) ? statisticsMap.get(dayFormat)["mbrType" + searchDto.mbrType + "Cnt"] : 0
                setUserCnt(userCnt => [...userCnt, chartItem])

                /** table Item */
                const tbItem = statisticsMap.get(dayFormat) || {
                    day,
                    ["mbrType" + searchDto.mbrType + "Cnt"] : 0,
                };

                totalAccessCnt += Number(tbItem["mbrType" + searchDto.mbrType + "Cnt"] || 0)

                return (
                    <tr key={dayFormat}>
                        <td>{dayFormat} 일</td>
                        <td>{Number(tbItem["mbrType" + searchDto.mbrType + "Cnt"] || 0).toLocaleString()} 명</td>
                    </tr>
                );
            });

            /** table Item */
            dataList.push(
                <tr key="total">
                    <td>총합</td>
                    <td>{Number(totalAccessCnt).toLocaleString()} 명</td>
                </tr>
            );

            setUserAccessList(dataList);
            props.onCallback();
        });
    }

    useEffect(() => {
        props.onCallback("isLoading");
        getStatisticsUserAccess()
    }, [searchDto]);

    const chartOptions = {
        chart: {
            id: props.pageName + "-접속통계",
        },
        xaxis: {
            categories: categories,
        },
    };

    const series = [
        {
            name: props.pageName || "사용자",
            data: userCnt,
        },
    ];

    return (
        <>
            <style>
            {`
                #tbChart {
                    display : flex;
                }
                #item1 {
                    width : 25%
                }
                #item1 tbody tr td:nth-child(1) {
                    text-align : left !important;
                }
                #item1 tbody tr td:nth-child(2) {
                    text-align : right;
                } 
                 #item2 {
                    width : 75%
                }
                
                .scrollable-tbody {
                    display: block;
                    max-height: 450px; /* 원하는 높이 지정 */
                    min-height: 300px;
                    overflow-y: auto;
                }

            `}
            </style>
            <div className="tableBox type1" id="tbChart">
                <div id="item2">
                    <ApexCharts options={chartOptions} series={series} type="bar" height={500}/>
                </div>
                <div id="item1">
                    <table>
                        <caption>접속자 수</caption>
                        <thead className="fixed-thead">
                        <tr>
                            <th>일자</th>
                            <th>접속자수</th>
                        </tr>
                        </thead>
                        <tbody className="scrollable-tbody">
                        {userAccessList}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AccessTabMoveIn;
