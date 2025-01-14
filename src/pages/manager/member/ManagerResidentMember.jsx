import React, { useState, useEffect, useCallback } from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftMember";


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
            <div>
                <NavLink to={URL.RESIDENT_COMPANY_CREATE}>
                    입주기업 등록
                </NavLink>
            </div>
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
            입주기업
        </div>
      </div>
    </div>
  )
      ;
}

export default Index;
