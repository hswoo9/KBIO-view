import React, { useState, useEffect, useCallback } from "react";
import {Link, NavLink, useLocation} from "react-router-dom";

import URL from "@/constants/url";

import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftMember";
import ResidentCompanyList from "./ResidentCompanyList.jsx";


function Index(props) {
    
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
                                <li className="third_2 R">
                                    <span className="lb">기업이름</span>
                                    <span className="f_search w_400" style = {{width:"20%"}}>
                                        <input
                                            type="text"
                                            name="mvnEntName"
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
                                    <span className="lb" style={{marginLeft:"15px"}}>대표자</span>
                                    <span className="f_search w_400" style = {{width:"20%"}}>
                                        <input
                                            type="text"
                                            name="rpsvNm"
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
                                    <span className="lb" style={{marginLeft:"15px"}}>사업자번호</span>
                                    <span className="f_search w_400" style = {{width:"20%"}}>
                                        <input
                                            type="text"
                                            name="brno"
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
                        <div style={{
                            overflow: "hidden",
                        }}>
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
