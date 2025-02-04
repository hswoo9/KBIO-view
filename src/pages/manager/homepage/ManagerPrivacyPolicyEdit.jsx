import React, {useState, useEffect, useRef, useCallback} from "react";
import $ from 'jquery';
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftHomepage";
import Swal from "sweetalert2";

import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

function ManagerPrivacyPolicyEdit(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const checkRef = useRef([]);
    const sessionUser = getSessionItem("loginUser");
    const sessionUserName = sessionUser?.name;

    const [privacyPolicyDetail, setPrivacyPolicyDetail] = useState({
        policyTitle: '',
        policyContent: '',
        useYn: 'Y',
    });

    const [modeInfo, setModeInfo] = useState({ mode: props.mode });


    const handleSave = () => {

        console.log("저장 버튼 클릭");
    };



    useEffect(() => {
        setModeInfo({ mode: props.mode });
    }, [props.mode]);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew />
            <div className="inner">
                {modeInfo.mode === CODE.MODE_CREATE && (
                    <h2 className="pageTitle"><p>개인정보처리방침 등록</p></h2>
                )}

                {modeInfo.mode === CODE.MODE_MODIFY && (
                    <h2 className="pageTitle"><p>개인정보처리방침 수정</p></h2>
                )}
                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 width1">
                            <label className="title essential" htmlFor="registrar"><small>등록자</small></label>
                            <div className="input">
                                <input type="text"
                                       id="registrar"
                                       value={sessionUserName || ""}
                                       readOnly
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <label className="title essential" htmlFor="policyTitle"><small>제목</small></label>
                            <div className="input">
                                <input type="text"
                                       id="policyTitle"
                                       value={privacyPolicyDetail.policyTitle || ""}
                                       onChange={(e) => setPrivacyPolicyDetail({
                                           ...privacyPolicyDetail,
                                           policyTitle: e.target.value
                                       })}
                                       required
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <label className="title" htmlFor="policyContent"><small>내용</small></label>
                            <div className="input">
                                <textarea
                                    id="policyContent"
                                    value={privacyPolicyDetail.policyContent || ""}
                                    onChange={(e) => setPrivacyPolicyDetail({
                                        ...privacyPolicyDetail,
                                        policyContent: e.target.value
                                    })}
                                />
                            </div>
                        </li>
                        <li className="toggleBox width3">
                            <div className="box">
                                <p className="title essential">사용여부</p>
                                <div className="toggleSwithWrap">
                                    <input type="checkbox"
                                           id="useYn"
                                           checked={privacyPolicyDetail.useYn === "Y"}
                                           onChange={(e) => setPrivacyPolicyDetail({
                                               ...privacyPolicyDetail,
                                               useYn: e.target.checked ? "Y" : "N"
                                           })}
                                    />
                                    <label htmlFor="useYn" className="toggleSwitch">
                                        <span className="toggleButton"></span>
                                    </label>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="buttonBox">
                        <div className="leftBox">
                            <button type="button" className="clickBtn point" onClick={handleSave}><span>등록</span>
                            </button>
                            {modeInfo.mode === CODE.MODE_MODIFY && (
                                <button type="button" className="clickBtn gray" onClick={""}><span>삭제</span></button>
                            )}
                        </div>
                        <NavLink to={URL.MANAGER_HOMEPAGE_PRIVACY_POLICY}>
                            <button type="button" className="clickBtn black"><span>목록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerPrivacyPolicyEdit;