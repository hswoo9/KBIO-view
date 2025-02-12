import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeftNew from "@/components/manager/ManagerLeftHomepage";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";

function ManagerPrivacyList(props) {
    const searchWrdRef = useRef();
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const useYnRef = useRef();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
            useYn: "",
            utztnTrmsKnd: 1,
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({});

    const [privacyPolicyList, setprivacyPolicyList] = useState([]);

    const cndRef = useRef();
    const wrdRef = useRef();

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getprivacyPolicyList(searchDto);
        }
    };

    const getprivacyPolicyList = useCallback(
        (searchDto) => {
            const privacyPolicyListURL = "/utztnApi/getPrivacyPolicyList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                privacyPolicyListURL,
                requestOptions,
                (resp) => {
                    console.log("Response:", resp);
                    console.log("Data List:", resp.result?.getPrivacyPolicyList);
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="no-data">
                            <td colSpan="6">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getPrivacyPolicyList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        const totalItems = resp.result.getPrivacyPolicyList.length;
                        const itemNumber = totalItems - index;

                        dataList.push(
                            <tr key={item.utztnTrmsSn}>
                                <td>{itemNumber}</td>
                                <td>
                                    <Link
                                        to={{pathname: URL.MANAGER_HOMEPAGE_PRIVACY_MODIFY}}
                                        state={{
                                            utztnTrmsSn: item.utztnTrmsSn
                                        }}
                                        key={item.utztnTrmsSn}
                                        style={{cursor: 'pointer', textDecoration: 'underline'}}
                                    >
                                        {item.utztnTrmsTtl}
                                    </Link>
                                </td>
                                <td>{item.creatr}</td>
                                <td>{new Date(item.frstCrtDt).toISOString().split("T")[0]}</td>
                                <td>{item.useYn === "Y" ? "사용중" : "사용안함"}</td>
                            </tr>
                        );
                    });
                    setprivacyPolicyList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [privacyPolicyList, searchDto]
    );

    useEffect(() => {
        getprivacyPolicyList(searchDto);
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>개인정보처리방침</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">사용여부</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            ref={useYnRef}
                                            onChange={(e) => {
                                                setSearchDto({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    useYn: e.target.value,
                                                });
                                                getprivacyPolicyList({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    useYn: e.target.value,
                                                });
                                            }}
                                    >
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <p className="title">이름</p>
                                <label className="input"><input type="text" id="search" name="search"
                                                                placeholder="검색어를 입력해주세요"/></label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray">
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        getprivacyPolicyList({
                                            ...searchDto,
                                            pageIndex: 1,
                                            useYn: e.target.value,
                                        });
                                    }}>
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">전체 : <span className="red">{paginationInfo.totalRecordCount}</span>건
                            페이지 : <span
                                className="red">{paginationInfo.currentPageNo}/{paginationInfo.totalPageCount}</span>
                        </p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red">
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                        </div>
                    </div>
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>조직도목록</caption>
                            <colgroup>
                            <col width="80px"/>
                                <col width="600px"/>
                                <col width="200px"/>
                                <col width="250px"/>
                                <col width="150px"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>등록자</th>
                                <th>등록일</th>
                                <th>사용여부</th>
                            </tr>
                            </thead>
                            <tbody>
                            {privacyPolicyList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                privacyPolicyList({
                                    ...searchDto,
                                    pageIndex: passedPage,
                                });
                            }}
                        />
                        <NavLink
                            to={{pathname: URL.MANAGER_HOMEPAGE_PRIVACY_CREATE}}
                        >
                            <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerPrivacyList;
