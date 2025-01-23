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

function ManagerAccessList(props) {
    const location = useLocation();
    console.log(location);
    const sessionUser = getSessionItem("loginUser");
    const [searchCondition, setSearchCondition] = useState(
        location.state?.searchCondition || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({});

    const cndRef = useRef();
    const wrdRef = useRef();

    const [saveEvent, setSaveEvent] = useState({});
    useEffect(() => {
        if(saveEvent.save){
            if(saveEvent.mode == "delete"){
                delCdGroupData(saveEvent);
            }
        }
    }, [saveEvent]);

    useEffect(() => {
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
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="1">IP</option>
                                        <option value="2">사용처</option>
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
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>접근관리목록</caption>
                            <colgroup>
                                <col width="50px"/>
                                <col width="200px"/>
                                <col/>
                                <col width="80px"/>
                                <col/>
                                <col/>
                                <col/>
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
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {

                            }}
                        />
                        <NavLink
                            to={{pathname: URL.MANAGER_ACCESS_CREATE}}

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
