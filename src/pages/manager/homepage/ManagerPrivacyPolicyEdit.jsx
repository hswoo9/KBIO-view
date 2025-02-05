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
    const sessionUserSn = sessionUser?.userSn;

    const [searchDto, setSearchDto] = useState(
        {
            search: "",
        }
    );


    const [privacyPolicyDetail, setPrivacyPolicyDetail] = useState({});

    useEffect(() => {
        console.log(privacyPolicyDetail);
    }, [privacyPolicyDetail]);

    const [modeInfo, setModeInfo] = useState({ mode: props.mode });

    const [saveEvent, setSaveEvent] = useState({});
    useEffect(() => {
        if(saveEvent.save){
            if(saveEvent.mode == "save"){
                savePrivacyPolicyData(privacyPolicyDetail);
            }
            if(saveEvent.mode == "delete"){
                delPrivacyPolicyData(privacyPolicyDetail);
            }
        }
    }, [saveEvent]);

    useEffect(() => {
        setModeInfo({ mode: props.mode });
    }, [props.mode]);


    const handleSave = () => {
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                if (!privacyPolicyDetail.utztnTrmsTtl) {
                    Swal.fire("제목이 없습니다.");
                    return;
                }

                if (!privacyPolicyDetail.utztnTrmsCn) {
                    Swal.fire("내용이 없습니다.");
                    return;
                }

                setSaveEvent({
                    ...saveEvent,
                    save: true,
                    mode: "save"
                });
            } else {
            }
        });
    };

    const delBtnEvent = () => {
        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                setSaveEvent({
                    ...saveEvent,
                    save: true,
                    mode: "delete"
                });
            } else {
            }
        });
    }

    const savePrivacyPolicyData = useCallback(
        (privacyPolicyDetail) => {
            const formData = new FormData();
            for (let key in privacyPolicyDetail) {
                if (privacyPolicyDetail[key] != null) {
                    formData.append(key, privacyPolicyDetail[key]);
                }
            }

            formData.append("creatrSn", sessionUserSn || "");
            formData.append("creatr", sessionUserName || "");
            formData.append("utztnTrmsKnd", "1");

            const menuListURL = "/utztnApi/setPrivacyPolicy";
            const requestOptions = {
                method: "POST",
                body: formData
            };

            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        navigate({ pathname: URL.MANAGER_HOMEPAGE_PRIVACY_POLICY });
                    } else {
                        navigate(
                            { pathname: URL.ERROR },
                            { state: { msg: resp.resultMessage } }
                        );
                    }
                }
            );
        }
    );


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
                                       id="creatr"
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
                                       value={privacyPolicyDetail.utztnTrmsTtl || ""}
                                       onChange={(e) => setPrivacyPolicyDetail({
                                           ...privacyPolicyDetail,
                                           utztnTrmsTtl: e.target.value
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
                                    value={privacyPolicyDetail.utztnTrmsCn || ""}
                                    onChange={(e) => setPrivacyPolicyDetail({
                                        ...privacyPolicyDetail,
                                        utztnTrmsCn: e.target.value
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
                    <div className="buttonBox" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="leftBox">
                            <button type="button" className="clickBtn point" onClick={handleSave}><span>저장</span></button>
                            {modeInfo.mode === CODE.MODE_MODIFY && (
                                <button type="button" className="clickBtn gray" onClick={delBtnEvent}><span>삭제</span></button>
                            )}
                        </div>
                        <NavLink to={URL.MANAGER_HOMEPAGE_PRIVACY_POLICY}>
                            <button type="button" className="clickBtn black" style={{ marginLeft: '10px' }}>
                                <span>목록</span>
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerPrivacyPolicyEdit;