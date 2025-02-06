import React from "react";
import { useNavigate } from "react-router-dom";
import URL from "@/constants/url";
import SnsNaverBt from "@/components/sns/SnsNaverBt";
import SnsKakaoBt from "@/components/sns/SnsKakaoBt";
import SnSGoogleBt from "@/components/sns/SnsGoogleBt";

const MemberSignupChoice = () => {
    const navigate = useNavigate();

    const handleNext = (type) => {
        if (type !== "naver") {
            navigate(URL.TERMS_AGREEMENT, { state: { signupType: type } });
        }
    };

    return (
        <div id="container" className="container join">
            <div className="inner">
                <div className="titleWrap" data-aos="fade-up" data-aos-duration="1500">
                    <p className="tt1">회원가입</p>
                    <strong className="tt2">K-바이오 랩허브 홈페이지 오신걸 환영합니다.</strong>
                </div>

                {/* Layout */}
                <div className="layout">
                    <div className="contents JOIN_TYPE" id="contents">

                        <div className="boxWrap">
                            <div className="box box01" data-aos="fade-left" data-aos-duration="1500">
                                <strong className="tt1">홈페이지 회원</strong>
                                <p className="tt2">K-바이오 랩허브 홈페이지 회원으로 <br/>가입신청을 진행합니다</p>
                                <button
                                    className="clickBtn black"
                                    onClick={() => handleNext("general")}
                                >
                                    가입하기
                                </button>
                            </div>

                            <div className="box box02" data-aos="fade-right" data-aos-duration="1500">
                                <strong className="tt1">SNS 회원</strong>
                                <p className="tt2">
                                    SNS 아이디로 가입 신청하고 K-바이오 랩허브 <br/>홈페이지에서 로그인 합니다.
                                </p>
                                <ul className="buttonBox" style={{marginBottom: "0",}}>
                                    <li className="naver">
                                        <SnsNaverBt
                                            render={() => (
                                                <button type="button">
                                                    <div className="icon"></div>
                                                    <p style={{margin: 0, textAlign: "center"}}>네이버 아이디 로그인</p>
                                                </button>
                                            )}
                                        />
                                    </li>
                                    <li className="google">
                                        <SnSGoogleBt
                                            render={() => (
                                                <button type="button" onClick={() => handleNext("google")}>
                                                    <div className="icon"></div>
                                                    <p style={{margin: 0, textAlign: "center"}}>구글 아이디 로그인</p></button>
                                            )}
                                        />
                                    </li>
                                    <li className="kakao">
                                        <SnsKakaoBt
                                            render={() => (
                                                <button type="button"  onClick={() => handleNext("kakao")}>
                                                    <div className="icon"></div>
                                                    <p style={{margin: 0, textAlign: "center"}}>카카오 아이디 로그인</p>
                                                </button>
                                            )}
                                        />
                                    </li>
                                </ul>
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

export default MemberSignupChoice;
