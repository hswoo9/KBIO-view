import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeftNew from "@/components/manager/ManagerLeftStatistics";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

import { getSessionItem } from "@/utils/storage";

function ManagerStatisticsUser(props) {

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>사용자통계</p></h2>
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
                                    <select className="selectGroup"
                                            id="bbsTypeNm"
                                            name="bbsTypeNm"
                                            title="게시판유형선택"
                                            ref={bbsTypeNmRef}
                                            onChange={(e) => {
                                                getBbsList({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    bbsTypeNm: bbsTypeNmRef.current.value,
                                                    bbsNm: bbsNmRef.current.value,
                                                });
                                            }}
                                    >
                                        <option value="">전체</option>
                                        <option value="0">일반</option>
                                        <option value="1">FAQ</option>
                                        <option value="2">QNA</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input type="text"
                                           name=""
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray">
                                <div className="icon"></div>
                            </button>
                            <button type="button"
                                    className="searchBtn btn btn1 point"
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">

                </div>
            </div>
        </div>
    );
}

export default ManagerStatisticsUser;
