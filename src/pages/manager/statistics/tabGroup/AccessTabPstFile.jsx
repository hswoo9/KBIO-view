import React, { useState, useEffect, useCallback, useRef } from "react";
import ApexCharts from 'react-apexcharts'
import * as EgovNet from "@/api/egovFetch";

function AccessTabPstFile(props) {
    console.log(props.pageName)
    const [searchDto, setSearchDto] = useState(
        props.searchDto || {
            searchYear: "",
            searchMonth: "",
            trgtSn : ""
        }
    );

    const year = parseInt(searchDto.searchYear, 10);
    const month = parseInt(searchDto.searchMonth, 10);
    const lastDay = new Date(year, month, 0).getDate();

    const categories = Array.from({ length: lastDay }, (_, i) => String(i + 1 + "일").padStart(2, '0'));
    const [pstFileUseList, setPstFileUseList] = useState([]);
    const [cnt, setCnt] = useState([])

    const getStatisticsPstAccess = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch("/statisticsApi/getStatisticsPstFile.do", requestOptions, function (resp) {
            setCnt([])

            const statisticsMap = new Map(
                resp.result.statisticsPstFile.map(item => [item.day.split("-")[2], item])
            );

            let totalPstFileUseCnt = 0;
            const dataList = categories.map(day => {
                const dayFormat = day.slice(0, -1);

                /** chart Item */
                const chartItem =  statisticsMap.get(dayFormat) ? statisticsMap.get(dayFormat).cnt : 0
                setCnt(cnt => [...cnt, chartItem])

                /** table Item */
                const tbItem = statisticsMap.get(dayFormat) || {
                    day,
                    cnt: 0,
                };

                totalPstFileUseCnt += Number(tbItem.cnt || 0)

                return (
                    <tr key={dayFormat}>
                        <td>{dayFormat} 일</td>
                        <td>{Number(tbItem.cnt || 0).toLocaleString()} 건</td>
                    </tr>
                );
            });

            /** table Item */
            dataList.push(
                <tr key="total">
                    <td>총합</td>
                    <td>{Number(totalPstFileUseCnt).toLocaleString()} 건</td>
                </tr>
            );

            setPstFileUseList(dataList);
            props.onCallback();
        });
    }

    useEffect(() => {
        props.onCallback("isLoading");
        getStatisticsPstAccess()
    }, [searchDto]);


    const chartOptions = {
        chart: {
            id: props.pageName + "-첨부자료이용통계",
        },
        xaxis: {
            categories: categories,
        },
    };

    const series = [
        {
            name: '다운로드수',
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
                <div id="item1">
                    <table>
                        <caption>다운로드수</caption>
                        <thead className="fixed-thead">
                        <tr>
                            <th>일자</th>
                            <th>다운로드수</th>
                        </tr>
                        </thead>
                        <tbody className="scrollable-tbody">
                            {pstFileUseList}
                        </tbody>
                    </table>
                </div>
                <div id="item2">
                    <ApexCharts options={chartOptions} series={series} type="bar" height={500}/>
                </div>
            </div>
        </>
    );
}

export default AccessTabPstFile;
