import React, { useState, useEffect, useCallback } from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";


import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";

import ResidentMemberCreateContent from "./ResidentMemberCreateContent.jsx";


function Index(props) {





    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <ResidentMemberCreateContent></ResidentMemberCreateContent>
        </div>
    )
        ;
}

export default Index;
