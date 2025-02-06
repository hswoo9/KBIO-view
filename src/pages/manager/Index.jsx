import React, { useState, useEffect, useCallback } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import {mngrAcsIpChk} from "@/components/CommonComponents.jsx";

function Index(props) {
    // mngrAcsIpChk(useNavigate())

  return (
    <div id="container" className="container layout cms">
        <ManagerLeftNew/>
        <div className="inner">
            
        </div>
    </div>
  );
}

export default Index;
