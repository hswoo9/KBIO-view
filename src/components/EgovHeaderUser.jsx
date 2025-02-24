import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";

import * as EgovNet from "@/api/egovFetch";
import * as ComScript from "@/components/CommonScript";
import {getMenu, getMenuOnTree } from "@/components/CommonComponents";
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
import '@/css/manager/userCustom.css';
import '@/css/manager/page.css';

import userJs from "@/js/userCustom";

import logoWhite from "@/assets/images/logo_white.svg";
import {useWebSocket} from "../utils/WebSocketProvider.jsx";
import {getUserMsgTopList} from "./CommonComponents.jsx";
import moment from "moment";

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
  const userSn = getSessionItem("userSn");
  const { userMsgTopList, setUserMsgTopList } = useWebSocket();
  const [msgHtml, setMsgHtml] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [userInfo, setUserInfo] = useState({
    id: "",
    password: "default",
    userSe: "USR",
    loginType : "base"
  });

  const [loginVO, setLoginVO] = useState({});
  const [saveIDFlag, setSaveIDFlag] = useState(false);

  const [siteMapMenu, setSiteMapMenu] = useState([]);

  /* 알림창 관련 */
  const [isToggled, setIsToggled] = useState(false);
  const handleToggle = () => {
    setIsToggled(prevState => !prevState);
    document.getElementById("alarmDot").style.display = "none";
    // getUserMsgTopList(sessionUserSn).then((data) => {
    //   setUserMsgTopList(data)
    // })
  };

  /* 스크롤 이벤트 관련 */
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);



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
      ComScript.closeModal("loginModal");
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
      Swal.fire({
        title: "오류 발생",
        text: "서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  const makerSubMenu = (data) => {
    let returnHtml = [];
    returnHtml.push(
        <li key="noData">
          <NavLink
              to={"#"}
              className="title2"
          >
            <span>-</span>
          </NavLink>
        </li>
    )
    if (data) {
      data.forEach(function (item, index) {
        if (index === 0) returnHtml = [];
        returnHtml.push(
            <li key={item.menuSn}>
              <NavLink
                  to={item.menuPathNm}
                  state={{
                    menuSn: item.upperMenuSn,
                    thisMenuSn: item.menuSn,
                    bbsSn: item.bbsSn,
                    menuNmPath: item.menuNmPath
                  }}
                  className="title2"
                  onClick={() => {ComScript.closeModal("sitemap")}}
              >
                <span>{item.menuNm}</span>
              </NavLink>
            </li>
        )
      });
    }
    return returnHtml;
  }

  useEffect(() => {

    const activeTag = document.getElementsByClassName('activeTag');
    if (activeTag.length) {
      const parentTag = activeTag[0].parentElement;
      if (parentTag) {
        parentTag.className = "active";
      }
    }


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
      checkRef.current.className = "checkBox type2 f_chk";
    } else {
      checkRef.current.className = "checkBox type2 f_chk on";
    }

    let data = getLocalItem(KEY_ID);
    if (data !== null) {
      setUserInfo({ id: data, password: "default", userSe: "USR", loginType: "base"});
    }

    getMenuOnTree(null, null, userSn).then((data) => {
      let dataList = [];
      if(data != null){
        data.forEach(function(item, index){
          if (index === 0) dataList = [];
          if(item.menuType == "n"){
            dataList.push(
                <li key={item.menuSn}>
                  <NavLink
                      to={item.menuPathNm}
                      state={{
                        menuSn: item.menuSn,
                        menuNmPath: item.menuNmPath,
                      }}
                      className="title"
                      onClick={() => {ComScript.closeModal("sitemap")}}
                  >
                    <span>{item.menuNm}</span>
                  </NavLink>
                  <ul className="dep2">
                    {item.childTblMenu && makerSubMenu(item.childTblMenu)}
                  </ul>
                </li>
            )
          }
        });
        setSiteMapMenu(dataList);
      }
    });

    getMenu(null, 0, userSn).then((data) => {
      let dataList = [];
      if (data != null) {
        data.forEach(function (item, index) {
          if (index === 0) dataList = [];
          if (item.menuType == "n") {
            dataList.push(
                <li key={item.menuSn}>
                  <NavLink
                      to={item.menuPathNm}
                      state={{
                        menuSn: item.menuSn,
                        menuNmPath: item.menuNmPath
                      }}
                      className={({ isActive }) => (isActive ? "activeTopMenu" : "")}
                  >
                    <p>{item.menuNm}</p>
                  </NavLink>
                </li>
            )
          }
        });
        setMenuList(dataList);
      }
    });

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

  /* 스크롤 이벤트 */
  useEffect(() => {
    const headerElement = document.querySelector('header');
    if(headerElement){
      setHeaderHeight(headerElement ? headerElement.offsetHeight : 0);
    }
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    // 스크롤 상태에 따라 스타일을 조정
    const container = document.querySelector('.container');
    if(container){
      if (isScrolled) {
        container.style.paddingTop = '16.2rem';
      } else {
        container.style.paddingTop = '23.9rem';
      }
    }
  }, [isScrolled]);


  const activeEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFormHandler("N");
    }
  };
  const submitFormHandler = (confirmPass) => {
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
      body: JSON.stringify({ ...userInfo, confirmPass : confirmPass }),
    };

    EgovNet.requestFetch(loginUrl, requestOptions, (resp) => {
      if(resp.resultCode != "200"){
        if(resp.resultCode == "502"){
          Swal.fire({
            title: resp.resultMessage,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
          }).then((result) => {
            if(result.isConfirmed) {
              submitFormHandler("Y");
            }
          });
        }else{
          Swal.fire(resp.resultMessage);
          return;
        }
      }else{
        setSessionItem("loginUser", {userSn : resp.result.userSn, name : resp.result.userName, id : resp.result.userId, userSe : resp.result.userSe, mbrType : resp.result.mbrType});
        // setSessionItem("userName", resp.userName);
        setSessionItem("jToken", resp.result.jToken);
        setSessionItem("userSn", resp.result.userSn);
        //if (saveIDFlag) setLocalItem(KEY_ID, resultVO?.id);
        if (saveIDFlag) setLocalItem(KEY_ID, resp.result.userId);
        // Swal.fire("로그인 성공");
        $('#id').val("");
        $('#password').val("");
        $('.modalCon').removeClass('open');
        $('html, body').css('overflow', 'visible');
        window.location.href = "/";
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
        // Swal.fire("로그아웃되었습니다!");
        // navigate(URL.MAIN);
        window.location.href = "/";
      }
    });
  };

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
    //userJs();
  });

  useEffect(() => {
    if(window.location.pathname != "/"){
      const element = document.querySelector(".user.main");
      if(element){
        element.classList.remove("main");
      }
    }else{
      const element = document.querySelector("#wrap");
      if(element){
        element.classList.add("main");
      }
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({userSn : userSn}),
    };

    EgovNet.requestFetch("/commonApi/getDuplicateLogin.do", requestOptions, (resp) => {
      if(resp.result != null){
        if(resp.result.duplicateLogin == "Y"){
          removeSessionItem("loginUser");
          removeSessionItem("jToken");
          removeSessionItem("userSn");
          navigate(
              { pathname : URL.COMMON_ERROR},
              { state : {
                  redirectPath : URL.MAIN,
                  errorCode: resp.resultCode,
                  errorMessage: resp.resultMessage,
                  errorSubMessage : "메인으로 이동합니다."
                }
              }
          );
        }
      }
    });
  }, [window.location.pathname]);

  const userMsgTopMakeHtml = () => {
      let dataList = [];
      dataList.push(
          <li key="no_data" className="noData">
              <div style={{height: "2.5rem"}}>
                <p style={{fontSize: "16px", display: "flex", justifyContent: "center", height: "100%", alignItems: "center"}}>
                  알림이 없습니다.
                </p>
              </div>
          </li>
      );

    userMsgTopList.forEach(function (item, index) {
      if (index === 0) dataList = [];

      dataList.push(
          <li key={item.tblUserMsg.msgSn} className={`msg msg${item.tblUserMsg.msgSn}`}>
            <div className="close" onClick={(e) => {
              setExpsrYn(e, item.tblUserMsg.msgSn)
            }}>
              <div className="icon"></div>
            </div>
            <NavLink
                to={URL.MEMBER_MYPAGE_MSG_LIST}
                state={{
                  menuSn: 53,
                  thisMenuSn: 63,
                  menuNmPath: "마이페이지 > 알림내역"
                }}
                style={{height: "auto"}}
                onClick={handleToggle}>
              <div style={{height: "auto"}}>
                <p style={{fontSize: "16px", display: "flex", justifyContent: "space-between"}}>
                  {item.tblUserMsg.msgTtl}
                </p>
                <p style={{fontSize: "12px", marginTop: "5px", color: "#555555"}}>
                  {item.dsptchUser?.kornFlnm} - {moment(item.tblUserMsg.frstCrtDt).format('YYYY-MM-DD HH:mm:ss')}
                </p>
              </div>
            </NavLink>
          </li>
      );
    });
    setMsgHtml(dataList);
  }

  const setExpsrYn = (e, msgSn) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({msgSn : msgSn, mdfrSn : sessionUserSn}),
    };

    EgovNet.requestFetch("/userMsgApi/setUserMsgExpsrYn", requestOptions, (resp) => {
      if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
        e.target.closest("li").classList.add("slide-out");

        setTimeout(() => {
          e.target.closest("li").remove();

          if(document.querySelectorAll("#alarmUl li.msg").length == 0 && document.querySelectorAll("#alarmUl li.noData").length == 0) {
            document.getElementById("alarmUl").innerHTML = `
             <li key="no_data" class="noData">
              <div style="height: 2.5rem">
                <p style="font-size: 16px; display:flex; justify-content : center; height: 100%; align-items: center">
                  알림이 없습니다.
                </p>
              </div>
            </li>`
          }
        }, 400);
      } else {
        alert("ERR : " + resp.resultMessage);
      }
    });

  }

  useEffect(() => {
    userMsgTopMakeHtml();
  }, [userMsgTopList]);

  return (
      // <!-- header -->
      <header className={isScrolled ? 'scroll' : ''}>
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
                
                @keyframes slideOutRight {
                  0% {
                    transform: translateX(0);
                    opacity: 1;
                  }
                  100% {
                    transform: translateX(100%);
                    opacity: 0;
                  }
                }
                
                .slide-out {
                  animation: slideOutRight 0.4s ease-out forwards;
                }
                `}
        </style>
        <div className="hInner">
          <div className="hTop inner">
            <div className="logBox">
              {/* 로그아웃 : 로그인 정보 있을때 */}
              {sessionUserId && (
                  <>
                    <span className="person">{sessionUserName} </span>
                    {sessionUserSe === "UDR" && (
                        <NavLink
                            to={URL.MEMBER_MYPAGE_MODIFY}
                            state={{
                              menuSn: 53,
                              menuNmPath: "마이페이지 > 회원정보수정"
                            }}
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
                    <button type="button" className="loginBtn" onClick={() => ComScript.openModal("loginModal")}>
                      <span>로그인</span></button>
                    {/*</NavLink>*/}
                    <NavLink
                        to={URL.SIGNUP_CHOICE}
                    >
                      <button type="button" className="signUpBtn"><span>회원가입</span></button>
                    </NavLink>
                  </>
              )}
            </div>

            {sessionUserId && (
                <div className={isToggled ? "alarmWrap click" : "alarmWrap"}>
                  <button type="button" className="alarmBtn" onClick={handleToggle}>
                    <div className="icon alarmIcon"></div>
                    <span id="alarmDot" className="dot" style={{display: "none"}}></span>
                  </button>
                  <ul className="selectBox" id="alarmUl" style={{overflowX: "hidden"}}>
                    {msgHtml}
                  </ul>
                </div>
            )}


            <div className="langBox">
              <div className="itemBox">
                <select className="selectGroup langSelect">
                  <option value="0">KR</option>
                  <option value="1">EN</option>
                </select>
              </div>
            </div>
          </div>
          <div className="hBot inner">
            <div className="top">
              <h1><NavLink to={URL.MAIN}><img src={logoWhite} alt="images"/><span className="hidden">K BIO LabHub</span></NavLink>
              </h1>
              <nav className="navBox">
                <ul className="dep">
                  {menuList}
                </ul>
              </nav>
              <div className="rightBox">
                <NavLink
                    to={URL.TOTAL_SEARCH}
                    state={{
                      menuNmPath: "통합검색"
                    }}
                >
                  <button type="button" className="searchBtn">
                    <div className="icon"></div>
                  </button>
                </NavLink>
                <button type="button" className="sitemapBtn" onClick={() => ComScript.openModal("sitemap")}>
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
                  <p>{location.state?.menuNmPath}</p>
                </li>
              </ul>
              <h2 className="pageTitle">{location.state?.menuNmPath}</h2>
            </div>
          </div>
        </div>
        <div className="sitemap">
          <div className="bg" onClick={() => ComScript.closeModal("sitemap")}></div>
          <div className="sitemapBox">
            <div className="closeBtn" onClick={() => ComScript.closeModal("sitemap")}>
              <div className="icon"></div>
            </div>
            <ul className="dep">
              {/*<li>
                <a href="#" className="title"><span>기관소개</span></a>
                <ul className="dep2">
                  <li><a href="#" className="title2"><span>입주기관 소개</span></a></li>
                  <li><a href="#" className="title2"><span>협업기관 소개</span></a></li>
                </ul>
              </li>
              <li>
                <a href="#" className="title"><span>컨설팅</span></a>
                <ul className="dep2">
                  <li><a href="#" className="title2"><span>컨설턴트</span></a></li>
                  <li><a href="#" className="title2"><span>애로사항</span></a></li>
                </ul>
              </li>
              <li>
                <a href="#" className="title"><span>커뮤니티</span></a>
                <ul className="dep2">
                  <li><a href="#" className="title2"><span>공지사항</span></a></li>
                  <li><a href="#" className="title2"><span>Q&A</span></a></li>
                  <li><a href="#" className="title2"><span>FAQ</span></a></li>
                  <li><a href="#" className="title2"><span>자료실</span></a></li>
                  <li><a href="#" className="title2"><span>연구자료실</span></a></li>
                </ul>
              </li>
              <li>
                <a href="#" className="title"><span>K-BioLabHub</span></a>
                <ul className="dep2">
                  <li><a href="#" className="title2"><span>사업소개</span></a></li>
                  <li><a href="#" className="title2"><span>시설안내</span></a></li>
                  <li><a href="#" className="title2"><span>조직도</span></a></li>
                  <li><a href="#" className="title2"><span>오시는길</span></a></li>
                </ul>
              </li>*/}
              {siteMapMenu}
            </ul>
          </div>
        </div>
        <div className="loginModal modalCon">
          <div className="bg" onClick={() => ComScript.closeModal("loginModal")}></div>
          <div className="m-inner">
            <div className="boxWrap">
              <div className="close" onClick={() => ComScript.closeModal("loginModal")}>
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
                <button type="button" className="loginBtn" onClick={(e) => {
                  submitFormHandler("N")
                }}><span>로그인</span></button>
                <ul className="botBtnBox">
                  <li>
                    <button type="button" className="idBtn" onClick={() => {
                      ComScript.closeModal("loginModal");
                      ComScript.openModal("findId");
                    }}><span>아이디 찾기</span></button>
                  </li>
                  <li>
                    <button type="button" className="pwBtn" onClick={() => {
                      ComScript.closeModal("loginModal");
                      ComScript.openModal("findPwd");
                    }}><span>비밀번호 찾기</span></button>
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
        <div className="findId modalCon customUserModal">
          <div className="bg" onClick={() => ComScript.closeModal("findId")}></div>
          <div className="m-inner">
            <div className="boxWrap">
              <div className="close" onClick={() => ComScript.closeModal("findId")}>
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
        <div className="findPwd modalCon customUserModal">
          <div className="bg" onClick={() => ComScript.closeModal("findPwd")}></div>
          <div className="m-inner">
            <div className="boxWrap">
              <div className="close" onClick={() => ComScript.closeModal("findPwd")}>
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
