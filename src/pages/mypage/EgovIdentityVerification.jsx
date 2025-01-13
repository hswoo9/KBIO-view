import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import URL from "@/constants/url";

const EgovIdentityVerification = () => {
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    const handleVerification = () => {
        // 실제 본인인증 로직을 여기에 추가
        // 예: 인증 API 호출 후 성공 시 setIsVerified(true) 호출
        alert("본인인증이 완료되었습니다.");
        setIsVerified(true);
    };

    const handleNext = () => {
        if (!isVerified) {
            alert("본인인증을 완료해야 회원가입을 진행할 수 있습니다.");
            return;
        }
        navigate(URL.MYPAGE_CREATE);
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
                        <li>본인인증</li>
                    </ul>
                </div>

                {/* Layout */}
                <div className="layout">
                    <div className="contents VERIFICATION" id="contents">
                        {/* Header */}
                        <div className="top_tit">
                            <h1 className="tit_1">본인인증</h1>
                            <p className="desc">
                                회원가입을 위해 본인인증을 진행해주세요.
                            </p>
                        </div>

                        {/* Verification */}
                        <div className="verification_wrap">
                            <button
                                className="btn btn_skyblue_h46 w_100"
                                onClick={handleVerification}
                            >
                                본인인증
                            </button>
                            {isVerified && (
                                <p className="success_message">
                                    본인인증이 완료되었습니다.
                                </p>
                            )}
                        </div>

                        {/* Button Area */}
                        <div className="board_btn_area">
                            <div className="left_col btn1">
                                <button
                                    className={`btn btn_skyblue_h46 w_100 ${
                                        isVerified ? "" : "btn_disabled"
                                    }`}
                                    onClick={handleNext}
                                    disabled={!isVerified}
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

export default EgovIdentityVerification;
