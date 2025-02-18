import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

import { getSessionItem } from "@/utils/storage";
import moment from "moment";

function ManagerAccessList(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            searchType: "",
            searchVal: "",
            actvtnYn : "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({});
    const [mngrAcsIpList, setMngrAcsIpList] = useState([]);

    const searchTypeRef = useRef();
    const searchValRef = useRef();
    const actvtnYnRef = useRef();

    const searchHandle = () => {
        getMngrAcsIpList(searchDto);
    }

    const searchReset = () => {
        setSearchDto({
            ...searchDto,
            actvtnYn: "",
            searchType: "",
            searchVal: ""
        })
    }

    const getMngrAcsIpList = useCallback(
        (searchDto) => {
            const pstListURL = "/mngrAcsIpApi/getMngrAcsIpList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                pstListURL,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan="5">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.mngrAcsIpList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화
                        dataList.push(
                            <tr key={item.mngrAcsSn}>
                                <td>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td style={{textAlign: "left", paddingLeft: "15px"}}>
                                    <NavLink to={URL.MANAGER_ACCESS_MODIFY}
                                          mode={CODE.MODE_MODIFY}
                                          state={{mngrAcsSn: item.mngrAcsSn}}
                                    >
                                        {item.ipAddr}
                                    </NavLink>
                                </td>
                                <td>
                                    <NavLink
                                        to={URL.MANAGER_ACCESS_MODIFY}
                                             mode={CODE.MODE_MODIFY}
                                             state={{mngrAcsSn: item.mngrAcsSn}}
                                    >
                                        {item.plcusNm}
                                    </NavLink>
                                </td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "미사용"}</td>
                            </tr>
                        );
                    });
                    setMngrAcsIpList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [mngrAcsIpList, searchDto]
    );

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getMngrAcsIpList(searchDto);
        }
    };

    useEffect(() => {
        getMngrAcsIpList(searchDto);
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>접근관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">활성여부</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        id="actvtnYn"
                                        name="actvtnYn"
                                        title="검색유형"
                                        ref={actvtnYnRef}
                                        value={searchDto.actvtnYn || ""}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, actvtnYn: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        id="searchType"
                                        name="searchType"
                                        title="검색유형"
                                        ref={searchTypeRef}
                                        value={searchDto.searchType || ""}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchType: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="1">IP</option>
                                        <option value="2">사용처</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input
                                        name=""
                                        ref={searchValRef}
                                        value={searchDto.searchVal || ""}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchVal: e.target.value})
                                        }}
                                        onKeyDown={activeEnter}
                                        placeholder="검색어를 입력해주세요"
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray"
                                    onClick={searchReset}
                            >
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point"
                                    onClick={searchHandle}
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>접근관리목록</caption>
                            <colgroup>
                                <col width="50px"/>
                                <col width="200px"/>
                                <col width="200px"/>
                                <col width="120px"/>
                                <col width="80px"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>IP</th>
                                <th>사용처</th>
                                <th>등록일자</th>
                                <th>활성여부</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mngrAcsIpList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getMngrAcsIpList({
                                    ...searchDto,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                        <NavLink
                            to={{pathname: URL.MANAGER_ACCESS_CREATE}}
                            mode={CODE.MODE_CREATE}
                        >
                            <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerAccessList;
