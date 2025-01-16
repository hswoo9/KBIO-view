import React, { useState, useEffect, useCallback } from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftMember";
import ResidentCompanyList from "./ResidentCompanyList.jsx";
import EgovPaging from "@/components/EgovPaging";


function Index(props) {

  const location = useLocation();
    
  const Location = React.memo(function Location() {
    return (
        <div className="location">
            <ul>
                <li>
                    <Link to={URL.MANAGER} className="home">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to={URL.MANAGER_NORMAL_MEMBER}>회원관리</Link>
                </li>
                <li>입주기업</li>
            </ul>

        </div>
    );
  });


    return (
        <div className="container">
            <div className="c_wrap">
                <Location/>

                <div className="layout">
                    {/* <!-- layout --> */}
                    <EgovLeftNav/>
                    <div className="contents BOARD_CREATE_LIST" id="contents">

                        <div className="condition">
                            <ul>
                                <li className="third_1 L">
                                    <span className="lb">검색기능 예시</span>
                                    <label className="f_select" htmlFor="bbsType">
                                        <select
                                            id="searchExample"
                                            name="searchExample"
                                            title="검색기능예시"
                                        >
                                            <option value="0">일반</option>
                                        </select>
                                    </label>
                                </li>
                                <li className="third_2 R">
                                    <span className="lb">검색어</span>
                                    <span className="f_search w_400">
                                        <input
                                            type="text"
                                            name=""
                                            placeholder=""
                                            onChange={(e) => {
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {

                                            }}
                                        >
                                          조회
                                        </button>
                                  </span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <NavLink
                                to={URL.RESIDENT_COMPANY_CREATE}
                                className="btn  btn_blue_h46 pd35"
                                style={{float: "right", marginRight: "20px", marginTop: "15px", marginBottom: "15px"}}
                            >
                                입주기업 등록
                            </NavLink>
                        </div>
                            {/*테이블 영역*/}
                            <ResidentCompanyList/>
                    </div>
                    {/* <!--// layout --> */}
                </div>
            </div>
        </div>
    )
        ;
}

export default Index;
