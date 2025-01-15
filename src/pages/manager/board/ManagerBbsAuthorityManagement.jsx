import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftBoard";


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
                        <Link to={URL.MANAGER_BBS_LIST}>게시판관리</Link>
                    </li>
                    <li>게시판권한관리</li>
                </ul>
            </div>
        );
    });


    return (
        <div className="container">
            <div className="c_wrap">
                {/* <!-- Location --> */}
                <Location/>
                {/* <!--// Location --> */}

                <div className="layout">
                    {/* <!-- Navigation --> */}
                    {/* <!--// Navigation --> */}
                    <EgovLeftNav/>
                    게시판권한관리
                </div>
            </div>
        </div>
    )
        ;
}

export default Index;
