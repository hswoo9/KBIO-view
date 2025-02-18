import React, { useState, useEffect, useCallback, useRef } from "react";
import ApexCharts from 'react-apexcharts'
import * as EgovNet from "../../../../api/egovFetch.js";

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
            resp.result.statisticsUserAccess.forEach(function(v, i){
                const userCounts = categories.map((day) => {
                    const item = resp.result.statisticsUserAccess.find(v => parseInt(v.day.split("-")[2]) === parseInt(day.slice(0, -1)));
                    return item ? item["mbrType" + searchDto.mbrType + "Cnt"] : 0;
                });

                setUserCnt(userCounts)
            })
            props.onCallback();
        });
    }

    useEffect(() => {
        props.onCallback("isLoading");
        getStatisticsUserAccess()
    }, [searchDto]);

    const chartOptions = {
        chart: {
            id: 'basic-bar',
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
        <ApexCharts options={chartOptions} series={series} type="bar" height={350}/>
    );
}

export default AccessTabMoveIn;
