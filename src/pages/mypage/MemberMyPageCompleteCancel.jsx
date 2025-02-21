import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { getSessionItem } from "@/utils/storage";
import { removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import image from "@/assets/images/user_withdraw_img.jpg"
const MemberMyPageCompleteCancel = () => {
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const sessionUserName = sessionUser?.name;
    const sessionUserSn = sessionUser?.userSn;

    return (
        <div id="container" className="container withdraw step3">
            <div className="inner">
                <CommonSubMenu/>
                    <div className="inner2" data-aos="fade-up" data-aos-duration="1500">
                        <figure className="imgBox"><img src={image} alt="image"/></figure>
                        <div className="textBox">
                            <strong className="title">회원탈퇴가 완료 되었습니다.</strong>
                            <p className="text">K-Bio LabHub를 이용해 주셔서 진심으로 감사드립니다. <br/>더 좋은 서비스로 발전해서 다시 만날 날을 기다리겠습니다.
                            </p>
                        </div>
                        <NavLink
                                to={URL.MAIN}
                                className="clickBtn"
                                 style={{width: "100%"}}
                                 state={{
                                     menuSn: location.state?.menuSn,
                                     menuNmPath: location.state?.menuNmPath
                                 }}>
                            <button type="button" className="clickBtn"><span>확인</span></button>
                        </NavLink>
                </div>
            </div>
    </div>
    );
};

export default MemberMyPageCompleteCancel;
