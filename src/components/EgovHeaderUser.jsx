import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";

import * as EgovNet from "@/api/egovFetch";

import URL from "@/constants/url";
import CODE from "@/constants/code";
import logo from "@/assets/images/logo.svg";
import { getLocalItem, setLocalItem, getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import Swal from 'sweetalert2';

import '@/css/manager/niceSelect/nice-select.css';
import '@/css/manager/swiper-bundle.min.css';
import '@/css/manager/aos.css';
import '@/css/manager/pretendard.css';
import '@/css/manager/Rubik.css';
import '@/css/manager/reset.css';
import '@/css/manager/user.css';
import '@/css/manager/page.css';

import userJs from "@/js/userCustom";

import logoWhite from "@/assets/images/logo_white.svg";

function EgovHeader() {
  const KAKAO_CLIENT_ID = import.meta.env.VITE_APP_KAKAO_CLIENTID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = import.meta.env.VITE_APP_KAKAO_CALLBACKURL; // Callback URL
  const STATE = import.meta.env.VITE_APP_STATE;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}&reponse_type=code`;
  const GOOGLE_CLIENTID = import.meta.env.VITE_APP_GOOGLE_CLIENTID; // 발급받은 클라이언트 아이디
  const GOOGLE_CALLBACKURL = import.meta.env.VITE_APP_GOOGLE_CALLBACKURL; // 발급받은 클라이언트 아이디

  const NAVER_CLIENT_ID = import.meta.env.VITE_APP_NAVER_CLIENTID; // 발급받은 클라이언트 아이디
  const NAVER_REDIRECT_URI = import.meta.env.VITE_APP_NAVER_CALLBACKURL; // Callback URL
  const NAVER_STATE = import.meta.env.VITE_APP_STATE; //다른 서버와 통신 시 암호화문자
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${NAVER_STATE}&redirect_uri=${NAVER_REDIRECT_URI}`;

  const NaverLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };

  const KakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const GoogleLogin = () => {
    // 구글 로그인 화면으로 이동시키기
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?
		client_id=${GOOGLE_CLIENTID}
		&redirect_uri=${GOOGLE_CALLBACKURL}
		&response_type=code
		&scope=email profile`;
  };


  const navigate = useNavigate();
  const location = useLocation();

  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [userInfo, setUserInfo] = useState({
    id: "",
    password: "default",
    userSe: "USR",
    loginType : "base"
  });

  const [loginVO, setLoginVO] = useState({});

  const [saveIDFlag, setSaveIDFlag] = useState(false);

  const checkRef = useRef();
  const idRef = useRef(null); //id입력 부분에서 엔터키 이벤트 발생 확인
  const passwordRef = useRef(null); //비밀번호 입력 부분

  const KEY_ID = "KEY_ID";
  const KEY_SAVE_ID_FLAG = "KEY_SAVE_ID_FLAG";

  const handleSaveIDFlag = () => {
    setLocalItem(KEY_SAVE_ID_FLAG, !saveIDFlag);
    setSaveIDFlag(!saveIDFlag);
  };

  const handleSignUp = () => {
    const modal = document.querySelector('.loginModal.modalCon');
    if (modal) {
      modal.style.display = 'none';
    }
    navigate(URL.SIGNUP_CHOICE);
  };

  const handleFindPassword = async () => {

    const id = document.querySelector('input[name="pwdid"]').value;
    const name = document.querySelector('input[name="pwdname"]').value;
    const email = document.querySelector('input[name="pwdemail"]').value;

    if (!id || !name || !email) {
      Swal.fire({
        title: "입력 오류",
        text: "아이디, 이름, 이메일을 모두 입력해주세요.",
      });
      return;
    }

    try {
      const findPasswordURL = "/memberApi/findPassword.do";
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, email }),
      };

      // 서버 응답 처리
      await EgovNet.requestFetch(findPasswordURL, reqOptions, function (response) {
        if (response.resultCode === 200) {
          Swal.fire({
            title: "비밀번호 찾기 성공",
            text: "임시 비밀번호가 이메일로 전송되었습니다.",
          }).then(() => {
            const modal = document.querySelector('.findPwd.modalCon');
            if (modal) {
              modal.style.display = 'none';
            }
          });
        } else {
          Swal.fire({
            title: "찾기 실패",
            text: "일치하는 회원 정보가 없습니다. 다시 확인해주세요.",
          });
        }
      });
    } catch (error) {
      console.error("비밀번호 찾기 요청 실패:", error);
      Swal.fire({
        title: "오류 발생",
        text: "서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  const handleFindId = async () => {
    // 유효성 검사: 이름과 이메일 입력 확인
    if (!name || !email) {
      Swal.fire({
        title: "입력 오류",
        text: "이름과 이메일을 모두 입력해주세요.",
      });
      return;
    }

    try {
      const checkIdURL = "/memberApi/findId.do";
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      };

      // 서버 응답 처리
      await EgovNet.requestFetch(checkIdURL, reqOptions, function (response) {
        if (response.resultCode === 200) {
          const userId = response.result.userId;
          if (userId) {
            Swal.fire({
              title: "ID 찾기 성공",
              text: `회원님의 ID는 '${userId}'입니다.`,})
              .then(() => {
                const modal = document.querySelector('.findId.modalCon');
                if (modal) {
                  modal.style.display = 'none';
                }
            });
          } else {
            Swal.fire({
              title: "찾기 실패",
              text: "회원 정보가 없습니다. 다시 확인해주세요.",
            });
          }
        } else {
          Swal.fire({
            title: "찾기 실패",
            text: "회원 정보가 없습니다. 다시 확인해주세요.",
          });
        }
      });
    } catch (error) {
      console.error("ID 찾기 요청 실패:", error);
      Swal.fire({
        title: "오류 발생",
        text: "서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  useEffect(() => {
    let idFlag = getLocalItem(KEY_SAVE_ID_FLAG);
    if (idFlag === null) {
      setSaveIDFlag(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      idFlag = false;
    } else {
      setSaveIDFlag(idFlag);
    }
    if (idFlag === false) {
      setLocalItem(KEY_ID, "");
      checkRef.current.className = "f_chk";
    } else {
      checkRef.current.className = "f_chk on";
    }
  }, []);

  useEffect(() => {
    let data = getLocalItem(KEY_ID);
    if (data !== null) {
      setUserInfo({ id: data, password: "default", userSe: "USR", loginType: "base"});
    }
  }, []);

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFormHandler(e);
    }
  };
  const submitFormHandler = () => {
    if(!idRef.current.value){
      Swal.fire("아이디를 입력해주세요.");
      idRef.current.focus();
      return;
    }else if(!passwordRef.current.value){
      Swal.fire("비밀번호를 입력해주세요.");
      passwordRef.current.focus();
      return;
    }

    const loginUrl = "/loginApi/loginAction";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userInfo),
    };

    EgovNet.requestFetch(loginUrl, requestOptions, (resp) => {
      if(resp.resultCode != "200"){
        Swal.fire(resp.resultMessage);
        return;
      }else{
        console.log("resp",resp)
        setSessionItem("loginUser", {userSn : resp.result.userSn, name : resp.result.userName, id : resp.result.userId, userSe : resp.result.userSe});
        // setSessionItem("userName", resp.userName);
        setSessionItem("jToken", resp.result.jToken);
        setSessionItem("userSn", resp.result.userSn);
        //if (saveIDFlag) setLocalItem(KEY_ID, resultVO?.id);
        if (saveIDFlag) setLocalItem(KEY_ID, resp.result.userId);
        Swal.fire("로그인 성공");
        $('#id').val("");
        $('#password').val("");
        $('.modalCon').removeClass('open');
        $('html, body').css('overflow', 'visible');
        navigate("/");
      }
    });
  };

  const logInHandler = () => {
    // 로그인 정보 없을 시
    navigate(URL.LOGIN);
    // PC와 Mobile 열린메뉴 닫기
    document.querySelector(".all_menu.WEB").classList.add("closed");
    document.querySelector(".btnAllMenu").classList.remove("active");
    document.querySelector(".btnAllMenu").title = "전체메뉴 닫힘";
    document.querySelector(".all_menu.Mobile").classList.add("closed");
  };
  const logOutHandler = () => {
    const logOutUrl = "/loginApi/logoutAction";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body : JSON.stringify({userSn : sessionUserSn})
    };

    EgovNet.requestFetch(logOutUrl, requestOptions, function (resp) {
      if(resp.resultCode == "200"){
        removeSessionItem("loginUser");
        removeSessionItem("jToken");
        removeSessionItem("userSn");
        Swal.fire("로그아웃되었습니다!");
        navigate(URL.MAIN);
      }
    });
  };

  console.log("------------------------------EgovHeader [End]");
  console.groupEnd("EgovHeader");

  //자동 로그아웃
  const logoutTimer = useRef(null);
  const idleTimeLimit = 30 * 60 * 1000;

  const resetTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    // 일정 시간이 지나면 로그아웃 처리
    logoutTimer.current = setTimeout(() => {
      handleLogout();
    }, idleTimeLimit);
  };

  const handleLogout = () => {
    Swal.fire('30분 이상 액션이 없어<br/>자동 로그아웃 처리됩니다.');
    logOutHandler();
  };

  useEffect(() => {
    // 이벤트 리스너 추가
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer) );
    // 초기 타이머 설정
    resetTimer();

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 및 타이머 초기화
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    userJs();
  });

  return (
      // <!-- header -->
      <header>
        <style>{`
                header .modalCon {display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 150;}
                header .modalCon.open {display: block; animation: fadeIn 1s ease both;}
                header .modalCon .bg {position: absolute; width: 100%; height: 100%; top: -100%; left: 0; background: rgba(0, 0, 0, .5); transition: .4s ease; backdrop-filter: blur(8px);}
                header .modalCon.open .bg {top: 0 !important;}
                header .modalCon .m-inner {width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;}
                header .modalCon .boxWrap {position: relative; background: #fff; opacity: 0; transform: scale(.8); transition: .5s ease; max-width: 840px; width: 90%; max-height: calc(100% - 4rem); height: auto; border-radius: 1rem;}
                header .modalCon.open .boxWrap {opacity: 1; transition-delay: .3s; transform: none;}
                header .modalCon .boxWrap .top {position: absolute; top: 0; left: 0; width: 100%; padding: 1.35rem; padding-bottom: .9rem; display: flex; gap: 1rem; justify-content: space-between; box-sizing: border-box; z-index: 5;}
                header .modalCon .boxWrap .top .title {font-size: 1.1rem; font-weight: 700;}
                header .modalCon .boxWrap .top .close {flex: none; cursor: pointer;}
                header .modalCon .boxWrap .top .close .icon {width: 24px; height: 24px; background: url(@/assets/images/ico_close.svg) no-repeat center / contain; transition: .5s ease;}
                header .modalCon .boxWrap .box {width: 100%; height: auto; padding: 1.5rem; box-sizing: border-box; overflow-y: auto; display: flex; gap: .5rem; flex-direction: column; max-height: calc(100vh - 7.5rem);}
                header .modalCon .boxWrap .top + .box {margin-top: 3.5rem; padding-top: 0;}
                header .modalCon .boxWrap .box .bot {display: flex; flex-direction: column; gap: .9rem;}
                header .modalCon .boxWrap .tabWrap {margin-bottom: 1.35rem;}
                header .modalCon .boxWrap .buttonBox {display: flex; justify-content: center; gap: 8px;}
                header .modalCon .boxWrap .clickBtn {width: 100px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; background: var(--mainColor); box-sizing: border-box;}
                header .modalCon .boxWrap .clickBtn.white {background: #fff; border: 1px solid #999999; color: #999999;}
                header .modalCon .boxWrap .clickBtn.gray {background: #999;}
                header .modalCon .boxWrap .clickBtn.black {background: var(--black);}
                header .modalCon .boxWrap .clickBtn.red {background: var(--pointColor2);}
                
                header .inputBox.type2 {position: relative;}
                header .inputBox.type2 .tt1 {position: absolute; color: #666; font-size: .8rem; font-weight: 600; top: .8rem; left: .9rem; pointer-events: none;}
                header .inputBox.type2 .input {display: block; width: 100%; height: 4.1rem; border-radius: .9rem; background: #F6F6F6; padding: .7rem .9rem; box-sizing: border-box; padding-top: 2rem;}
                header .inputBox.type2.noText .input {padding-bottom: 0; padding-top: 0; display: flex; align-items: center;}
                header .inputBox.type2 .input.flexinput {display: flex; gap: .5rem; align-items: center;}
                header .inputBox.type2 .input.flexinput > *:not(span, .btn) {width: 100%;}
                header .inputBox.type2 .input.flexinput > span {flex: none;}
                header .inputBox.type2 input {width: 100%; box-sizing: border-box; font-size: .9rem; background: transparent;}
                header .inputBox.type2 .nice-select {background: transparent; border: none; padding: 0 1rem}
                header .inputBox.type2.white .input {background: #fff;}
                header .inputBox.type2 .input .btn {top: auto; bottom: .6rem; right: 1rem; transform: none;}
                header .inputBox.type2 .checkWrap {height: 1.5rem;}
                header .checkWrap {display: flex; flex-wrap: wrap; gap: .6rem;}
                header .checkBox {display: flex; align-items: center; gap: 8px;}
                header .checkBox label {display: flex; gap: 6px; align-items: center;}
                header .checkBox label input {position: relative; width: 20px; height: 20px; -webkit-appearance: none; background: #DDDDDD; border-radius: 50%; flex: none; transition: .5s ease;}
                header .checkBox label input:checked {background: var(--mainColor);}
                header .checkBox label input:before {content: ""; position: absolute; width: 100%; height: 100%; background: url(@/assets/images/ico_check_gray.svg) no-repeat center / contain;}
                header .checkBox label input:checked:before {background-image: url(@/assets/images/ico_check_white.svg)}
                header .checkBox label small {transition: .5s ease; position: relative; font-size: .8em; font-weight: 500; color: #555;}
                header .checkBox.type1 input {flex: none; position: relative; width: 20px; height: 20px; font-size: .9rem; -webkit-appearance: none; border: 1px solid #ddd; border-radius: 4px; transition: .5s ease;}
                header .checkBox.type1 input:checked {background: var(--black); border-color: var(--black);}
                header .checkBox.type1 input:checked:before {content: ""; position: absolute; width: 100%; height: 100%; background: url(@/assets/images/ico_check_white.svg) no-repeat center / contain;}
                header .checkBox.type1  small {color: #111; transition: .5s ease; font-weight: 500; font-size: .9rem;}
                header .checkBox.type2 input {flex: none; position: relative; width: 24px; height: 24px; font-size: .9rem; -webkit-appearance: none; border: 1px solid #ddd; border-radius: 8px; transition: .5s ease;}
                header .checkBox.type2 input::before {content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; display: flex; justify-content: center; align-items: center; border-radius: 3px; background: #ddd;}
                header .checkBox.type2 input:checked {border-color: var(--black);}
                header .checkBox.type2 input:checked::before {background: var(--black)}
                header .checkBox.type2 input + small {color: #555; transition: .5s ease; font-weight: 500; font-size: .8rem;}
                header .checkBox.type2 input:checked + small {color: var(--black)}
                header .checkBox.type3 input {flex: none; position: relative; width: 18px; height: 18px; font-size: .9rem; -webkit-appearance: none; border: 1px solid #ddd; border-radius: 50%; transition: .5s ease;}
                header .checkBox.type3 input::before {content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; display: flex; justify-content: center; align-items: center; border-radius: 50%; background: #ddd;}
                header .checkBox.type3 input:checked {border-color: var(--black);}
                header .checkBox.type3 input:checked::before {background: var(--black)}
                header .checkBox.type3 input + small {color: #555; transition: .5s ease; font-weight: 500; font-size: .8rem;}
                header .checkBox.type3 input:checked + small {color: var(--black)}
                `}
        </style>
        <div className="hInner">
          <div className="hTop inner">
            <div className="logBox">
              {/* 로그아웃 : 로그인 정보 있을때 */}
              {sessionUserId && (
                  <>
                    <span className="person">{sessionUserName} </span> 님이,{" "}
                    {sessionUserSe}로 로그인하셨습니다.
                    {sessionUserSe === "UDR" && (
                        <NavLink
                            to={URL.MEMBER_MYPAGE_MODIFY}
                        >
                          <button type="button" className="myPage"><span>마이페이지</span></button>
                        </NavLink>
                    )}
                    <button onClick={logOutHandler} className="btn">
                      로그아웃
                    </button>
                  </>
              )}
              {/* 로그인 : 로그인 정보 없을 때 */}
              {!sessionUserId && (
                  <>
                    {/*<NavLink
                        to={URL.LOGIN}
                    >*/}
                    <button type="button" className="loginBtn"><span>로그인</span></button>
                    {/*</NavLink>*/}
                    <NavLink
                        to={URL.SIGNUP_CHOICE}
                    >
                      <button type="button" className="signUpBtn"><span>회원가입</span></button>
                    </NavLink>
                  </>
              )}
            </div>
            <div className="langBox">
              <div className="itemBox">
                <select>
                  <option value="0">KR</option>
                  <option value="1">EN</option>
                </select>
              </div>
            </div>
          </div>
          <div className="hBot inner">
            <div className="top">
              <h1><a href="/"><img src={logoWhite} alt="images"/><span className="hidden">K BIO LabHub</span></a>
              </h1>
              <nav className="navBox">
                <ul className="dep">
                  <li><a href="#"><p>기관소개</p></a></li>
                  <li><a href="#"><p>컨설팅</p></a></li>
                  <li><a href="#"><p>커뮤니티</p></a></li>
                  <li><a href="#"><p>k-BioLabHub</p></a></li>
                </ul>
              </nav>
              <div className="rightBox">
                <button type="button" className="searchBtn">
                  <div className="icon"></div>
                </button>
                <button type="button" className="sitemapBtn">
                  <div className="icon"></div>
                </button>
              </div>
            </div>
            <div className="bot">
              <ul className="lnbBox">
                <li className="home">
                  <a href="/">
                    <div className="icon"></div>
                    <span>홈</span>
                  </a>
                </li>
                <li>
                  <p>커뮤니티</p>
                </li>
              </ul>
              <h2 className="pageTitle">커뮤니티</h2>
            </div>
          </div>
        </div>
        <div className="loginModal modalCon">
          <div className="bg"></div>
          <div className="m-inner">
            <div className="boxWrap">
              <div className="close">
                <div className="icon"></div>
              </div>
              <form className="box">
                <figure className="logo"><img src={logo} alt="K k-Bio LabHub"/></figure>
                <ul className="inputWrap">
                  <li className="inputBox type2">
                    <span className="tt1">아이디</span>
                    <label className="input">
                      <input
                          type="text"
                          name="id"
                          id="id"
                          placeholder="아이디"
                          title="아이디"
                          value={userInfo?.id}
                          onChange={(e) =>
                              setUserInfo({...userInfo, id: e.target.value})
                          }
                          ref={idRef}
                          onKeyDown={activeEnter}
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
                <div className="stateBtn">
                  <label className="checkBox type2 f_chk" ref={checkRef}>
                    <input
                        type="checkbox"
                        name="login_state"
                        id="saveid"
                        onChange={handleSaveIDFlag}
                        checked={saveIDFlag}
                    />
                    <small>로그인 상태 유지</small>
                  </label>
                </div>
                <button type="button" className="loginBtn" onClick={submitFormHandler}><span>로그인</span></button>
                <ul className="botBtnBox">
                  <li>
                    <button type="button" className="idBtn"><span>아이디 찾기</span></button>
                  </li>
                  <li>
                    <button type="button" className="pwBtn"><span>비밀번호 찾기</span></button>
                  </li>
                  <li>
                    <button type="button" className="signUp" onClick={handleSignUp}><span>회원가입</span></button>
                  </li>
                </ul>
                <div className="snsLoginBox">
                  <div className="or"><p>or</p></div>
                  <ul className="list">
                    <li className="kakao" onClick={KakaoLogin}><a href="#">
                      <div className="icon"></div>
                    </a></li>
                    <li className="google" onClick={GoogleLogin}><a href="#">
                      <div className="icon"></div>
                    </a></li>
                    <li className="naver" onClick={NaverLogin}><a href="#">
                      <div className="icon"></div>
                    </a></li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="findId modalCon">
          <div className="bg"></div>
          <div className="m-inner">
            <div className="boxWrap">
              <div className="close">
                <div className="icon"></div>
              </div>
              <form className="box">
                <figure className="logo"><img src={logo} alt="K k-Bio LabHub"/></figure>
                <ul className="inputWrap">
                  <li className="inputBox type2">
                    <span className="tt1">이름</span>
                    <label className="input">
                      <input
                          type="text"
                          name="name"
                          title="이름"
                          placeholder="이름"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                    </label>
                  </li>
                  <li className="inputBox type2">
                    <span className="tt1">이메일</span>
                    <label className="input">
                      <input
                          type="text"
                          name="email"
                          title="이메일"
                          placeholder="이메일"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                  </li>
                </ul>
                <button type="button" className="loginBtn" onClick={handleFindId}><span>아이디 찾기</span></button>
              </form>
            </div>
          </div>
        </div>
        <div className="findPwd modalCon">
          <div className="bg"></div>
          <div className="m-inner">
            <div className="boxWrap">
              <div className="close">
                <div className="icon"></div>
              </div>
              <form className="box">
                <figure className="logo"><img src={logo} alt="K k-Bio LabHub"/></figure>
                <ul className="inputWrap">
                  <li className="inputBox type2">
                    <span className="tt1">아이디</span>
                    <label className="input">
                      <input
                          type="text"
                          name="pwdid"
                          title="아이디"
                          placeholder="아이디"
                      />
                    </label>
                  </li>
                  <li className="inputBox type2">
                    <span className="tt1">이름</span>
                    <label className="input">
                      <input
                          type="text"
                          name="pwdname"
                          title="이름"
                          placeholder="이름"
                      />
                    </label>
                  </li>
                  <li className="inputBox type2">
                    <span className="tt1">이메일</span>
                    <label className="input">
                      <input
                          type="text"
                          name="pwdemail"
                          title="이메일"
                          placeholder="이메일"
                      />
                    </label>
                  </li>
                </ul>
                <ul className="list">
                  <li style={{fontSize: '0.7rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                    비밀번호의 경우 가입된 이메일로 임시비밀번호가 발송됩니다.<br/>
                    <br/>SNS회원은 가입한 홈페이지에서 아이디 및 비밀번호 찾기를 진행 바랍니다.
                  </li>
                </ul>
                <button type="button" className="loginBtn" onClick={handleFindPassword}><span>비밀번호 찾기</span></button>
              </form>
            </div>
          </div>
        </div>
      </header>
  );
}

export default EgovHeader;
