import React from "react";
import { useNavigate } from "react-router-dom";
import URL from "@/constants/url";

const EgovSignupChoice = () => {
    const navigate = useNavigate();

    const handleNext = (type) => {
        navigate(URL.TERMS_AGREEMENT, { state: { signupType: type } });
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
                        <li>회원가입 선택</li>
                    </ul>
                </div>

                {/* Layout */}
                <div className="layout">
                    <div className="contents JOIN_TYPE" id="contents">
                        {/* Header */}
                        <div className="top_tit">
                            <h1 className="tit_1">회원가입</h1>
                        </div>

                        {/* Centered Instructions */}
                        <p className="mid_text" style={{ textAlign: "center", fontSize: "20px", marginBottom: "40px" }}>
                            K-바이오 랩허브 홈페이지에 오신 것을 환영합니다.​
                        </p>

                        {/* Signup Options */}
                        <div className="signup_choice_wrap" style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
                            {/* General Signup */}
                            <div className="signup_option">
                                <h2 className="option_title">홈페이지 회원</h2>
                                <p className="option_description">
                                    K-바이오 랩허브 홈페이지 회원으로 가입신청을 진행합니다.
                                </p>
                                <button
                                    className="btn_general"
                                    onClick={() => handleNext("general")}
                                >
                                    가입하기
                                </button>
                            </div>

                            {/* SNS Signup */}
                            <div className="signup_option">
                                <h2 className="option_title">SNS 회원</h2>
                                <p className="option_description">
                                    아래 SNS 계정으로 가입 신청하고 K-바이오 랩허브 홈페이지에서 로그인합니다.
                                </p>
                                <div className="sns_buttons">
                                    <button className="btn_naver" onClick={() => handleNext("naver")}>
                                        <span className="sns_icon">N</span> 네이버 아이디 로그인
                                    </button>
                                    <button className="btn_google" onClick={() => handleNext("google")}>
                                        <span className="sns_icon">G</span> 구글 아이디 로그인
                                    </button>
                                    <button className="btn_kakao" onClick={() => handleNext("kakao")}>
                                        <span className="sns_icon">K</span> 카카오톡 로그인
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline CSS for Layout and Buttons */}
            <style jsx>{`
                .signup_choice_wrap {
                    margin-top: 30px;
                }
                .signup_option {
                    width: 300px;
                    height: 300px; /* 카드 크기 증가 */
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .option_title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .option_description {
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .btn_general {
                    width: 100%;
                    background-color: #f06292;
                    color: white;
                    border: none;
                    padding: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    border-radius: 5px;
                }
                .btn_general:hover {
                    background-color: #ec407a;
                }
                .sns_buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 8px; /* 간격 줄이기 */
                }
                .btn_naver,
                .btn_google,
                .btn_kakao {
                    width: 100%;
                    padding: 8px; /* 버튼 높이 줄이기 */
                    font-size: 14px; /* 글씨 크기 줄이기 */
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn_naver {
                    background-color: #00c73c;
                    color: white;
                }
                .btn_google {
                    background-color: #4285f4;
                    color: white;
                }
                .btn_kakao {
                    background-color: #fee500;
                    color: black;
                }
                .sns_icon {
                    font-size: 16px; /* 아이콘 크기 줄이기 */
                    font-weight: bold;
                    margin-right: 6px;
                }
            `}</style>
        </div>
    );
};

export default EgovSignupChoice;
