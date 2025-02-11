import React, { useState, useEffect, useCallback, useRef } from "react";
import * as EgovNet from "@/api/egovFetch";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import CommonSubMenu from "../../components/CommonSubMenu.jsx";
import {getSessionItem} from "../../utils/storage.js";
import Swal from "sweetalert2";
import $ from "jquery";

function contentView(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();

    const editClick = () => {
        if(sessionUser){
            navigate(
                { pathname : URL.CONSULTING_CREATE },
                {
                    state : {
                        callBackUrl : URL.DIFFICULTIES,
                        cnsltSe : 28,
                        menuSn : location.state?.menuSn,
                        menuNmPath : location.state?.menuNmPath,
                    }
                });
        }else{
            Swal.fire("로그인이 필요한 서비스 입니다.");
            document.getElementsByClassName("loginModal").item(0).classList.add("open")
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        }
    }

    return (
        <div id="container" className="container layout">
            <div className="inner">
                <CommonSubMenu/>
                <div>
                    K-BioLabHub는 고객님의 의견을 소중히 여기며, 더 나은 서비스를 제공하기 위해<br/>
                    애로사항 등록 서비스를 운영하고 있습니다.<br/>
                    사용 중 겪으신 불편사항이나 개선이 필요한 점이 있다면 언제든 알려주세요.
                </div>

                <button
                    type="button"
                    className="writeBtn clickBtn"
                    onClick={editClick}
                >
                    <span>등록하기</span>
                </button>
            </div>
        </div>
    );
}

export default contentView;
