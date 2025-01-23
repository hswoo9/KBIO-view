import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import EgovPaging from "@/components/EgovPaging";
import OperationalSupport from "./OperationalSupport.jsx";

function OperationalResidentMember(props) {


    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>입주기업 관리</p></h2>
                {/*회사 로고*/}
                <div className="company_info">
                    <div className="left">
                        <figure className="logo">
                            {/*기업 로고 이미지 추가할 것*/}
                        </figure>
                        <p className="name" id="mvnEntNm"></p>
                    </div>
                    <ul className="right">
                        <li>
                            <p className="tt1">대표자</p>
                            <p className="tt2"></p>
                        </li>
                        <li>
                            <p className="tt1">대표전화</p>
                            <p className="tt2"></p>
                        </li>
                        <li>
                            <p className="tt1">업종</p>
                            <p className="tt2"></p>
                        </li>
                    </ul>
                </div>


            </div>
        </div>
    );
}

export default OperationalResidentMember;