import React, { useState, useEffect, useCallback, useRef } from "react";
import * as EgovNet from "../../../../api/egovFetch.js";

function AccessTabAll(props) {
    const [searchDto, setSearchDto] = useState(
        props.searchDto || {
            searchYear: "",
            searchMonth: "",
        }
    );
    const [userAccessList, setUserAccessList] = useState([]);

    const getStatisticsUserAccess = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch("/statisticsApi/getStatisticsUserAccess.do", requestOptions, function (resp) {

            const year = parseInt(searchDto.searchYear, 10);
            const month = parseInt(searchDto.searchMonth, 10);
            const lastDay = new Date(year, month, 0).getDate();
            const daysInMonth = Array.from({ length: lastDay }, (_, i) => String(i + 1).padStart(2, '0'));

            const statisticsMap = new Map(
                resp.result.statisticsUserAccess.map(item => [item.day.split("-")[2], item])
            );

            let totalMbrType1Cnt = 0;
            let totalMbrType2Cnt = 0;
            let totalMbrType3Cnt = 0;
            let totalMbrType4Cnt = 0;

            const dataList = daysInMonth.map(day => {
                const item = statisticsMap.get(day) || {
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

                return (
                    <tr key={day}>
                        <td>{day} 일</td>
                        <td>{Number(item.mbrType1Cnt).toLocaleString()}</td>
                        <td>{Number(item.mbrType3Cnt).toLocaleString()}</td>
                        <td>{Number(item.mbrType4Cnt).toLocaleString()}</td>
                        <td>{Number(item.mbrType2Cnt).toLocaleString()}</td>
                        <td>
                            {Number(item.mbrType1Cnt + item.mbrType2Cnt + item.mbrType3Cnt + item.mbrType4Cnt).toLocaleString()}
                        </td>
                    </tr>
                );
            });

            dataList.push(
                <tr key="total">
                    <td>총합</td>
                    <td>{Number(totalMbrType1Cnt).toLocaleString()}</td>
                    <td>{Number(totalMbrType3Cnt).toLocaleString()}</td>
                    <td>{Number(totalMbrType4Cnt).toLocaleString()}</td>
                    <td>{Number(totalMbrType2Cnt).toLocaleString()}</td>
                    <td>
                        {Number(totalMbrType1Cnt + totalMbrType2Cnt + totalMbrType3Cnt + totalMbrType4Cnt).toLocaleString()}
                    </td>
                </tr>
            );

            setUserAccessList(dataList);
        });
    }

    useEffect(() => {
        getStatisticsUserAccess()
    }, [searchDto]);

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
                {userAccessList}
                </tbody>
            </table>
        </div>
    );
}

export default AccessTabAll;
