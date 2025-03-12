import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as EgovNet from "@/api/egovFetch";
import * as ComScript from "@/components/CommonScript";
import { getComCdList } from "@/components/CommonComponents";
import CommonEditor from "@/components/CommonEditor";
import moment from "moment/moment.js";
import { getSessionItem } from "@/utils/storage";

const CompanyModifyMember = ({data}) => {
    const sessionUser = getSessionItem("loginUser");
    const navigate = useNavigate();
    const [paramsData, setParamsData] = useState({});
    const sessionUserSn = sessionUser?.userSn;

    useEffect(() => {
        console.log(data);
        setParamsData(data);
    }, [data]);


    const searchAddress = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert('주소 검색 API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                const fullAddress = data.address;
                const zipCode = data.zonecode;
                setCompanyDetail({
                    ...memberDetail,
                    zip: zipCode,
                    addr: fullAddress,
                    searchAddress: '',
                });
            },
        }).open();
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
                        ...companyMember,
                        userPw: "qwer12!@"
                    }),
                };

                EgovNet.requestFetch(resetPwdUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire({
                            title: "비밀번호가 초기화되었습니다.",
                            confirmButtonText: "확인"
                        })
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



    useEffect(() => {
        setCompanyDetail(paramsData);
    }, [paramsData]);

    const [companyMember, setCompanyDetail] = useState({});
    useEffect(() => {
        console.log(companyMember);
    }, [companyMember]);

    useEffect(() => {
        setCompanyDetail({
            ...paramsData,
            userSn: paramsData?.userSn || '',
            userId: paramsData?.userId || '',
            userPw: paramsData?.userPw || '',
            kornFlnm: paramsData?.kornFlnm || '',
            mblTelno: paramsData?.decodeMblTelno || '',
            zip: paramsData?.zip || '',
            addr: paramsData?.addr || '',
            daddr: paramsData?.daddr || '',
            email: paramsData?.email || '',
            mdfrSn: sessionUserSn,
        });
    }, [paramsData]);


    const updateMember = () => {
        if (!companyMember.userId) {
            Swal.fire("회원ID를 입력해주세요.");
            return false;
        }

        if (!companyMember.kornFlnm) {
            Swal.fire("성명을 입력해주세요.");
            return false;
        }

        if (!companyMember.mblTelno) {
            Swal.fire("핸드폰번호를 입력해주세요.");
            return false;
        }

        if (!companyMember.email) {
            Swal.fire("이메일은 필수 값입니다.");
            return false;
        }

        if (!companyMember.addr) {
            Swal.fire("주소를 입력해주세요.");
            return false;
        }

        if (!companyMember.daddr) {
            Swal.fire("상세주소를 입력해주세요.");
            return false;
        }

        setCompanyDetail({...companyMember});


        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(companyMember)
                };

                EgovNet.requestFetch("/memberApi/setNormalMember", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("수정되었습니다.").then((result) => {
                        ComScript.closeModal("modifyModal");
                        window.location.reload();
                        });
                    } else {
                    }
                });
            } else {
                //취소
            }
        });

    };
    
    


    return (

        <div className="modifyModal modalCon companyModal">
            <div className="bg" onClick={() => ComScript.closeModal("modifyModal")}></div>
            <div className="m-inner">
                <div className="boxWrap">
                    <div className="close" onClick={() => ComScript.closeModal("modifyModal")}>
                        <div className="icon"></div>
                    </div>
                    <div className="titleWrap type2">
                        <p className="tt1">직원 수정</p>
                    </div>
                    <div className="diffiBox">
                        <div className="cont">
                            <ul className="listBox">

                                <li className="inputBox type1 width1">
                                    <label className="title"><small>아이디</small></label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            defaultValue={companyMember?.userId || ''}
                                            onChange={(e) =>
                                                setCompanyDetail({...companyMember, userId: e.target.value})
                                            }
                                            readOnly
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title"><small>비밀번호</small></label>
                                    <div className="input">
                                        <input
                                            type="password"
                                            defaultValue={companyMember?.userPw || ''}
                                            readOnly
                                        />
                                        <button type="button" className="pwdBtn btn" onClick={(e) => {
                                            pwdReset();
                                        }}>
                                            <span>비밀번호 초기화</span>
                                        </button>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2 left">
                                    <label className="title"><small>성명</small></label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            defaultValue={companyMember?.kornFlnm || ''}
                                            onChange={(e) =>
                                                setCompanyDetail({...companyMember, kornFlnm: e.target.value})
                                            }
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title"><small>휴대폰</small></label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            value={companyMember?.mblTelno || ''}
                                            onChange={(e) =>
                                                setCompanyDetail({...companyMember, mblTelno: e.target.value})
                                            }
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2 left">
                                    <label className="title"><small>이메일</small></label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            defaultValue={companyMember?.email || ''}
                                            onChange={(e) =>
                                                setCompanyDetail({...companyMember, email: e.target.value})
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
                                            defaultValue={companyMember?.zip || ""}
                                            onChange={(e) =>
                                                setCompanyDetail({
                                                    ...companyMember,
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
                                            defaultValue={companyMember?.addr || ""}
                                            onChange={(e) => setCompanyDetail({
                                                ...companyMember,
                                                addr: e.target.value
                                            })}
                                            readOnly
                                        /></div>
                                </li>

                                <li className="inputBox type1 width2 left">
                                    <span className="title">상세주소</span>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="daddr"
                                            id="daddr"
                                            title="상세주소"
                                            defaultValue={companyMember?.daddr || ""}
                                            onChange={(e) => setCompanyDetail({
                                                ...companyMember,
                                                daddr: e.target.value
                                            })}
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <button type="button" className="clickBtn black writeBtn" onClick={() => updateMember()}>
                            <span>수정</span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CompanyModifyMember;
