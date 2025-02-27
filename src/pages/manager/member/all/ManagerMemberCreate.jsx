import React, {useState, useEffect, useRef, useCallback} from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";
import Swal from "sweetalert2";
import CommonEditor from "@/components/CommonEditor";
import {useDropzone} from "react-dropzone";
import { getSessionItem } from "@/utils/storage";
import {getComCdList} from "@/components/CommonComponents";
import ManagerLeft from "@/components/manager/ManagerLeftMember";

function ManagerMemberCreate(props) {

    const location = useLocation();
    const navigate = useNavigate();
    const checkRef = useRef([]);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [emailAddr, setEmailAddr] = useState("");
    const [comCdList, setComCdList] = useState([]);


    const [memberDetail, setMemberDetail] = useState({
        actvtnYn: 'Y',
        mbrStts: 'Y'
    });



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

    const nonsearchAddress = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert('주소 검색 API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                const fullAddress = data.address;
                setMemberDetail({
                    ...memberDetail,
                    nonpostcode: fullAddress,
                    nonaddress: fullAddress,
                    nonsearchAddress: fullAddress,
                });
            },
        }).open();
    };

    const checkIdDplct = () => {
        return new Promise((resolve) => {
            let checkId = memberDetail["userId"];
            if (checkId === null || checkId === undefined) {
                Swal.fire("회원ID를 입력해 주세요");
                return false;
            }
            const checkIdURL = `/memberApi/checkMemberId.do`;
            const reqOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    userId : checkId
                })
            };
            EgovNet.requestFetch(checkIdURL, reqOptions, function (resp) {
                if (resp.resultCode === 400 && resp.result.usedCnt > 0
                ) {
                    setMemberDetail({
                        ...memberDetail,
                        checkIdResult: "중복된 아이디입니다.",
                        checkIdResultColor: "red",
                        userId: checkId,
                    });
                    resolve(resp.result.usedCnt);
                } else {
                    setMemberDetail({
                        ...memberDetail,
                        checkIdResult: "사용 가능한 아이디입니다.",
                        checkIdResultColor: "green",
                        userId: checkId,
                    });
                    resolve(0);
                }
            });
        });
    };

    const updateMember = async () => {
        let requestOptions = {};

        if (!memberDetail.userId) {
            Swal.fire("회원ID를 입력해주세요.");
            return false;
        }

        const res = await checkIdDplct();

        if (res > 0) {
            Swal.fire("중복된 아이디입니다. 다른 아이디를 사용해주세요.");
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


        const phonenumRegex = /^\d{11}$/;
        if (!phonenumRegex.test(memberDetail.mblTelno)) {
            Swal.fire("전화번호는 11자리 숫자만 입력 가능합니다.");
            return false;
        }

        if (!memberDetail.userPw) {
            Swal.fire("비밀번호는 필수 값입니다.");
            return false;
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~_`|-]).{8,20}$/;
        if (!passwordRegex.test(memberDetail.userPw)) {
            Swal.fire("비밀번호는 영문자, 숫자, 특수문자 조합으로 8~20자리 이내여야 합니다.");
            return false;
        }

        if (!memberDetail.password_chk) {
            Swal.fire("비밀번호 확인은 필수 값입니다.");
            return false;
        }

        if (memberDetail.userPw !== memberDetail.password_chk) {
            Swal.fire("비밀번호가 일치하지 않습니다.");
            return false;
        }

        const mberNmRegex = /^[a-zA-Zㄱ-ㅎ가-힣]+$/;
        if (!mberNmRegex.test(memberDetail.kornFlnm)) {
            Swal.fire("성명은 한글 또는 영문자만 사용 가능합니다.");
            return false;
        }

        if (!memberDetail.email) {
            Swal.fire("이메일은 필수 값입니다.");
            return false;
        }

        if (!memberDetail.emailDomain) {
            Swal.fire("도메인은 필수 값입니다.");
            return false;
        }



        setMemberDetail({...memberDetail});

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
                        Swal.fire("등록되었습니다.");
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


    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle">
                    <p>회원 생성</p>
                </h2>
                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 width3">
                            <span className="title">성명</span>
                            <label className="input">
                                <input
                                    type="text"
                                    name="kornFlnm"
                                    title=""
                                    id="kornFlnm"
                                    placeholder=""
                                    value={memberDetail.kornFlnm || ""}
                                    onChange={(e) => setMemberDetail({...memberDetail, kornFlnm: e.target.value})}
                                />
                            </label>
                        </li>

                        <li className="inputBox type1 width3">
                            <span className="title">휴대폰</span>
                            <label className="input">
                                <input
                                    type="text"
                                    name="mblTelno"
                                    title=""
                                    id="mblTelno"
                                    placeholder=""
                                    value={memberDetail.mblTelno || ""}
                                    onChange={(e) => setMemberDetail({...memberDetail, mblTelno: e.target.value})}
                                />
                            </label>
                        </li>

                        <li className="inputBox type1 width3">
                            <span className="title">회원구분</span>
                            <div className="itemBox">
                                <select className="selectGroup"
                                        type="text"
                                        name="mbrType"
                                        value={memberDetail.mbrType || ""}
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

                        <li className="inputBox type1 width2">
                            <span className="title">아이디</span>
                            <div className="input">
                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                    <input
                                        type="text"
                                        name="userId"
                                        id="userId"
                                        placeholder="아이디는 6~12자 영문, 숫자만 가능합니다."
                                        title="아이디"
                                        value={memberDetail.userId || ""}
                                        onChange={(e) => setMemberDetail({...memberDetail, userId: e.target.value})}
                                        style={{flex: 1}}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn_skyblue_h46"
                                        onClick={checkIdDplct}
                                    >
                                        중복확인
                                    </button>
                                </div>
                                {memberDetail.checkIdResult && (
                                    <div style={{
                                        color: memberDetail.checkIdResultColor,
                                        marginTop: '10px',
                                        fontSize: '12px'
                                    }}>
                                        {memberDetail.checkIdResult}
                                    </div>
                                )}
                            </div>
                        </li>

                        <li className="inputBox type1 email width2">
                            <span className="title" htmlFor="emailId">이메일</span>
                            <div className="input" style={{display: 'flex', alignItems: 'center'}}>
                                <input
                                    type="text"
                                    name="emailPrefix"
                                    id="emailPrefix"
                                    placeholder="이메일 아이디 입력"
                                    value={memberDetail.emailPrefix || ""}
                                    onChange={(e) => setMemberDetail({
                                        ...memberDetail,
                                        emailPrefix: e.target.value,
                                        email: `${e.target.value}@${memberDetail.emailDomain || ''}` // 도메인이 비어있을 경우 처리
                                    })}
                                    style={{flex: 1, padding: '5px'}}
                                />
                                <span style={{margin: '0 5px'}}>@</span>
                                <div className="itemBox" style={{flex: 1}}>
                                    {memberDetail.emailProvider === "direct" ? (
                                        <input
                                            type="text"
                                            placeholder="도메인 입력"
                                            value={memberDetail.emailDomain || ""}
                                            onChange={(e) => setMemberDetail({
                                                ...memberDetail,
                                                emailDomain: e.target.value,
                                                email: `${memberDetail.emailPrefix}@${e.target.value}` // 도메인 입력 시 이메일 업데이트
                                            })}
                                            onBlur={() => {
                                                if (!memberDetail.emailDomain) {
                                                    setMemberDetail({...memberDetail, emailProvider: ""});
                                                }
                                            }}
                                        />
                                    ) : (
                                        <select
                                            className="selectGroup"
                                            onChange={(e) => {
                                                const provider = e.target.value;
                                                const newEmailDomain = provider === "direct" ? "" : provider; // 선택한 도메인
                                                const newEmail = `${memberDetail.emailPrefix}@${newEmailDomain}`; // 새로운 이메일 생성
                                                setMemberDetail((prevDetail) => ({
                                                    ...prevDetail,
                                                    emailProvider: provider,
                                                    emailDomain: newEmailDomain,
                                                    email: newEmail
                                                }));
                                            }}
                                            value={memberDetail.emailProvider || ""}
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


                        <li className="inputBox type1 width2">
                            <span className="title">비밀번호</span>
                            <label className="input">
                                <input
                                    type="password"
                                    name="userPw"
                                    id="userPw"
                                    placeholder="영문자, 숫자, 특수문자 조합으로 8~20자 이내만 가능합니다."
                                    title="비밀번호"
                                    value={memberDetail.userPw || ""}
                                    onChange={(e) => setMemberDetail({...memberDetail, userPw: e.target.value})}
                                />
                            </label>
                        </li>

                        <li className="inputBox type1 width2">
                            <span className="title">비밀번호 확인</span>
                            <label className="input">
                                <input
                                    type="password"
                                    name="password_chk"
                                    id="password_chk"
                                    title="비밀번호 확인"
                                    value={memberDetail.password_chk || ""}
                                    onChange={(e) => setMemberDetail({
                                        ...memberDetail,
                                        password_chk: e.target.value
                                    })}
                                />
                            </label>
                            <span className="warningText">비밀번호: 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.</span>
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
                                    value={memberDetail.zip || ""}
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
                                    readOnly
                                    title="주소"
                                    value={memberDetail.addr || ""}
                                /></div>
                        </li>

                        <li className="inputBox type1 width2">
                            <span className="title">상세주소</span>
                            <div className="input">
                                <input
                                    type="text"
                                    name="daddr"
                                    id="daddr"
                                    placeholder="상세주소를 입력해주세요"
                                    title="상세주소"
                                    value={memberDetail.daddr || ""}
                                    onChange={(e) => setMemberDetail({...memberDetail, daddr: e.target.value})}
                                />
                            </div>
                        </li>
                    </ul>
                    <div className="buttonBox">
                        <div className="leftBox">
                            <button
                                type="button" className="clickBtn point"
                                onClick={() => updateMember()}
                            >
                                등록
                            </button>
                        </div>
                        <NavLink
                            to={URL.MANAGER_NORMAL_MEMBER}
                        >
                            <button type="button" className="clickBtn black">
                                <span>목록</span>
                            </button>
                        </NavLink>

                    </div>


                </div>

            </div>
        </div>
    )
}

export default ManagerMemberCreate;