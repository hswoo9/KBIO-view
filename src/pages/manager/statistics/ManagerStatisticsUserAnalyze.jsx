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
import ManagerStatisticsPeriodUser from "./tabGroup/ManagerStatisticsPeriodUser.jsx";
import ManagerStatisticsRegionUser from "./tabGroup/ManagerStatisticsRegionUser.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner.jsx";

function ManagerStatisticsUserAnalyze(props) {
    const [isLoading, setIsLoading] = useState(true);  // 로딩 상태

    const handleCallback = (e) => {
        if(e == "isLoading"){
            setIsLoading(true);
        }else{
            setIsLoading(false);
        }
    };

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>

            {isLoading &&
                <LoadingSpinner />
            }

            <div className="inner period">
                <ManagerStatisticsPeriodUser onCallback={handleCallback}/>
            </div>
            <div className="inner region">
                <ManagerStatisticsRegionUser onCallback={handleCallback}/>
            </div>
        </div>
    );
}

export default ManagerStatisticsUserAnalyze;
