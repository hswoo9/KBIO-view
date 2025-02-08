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

function AccessTabAll(props) {

    return (
        <div className="tableBox type1">
            <table>
                <caption>회원 수</caption>
                <thead>
                <tr>
                    <th>일자</th>
                    <th>입주기업 회원</th>
                    <th>유관기관 회원</th>
                    <th>비입주기업 회원</th>
                    <th>컨설턴트 회원</th>
                    <th>총합</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1일</td>
                    <td>5,600</td>
                    <td>4,600</td>
                    <td>7,600</td>
                    <td>50</td>
                    <td>17,850</td>
                </tr>
                <tr>
                    <td>2일</td>
                    <td>5,600</td>
                    <td>4,600</td>
                    <td>7,600</td>
                    <td>50</td>
                    <td>17,850</td>
                </tr>
                <tr>
                    <td>3일</td>
                    <td>5,600</td>
                    <td>4,600</td>
                    <td>7,600</td>
                    <td>50</td>
                    <td>17,850</td>
                </tr>
                <tr>
                    <td>4일</td>
                    <td>5,600</td>
                    <td>4,600</td>
                    <td>7,600</td>
                    <td>50</td>
                    <td>17,850</td>
                </tr>
                <tr>
                    <td>5일</td>
                    <td>5,600</td>
                    <td>4,600</td>
                    <td>7,600</td>
                    <td>50</td>
                    <td>17,850</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default AccessTabAll;
