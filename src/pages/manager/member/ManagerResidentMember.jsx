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
                    <ResidentCompanyList/>
                {/* <!--// layout --> */}
                </div>
            </div>
        </div>
    )
        ;
}

export default Index;
