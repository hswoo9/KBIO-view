import React, { useState, useEffect, useCallback, useRef } from "react";
import ApexCharts from 'react-apexcharts'
import * as EgovNet from "@/api/egovFetch";

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
            resp.result.statisticsPstFile.forEach(function(v, i){
                const userCounts = categories.map((day) => {
                    const item = resp.result.statisticsPstFile.find(v => parseInt(v.day.split("-")[2]) === parseInt(day.slice(0, -1)));
                    return item ? item.cnt : 0;
                });

                setCnt(userCounts)
            })
            props.onCallback();
        });
    }

    useEffect(() => {
        props.onCallback("isLoading");
        getStatisticsPstAccess()
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
            name: '다운로드수',
            data: cnt,
        },
    ];

    return (
        <ApexCharts options={chartOptions} series={series} type="bar" height={350}/>
    );
}

export default AccessTabPst;
