import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeft from "@/components/manager/ManagerLeftMember";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import base64 from 'base64-js';
import { getSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";


const EgovMyPage = () => {
    const location = useLocation();
    const checkRef = useRef([]);
    const navigate = useNavigate();
    const sessionUser = getSessionItem("loginUser");
    const sessionUserName = sessionUser?.name;
    const sessionUserSn = sessionUser?.userSn;

    const [userInfo, setUserInfo] = useState({
        id: sessionUser?.id,
        password: "default",
        userSe: "USR",
    });

    const idRef = useRef(null); //id입력 부분에서 엔터키 이벤트 발생 확인
    const passwordRef = useRef(null); //비밀번호 입력 부분

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            checkUser(e);
        }
    };


    const checkUser =() => {
        if(!passwordRef.current.value){
            Swal.fire("비밀번호를 입력해주세요.");
            passwordRef.current.focus();
            return;
        }
        
        const checkUrl = "/memberApi/checkUser.do";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(userInfo),
        };

        EgovNet.requestFetch(checkUrl, requestOptions, (resp) => {
            if(resp.resultCode != "200") {
                Swal.fire(resp.resultMessage);
                return;
            }else{
                navigate(URL.MEMBER_MYPAGE_IDENTITY, {
                    state: {
                        menuSn: location.state?.menuSn,
                        menuNmPath: location.state?.menuNmPath,
                    },
                });
            }
        });
    }

    return (
        <div id="container" className="container withdraw step2">
            <div className="inner">
                <CommonSubMenu/>

                <div className="inner2" data-aos="fade-up" data-aos-duration="1500">
                    <div className="titleWrap type1">
                        <p className="tt1">회원 탈퇴</p>
                        <strong className="tt2">K-BIO LabHub회원탈퇴를 진행하려면 가입하신 방법에 따라 “실명확인” 후 회원탈퇴가 가능합니다. <br/>입력한 정보는
                            회원탈퇴
                            이외의 목적으로 사용하지 않습니다.</strong>
                    </div>
                        <ul className="listBox" style={{width : "200%"}}>
                            <li className="inputBox type2 textBox">
                                <p className="title">아이디</p>
                                <p className="text">
                                    <input
                                        type="text"
                                        name="id"
                                        id="id"
                                        placeholder="아이디"
                                        title="아이디"
                                        value={sessionUser?.id}
                                        onKeyDown={activeEnter}
                                        readOnly
                                    />
                                </p>
                            </li>
                            <li className="inputBox type2">
                                <label className="tt1">비밀번호 입력</label>
                                <div className="input">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="비밀번호"
                                        title="비밀번호"
                                        onChange={(e) =>
                                            setUserInfo({...userInfo, password: e.target.value})
                                        }
                                        ref={passwordRef}
                                        onKeyDown={activeEnter}
                                    />
                                </div>
                            </li>
                        </ul>
                        <button type="button" className="clickBtn" onClick={checkUser}>
                            <span>확인</span>
                        </button>
                </div>
            </div>
        </div>
    )
        ;
};

export default EgovMyPage;
