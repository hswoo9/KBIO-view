import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerTop from "@/components/manager/ManagerTop";

function Index(props) {

  return (
    <div id="container" className="container layout cms">
        <ManagerTop/>

        <div className="inner">
            
        </div>
    </div>
  );
}

export default Index;
