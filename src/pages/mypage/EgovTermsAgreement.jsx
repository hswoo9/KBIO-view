import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import URL from "@/constants/url";
import AOS from "aos";
import Swal from "sweetalert2";

const EgovTermsAgreement = () => {
    const [isAgreed, setIsAgreed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [signupType, setSignupType] = useState("");

    useEffect(() => {
        if (location.state?.signupType) {
            setSignupType(location.state.signupType);
        }
    }, [location.state]);

    const handleAgreementChange = (e) => {
        setIsAgreed(e.target.checked);
    };

    const handleNext = () => {
        if (!isAgreed) {
            Swal.fire("약관에 동의해야 회원가입을 진행할 수 있습니다.");
            return;
        }
        if (location.state?.signupType) {
            navigate(URL.IDENTITY_VERIFICATION, { state: { signupType } });
        }else{
            navigate(URL.IDENTITY_VERIFICATION, { state : location.state} );
        }

    };

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div id="container" className="container join_step step1">
            <div className="inner">
                <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                    <li className="active">
                        <div className="num"><p>1</p></div>
                        <p className="text">약관동의</p>
                    </li>
                    <li>
                        <div className="num"><p>2</p></div>
                        <p className="text">본인인증</p>
                    </li>
                    <li>
                        <div className="num"><p>3</p></div>
                        <p className="text">정보입력</p>
                    </li>
                    <li>
                        <div className="num"><p>4</p></div>
                        <p className="text">신청완료</p>
                    </li>
                </ul>
                <div className="inner2" data-aos="fade-up" data-aos-duration="1500">
                    <div className="titleWrap type2 left">
                        <p className="tt1">개인 정보 수집 및 이용에 대한 안내 <span className="red">*필수</span></p>
                    </div>
                    <div className="privacyWrap">
                        <div className="infoBox">
                            <div className="text">
                                <p>개인정보보호법에 따라 K-바이오랩허브에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간,
                                    동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다. <br/>1. 수집하는 개인정보 이용자는
                                        회원가입을 하지 않아도 정보 검색, 공지사항 확인 등 대부분의 K-바이오랩허브 서비스를 회원과 동일하게 이용할 수 있습니다. 이용자가 연구
                                        지원, 시설 예약, 네트워킹 등과 같이 개인화 혹은 회원제 서비스를 이용하기 위해 회원가입을 할 경우, K-바이오랩허브는 서비스 이용을 위해
                                        필요한 최소한의 개인정보를 수집합니다. <br/>회원가입 시점에 K-바이오랩허브가 이용자로부터 수집하는 개인정보는 아래와 같습니다. <br/>·
                                        회원 가입 시 필수항목으로 아이디, 비밀번호, 이름, 생년월일, 성별, 휴대전화번호를, 선택항목으로 본인확인 이메일주소를 수집합니다. 실명
                                        인증된 아이디로 가입 시, 암호화된 동일인 식별정보(CI), 중복가입 확인정보(DI), 내외국인 정보를 함께 수집합니다. 만 14세 미만 아동의
                                        경우, 법정대리인의 동의를 받고 있으며, 휴대전화번호 또는 아이핀 인증을 통해 법정대리인의 동의를 확인하고 있습니다. 이 과정에서 법정대리인의
                                        정보(법정대리인의 이름, 중복가입확인정보(DI), 휴대전화번호(아이핀 인증인 경우 아이핀번호))를 추가로 수집합니다. <br/>· 비밀번호 없이
                                        회원 가입 시에는 필수항목으로 아이디, 이름, 생년월일, 휴대전화번호를, 선택항목으로 비밀번호를 수집합니다. <br/>· 단체 회원가입 시 필수
                                        항목으로 단체아이디, 비밀번호, 단체이름, 이메일주소, 휴대전화번호를, 선택항목으로 단체 대표자명을 수집합니다. <br/>서비스 이용 과정에서
                                        이용자로부터 수집하는 개인정보는 아래와 같습니다. <br/>· 회원정보 또는 개별 서비스에서 프로필 정보(별명, 프로필 사진)를 설정할 수
                                        있습니다. 회원정보에 별명을 입력하지 않은 경우에는 마스킹 처리된 아이디가 별명으로 자동 입력됩니다. <br/>· K-바이오랩허브 내의 개별
                                        서비스 이용, 이벤트 응모 및 연구 지원 신청 과정에서 해당 서비스의 이용자에 한해 추가 개인정보 수집이 발생할 수 있습니다. 추가로 개인정보를
                                        수집할 경우에는 해당 개인정보 수집 시점에서 이용자에게 ‘수집하는 개인정보 항목, 개인정보의 수집 및 이용목적, 개인정보의 보관기간’에 대해
                                        안내 드리고 동의를 받습니다.</p>
                            </div>
                        </div>
                        <label className="checkBox type2">
                            <input
                                type="checkbox"
                                id="agree"
                                name="agree"
                                checked={isAgreed}
                                onChange={handleAgreementChange}
                            />
                            <small>개인 정보 수집 및 이용을 확인하였으며 동의합니다.</small>
                        </label>
                    </div>
                    <div className="buttonBox">
                        <button type="button" className="clickBtn black"
                                className={`clickBtn black ${
                                    isAgreed ? "" : "btn_disabled"
                                }`}
                                onClick={handleNext}
                        ><span>다음</span></button>
                        <button type="button" className="clickBtn white" onClick={() => navigate(URL.SIGNUP_CHOICE)}><span>뒤로가기</span></button>
                    </div>
                </div>
                {/*<div className="titleWrap type1" data-aos="fade-up" data-aos-duration="1500">
                    <p className="tt1">약관 동의</p>
                    <strong className="tt2">회원가입을 위해 아래 약관을 읽고 동의해주세요.</strong>
                </div>
                <div className="topTextBox" data-aos="fade-up" data-aos-duration="1500">
                    <p>약관의 내용</p>
                    <label className="checkBox type1"><small>안내 사항을 모두 확인하였으며, 이에 동의합니다.</small><input
                        type="checkbox" id="agree" name="agree" checked={isAgreed}
                        onChange={handleAgreementChange}/></label>
                </div>
                <div className="authenBox" data-aos="fade-up" data-aos-duration="1500">
                    <button
                        type="button"
                        className={`clickBtn black ${
                            isAgreed ? "" : "btn_disabled"
                        }`}
                        onClick={handleNext}
                        disabled={!isAgreed}
                    >
                        <span>다음</span>
                    </button>
                </div>*/}
            </div>
        </div>
);
};

export default EgovTermsAgreement;
