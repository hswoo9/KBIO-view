import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import base64 from 'base64-js';
import { getSessionItem } from "@/utils/storage";
import passImage from '@/assets/images/ico_pass.png';
import mobileImage from '@/assets/images/ico_mobile.png';
import { removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
const MemberMyPageIdentity = () => {
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const sessionUserName = sessionUser?.name;
    const sessionUserSn = sessionUser?.userSn;


    const handleImageClick = () => {
        if (!isVerified) {
            Swal.fire("안내 사항에 동의해야 합니다.");
            return;
        }
        const CancelMemberUrl = `/memberApi/myPageCancelMember`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userSn: sessionUserSn 
            }),
        };

        EgovNet.requestFetch(CancelMemberUrl, requestOptions, (resp) => {
            if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                removeSessionItem("loginUser");
                Swal.fire("회원탈퇴가 완료되었습니다.");
                navigate(URL.MEMBER_MYPAGE_COMPLETE_CANCEL, {
                    state: {
                        menuSn: location.state?.menuSn,
                        menuNmPath: location.state?.menuNmPath
                    }
                });
            } else {
                Swal.fire("ERR : " + resp.resultMessage);
            }
        });
    };


    const handlePrev = (type) => {
        navigate(URL.MEMBER_MYPAGE_CANCEL);
    }

    return (
        <div id="container" className="container withdraw join_step">
            <div className="inner">
                <CommonSubMenu/>
               
                <div className="inner">
                    <div className="titleWrap type1" data-aos="fade-up" data-aos-duration="1500">
                        <p className="tt1">안내사항</p>
                        <strong className="tt2">회원탈퇴를 신청하기전, 다음 내용을 꼭 확인해주세요.</strong>
                    </div>
                    <div className="topTextBox" data-aos="fade-up" data-aos-duration="1500">
                        <p>회원정보 및 개인형 서비스 이용 기록은 개인정보보호 처리 방침 기준에 따라 삭제됩니다.</p>
                        <p>회원탈퇴시 더 이상 홈페이지 서비스 사용이 불가능하며, K-BIO LabHub 홈페이지에서 탈퇴처리됩니다.</p>
                        <label className="checkBox type1"><small>안내 사항을 모두 확인하였으며 , 이에 동의합니다.</small><input
                            type="checkbox"
                            id="agree"
                            name="agree"
                            checked={isVerified}
                            onChange={() => setIsVerified(!isVerified)}
                        /></label>
                    </div>
                    <div className="authenBox" data-aos="fade-up" data-aos-duration="1500">
                        <div className="selectBox">
                            <button type="button" className="pass" onClick={handleImageClick}>
                            <figure className="imgBox"><img src={passImage} alt="pass images"/>
                                </figure>
                                <p className="tt">통신사 PASS</p>
                            </button>
                            <button type="button" className="moblie" onClick={handleImageClick}>
                                <figure className="imgBox"><img src={mobileImage} alt="pass images"/>
                                </figure>
                                <p className="tt">모바일 신분증</p>
                            </button>
                        </div>
                        <div className="textBox">
                            <p>간편인증을 이용하기 위해서는 [휴대폰 본인확인]이 필요합니다.</p>
                            <p>모바일 신분증앱에서 모바일 신분증을 등록 후 사용할 수 있습니다.</p>
                        </div>
                        <NavLink to={URL.MEMBER_MYPAGE_CANCEL}
                                 style={{width: "100%"}}
                                 state={{
                                     menuSn : location.state?.menuSn,
                                     menuNmPath : location.state?.menuNmPath
                                 }}>
                        <button type="button" className="clickBtn black"><span>뒤로가기</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
};

export default MemberMyPageIdentity;
