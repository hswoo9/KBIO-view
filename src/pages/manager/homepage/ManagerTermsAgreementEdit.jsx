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
import CommonEditor from "@/components/CommonEditor";

function ManagerTermsAgreementEdit(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const checkRef = useRef([]);
    const sessionUser = getSessionItem("loginUser");
    const sessionUserName = sessionUser?.name;
    const sessionUserSn = sessionUser?.userSn;

    const isFirstRender = useRef(true);
    const handleChange = (value) => {
        if(isFirstRender.current){
            isFirstRender.current = false;
            return;
        }
        setTermsAgreementDetail({...termsAgreementDetail, utztnTrmsCn: value});
    };

    const [termsAgreementDetail, setTermsAgreementDetail] = useState({
        useYn: "Y",
    });

    const [modeInfo, setModeInfo] = useState({ mode: props.mode });

    const [searchDto, setSearchDto] = useState(
        {
            search: "",
        }
    );

    useEffect(() => {
        console.log(termsAgreementDetail);
    }, [termsAgreementDetail]);

    const [saveEvent, setSaveEvent] = useState({});
    useEffect(() => {
        if(saveEvent.save){
            if(saveEvent.mode == "save"){
                saveTermsAgreementData(termsAgreementDetail);
            }
            if(saveEvent.mode == "delete"){
                delTermsAgreementData(termsAgreementDetail);
            }
        }
    }, [saveEvent]);

    const handleSave = () => {
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                if (!termsAgreementDetail.utztnTrmsTtl) {
                    Swal.fire("제목이 없습니다.");
                    return;
                }

                if (!termsAgreementDetail.utztnTrmsCn) {
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

    const saveTermsAgreementData = useCallback(
        (termsAgreementDetail) => {
            const formData = new FormData();
            for (let key in termsAgreementDetail) {
                if (termsAgreementDetail[key] != null) {
                    formData.append(key, termsAgreementDetail[key]);
                }
            }

            formData.append("utztnTrmsKnd", "2");
            if (modeInfo.mode === CODE.MODE_CREATE) {
                formData.append("creatrSn", sessionUserSn || "");
                formData.append("creatr", sessionUserName || "");
            }

            const menuListURL = "/utztnApi/setTermsAgreement";
            const requestOptions = {
                method: "POST",
                body: formData
            };

            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        navigate({ pathname: URL.MANAGER_HOMEPAGE_TERMS_AGREEMENT });
                    } else {
                        navigate(
                            { pathname: URL.ERROR },
                            { state: { msg: resp.resultMessage } }
                        );
                    }
                }
            );
        },
    );

    const delTermsAgreementData = useCallback(
        (termsAgreementDetail) => {
            console.log(termsAgreementDetail);
            const termsAgreementURL = "/utztnApi/setTermsAgreementDel";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(termsAgreementDetail)
            };
            EgovNet.requestFetch(
                termsAgreementURL,
                requestOptions,
                (resp) => {

                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        navigate({ pathname: URL.MANAGER_HOMEPAGE_TERMS_AGREEMENT });
                    } else {
                        navigate(
                            { pathname: URL.ERROR },
                            { state: { msg: resp.resultMessage } }
                        );
                    }

                }
            )
        }
    );

    const initMode = () => {
        switch (props.mode){
            case CODE.MODE_CREATE:
                setModeInfo({
                    ...modeInfo,
                    modeTitle: "등록",
                });
                break;
            case CODE.MODE_MODIFY:
                setModeInfo({
                    ...modeInfo,
                    modeTitle: "수정",
                });
                break;
            default:
                navigate({ pathname: URL.ERROR }, { state: { msg: "" } });
        }
        getTermsAgreemetData();
    };

    const getTermsAgreemetData = () => {

        const getTermsAgreemetURL = `/utztnApi/getTermsAgreemet`;

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({utztnTrmsSn : location.state?.utztnTrmsSn})
        };

        EgovNet.requestFetch(getTermsAgreemetURL, requestOptions, function (resp) {
            console.log(resp);
            if (modeInfo.mode === CODE.MODE_MODIFY) {
                if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                    resp.result.tblUtztnTrms.mdfrSn = sessionUser.userSn;
                    setTermsAgreementDetail(resp.result.tblUtztnTrms);
                    if(resp.result.tblUtztnTrms.useYn != null){
                        if(resp.result.tblUtztnTrms.useYn == "Y"){
                            document.getElementById("useYn").checked = true;
                        }else{
                            document.getElementById("useYn").checked = false;
                        }
                    }
                } else {
                    navigate(
                        { pathname: URL.ERROR },
                        { state: { msg: resp.resultMessage } }
                    );
                }

            }
        });

    };

    useEffect(() => {
        initMode();
    }, []);
    

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew />
            <div className="inner">
                {modeInfo.mode === CODE.MODE_CREATE && (
                    <h2 className="pageTitle"><p>이용약관 등록</p></h2>
                )}

                {modeInfo.mode === CODE.MODE_MODIFY && (
                    <h2 className="pageTitle"><p>이용약관 수정</p></h2>
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
                            <label className="title essential" htmlFor="termsTitle"><small>제목</small></label>
                            <div className="input">
                                <input type="text"
                                       id="termsTitle"
                                       value={termsAgreementDetail.utztnTrmsTtl || ""}
                                       onChange={(e) => setTermsAgreementDetail({
                                           ...termsAgreementDetail,
                                           utztnTrmsTtl: e.target.value
                                       })}
                                       required
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <label className="title" >내용</label>
                            <div className="input">
                            {/*<textarea
                                id="termsContent"
                                value={termsAgreementDetail.utztnTrmsCn || ""}
                                onChange={(e) => setTermsAgreementDetail({
                                    ...termsAgreementDetail,
                                    utztnTrmsCn: e.target.value
                                })}
                            />*/}
                                <CommonEditor
                                    value={termsAgreementDetail.utztnTrmsCn || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </li>
                        <li className="toggleBox width3">
                            <div className="box">
                                <p className="title essential">사용여부</p>
                                <div className="toggleSwithWrap">
                                    <input type="checkbox"
                                           id="useYn"
                                           checked={termsAgreementDetail.useYn === "Y"}
                                           onChange={(e) => setTermsAgreementDetail({
                                               ...termsAgreementDetail,
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
                    <div className="buttonBox" style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <div className="leftBox">
                            <button type="button" className="clickBtn point" onClick={handleSave}><span>저장</span>
                            </button>
                            {modeInfo.mode === CODE.MODE_MODIFY && (
                                <button type="button" className="clickBtn gray" onClick={delBtnEvent}><span>삭제</span>
                                </button>
                            )}
                        </div>
                        <NavLink to={URL.MANAGER_HOMEPAGE_TERMS_AGREEMENT}>
                            <button type="button" className="clickBtn black" style={{marginLeft: '10px'}}>
                                <span>목록</span>
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerTermsAgreementEdit;


