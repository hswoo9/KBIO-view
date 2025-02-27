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


function setNormalMember(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const checkRef = useRef([]);
    const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(true);
    const mberSttusRadioGroup = [
        {defaultValue: "P", label: "가능"},
        {defaultValue: "A", label: "대기"},
        {defaultValue: "D", label: "탈퇴"},
    ];
    const [searchDto, setSearchDto] = useState({userSn: location.state?.userSn});

    const [modeInfo, setModeInfo] = useState({mode: props.mode});
    const [memberDetail, setMemberDetail] = useState({});

    useEffect(() => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;

        script.onload = () => {
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [location.state]);

    const searchAddress = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert('주소 검색 API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                const fullAddress = data.address;
                const zipCode = data.zonecode;
                setMemberDetail({
                    ...memberDetail,
                    zip: zipCode,
                    addr: fullAddress,
                    searchAddress: '',
                });
            },
        }).open();
    };

    const initMode = () => {
        setModeInfo({
            ...modeInfo,
            modeTitle: modeInfo.mode === CODE.MODE_CREATE ? "회원 등록" : "회원 수정",
            editURL: `/memberApi/setNormalMember`,
        });

        getNormalMember(searchDto);
    };

    const updateMember = () => {
        let requestOptions = {};

        if (!memberDetail.userId) {
            Swal.fire("회원ID를 입력해주세요.");
            return false;
        }

        if (!memberDetail.kornFlnm) {
            Swal.fire("성명을 입력해주세요.");
            return false;
        }

        if (!memberDetail.mbrType) {
            Swal.fire("회원구분을 선택해주세요.");
            return false;
        }

        if (!memberDetail.mblTelno) {
            Swal.fire("핸드폰번호를 입력해주세요.");
            return false;
        }

        if (!memberDetail.email) {
            Swal.fire("이메일은 필수 값입니다.");
            return false;
        }

        setMemberDetail({...memberDetail});

        console.log(memberDetail);

        const formData = new FormData();


        for (let key in memberDetail) {
            const value = memberDetail[key];
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value);
            }
        }


        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                requestOptions = {
                    method: "POST",
                    body: formData
                };

                EgovNet.requestFetch("/memberApi/managerMemberInsert", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("수정되었습니다.");
                        navigate(URL.MANAGER_NORMAL_MEMBER);
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

    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };


    useEffect(() => {
        initMode();
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;

        script.onload = () => {
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const getNormalMember = (serachDto) => {
        if (modeInfo.mode === CODE.MODE_CREATE) {
            setMemberDetail({
                tmplatId: "TMPLAT_MEMBER_DEFAULT",
            });
            return;
        }
        const getNormalMemberURL = `/memberApi/getNormalMember`;
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
        let foundValueLabelObj = objArray.find((o) => o["defaultValue"] === findLabel);
        return foundValueLabelObj["label"];
    };

    useEffect(() => {
        initMode();
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle">
                    <p>{modeInfo.mode === CODE.MODE_CREATE ? "회원 등록" : "회원 수정"}</p>
                </h2>

                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 width3">
                            <label className="title"><small>회원상태</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    defaultValue={
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
                        <li className="inputBox type1 width3">
                            <span className="title">회원구분</span>
                            <div className="itemBox">
                                <select className="selectGroup"
                                        name="mbrType"
                                        value={memberDetail.mbrType || ''}
                                        onChange={(e) => setMemberDetail({...memberDetail, mbrType: e.target.value})}
                                >
                                    <option value="">선택하세요</option>
                                    <option value="9">관리자</option>
                                    <option value="1">입주기업</option>
                                    <option value="3">유관기관</option>
                                    <option value="4">비입주기업</option>
                                    <option value="2">컨설턴트</option>
                                </select>
                            </div>
                        </li>


                        <li className="inputBox type1 width3">
                            <label className="title"><small>아이디</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    defaultValue={memberDetail.userId || ''}
                                    onChange={(e) =>
                                        setMemberDetail({...memberDetail, userId: e.target.value})
                                    }
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>비밀번호</small></label>
                            <div className="input">
                                <input
                                    type="password"
                                    defaultValue={memberDetail.userPw || ''}
                                />
                                <button type="button" className="pwdBtn btn" onClick={(e) => {
                                    pwdReset();
                                }}>
                                    <span>비밀번호 초기화</span>
                                </button>
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>성명</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    defaultValue={memberDetail.kornFlnm || ''}
                                    onChange={(e) =>
                                        setMemberDetail({...memberDetail, kornFlnm: e.target.value})
                                    }
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>휴대폰</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberDetail.mblTelno || ''}
                                    onChange={(e) =>
                                        setMemberDetail({...memberDetail, mblTelno: e.target.value})
                                    }
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>이메일</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    defaultValue={memberDetail.email || ''}
                                    onChange={(e) =>
                                        setMemberDetail({...memberDetail, email: e.target.value})
                                    }
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <span className="title">주소</span>
                            <div className="input">
                                <small className="text btn" onClick={searchAddress}>주소 검색</small>
                                <input
                                    type="hidden"
                                    name="zip"
                                    id="zip"
                                    title="우편번호 입력"
                                    defaultValue={memberDetail.zip || ""}
                                    onChange={(e) =>
                                        setMemberDetail({
                                            ...memberDetail,
                                            zip: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    name="addr"
                                    id="addr"
                                    title="주소"
                                    defaultValue={memberDetail.addr || ""}
                                    onChange={(e) => setMemberDetail({...memberDetail, addr: e.target.value})}
                                    readOnly
                                /></div>
                        </li>

                        <li className="inputBox type1 width2">
                            <span className="title">상세주소</span>
                            <div className="input">
                                <input
                                    type="text"
                                    name="daddr"
                                    id="daddr"
                                    title="상세주소"
                                    defaultValue={memberDetail.daddr || ""}
                                    onChange={(e) => setMemberDetail({...memberDetail, daddr: e.target.value})}
                                />
                            </div>
                        </li>

                        <li className="toggleBox width4">
                            <div className="box">
                                <p className="title essential">문자수신</p>
                                <div className="toggleSwithWrap">
                                    <input type="checkbox" id="emlRcptnAgreYn" hidden
                                           checked={memberDetail.emlRcptnAgreYn === "Y"}
                                           onChange={(e) => {
                                               setMemberDetail({
                                                   ...memberDetail,
                                                   emlRcptnAgreYn: e.target.checked ? "Y" : "N",
                                               })
                                               setIsDatePickerEnabled(e.target.checked);
                                           }}/>
                                    <label htmlFor="emlRcptnAgreYn" className="toggleSwitch">
                                        <span className="toggleButton"></span>
                                    </label>
                                </div>
                            </div>
                        </li>

                        <li className="toggleBox width4">
                            <div className="box">
                                <p className="title essential">문자수신</p>
                                <div className="toggleSwithWrap">
                                    <input type="checkbox" id="smsRcptnAgreYn" hidden
                                           checked={memberDetail.smsRcptnAgreYn === "Y"}
                                           onChange={(e) => {
                                               setMemberDetail({
                                                   ...memberDetail,
                                                   smsRcptnAgreYn: e.target.checked ? "Y" : "N",
                                               })
                                               setIsDatePickerEnabled(e.target.checked);
                                           }}/>
                                    <label htmlFor="smsRcptnAgreYn" className="toggleSwitch">
                                        <span className="toggleButton"></span>
                                    </label>
                                </div>
                            </div>
                        </li>

                        <li className="inputBox type1 width4">
                            <label className="title"><small>가입일</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    defaultValue={memberDetail.frstCrtDt ? new Date(memberDetail.frstCrtDt).toLocaleDateString() : ''} // 연월일만 표시
                                    readOnly
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width4" style={{width: '50%'}}>
                            <label className="title"><small>최근접속일시</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    defaultValue={memberDetail.lastLoginDate ? new Date(memberDetail.lastLoginDate).toLocaleDateString() : ''}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>소셜구분</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    defaultValue={memberDetail.socialType || ''}
                                    readOnly
                                />
                            </div>
                        </li>
                    </ul>

                    <div className="buttonBox">
                        <div className="leftBox">
                            <button type="button" className="clickBtn point" onClick={() => updateMember()}>
                                <span>수정</span>
                            </button>
                            {/*{modeInfo.mode === CODE.MODE_MODIFY && (
                                <button
                                    type="button"
                                    className="clickBtn gray"
                                    onClick={() => setNormalMemberDel(memberDetail.userSn)}
                                >
                                    <span>삭제</span>
                                </button>
                            )}*/}
                        </div>
                        <Link to={URL.MANAGER_NORMAL_MEMBER}>
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

export default setNormalMember;
