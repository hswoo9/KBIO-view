import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getBnrPopupList} from "@/components/main/MainComponents";

function Introduce(props) {
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const sessionUserId = sessionUser?.id;
    const sessionUserName = sessionUser?.name;
    const sessionUserSe = sessionUser?.userSe;
    const sessionUserSn = sessionUser?.userSn;
    const userSn = getSessionItem("userSn");

    const [popUpList, setPopUpList] = useState([]);

    useEffect(() => {
        popUpList.forEach((e, i) => {
            const popUp = e.tblBnrPopup;
            if(!localStorage.getItem(popUp.bnrPopupSn) || Date.now() > localStorage.getItem(popUp.bnrPopupSn)){
                window.open(
                    `/popup?bnrPopupSn=${popUp.bnrPopupSn}`, 
                    `${popUp.bnrPopupSn}`,
                    `width=${popUp.popupWdthSz},
            height=${popUp.popupVrtcSz},
            left=${popUp.popupPstnWdth},
            top=${popUp.popupPstnUpend}`
                );

                localStorage.removeItem(popUp.bnrPopupSn)
            }
        })
    }, [popUpList]);

    useEffect(() => {
        getBnrPopupList("popup").then((data) => {
            setPopUpList(data.filter(e => e.tblBnrPopup.bnrPopupKnd == "popup"));
        });
    }, []);

    return (
        <div id="container" className="container layout">
            <div className="inner">
                <CommonSubMenu/>
            </div>
        </div>
    );
}

export default Introduce;
