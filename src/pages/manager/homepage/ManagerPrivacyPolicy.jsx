import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { excelExport } from "@/components/CommonComponents";
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
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const searchTypeRef = useRef();
    const searchValRef = useRef();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            searchCnd: "0",
            searchVal : "",
            searchType: "",
            useYn: "",
            utztnTrmsKnd: 1,
        }
    );

    const searchReset = () => {
        setSearchDto({
            pageIndex: 1,
            searchVal: "",
            searchType: "",
            useYn: ""
        });
    };

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

    const dataExcelDownload = useCallback(() => {
        //let excelParams = searchDto;
        let excelParams = { ...searchDto };
        excelParams.pageIndex = 1;
        excelParams.pageUnit = paginationInfo?.totalRecordCount || 9999999999

        const requestURL = "/utztnApi/getPrivacyPolicyList.do";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(excelParams)
        };
        EgovNet.requestFetch(
            requestURL,
            requestOptions,
            (resp) => {
                let rowDatas = [];
                if(resp.result.getPrivacyPolicyList != null){
                    resp.result.getPrivacyPolicyList.forEach(function (item, index) {
                        rowDatas.push(
                            {
                                number : resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index,
                                utztnTrmsTtl : item.utztnTrmsTtl,
                                creatr : item.creatr,
                                frstCrtDt : moment(item.frstCrtDt).format('YYYY-MM-DD'),
                                useYn : item.useYn === "Y" ? "사용중" : "사용안함",
                            }
                        )
                    });
                }

                let sheetDatas = [{
                    sheetName : "개인정보처리방침",
                    header : ['번호', '제목', '등록자', '등록일', '사용여부'],
                    row : rowDatas
                }];
                excelExport("개인정보처리방침", sheetDatas);
            }
        )
    });

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
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="no-data">
                            <td colSpan="6">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getPrivacyPolicyList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.utztnTrmsSn}>
                                <td>{resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}</td>
                                <td>
                                    <Link
                                        to={{pathname: URL.MANAGER_HOMEPAGE_PRIVACY_MODIFY}}
                                        state={{
                                            utztnTrmsSn: item.utztnTrmsSn
                                        }}
                                        key={item.utztnTrmsSn}
                                        style={{cursor: 'pointer'}}
                                    >
                                        {item.utztnTrmsTtl}
                                    </Link>
                                </td>
                                <td>{item.creatr}</td>
                                <td>{new Date(item.frstCrtDt).toISOString().split("T")[0]}</td>
                                <td>{item.useYn === "Y" ? "사용중" : "사용안함"}</td>
                                <td>
                                    {item.cnsltSttsCd === "200" && (
                                        <span>만족도완료</span>
                                    )}
                                </td>
                            </tr>
                        );
                    });
                    setprivacyPolicyList(dataList);
                },
                function (resp) {

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
                                            name="useYn"
                                            value={searchDto.useYn || ""}
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, useYn: e.target.value})
                                            }}
                                    >
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width: "25%"}}>
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
                                        <option value="utztnTrmsCn">제목</option>
                                        <option value="utztnTrmsTtl">내용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1" style={{width: "100%"}}>
                                <label className="input">
                                    <input
                                        type="text"
                                        name="searchVal"
                                        value={searchDto.searchVal}
                                        placeholder=""
                                        ref={searchValRef}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchVal: e.target.value})
                                        }}
                                        onKeyDown={activeEnter}
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        getprivacyPolicyList({
                                            ...searchDto,
                                            pageIndex: 1
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
                            <button type="button" className="btn btn2 downBtn red"
                                onClick={dataExcelDownload}
                            >
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                        </div>
                    </div>
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>개인정보처리방침목록</caption>
                            <thead>
                            <tr>
                                <th className="th2">번호</th>
                                <th>제목</th>
                                <th className="th2">등록자</th>
                                <th className="th2">등록일</th>
                                <th className="th2">사용여부</th>
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
