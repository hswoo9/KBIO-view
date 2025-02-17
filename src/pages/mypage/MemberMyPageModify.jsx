import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeft from "@/components/manager/ManagerLeftMember";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import base64 from 'base64-js';
import { getSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
function MemberMyPageModify(props) {
    const location = useLocation();
    const checkRef = useRef([]);
    const navigate = useNavigate();
    const sessionUser = getSessionItem("loginUser");
    const sessionUserName = sessionUser?.name;
    const sessionUserSn = sessionUser?.userSn;
    const [address, setAddress] = useState("");

    console.log(sessionUser);

    const [memberDetail, setMemberDetail] = useState({
        kornFlnm: '', // 성명
        mblTelno: '', // 휴대폰
        userId: '', // 아이디
        emailPrefix: '', // 이메일 아이디
        emailDomain: '', // 이메일 도메인
        email: '', // 전체 이메일
        userPw: '', // 비밀번호
        addr: '', // 주소
        daddr: '', // 상세주소
        emlRcptnAgreYn: '', // 메일 수신 동의
        smsRcptnAgreYn: '' // 문자 수신 동의
    });
    const [modeInfo, setModeInfo] = useState({mode: props.mode});
    const [searchDto, setSearchDto] = useState({userSn:sessionUserSn});


    const handleMailChange = (e) => {
        const value = e.target.value;
        setMemberDetail({
            ...memberDetail,
            emlRcptnAgreYn: value,
        });
    };

    useEffect(() => {
        console.log(memberDetail);
    }, [memberDetail]);

    const handleSmsChange = (e) => {
        const value = e.target.value;
        setMemberDetail({
            ...memberDetail,
            smsRcptnAgreYn: value,
        });
    };
    const initMode = () => {
        setModeInfo({
            ...modeInfo,
            modeTitle: modeInfo.mode === CODE.MODE_CREATE ? "회원 등록" : "회원 수정",
            editURL: `/memberApi/setNormalMember`,
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


    useEffect(() => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;

        script.onload = () => {
            console.log("카카오 주소 검색 API가 로드되었습니다.");

            if (location.state?.signupType) {
                console.log("Signup Type: ", location.state.signupType);
            }
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [location.state]);

    useEffect(() => {
        if (memberDetail.email) {
            const emailParts = memberDetail.email.split("@");
            const emailPrefix = emailParts[0] || "";
            const emailDomain = emailParts[1] || "";

            // 기본 제공 도메인 리스트
            const defaultProviders = [
                "naver.com",
                "gmail.com",
                "daum.net",
                "hotmail.com",
                "nate.com",
                "hanmail.net"
            ];

            setMemberDetail((prevState) => ({
                ...prevState,
                emailPrefix,
                emailDomain,
                emailProvider: defaultProviders.includes(emailDomain) ? emailDomain : "direct",
            }));
        }
    }, [memberDetail.email]);

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

    const getNormalMember = (searchDto) => {
        const getNormalMemberURL = `/memberApi/getMyPageNormalMember`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getNormalMemberURL, requestOptions, (resp) => {
            console.log("Response Received:", resp);  // 응답이 올바르게 들어오는지 확인
            if (modeInfo.mode === CODE.MODE_MODIFY) {
                const memberData = resp.result.member;

                console.log("D Member Data:", memberData);

                const decodedPhoneNumber = memberData.mblTelno ? decodePhoneNumber(memberData.mblTelno) : "";

                let emailPrefix = "";
                let emailDomain = "";
                let emailProvider = "direct";

                if (memberData.email && memberData.email.includes("@")) {
                    const emailParts = memberData.email.split("@");
                    emailPrefix = emailParts[0] || "";
                    emailDomain = emailParts[1] || "";
                    emailProvider = emailDomain;
                }

                setMemberDetail((prevState) => ({
                    ...prevState,
                    ...memberData,
                    mblTelno: decodedPhoneNumber,
                    emailPrefix,
                    emailDomain,
                    email: memberData.email,
                    emailProvider,
                }));
            }
        });
    };


    useEffect(() => {
        initMode();
    }, []);


    const updateMember = () => {
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
        if (result.isConfirmed) {
            if (!memberDetail.emailPrefix || !memberDetail.emailDomain) {
                Swal.fire("이메일을 입력해주세요.");
                return;
            }

            if (!memberDetail.email) {
                Swal.fire("이메일을 입력해주세요.");
                return;
            }

            if (!memberDetail.userPw) {
                    Swal.fire({
                        title: '비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.',
                        text: '비밀번호가 요구 사항에 맞지 않습니다.',
                    });
                    return;
            }

            if (!memberDetail.addr) {
                Swal.fire("주소를 입력해주세요.");
                return;
            }

            if (!memberDetail.daddr) {
                Swal.fire("상세주소를 입력해주세요.");
                return;
            }

            const emailPrefix = memberDetail.emailPrefix || "";
            const emailDomain = memberDetail.emailDomain || "";
            const email = `${emailPrefix}@${emailDomain}`;

            const updatedMemberDetail = {
                ...memberDetail,
                emailPrefix,
                emailDomain,
                email,
                emailProvider: emailDomain,
            };

            setSaveEvent({
                ...saveEvent,
                save: true,
                mode: "save",
                memberDetail: updatedMemberDetail
                });
            } else {
            }
        });
    };
    const [saveEvent, setSaveEvent] = useState({});
    useEffect(() => {
        if(saveEvent.save){
            if(saveEvent.mode == "save"){
                saveMemberModdifyData(memberDetail);
            }else {
            }
        }
    }, [saveEvent]);

    const saveMemberModdifyData = useCallback(
        (MemberDetail) => {
            const formData = new FormData();
            for (let key in MemberDetail) {
                if (MemberDetail[key] != null) {
                    formData.append(key, MemberDetail[key]);
                }
            }

            console.log("Sending data:", Object.fromEntries(formData.entries()));

            const menuListURL = "/memberApi/setMemberMyPageModfiy";
            const requestOptions = {
                method: "POST",
                body: formData
            };

            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire({
                            text: resp.resultMessage,
                            confirmButtonText: '확인'
                        });
                        navigate({ pathname: URL.LOGIN });
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

    return (
        <div id="container" className="container ithdraw join_step">
            <div className="inner">
                <CommonSubMenu/>
                
                {/* 페이지 내용 표시 */}
                <form className="contBox">
                    <ul className="inputWrap box01" data-aos="fade-up" data-aos-duration="1500">
                        <li className="inputBox type2 white">
                            <span className="tt1">회원분류</span>
                            <div className="input">
                                <input
                                    type="text"
                                    name="mbrType"
                                    id="mbrType"
                                    value={memberTypeLabel}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type2 white">
                            <span className="tt1">성명</span>
                            <label className="input">
                                <input
                                    type="text"
                                    name="kornFlnm"
                                    id="kornFlnm"
                                    value={memberDetail.kornFlnm || ''}
                                    readOnly
                                />
                            </label>
                        </li>

                        <li className="inputBox type2 white">
                            <span className="tt1">휴대폰</span>
                            <label className="input">
                                <input
                                    type="text"
                                    name="mblTelno"
                                    id="mblTelno"
                                    value={memberDetail.mblTelno || ''}
                                    readOnly
                                />
                            </label>
                        </li>

                        <li className="inputBox type2 white">
                            <span className="tt1">아이디</span>
                            <div className="input">
                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                    <input
                                        type="text"
                                        name="userId"
                                        id="userId"
                                        placeholder="아이디는 6~12자 영문, 숫자만 가능합니다."
                                        value={memberDetail.userId || ''}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </li>
                        <li className="inputBox type2">
                            <span className="tt1">이메일</span>
                            <div className="input flexinput" style={{display: 'flex', alignItems: 'center'}}>
                                <input
                                    type="text"
                                    name="emailPrefix"
                                    id="emailPrefix"
                                    placeholder="이메일 아이디 입력"
                                    value={memberDetail.emailPrefix || ""}
                                    onChange={(e) => setMemberDetail((prev) => ({
                                        ...prev,
                                        emailPrefix: e.target.value,
                                        email: `${e.target.value}@${prev.emailDomain}`
                                    }))}
                                    style={{flex: 1, padding: '5px'}}
                                />
                                <span style={{margin: '0 5px'}}>@</span>
                                <div className="itemBox" style={{flex: 1}}>
                                    {memberDetail.emailProvider === "direct" ? (
                                        <input
                                            type="text"
                                            placeholder="도메인 입력"
                                            value={memberDetail.emailDomain}
                                            onChange={(e) => {
                                                const updatedEmailDomain = e.target.value;
                                                setMemberDetail({
                                                    ...memberDetail,
                                                    emailDomain: updatedEmailDomain,
                                                    email: `${memberDetail.emailPrefix}@${updatedEmailDomain}`,  // emailDomain이 수정될 때 email 값도 갱신
                                                });
                                            }}
                                            onBlur={() => {
                                                if (!memberDetail.emailDomain) {
                                                    setMemberDetail({
                                                        ...memberDetail,
                                                        emailProvider: "",
                                                        emailDomain: "",
                                                    });
                                                }
                                            }}
                                            style={{flex: 1, padding: '5px'}}
                                        />
                                    ) : (
                                        <select
                                            className="selectGroup"
                                            onChange={(e) => {
                                                const provider = e.target.value;
                                                setMemberDetail((prev) => ({
                                                    ...prev,
                                                    emailProvider: provider,
                                                    emailDomain: provider === "direct" ? "" : provider,
                                                    email: `${prev.emailPrefix}@${provider === "direct" ? "" : provider}`
                                                }));
                                            }}
                                            value={memberDetail.emailProvider || ""}
                                            style={{
                                                padding: '5px',
                                                flex: 1,
                                                appearance: 'none',
                                                width: '100%',
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
                                    )}
                                </div>
                            </div>
                        </li>

                        <li className="inputBox type2">
                            <span className="tt1">비밀번호</span>
                            <label className="input">
                                <input
                                    type="password"
                                    name="userPw"
                                    id="userPw"
                                    placeholder="영문자, 숫자, 특수문자 조합으로 8~20자 이내만 가능합니다."
                                    value={memberDetail.userPw}
                                    onChange={(e) => setMemberDetail({...memberDetail, userPw: e.target.value})}
                                />
                            </label>
                        </li>

                        <li className="inputBox type2">
                        <span className="tt1">주소</span>
                            <label className="input" style={{paddingRight: "6rem"}}>
                                <input type="text" name="addr" id="addr" readOnly value={memberDetail.addr}/>
                                <button type="button" className="addressBtn btn" onClick={searchAddress}>
                                    <span>주소검색</span>
                                </button>
                            </label>
                        </li>

                        <li className="inputBox type2">
                            <span className="tt1">상세주소</span>
                            <label className="input" style={{paddingRight: "6rem"}}>
                                <input
                                    type="text"
                                    name="daddr"
                                    id="daddr"
                                    placeholder="상세주소를 입력해주세요"
                                    value={memberDetail.daddr}
                                    onChange={(e) => setMemberDetail({...memberDetail, daddr: e.target.value})}
                                />
                            </label>
                        </li>
                    </ul>
                    <ul className="box03 inputWrap" data-aos="fade-up" data-aos-duration="1500">
                        <li className="inputBox type2 white">
                            <div className="input">
                                <span className="tt1">메일수신</span>
                                <div className="checkWrap">
                                    <label className="checkBox type3">
                                        <input
                                            type="radio"
                                            id="receive_mail_yes"
                                            name="receive_mail"
                                            value="Y"
                                            checked={memberDetail.emlRcptnAgreYn === "Y"}
                                            onChange={handleMailChange}
                                        />
                                        <small>수신</small>
                                    </label>
                                    <label className="checkBox type3">
                                        <input
                                            type="radio"
                                            id="receive_mail_no"
                                            name="receive_mail"
                                            value="N"
                                            checked={memberDetail.emlRcptnAgreYn === "N"}
                                            onChange={handleMailChange}
                                        />
                                        <small>수신안함</small>
                                    </label>
                                </div>
                            </div>
                            <span className="warningText">※ 메일링 서비스 수신동의 시 K-바이오랩허브 관련한 다양한 정보를 받으실 수 있습니다</span>
                        </li>
                        <li className="inputBox type2 white">
                            <div className="input">
                                <span className="tt1">문자수신</span>
                                <div className="checkWrap">
                                    <label className="checkBox type3">
                                        <input
                                            type="radio"
                                            id="receive_sms_yes"
                                            name="receive_sms"
                                            value="Y"
                                            checked={memberDetail.smsRcptnAgreYn === "Y"}
                                            onChange={handleSmsChange}
                                        />
                                        <small>수신</small>
                                    </label>
                                    <label className="checkBox type3">
                                        <input
                                            type="radio"
                                            id="receive_sms_no"
                                            name="receive_sms"
                                            value="N"
                                            checked={memberDetail.smsRcptnAgreYn === "N"}
                                            onChange={handleSmsChange}
                                        />
                                        <small>수신안함</small>
                                    </label>
                                </div>
                            </div>
                            <span className="warningText">※ 메일링 서비스 수신동의 시 K-바이오랩허브 관련한 다양한 정보를 받으실 수 있습니다</span>
                        </li>
                    </ul>

                    <div className="buttonBox">
                        <button type="button" className="clickBtn black" onClick={updateMember}>
                            <span>수정</span>
                        </button>
                        <button type="button" className="clickBtn white" onClick={() => navigate(URL.LOGIN)}>
                            <span>뒤로가기</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MemberMyPageModify;
