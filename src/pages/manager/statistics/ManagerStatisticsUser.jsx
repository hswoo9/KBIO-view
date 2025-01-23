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

                </div>
                <div className="contBox board type1 customContBox">

                </div>
            </div>
        </div>
    );
}

export default ManagerStatisticsUser;
