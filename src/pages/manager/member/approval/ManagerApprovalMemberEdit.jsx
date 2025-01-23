import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";

function setApprovalMember(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const checkRef = useRef([]);

    const mberSttusRadioGroup = [
        {value: "P", label: "가능"},
        {value: "A", label: "대기"},
        {value: "D", label: "탈퇴"},
    ];
    const [searchDto, setSearchDto] = useState({userSn: location.state?.userSn});

    const [modeInfo, setModeInfo] = useState({mode: props.mode});
    const [memberDetail, setMemberDetail] = useState({});

    const initMode = () => {
        setModeInfo({
            ...modeInfo,
            modeTitle: modeInfo.mode === CODE.MODE_CREATE ? "회원 등록" : "회원 수정",
            editURL: `/memberApi/setApprovalMember`,
        });

        getApprovalMember(searchDto);
    };

    const getApprovalMember = (serachDto) => {
        if (modeInfo.mode === CODE.MODE_CREATE) {
            // 조회/등록이면 초기값 지정
            setMemberDetail({
                tmplatId: "TMPLAT_MEMBER_DEFAULT",
            });
            return;
        }
        const getApprovalMemberURL = `/memberApi/getApprovalMember`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getApprovalMemberURL, requestOptions, function (resp) {
            if (modeInfo.mode === CODE.MODE_MODIFY) {
                setMemberDetail(resp.result.member);
                console.log(memberDetail)
            }
        });
    };


    const setApprovalMemberDel = (userSn) => {
        const setApprovalMemberUrl = "/memberApi/setApprovalMemberDel";

        Swal.fire({
            title: `<span style="font-size: 14px; line-height: 0.8;">
                    계정이 이용정지 될 경우 해당 회원은 홈페이지<br>
                    접속 및 서비스 이용이 불가합니다.<br>
                    해당 회원의 계정을 정지 하시겠습니까?
                </span>
            `,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        ...memberDetail,
                        zip: "N",
                        userSn: userSn
                    }),
                };

                EgovNet.requestFetch(setApprovalMemberUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("이용이 정지되었습니다.");
                        navigate(URL.MANAGER_APPROVAL_MEMBER);
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                //취소
            }
        });
    };

    const pwdReset = () => {
        Swal.fire({
            title: `<span style="font-size: 14px; line-height: 0.8;">
                    회원의 비밀번호를 초기화를 할 경우<br>
                    <strong>qwer12!@</strong><br>
                    로 초기화 됩니다.<br>
                    해당 회원의 비밀번호를 초기화 하시겠습니까?
                </span>
            `,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if (result.isConfirmed) {
                const resetPwdUrl = "/memberApi/resetMemberPassword";
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        ...memberDetail,
                        password: "qwer12!@"
                    }),
                };

                EgovNet.requestFetch(resetPwdUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire({
                            title: "비밀번호가 초기화되었습니다.",
                            confirmButtonText: "확인"
                        })
                        setMemberDetail({
                            ...memberDetail,
                            password: "qwer12!@"
                        });
                    } else {
                        Swal.fire({
                            title: "오류가 발생했습니다.",
                            text: resp.resultMessage,
                            confirmButtonText: "확인"
                        });
                    }
                });
            }
        });
    };
    const getSelectedLabel = (objArray, findLabel = "") => {
        let foundValueLabelObj = objArray.find((o) => o["value"] === findLabel);
        return foundValueLabelObj["label"];
    };

    useEffect(() => {
        initMode();
    }, []);

    console.log("------------------------------EgovAdminMemberEdit [End]");
    console.groupEnd("EgovAdminMemberEdit");

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">

                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 width1">
                            <label className="title"><small>회원상태</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.mberSttus || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>회원분류</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.userType || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>아이디</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.emplyrId || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>비밀번호</small></label>
                            <div className="input">
                                <input
                                    type="password"
                                    value={memberDetail.password || ''}
                                    readOnly
                                />
                                <button type="button" className="pwdBtn btn" onClick={(e) => {
                                    pwdReset();
                                }}>
                                    <span>비밀번호 초기화</span>
                                </button>
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>성명</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.userNm || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>휴대폰</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.mbtlnum || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>이메일</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.email || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>주소</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.adres || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>메일수신</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.emailRecptnAt || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>문자수신</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.smsRecptnAt || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <div style={{display: 'flex', gap: '20px', width: '100%'}}>
                            <li className="inputBox type1" style={{width: '50%'}}>
                                <label className="title"><small>가입일</small></label>
                                <div className="input">
                                    <input
                                        type="text"
                                        value={memberDetail.sbscrbDe || ''}
                                        readOnly
                                    />
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width: '50%'}}>
                                <label className="title"><small>최근접속일시</small></label>
                                <div className="input">
                                    <input
                                        type="text"
                                        value={memberDetail.lastLoginDt || ''}
                                        readOnly
                                    />
                                </div>
                            </li>
                        </div>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>소셜구분</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.socialType || ''}
                                    readOnly
                                />
                            </div>
                        </li>
                    </ul>

                    <div className="buttonBox">
                        <div className="leftBox">
                            {/*<button type="button" className="clickBtn point" onClick={() => setNormalMember()}>
                                <span>저장</span>
                            </button>
                            {modeInfo.mode === CODE.MODE_MODIFY && (
                            )}*/}
                                <button
                                    type="button"
                                    className="clickBtn gray"
                                    onClick={() => setApprovalMemberDel(memberDetail.userSn)}
                                >
                                    <span>이용정지</span>
                                </button>

                        </div>
                        <Link to={URL.MANAGER_APPROVAL_MEMBER}>
                            <button type="button" className="clickBtn black">
                                <span>목록</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default setApprovalMember;
