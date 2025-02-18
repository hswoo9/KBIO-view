import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink, useNavigate } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getBnrPopupList} from "@/components/main/MainComponents";

function Community(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;
  const userSn = getSessionItem("userSn");

  useEffect(() => {
    navigate(
        { pathname: URL.COMMON_PST_NORMAL_LIST},
        { state: {
            bbsSn:  1,
            thisMenuSn: 38,
            menuSn : location.state?.menuSn,
            menuNmPath : location.state?.menuNmPath,
          } },
        { mode:  CODE.MODE_READ}
    );
  }, []);

  return (
      <div id="container" className="container layout">
        <div className="inner">
        </div>
      </div>
  );
}

export default Community;
