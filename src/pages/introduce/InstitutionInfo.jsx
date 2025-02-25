import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink, useNavigate } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getBnrPopupList} from "@/components/main/MainComponents";

function KBioLabHub(props) {
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
        { pathname: URL.INTRODUCE_OPERATIONAL_LIST},
        { state: {
            menuSn : location.state?.menuSn,
            menuNmPath : location.state?.menuNmPath,
            thisMenuSn: 48,
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

export default KBioLabHub;
