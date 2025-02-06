import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import URL from "@/constants/url";
import passImage from '@/assets/images/ico_pass.png';
import mobileImage from '@/assets/images/ico_mobile.png';

const EgovIdentityVerification = () => {
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [signupType, setSignupType] = useState("");

    useEffect(() => {
        if (location.state?.signupType) {
            setSignupType(location.state.signupType);
        }
    }, [location.state]);


    const handlePrev = (type) => {
        navigate(URL.TERMS_AGREEMENT, { state: { signupType: type } });
    }
    const handleNext = () => {
        navigate(URL.MYPAGE_CREATE, { state: { signupType } });
    };

    return (
        <div id="container" className="container withdraw join_step">
            <div className="inner">
                <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                    <li>
                        <div className="num"><p>1</p></div>
                        <p className="text">약관동의</p>
                    </li>
                    <li className="active">
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
                    <p className="tt1">본인 인증</p>
                    <strong className="tt2">사용할 인증을 선택해주세요</strong>
                </div>

                <div className="authenBox" data-aos="fade-up" data-aos-duration="1500">
                    <div className="selectBox">
                        <button type="button" className="pass" onClick={handleNext}>
                            <figure className="imgBox">
                                <img src={passImage} alt="pass images"/>
                            </figure>
                            <p className="tt">통신사 PASS</p>
                        </button>
                        <button type="button" className="moblie" onClick={handleNext}>
                            <figure className="imgBox">
                                <img src={mobileImage} alt="mobile ID"/>
                            </figure>
                            <p className="tt">모바일 신분증</p>
                        </button>
                    </div>
                    <div className="textBox">
                        <p>간편인증을 이용하기 위해서는 [휴대폰 본인확인]이 필요합니다.</p>
                        <p>모바일 신분증앱에서 모바일 신분증을 등록 후 사용할 수 있습니다.</p>
                    </div>
                    <button type="button" className="clickBtn black" onClick={() => handlePrev("general")}>
                        <span>뒤로가기</span></button>
                </div>
            </div>
        </div>
        /*<div className="container">
            <div className="c_wrap">
                {/!* Location *!/}
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

                {/!* Layout *!/}
                <div className="layout">
                    <div className="contents VERIFICATION" id="contents">
                        {/!* Header *!/}
                        <div className="top_tit">
                            <h1 className="tit_1">본인인증</h1>
                            <p className="desc">
                                회원가입을 위해 본인인증을 진행해주세요.
                            </p>
                        </div>

                        {/!* Verification *!/}
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

                        {/!* Button Area *!/}
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
        </div>*/
)
    ;
};

export default EgovIdentityVerification;
