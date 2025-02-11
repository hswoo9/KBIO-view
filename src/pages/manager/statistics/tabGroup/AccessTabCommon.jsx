import React, { useState, useEffect, useCallback, useRef } from "react";
import ApexCharts from 'react-apexcharts'

function AccessTabCommon(props) {

    const chartOptions = {
        chart: {
            id: 'basic-bar',
        },
        //컬럼명
        xaxis: {
            categories: ['1일', '2일', '3일', '4일', '5일', '6일', '7일', '8일', '9일', '10일'],
        },
    };

    const series = [
        {
            name: '사용자',
            data: [5, 6, 7, 5, 10, 12, 16, 3, 20, 1],
        },
    ];

    return (
        <ApexCharts options={chartOptions} series={series} type="bar" height={350}/>
    );
}

export default AccessTabCommon;
