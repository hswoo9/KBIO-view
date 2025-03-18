import React, { useState, useEffect, useCallback, useRef } from "react";
import ApexCharts from 'react-apexcharts'
import * as EgovNet from "@/api/egovFetch";

function AccessTabPst(props) {
    const [searchDto, setSearchDto] = useState(
        props.searchDto || {
            searchYear: "",
            searchMonth: "",
            trgtSn : ""
        }
    );

    const year = parseInt(searchDto.searchYear, 10);
    const month = parseInt(searchDto.searchMonth, 10);
    //const lastDay = new Date(year, month, 0).getDate();
    const lastDay = searchDto.lastDate
        ? parseInt(searchDto.lastDate.split("-")[2], 10)
        : new Date(year, month, 0).getDate();

    //const categories = Array.from({ length: lastDay }, (_, i) => String(i + 1 + "일").padStart(2, '0'));
    const categories = (() => {
        if (searchDto.searchDate) {
            const startDate = new Date(searchDto.searchDate);
            const endDate = new Date(searchDto.lastDate || lastDay);
            const categoryList = [];

            while (startDate <= endDate) {
                const day = String(startDate.getDate()).padStart(2, '0'); // 일자만 추출하여 두 자리로 맞춤
                categoryList.push(day + "일");
                startDate.setDate(startDate.getDate() + 1); // 다음 날짜로 이동
            }

            return categoryList;
        } else {
            return Array.from({ length: lastDay }, (_, i) =>
                String(i + 1).padStart(2, '0') + "일"
            );
        }
    })();

    const [pstAccessList, setPstAccessList] = useState([]);
    const [cnt, setCnt] = useState([])

    const getStatisticsPstAccess = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch("/statisticsApi/getStatisticsPstAccess.do", requestOptions, function (resp) {
            setCnt([])

            const statisticsMap = new Map(
                resp.result.statisticsPstAccess.map(item => [item.day.split("-")[2], item])
            );

            let totalAccessCnt = 0;
            const dataList = categories.map(day => {
                const dayFormat = day.slice(0, -1).padStart(2, '0');
                /** chart Item */
                const chartItem =  statisticsMap.get(dayFormat) ? statisticsMap.get(dayFormat).cnt : 0
                setCnt(cnt => [...cnt, chartItem])

                /** table Item */
                const tbItem = statisticsMap.get(dayFormat) || {
                    day,
                    cnt: 0,
                };

                totalAccessCnt += Number(tbItem.cnt || 0)

                return (
                    <tr key={dayFormat}>
                        <td>{dayFormat} 일</td>
                        <td>{Number(tbItem.cnt || 0).toLocaleString()} 명</td>
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

            setPstAccessList(dataList);
            props.onCallback();
        });
    }

    useEffect(() => {
        props.onCallback("isLoading");
        getStatisticsPstAccess()
    }, [searchDto]);


    const chartOptions = {
        chart: {
            id: props.pageName + "-접속통계",
        },
        //컬럼명
        xaxis: {
            categories: categories,
        },
    };

    const series = [
        {
            name: '접속자수',
            data: cnt,
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
                        {pstAccessList}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AccessTabPst;
