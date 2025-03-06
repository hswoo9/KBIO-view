import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { getComCdList } from "@/components/CommonComponents";
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

    const handleTelnoChange = (e) => {
        const onlyNumbers = e.target.value.replace(/\D/g, "");
        setOrgchtData({
            ...orgchtData,
            telno: onlyNumbers
        })
    }
    const [deptList, setDeptList] = useState([]);
    const [positionList, setPositionList] = useState([]);
    const [orgchtData, setOrgchtData] = useState({});

    const [emailMode, setEmailMode] = useState("");

    const isFirstRender = useRef(true);
    const handleChange = (value) => {
        if(isFirstRender.current){
            isFirstRender.current = false;
            return;
        }
        setOrgchtData({...orgchtData, tkcgTask: value});
    };

    const [saveEvent, setSaveEvent] = useState({});
    useEffect(() => {
        if(saveEvent.save){
            if(saveEvent.mode == "save"){
                saveOrgchtData(orgchtData);
            }
            if(saveEvent.mode == "delete"){
                delOrgchtData(orgchtData);
            }

        }
    }, [saveEvent]);

    const saveOrgchtData = useCallback(
        (orgchtData) => {
            const requestURL = "/orgchtApi/setOrgcht";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(orgchtData)
            };
            EgovNet.requestFetch(
                requestURL,
                requestOptions,
                (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        navigate(
                            { pathname: URL.MANAGER_HOMEPAGE_ORGANIZATION_CHART_LIST }
                        );
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

    const delOrgchtData = useCallback(
        (orgchtData) => {
            const requestURL = "/orgchtApi/delOrgcht";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(orgchtData)
            };
            EgovNet.requestFetch(
                requestURL,
                requestOptions,
                (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        navigate(
                            { pathname: URL.MANAGER_HOMEPAGE_ORGANIZATION_CHART_LIST }
                        );
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

    const saveBtnEvent = () => {
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                setSaveEvent({
                    ...saveEvent,
                    save: true,
                    mode: "save"
                });
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
                setSaveEvent({
                    ...saveEvent,
                    save: true,
                    mode: "delete"
                });
            } else {
                //취소
            }
        });
    }

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
        getOrgchtDetail();
    };

    const getOrgchtDetail = () => {
        if(modeInfo.mode === CODE.MODE_CREATE){
            setOrgchtData({
                creatrSn: sessionUser.userSn,
                actvtnYn: "Y",
            });
            return;
        }

        const requestURL = '/orgchtApi/getOrgcht';
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({orgchtSn : location.state?.orgchtSn})
        };
        EgovNet.requestFetch(requestURL, requestOptions, function (resp) {
            if (modeInfo.mode === CODE.MODE_MODIFY) {
                if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                    if(resp.result.orgcht.actvtnYn != null){
                        if(resp.result.orgcht.actvtnYn == "Y"){
                            document.getElementById("actvtnYn").checked = true;
                        }else{
                            document.getElementById("actvtnYn").checked = false;
                        }
                    }
                    resp.result.orgcht.mdfrSn = sessionUser.userSn;
                    if(resp.result.orgcht.email){
                        resp.result.orgcht.emailPrefix = "";
                        resp.result.orgcht.emailProvider = "";
                        if(resp.result.orgcht.email.indexOf("@") > -1){
                            resp.result.orgcht.emailPrefix = resp.result.orgcht.email.split("@")[0];
                            resp.result.orgcht.emailDomain = resp.result.orgcht.email.split("@")[1];
                        }
                    }
                    setOrgchtData(resp.result.orgcht);
                } else {
                    navigate(
                        { pathname: URL.ERROR },
                        { state: { msg: resp.resultMessage } }
                    );
                }

            }
        });

    }


    useEffect(() => {
        getComCdList(12).then((data) => {
            if(data != null){
                let dataList = [];
                dataList.push(
                    <option value="" key="no_data">선택</option>
                )
                data.forEach(function(item, index){
                   dataList.push(
                       <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                   )
                });
                setDeptList(dataList);
            }
        });

        getComCdList(13).then((data) => {
            if(data != null){
                let dataList = [];
                dataList.push(
                    <option value="" key="no_data">선택</option>
                )
                data.forEach(function(item, index){
                    dataList.push(
                        <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                    )
                });
                setPositionList(dataList);
            }
        });
        initMode();
    }, []);

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
                                <select
                                    className="selectGroup"
                                    id="deptSn"
                                    value={orgchtData.deptSn || ""}
                                    onChange={(e) =>
                                        setOrgchtData({
                                          ...orgchtData,
                                          deptSn: e.target.value
                                        })
                                    }
                                >
                                    {deptList}
                                </select>
                            </div>
                        </li>
                        <li className="inputBox type1 width3">
                            <label className="title essential" htmlFor=""><small>이름</small></label>
                            <div className="input">
                                <input type="text"
                                       value={orgchtData.kornFlnm || ""}
                                       onChange={(e) =>
                                           setOrgchtData({
                                               ...orgchtData,
                                               kornFlnm: e.target.value
                                           })
                                       }
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width3">
                            <p className="title essential">직책</p>
                            <div className="itemBox">
                                <select className="selectGroup"
                                        id="jbttlSn"
                                        value={orgchtData.jbttlSn || ""}
                                        onChange={(e) =>
                                            setOrgchtData({
                                                ...orgchtData,
                                                jbttlSn: e.target.value
                                            })
                                        }
                                >
                                    {positionList}
                                </select>
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <label className="title essential" htmlFor=""><small>전화번호</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    id="telno"
                                    value={orgchtData.telno || ""}
                                    onChange={handleTelnoChange}
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <label className="title essential" htmlFor=""><small>이메일</small></label>
                            <div className="input customInputBox">
                                <input
                                    type="text"
                                    value={orgchtData.emailPrefix || ""}
                                    onChange={(e) => setOrgchtData({
                                        ...orgchtData,
                                        emailPrefix: e.target.value,
                                        email: `${e.target.value}@${orgchtData.emailDomain || ''}`
                                    })}
                                />
                                <span>@</span>
                                <input
                                    type="text"
                                    value={orgchtData.emailDomain || ""}
                                    disabled={emailMode == "direct" ? false : true}
                                    onChange={ (e) => {
                                        setOrgchtData({
                                            ...orgchtData,
                                            emailDomain: e.target.value,
                                            email: `${orgchtData.emailPrefix}@${e.target.value}`
                                        })
                                    }}
                                />
                                <select className="selectGroup"
                                        id=""
                                        onChange={(e) => {
                                            const provider = e.target.value;
                                            const newEmailDomain = provider === "direct" ? "" : provider;
                                            const newEmail = `${orgchtData.emailPrefix}@${newEmailDomain}`;
                                            setOrgchtData((prevDetail) => ({
                                                ...orgchtData,
                                                emailProvider: provider,
                                                emailDomain: newEmailDomain,
                                                email: newEmail
                                            }));
                                            setEmailMode(
                                                e.target.value
                                            );
                                        }}
                                        value={orgchtData.emailProvider || ""}
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
                        <li className="inputBox type1 width3">
                            <label className="title" htmlFor="sortSeq"><small>정렬순서</small></label>
                            <div className="input">
                                <input type="text"
                                       id="sortSeq"
                                       placeholder=""
                                       value={orgchtData.sortSeq || ""}
                                       onChange={(e) =>
                                           setOrgchtData({
                                               ...orgchtData,
                                               sortSeq: e.target.value
                                           })
                                       }
                                />
                                <label htmlFor="actvtnYn" className="toggleSwitch">
                                    <span className="toggleButton"></span>
                                </label>
                            </div>
                        </li>
                        <li className="toggleBox width3">
                            <div className="box">
                                <p className="title essential">활성여부</p>
                                <div className="toggleSwithWrap">
                                    <input type="checkbox"
                                           id="actvtnYn"
                                           checked={orgchtData.actvtnYn == "Y"}
                                           onChange={(e) =>
                                               setOrgchtData({
                                                   ...orgchtData,
                                                   actvtnYn : e.target.checked ? "Y" : "N"
                                               })
                                           }
                                    />
                                    <label htmlFor="actvtnYn" className="toggleSwitch">
                                        <span className="toggleButton"></span>
                                    </label>
                                </div>
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <label className="title essential"><small>담당업무</small></label>
                            <div>
                                <CommonEditor
                                    value={orgchtData.tkcgTask || ""}
                                    onChange={handleChange}
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
