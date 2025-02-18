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


function OperationRelatedMember(props) {
    console.group("ManagerNormalMemberEdit");
    console.log("[Start] ManagerNormalMemberEdit------------------------------");
    console.log("ManagerNormalMemberEdit [props] : ", props);
    

    const navigate = useNavigate();
    const location = useLocation();
    const checkRef = useRef([]);

    const [searchDto, setSearchDto] = useState(
        {userSn: location.state?.userSn,
            relInstSn:location.state?.relInstSn
        }
    );

    const [modeInfo, setModeInfo] = useState({mode: props.mode});
    const [memberDetail, setMemberDetail] = useState({});
    const [rcDetail, setRcDetail] = useState({});

    const initMode = () => {
        setModeInfo({
            ...modeInfo,
            editURL: `/relatedApi/setMemberMbrStts`,
        });

        getNormalMember(searchDto);
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

    const getNormalMember = (serachDto) => {
        const getNormalMemberURL = `/relatedApi/getRelatedMemberOne.do`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getNormalMemberURL, requestOptions, function (resp) {
            if (modeInfo.mode === CODE.MODE_MODIFY) {
                const decodedPhoneNumber = decodePhoneNumber(resp.result.member.mblTelno);
                setMemberDetail({
                    ...resp.result.member,
                    mblTelno: decodedPhoneNumber, // 디코딩된 전화번호로 업데이트
                });

                setRcDetail({
                    ...resp.result.rc
                });
            }
        });
    };

    useEffect(() => {
        initMode();
    }, []);

    const updateMbrStts = (newStatus) =>{

        const updatedDto = { ...searchDto, mbrStts: newStatus };

        Swal.fire({
            title: "수정하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(updatedDto),
                };

                console.log("Request Body:", JSON.stringify(requestOptions));

                EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("수정되었습니다.");
                        window.location.reload();
                    } else {
                        navigate(
                            { pathname: URL.ERROR },
                            { state: { msg: resp.resultMessage } }
                        );
                    }
                });
            } else {
                //취소
            }
        });
    };




    console.log("------------------------------EgovAdminMemberEdit [End]");
    console.groupEnd("EgovAdminMemberEdit");

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle">
                    <p>개인정보</p>
                </h2>

                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 width2">
                            <label className="title"><small>회원상태</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={
                                        memberDetail.mbrStts === 'Y' ? '정상회원' :
                                            memberDetail.mbrStts === 'W' ? '대기회원' :
                                                memberDetail.mbrStts === 'R' ? '반려회원' :
                                                    memberDetail.mbrStts === 'C' ? '정지회원' :
                                                        memberDetail.mbrStts === 'S' ? '탈퇴회원' : ''
                                    }
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
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
                            <label className="title"><small>성명</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.kornFlnm || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>휴대폰</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.mblTelno || ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
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

                        <li className="inputBox type1 width2">
                            <label className="title"><small>메일수신</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.emlRcptnAgreYn === 'Y' ? '수신동의' : memberDetail.emlRcptnAgreYn === 'N' ? '수신거절' : ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
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
                </div>
                {/*회원정보끝*/}

                <h2 className="pageTitle">
                    <p>기업정보</p>
                </h2>
                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 email width2">
                            <label className="title"><small>기업명</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    name="brno"
                                    id="brno"
                                    value={rcDetail.relInstNm || ""}
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                        <li className="inputBox type1 email width2">
                            <label className="title"><small>대표자</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    name="rpsvNm"
                                    id="rpsvNm"
                                    value={rcDetail.rpsvNm || ""}
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                        <li className="inputBox type1 email width2">
                            <label className="title"><small>산업</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    name="clsNm"
                                    id="clsNm"
                                    value={rcDetail.clsNm || ""}
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                        <li className="inputBox type1 email width2">
                            <label className="title"><small>사업자등록번호</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    name="brno"
                                    id="brno"
                                    value={rcDetail.brno || ""}
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                        <li className="inputBox type1 email width1">
                            <label className="title"><small>주소</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={`${rcDetail.entAddr || ''} ${rcDetail.entDaddr || ''}`}
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                        <li className="inputBox type1 email width2">
                            <label className="title"><small>대표번호</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    name="entTelno"
                                    id="entTelno"
                                    value={rcDetail.entTelno || ""}
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                        <li className="inputBox type1 email width2">
                            <label className="title"><small>기업메일</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    name="bzentyEmlAddr"
                                    id="bzentyEmlAddr"
                                    value={rcDetail.bzentyEmlAddr || ""}
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                    </ul>
                </div>
                {/*기업정보끝*/}


                {/*버튼영역*/}
                <div className="pageWrap">

                    <div className="leftBox"
                         style={{ display: memberDetail.actvtnYn === "W" ? "inline-block" : "none" }}>
                        <button
                            type="button" className="clickBtn point"
                            style={{display : "inline-block"}}
                            onClick={() => updateMbrStts("Y")}>
                            승인
                        </button>
                        <button
                            type="button"
                            className="clickBtn gray"
                            style={{display : "inline-block" , marginLeft : "10px"}}
                            onClick={() => updateMbrStts("R")}
                        >
                            <span>승인반려</span>
                        </button>
                    </div>

                    <div className="leftBox"
                         style={{ display: memberDetail.actvtnYn === "R" ? "inline-block" : "none" }}>
                        <button
                            type="button" className="clickBtn point"
                            style={{display : "inline-block"}}
                            onClick={() => updateMbrStts("Y")}>
                            재승인
                        </button>
                    </div>

                    <div className="rightBox">
                        <Link
                            to={URL.MANAGER_RESIDENT_MEMBER}
                            state={{relInstSn: rcDetail.relInstSn,
                                rpsvNm : rcDetail.rpsvNm,
                                entTelno : rcDetail.entTelno,
                                clsNm : rcDetail.clsNm
                            }}>

                            <button type="button" className="clickBtn black">
                                <span>목록</span>
                            </button>
                        </Link>
                    </div>

                </div>
                {/*버튼영역끝*/}
            </div>
        </div>
    );
}

export default OperationRelatedMember;
