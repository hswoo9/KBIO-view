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

function ManagerStatisticsUserAnalyze(props) {

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner period">
                <ManagerStatisticsPeriodUser/>
            </div>
            <div className="inner region">
                <ManagerStatisticsRegionUser/>
            </div>
        </div>
    );
}

export default ManagerStatisticsUserAnalyze;
