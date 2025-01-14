import React, { useState, useEffect, useCallback } from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";


import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftMember";
import ResidentMemberCreateContent from "./ResidentMemberCreateContent.jsx";


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
                    <li><Link to={URL.MANAGER_RESIDENT_COMPANY}>입주기업</Link></li>
                    <li>입주기업등록</li>
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


                    <ResidentMemberCreateContent></ResidentMemberCreateContent>

                </div>



            </div>
        </div>
    )
        ;
}

export default Index;
