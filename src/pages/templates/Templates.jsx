import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavTemplates";

//alert
import Swal from 'sweetalert2';

function Templates(props) {
  console.group("EgovDailyDetail");
  console.log("[Start] EgovDailyDetail ------------------------------");
  console.log("EgovDailyDetail [props] : ", props);

  const location = useLocation();
  console.log("EgovDailyDetail [location] : ", location);

  const swalNormal = () => {
    Swal.fire('문구');
  };

  const Location = React.memo(function Location() {
    return (
        <div className="location">
          <ul>
            <li>
              <Link to={URL.MAIN} className="home">
                Home
              </Link>
            </li>
            <li>
              <Link to={URL.TEMPLATES}>공통양식</Link>
            </li>
            <li>공통양식</li>
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
          <EgovLeftNav/>
          {/* <!--// Navigation --> */}

          <button onClick={swalNormal}>기본알럿</button>
        </div>
      </div>
    </div>
)
  ;
}

export default Templates;
