import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import URL from "@/constants/url";

import icoPass from "@/assets/images/ico_pass.png";
import icoMobile from "@/assets/images/ico_mobile.png";

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
        navigate(URL.MYPAGE_CREATE, { state: { signupType } });
    };

    return (
        <div id="container" className="container withdraw">
            <div className="inner">
                <div className="titleWrap type1" data-aos="fade-up" data-aos-duration="1500">
                    <p className="tt1">본인인증</p>
                    <strong className="tt2">사용할 인증을 선택해주세요.</strong>
                </div>
                {/*<div className="topTextBox" data-aos="fade-up" data-aos-duration="1500">
                    <p>회원정보 및 개인형 서비스 이용 기록은 개인정보보호 처리 방침 기준에 따라 삭제됩니다.</p>
                    <p>회원탈퇴시 더 이상 홈페이지 서비스 사용이 불가능하며, K-BIO LabHub 홈페이지에서 탈퇴처리됩니다.</p>
                    <label className="checkBox type1"><small>안내 사항을 모두 확인하였으며 , 이에 동의합니다.</small><input type="checkbox"
                                                                                                        id="agree"
                                                                                                        name="agree"/></label>
                </div>*/}
                <div className="authenBox" data-aos="fade-up" data-aos-duration="1500">
                    <div className="selectBox">
                        <button type="button" className="pass">
                            <figure className="imgBox"><img src={icoPass} alt="pass images"/></figure>
                            <p className="tt">통신사 PASS</p>
                        </button>
                        <button type="button" className="moblie">
                            <figure className="imgBox"><img src={icoMobile} alt="pass images"/></figure>
                            <p className="tt">모바일 신분증</p>
                        </button>
                    </div>
                    <div className="textBox">
                        <p>간편인증을 이용하기 위해서는 [휴대폰 본인확인]이 필요합니다.</p>
                        <p>모바일 신분증앱에서 모바일 신분증을 등록 후 사용할 수 있습니다.</p>
                    </div>
                    <button type="button" className="clickBtn black"><span>뒤로가기</span></button>
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
