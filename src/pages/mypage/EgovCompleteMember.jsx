import React from "react";
import { useNavigate } from "react-router-dom";
import URL from "@/constants/url";

const EgovSignUpComplete = () => {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate(URL.MAIN);
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
                        <li>회원가입 완료</li>
                    </ul>
                </div>

                {/* Layout */}
                <div className="layout">
                    <div className="contents SIGN_UP_COMPLETE" id="contents">
                        {/* Header */}
                        <div className="top_tit">
                            <h1 className="tit_1">회원가입 완료</h1>
                        </div>

                        {/* Success Message */}
                        <div className="message_wrap">
                            <p className="success_message">
                                축하합니다! 회원가입이 성공적으로 완료되었습니다.
                            </p>
                        </div>

                        {/* Button Area */}
                        <div className="board_btn_area">
                            <div className="left_col btn1">
                                <button
                                    className="btn btn_skyblue_h46 w_100"
                                    onClick={handleNext}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EgovSignUpComplete;
