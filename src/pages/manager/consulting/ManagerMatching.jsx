import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftConsulting";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import { getSessionItem } from "@/utils/storage";

function ManagerMatching(props) {

    const [searchCondition, setSearchCondition] = useState(
        location.state?.searchCondition || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({
        currentPageNo: 1,
        firstPageNo: 1,
        firstPageNoOnPageList: 1,
        firstRecordIndex: 0,
        lastPageNo: 1,
        lastPageNoOnPageList: 1,
        lastRecordIndex: 10,
        pageSize: 10,
        recordCountPerPage: 10,
        totalPageCount: 15,
        totalRecordCount: 158
    });
    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>간편상담</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">자문분야</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">상태</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="1">답변대기</option>
                                        <option value="2">답변완료</option>
                                        <option value="3">처리완료</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="1">컨설턴트</option>
                                        <option value="2">소속</option>
                                        <option value="3">제목</option>
                                        <option value="4">신청자</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input"><input type="text" id="search" name="search"
                                                                placeholder="검색어를 입력해주세요"/></label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray">
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point">
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">전체 : <span className="red">1234</span>건 페이지 : <span className="red">1/400</span> </p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red">
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                        </div>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>전문가목록</caption>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>자문분야</th>
                                <th>컨설턴트</th>
                                <th>소속</th>
                                <th>제목</th>
                                <th>신청자</th>
                                <th>신청일</th>
                                <th>상태</th>
                                <th>만족도</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {

                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerMatching;
