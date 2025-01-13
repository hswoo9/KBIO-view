import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

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
        </div>
      </div>
    </div>
  )
      ;
}

export default Index;
