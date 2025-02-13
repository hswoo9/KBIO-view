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
        console.log("User Info: ", userInfo);
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
                console.log("resp",resp)
                navigate(URL.MEMBER_MYPAGE_IDENTITY);
            }
        });
    }

    return (
        <div id="container" className="container ithdraw join_step">
            <div className="inner">
                {/* Step Indicator */}
                <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_MODIFY} >
                            <div className="num"><p>1</p></div>
                            <p className="text">회원정보수정</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING} >
                            <div className="num"><p>2</p></div>
                            <p className="text">컨설팅의뢰 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE} >
                            <div className="num"><p>3</p></div>
                            <p className="text">간편상담 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_DIFFICULTIES} >
                            <div className="num"><p>4</p></div>
                            <p className="text">애로사항 내역</p>
                        </NavLink>
                    </li>
                    <li className="active">
                        <NavLink to={URL.MEMBER_MYPAGE_CANCEL} >
                            <div className="num"><p>5</p></div>
                            <p className="text">회원탈퇴</p>
                        </NavLink>
                    </li>
                </ul>

                <div className="titleWrap type1" data-aos="fade-up" data-aos-duration="1500">
                    <strong className="tt2">회원 탈퇴</strong>
                    <p className="tt1">K-BIO LabHub회원탈퇴를 진행하려면 가입하신 방법에 따라 “실명확인” 후 회원탈퇴가 가능합니다.
                        <br/>입력한 정보는 회원탈퇴 이외의 목적으로 사용하지 않습니다.</p>
                </div>
                <div className="boxWrap">
                    <div className="close">
                        <div className="icon"></div>
                    </div>
                    <form className="box">
                        <ul className="inputWrap" style={{width: "30%", display: "block", margin: "0 auto"}}>
                            <li className="inputBox type2" style={{marginBottom: "15px"}}>
                                <span className="tt1">아이디</span>
                                <label className="input">
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
                                </label>
                            </li>
                            <li className="inputBox type2">
                                <span className="tt1">비밀번호</span>
                                <label className="input">
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
                                </label>
                            </li>
                        </ul>
                        <div className="buttonBox" style={{ width: "20%"}}>
                            <button type="button" className="clickBtn black" onClick={checkUser} style={{ marginTop:"45px"}}>
                                <span>확인</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
)
;
};

export default EgovMyPage;
