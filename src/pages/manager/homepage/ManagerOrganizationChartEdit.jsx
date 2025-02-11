import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeftNew from "@/components/manager/ManagerLeftHomepage";
import EgovPaging from "@/components/EgovPaging";
import CommonEditor from "@/components/CommonEditor";
import Swal from 'sweetalert2';

import { getSessionItem } from "@/utils/storage";

function ManagerAccessList(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const [modeInfo, setModeInfo] = useState({ mode: props.mode });

    const [emailMode, setEmailMode] = useState("");

    const saveBtnEvent = () => {
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                navigate({ pathname: URL.MANAGER_HOMEPAGE_ORGANIZATION_CHART_LIST });
            } else {
            }
        });
    }

    const delBtnEvent = () => {
        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                navigate({ pathname: URL.MANAGER_HOMEPAGE_ORGANIZATION_CHART_LIST });
            } else {
                //취소
            }
        });
    }

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                {modeInfo.mode === CODE.MODE_CREATE && (
                    <h2 className="pageTitle"><p>조직도 등록</p></h2>
                )}

                {modeInfo.mode === CODE.MODE_MODIFY && (
                    <h2 className="pageTitle"><p>조직도 수정</p></h2>
                )}
                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 width3">
                            <p className="title essential">부서</p>
                            <div className="itemBox">
                                <select className="selectGroup"
                                        id=""
                                >
                                    <option value="N">선택</option>
                                </select>
                            </div>
                        </li>
                        <li className="inputBox type1 width3">
                            <label className="title essential" htmlFor=""><small>이름</small></label>
                            <div className="input">
                                <input type="text"

                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width3">
                            <p className="title essential">직책</p>
                            <div className="itemBox">
                                <select className="selectGroup"
                                        id=""
                                >
                                    <option value="N">선택</option>
                                </select>
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <label className="title essential" htmlFor=""><small>전화번호</small></label>
                            <div className="input">
                                <input type="text"

                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <label className="title essential" htmlFor=""><small>이메일</small></label>
                            <div className="input customInputBox">
                                <input
                                    type="text"
                                />
                                <span>@</span>
                                <input
                                    type="text"
                                    disabled={emailMode == "direct" ? false : true}
                                />
                                <select className="selectGroup"
                                        id=""
                                        onChange={(e) => {
                                            setEmailMode(
                                                e.target.value
                                            )
                                        }}
                                >
                                    <option value="">선택하세요</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="hotmail.com">hotmail.com</option>
                                    <option value="nate.com">nate.com</option>
                                    <option value="hanmail.net">hanmail.net</option>
                                    <option value="direct">직접 입력</option>
                                </select>
                            </div>

                        </li>
                        <li className="inputBox type1 width1">
                            <label className="title essential"><small>담당업무</small></label>
                            <div>
                                <CommonEditor
                                />
                            </div>
                        </li>
                    </ul>
                    <div className="buttonBox">
                        <div className="leftBox">
                            <button type="button" className="clickBtn point" onClick={saveBtnEvent}><span>저장</span>
                            </button>
                            {modeInfo.mode === CODE.MODE_MODIFY && (
                                <button type="button" className="clickBtn gray" onClick={delBtnEvent}><span>삭제</span>
                                </button>
                            )}
                        </div>
                        <NavLink
                            to={URL.MANAGER_HOMEPAGE_ORGANIZATION_CHART_LIST}
                        >
                            <button type="button" className="clickBtn black"><span>목록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerAccessList;
