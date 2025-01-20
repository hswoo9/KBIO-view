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
        <div className="container">
            <div className="c_wrap">
                {/* Location */}
                <div className="location">
                    <ul>
                        <li>
                            <a className="home" href="#!">
                                Home
                            </a>
                        </li>
                        <li>약관 동의</li>
                    </ul>
                </div>

                {/* Layout */}
                <div className="layout">
                    <div className="contents AGREEMENT" id="contents">
                        {/* Header */}
                        <div className="top_tit">
                            <h1 className="tit_1">약관 동의</h1>
                            <p className="desc">
                                회원가입을 위해 아래 약관을 읽고 동의해주세요.
                            </p>
                        </div>

                        {/* Terms */}
                        <div className="terms_wrap">
                            <h2 className="terms_title">이용약관</h2>
                            <div className="terms_box">
                                <p>
                                    약관의 내용이 들어갑니다. 예: 본 약관은 귀하가 본 서비스를
                                    이용함에 있어 필요한 규정을 명시합니다...
                                </p>
                                {/* 약관 내용 추가 가능 */}
                            </div>

                            <div className="agree_box">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={isAgreed}
                                        onChange={handleAgreementChange}
                                    />
                                    <span>약관에 동의합니다.</span>
                                </label>
                            </div>
                        </div>

                        {/* Button Area */}
                        <div className="board_btn_area">
                            <div className="left_col btn1">
                                <button
                                    className={`btn btn_skyblue_h46 w_100 ${
                                        isAgreed ? "" : "btn_disabled"
                                    }`}
                                    onClick={handleNext}
                                    disabled={!isAgreed}
                                >
                                    다음
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EgovTermsAgreement;
