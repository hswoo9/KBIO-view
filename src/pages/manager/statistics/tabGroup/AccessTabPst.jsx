import React, { useState, useEffect, useCallback, useRef } from "react";
import ApexCharts from 'react-apexcharts'
import * as EgovNet from "../../../../api/egovFetch.js";

function AccessTabPst(props) {
    const [searchDto, setSearchDto] = useState(
        props.searchDto || {
            searchYear: "",
            searchMonth: "",
            bbsSn : ""
        }
    );

    const year = parseInt(searchDto.searchYear, 10);
    const month = parseInt(searchDto.searchMonth, 10);
    const lastDay = new Date(year, month, 0).getDate();

    const categories = Array.from({ length: lastDay }, (_, i) => String(i + 1 + "일").padStart(2, '0'));
    const [pstInqCnt, setPstInqCnt] = useState([])

    const getStatisticsPstAccess = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch("/statisticsApi/getStatisticsPstAccess.do", requestOptions, function (resp) {
            resp.result.statisticsPstAccess.forEach(function(v, i){
                const userCounts = categories.map((day) => {
                    const item = resp.result.statisticsPstAccess.find(v => parseInt(v.day.split("-")[2]) === parseInt(day.slice(0, -1)));
                    return item ? item.inqCnt : 0;
                });

                setPstInqCnt(userCounts)
            })
        });
    }

    useEffect(() => {
        getStatisticsPstAccess()
    }, [searchDto]);


    const chartOptions = {
        chart: {
            id: 'basic-bar',
        },
        //컬럼명
        xaxis: {
            categories: categories,
        },
    };

    const series = [
        {
            name: '조회수',
            data: pstInqCnt,
        },
    ];

    return (
        <ApexCharts options={chartOptions} series={series} type="bar" height={350}/>
    );
}

export default AccessTabPst;
