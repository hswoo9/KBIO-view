import React, { useState, useEffect, useCallback, useRef } from "react";
import * as EgovNet from "@/api/egovFetch";
import ApexCharts from "react-apexcharts";

function AccessTabAll(props) {
    const [searchDto, setSearchDto] = useState(
        props.searchDto || {
            searchYear: "",
            searchMonth: "",
        }
    );
    const year = parseInt(searchDto.searchYear, 10);
    const month = parseInt(searchDto.searchMonth, 10);
    const lastDay = new Date(year, month, 0).getDate();

    const [userAccessList, setUserAccessList] = useState([]);
    const categories = Array.from({ length: lastDay }, (_, i) => String(i + 1 + "일").padStart(2, '0'));
    const [mbrType1UserCnt, setMbrType1UserCnt] = useState([])
    const [mbrType3UserCnt, setMbrType3UserCnt] = useState([])
    const [mbrType4UserCnt, setMbrType4UserCnt] = useState([])
    const [mbrType2UserCnt, setMbrType2UserCnt] = useState([])

    const chartOptions = {
        chart: {
            id: '회원구분별 접속통계',
        },
        plotOptions: {
            bar: {
                columnWidth: "10px", // 막대 너비 (퍼센트 또는 px 단위)
            }
        },
        dataLabels: {
            enabled: false // 데이터 라벨(숫자) 숨김
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

    const getStatisticsUserAccess = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch("/statisticsApi/getStatisticsUserAccess.do", requestOptions, function (resp) {
            const statisticsMap = new Map(
                resp.result.statisticsUserAccess.map(item => [item.day.split("-")[2], item])
            );

            let totalMbrType1Cnt = 0;
            let totalMbrType2Cnt = 0;
            let totalMbrType3Cnt = 0;
            let totalMbrType4Cnt = 0;

            let type1CntList = [];
            let type2CntList = [];
            let type3CntList = [];
            let type4CntList = [];

            const dataList = categories.map(day => {
                const dayFormat = day.slice(0, -1);

                const item = statisticsMap.get(dayFormat) || {
                    day,
                    mbrType1Cnt: 0,
                    mbrType2Cnt: 0,
                    mbrType3Cnt: 0,
                    mbrType4Cnt: 0,
                };

                totalMbrType1Cnt += item.mbrType1Cnt;
                totalMbrType2Cnt += item.mbrType2Cnt;
                totalMbrType3Cnt += item.mbrType3Cnt;
                totalMbrType4Cnt += item.mbrType4Cnt;

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

            dataList.push(
                <tr key="total">
                    <td className="th1">총합</td>
                    <td>{Number(totalMbrType1Cnt).toLocaleString()} 명</td>
                    <td>{Number(totalMbrType3Cnt).toLocaleString()} 명</td>
                    <td>{Number(totalMbrType4Cnt).toLocaleString()} 명</td>
                    <td>{Number(totalMbrType2Cnt).toLocaleString()} 명</td>
                    <td>
                        {Number(totalMbrType1Cnt + totalMbrType2Cnt + totalMbrType3Cnt + totalMbrType4Cnt).toLocaleString()} 명
                    </td>
                </tr>
            );

            setMbrType1UserCnt(type1CntList);
            setMbrType2UserCnt(type2CntList);
            setMbrType3UserCnt(type3CntList);
            setMbrType4UserCnt(type4CntList);
            setUserAccessList(dataList);
            props.onCallback();
        });
    }

    useEffect(() => {
        props.onCallback("isLoading");
        getStatisticsUserAccess()
    }, [searchDto]);

    return (
        <>
            <style>
                {`
                // #tbChart {
                //     display : flex;
                // }
                // #item1 {
                //     width : 30%
                // }
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
                //  #item2 {
                //     width : 70%
                // }
            `}
            </style>
            <div className="contBox board type1 customContBox">
                <div className="tableBox type1" id="tbChart">
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
                            {userAccessList}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="tableBox type1">
                <ApexCharts options={chartOptions} series={series} type="bar" height={350}/>
            </div>
        </>
    );
}

export default AccessTabAll;
