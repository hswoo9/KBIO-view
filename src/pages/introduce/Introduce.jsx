import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getBnrPopupList} from "@/components/main/MainComponents";

function Introduce(props) {
    return (
        <div id="container" className="container layout">
            <div className="inner">
                <CommonSubMenu/>
            </div>
        </div>
    );
}

export default Introduce;
