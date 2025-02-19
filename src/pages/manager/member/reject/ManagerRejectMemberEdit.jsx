import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeft from "@/components/manager/ManagerLeftMember";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import base64 from 'base64-js';

function setRejectMember(props) {

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
            editURL: `/memberApi/setRejectMember`,
        });

        getRejectMember(searchDto);
    };


    const memberTypeLabel =
        memberDetail.mbrType === 9 ? '관리자' :
        memberDetail.mbrType === 1 ? '입주기업' :
        memberDetail.mbrType === 2 ? '컨설턴트' :
        memberDetail.mbrType === 3 ? '유관기관' :
        memberDetail.mbrType === 4 ? '비입주기업' :
        '테스트';
    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };

    const getRejectMember = (serachDto) => {
        if (modeInfo.mode === CODE.MODE_CREATE) {
            // 조회/등록이면 초기값 지정
            setMemberDetail({
                tmplatId: "TMPLAT_MEMBER_DEFAULT",
            });
            return;
        }
        const getRejectMemberURL = `/memberApi/getRejectMember`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getRejectMemberURL, requestOptions, function (resp) {
            if (modeInfo.mode === CODE.MODE_MODIFY) {
                const decodedPhoneNumber = decodePhoneNumber(resp.result.member.mblTelno);
                setMemberDetail({
                    ...resp.result.member,
                    mblTelno: decodedPhoneNumber, // 디코딩된 전화번호로 업데이트
                });
            }
        });
    };


    const setRejectMemberApproval = (userSn) => {
        const setRejectMemberApprovalUrl = "/memberApi/setRejectMemberApproval";

        Swal.fire({
            title: `<span style="font-size: 14px; line-height: 0.8;">
                    승인 시 해당 계정은 홈페이지 접속 및 서비스<br>
                    를 이용할 수 있습니다.<br>
                    해당 회원의 계정을 승인하시겠습니까?
                </span>
            `,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        ...memberDetail,
                        userSn: userSn
                    }),
                };

                EgovNet.requestFetch(setRejectMemberApprovalUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("승인되었습니다.");
                        navigate(URL.MANAGER_REJECT_MEMBER);
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
            <ManagerLeft/>
            <div className="inner">

                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 width1">
                            <label className="title"><small>회원상태</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={
                                        memberDetail.mbrStts === 'Y' ? '정상회원' :
                                        memberDetail.mbrStts === 'W' ? '대기회원' :
                                        memberDetail.mbrStts === 'R' ? '반려회원' :
                                        memberDetail.mbrStts === 'S' ? '정지회원' :
                                        memberDetail.mbrStts === 'C' ? '탈퇴회원' : ''
                                    }
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>회원분류</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberTypeLabel}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>아이디</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.userId || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>비밀번호</small></label>
                            <div className="input">
                                <input
                                    type="password"
                                    value={memberDetail.userPw || ''}
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
                                    value={memberDetail.kornFlnm || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>휴대폰</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.mblTelno || ''}
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
                                    value={`${memberDetail.addr || ''} ${memberDetail.daddr || ''}`} // addr과 daddr을 합쳐서 표시
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>메일수신</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.emlRcptnAgreYn === 'Y' ? '수신동의' : memberDetail.emlRcptnAgreYn === 'N' ? '수신거절' : ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>문자수신</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.smsRcptnAgreYn  === 'Y' ? '수신동의' : memberDetail.smsRcptnAgreYn === 'N' ? '수신거절' : ''}
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
                                        value={memberDetail.frstCrtDt ? new Date(memberDetail.frstCrtDt).toLocaleDateString() : ''} // 연월일만 표시
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
                                onClick={() => setRejectMemberApproval(memberDetail.userSn)}
                            >
                                <span>재승인</span>
                            </button>

                        </div>
                        <Link to={URL.MANAGER_REJECT_MEMBER}>
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

export default setRejectMember;
