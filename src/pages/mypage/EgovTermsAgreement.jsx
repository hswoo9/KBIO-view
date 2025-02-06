import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import URL from "@/constants/url";

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
            alert("약관에 동의해야 회원가입을 진행할 수 있습니다.");
            return;
        }
        // navigate(URL.MYPAGE_CREATE); // 회원가입 폼 페이지로 이동
        navigate(URL.IDENTITY_VERIFICATION, { state: { signupType } });
    };

    return (
        <div id="container" className="container withdraw join_step">
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
                <div className="titleWrap type1" data-aos="fade-up" data-aos-duration="1500">
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
                </div>
            </div>
        </div>
    );
};

export default EgovTermsAgreement;
