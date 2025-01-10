import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavAdmin";
function Menu(props) {
  const location = useLocation();

    const getMenuList = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                active: "Y",
            }),
        };

        EgovNet.requestFetch(`/menu/getMenuTreeList`, requestOptions, function (resp) {
            if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                console.log(resp);
            } else {
                console.log("ERROR");
                console.log(resp);
            }
        });
    }


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
              <Link to={URL.INFORM}>사이트 관리</Link>
            </li>
            <li>메뉴관리</li>
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
              <button type={'button'}
                  className="btn btn_blue_h46 pd35"
                  onClick={getMenuList}
              >조회</button>
          </div>
        </div>
      </div>
  )
      ;
}

export default Menu;
