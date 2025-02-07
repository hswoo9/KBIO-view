import React from "react";
import { useNavigate } from "react-router-dom";
import URL from "@/constants/url";

const EgovSignUpComplete = () => {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate(URL.MAIN);
    };

    return (
        <div className="container withdraw join_step">
            <div className="inner">
                {/* Step Indicator */}
                <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                    <li>
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
                    <li className="active">
                        <div className="num"><p>4</p></div>
                        <p className="text">신청완료</p>
                    </li>
                </ul>

                <div className="titleWrap type1" data-aos="fade-up" data-aos-duration="1500">
                    <p className="tt1">회원가입 완료</p>
                    <strong className="tt2">축하합니다! 회원가입이 성공적으로 완료되었습니다.</strong>
                </div>

                <div className="titleWrap type1" data-aos="fade-up" data-aos-duration="1500">
                    <p className="success_message">
                        이제 로그인 후 서비스를 이용하실 수 있습니다.
                    </p>
                </div>

                <div className="buttonBox">
                    <button type="button" className="clickBtn black" onClick={handleNext}>
                        <span>확인</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EgovSignUpComplete;
