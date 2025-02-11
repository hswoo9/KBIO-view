import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import {getMenu } from "@/components/CommonComponents";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";

import simpleMainIng from "/assets/images/img_simple_main.png";
import initPage from "@/js/ui";
import logo from "@/assets/images/logo.svg";
import {getBnrPopupList, getMvnEntList, getPstList} from "../../components/MainComponents.jsx";

function Introduce(props) {
    const location = useLocation();
    console.log(location.state);

    /* 세션정보 */
    const sessionUser = getSessionItem("loginUser");
    const sessionUserId = sessionUser?.id;
    const sessionUserName = sessionUser?.name;
    const sessionUserSe = sessionUser?.userSe;
    const sessionUserSn = sessionUser?.userSn;
    const userSn = getSessionItem("userSn");

    const [menuList, setMenuList] = useState([]);
    const [popUpList, setPopUpList] = useState([]);
    const [mainSlidesList, setMainSlidesList] = useState([]);
    const [mvnEntList, setMvnEntList] = useState([]);

    const [selBbs, setSelBbs] = useState(1);
    const [pstList, setPstList] = useState([]);

    const hoverRef = useRef(null);
    const handleMouseOver = (e, index) => {
        if(e.target === e.currentTarget){
            const element = e.currentTarget;
            const parentElement = element.parentElement;
            if(parentElement && hoverRef.current){
                const parentRect = parentElement.getBoundingClientRect();
                hoverRef.current.style.width = `${parentRect.width}px`;
                hoverRef.current.style.height = `${parentRect.height}px`;
                hoverRef.current.style.left = `${parentRect.left - 30}px`;
                hoverRef.current.style.top = `0px`;
                hoverRef.current.style.opacity = `1`;
            }
        }
    }

    useEffect(() => {
        popUpList.forEach((e, i) => {
            const popUp = e.tblBnrPopup;
            if(!localStorage.getItem(popUp.bnrPopupSn) || Date.now() > localStorage.getItem(popUp.bnrPopupSn)){
                window.open(
                    `/popup?bnrPopupSn=${popUp.bnrPopupSn}`, // 여기에 원하는 URL 입력
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
        const menuSn = location.state?.menuSn || null;
        getMenu(menuSn, 1, userSn).then((data) => {
            let dataList = [];
            if(data != null){
                data.forEach(function(item, index){
                    if (index === 0) dataList = [];
                    dataList.push(
                        <li key={item.menuSn}>
                            <NavLink
                                to={item.menuPathNm}
                                state={{
                                    bbsSn: item.bbsSn
                                }}
                                onMouseOver={(e) => handleMouseOver(e, index)}
                            >
                                <span>{item.menuNm}</span>
                            </NavLink>
                        </li>
                    )
                });
                setMenuList(dataList);
            }
        });

        getBnrPopupList("popup").then((data) => {
            setPopUpList(data.filter(e => e.tblBnrPopup.bnrPopupKnd == "popup"));
        });

        getBnrPopupList("bnr").then((data) => {
            setMainSlidesList(data.filter(e => e.tblBnrPopup.bnrPopupFrm == "mainSlides"));
        });

        getMvnEntList().then((data) => {
            setMvnEntList(data);
        });

    }, []);

    useEffect(() => {
        getPstList(selBbs).then((data) => {
            setPstList(data);
        });
    }, [selBbs]);

    return (
        <div id="container" className="container layout">
            <div className="inner">
                <div className="tabBox type1" data-aos="fade-up" data-aos-duration="1500">
                    <div className="bg hover" ref={hoverRef}></div>
                    <ul className="list">
                        {menuList}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Introduce;
