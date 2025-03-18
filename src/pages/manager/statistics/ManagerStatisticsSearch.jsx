import React, { useState, useEffect, useCallback, useRef } from "react";
import ManagerLeftNew from "@/components/manager/ManagerLeftStatistics";

import ApexCharts from 'react-apexcharts';

function ManagerStatisticsSearch(props) {


    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>검색어 통계</p></h2>

            </div>
        </div>
    )
}

export default ManagerStatisticsSearch;
