import React, { useState, useEffect, useCallback } from "react";
import {Link, NavLink, useLocation} from "react-router-dom";

import URL from "@/constants/url";

import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
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
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
               <ResidentCompanyList/>
        </div>
    )
        ;
}

export default Index;
