import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import URL from "@/constants/url";
import SnsNaverBt from "@/components/sns/SnsNaverBt";
import SnsKakaoBt from "@/components/sns/SnsKakaoBt";
import SnSGoogleBt from "@/components/sns/SnsGoogleBt";
import AOS from "aos";

const MemberSignupChoice = () => {
    const navigate = useNavigate();

    const handleNext = (type) => {
        if (type !== "naver") {
            navigate(URL.TERMS_AGREEMENT, { state: { signupType: type } });
        }
    };

    useEffect(() => {
        AOS.init();
    }, []);


    return (
        <div id="container" className="container join">
            <div className="inner">
                <div className="titleWrap type1" data-aos="fade-up" data-aos-duration="1500">
                    <p className="tt1">회원가입</p>
                    <strong className="tt2">K-바이오 랩허브 홈페이지 오신걸 환영합니다.</strong>
                </div>

                {/* Layout */}
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
                                        <button type="button">
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
    );
};

export default MemberSignupChoice;
