import { useState, useEffect, useRef } from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { getSessionItem, getLocalItem, setLocalItem, setSessionItem } from "@/utils/storage";
import Swal from "sweetalert2";
import loginBg from "@/assets/images/login_bg.jpg";
import loginLogo from "@/assets/images/login_logo.svg";


function ManagerLogin(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const sessionUser = getSessionItem("loginUser");

  const [userInfo, setUserInfo] = useState({
    id: "",
    password: "default",
    userSe: "ADM",
    loginType : "base",
    confirmPass : "N"
  });
  // eslint-disable-next-line no-unused-vars
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

  useEffect(() => {
    let idFlag = getLocalItem(KEY_SAVE_ID_FLAG);
    if (idFlag === null) {
      setSaveIDFlag(false);
      idFlag = false;
    } else {
      setSaveIDFlag(idFlag);
    }
    if (idFlag === false) {
      setLocalItem(KEY_ID, "");
      if(checkRef.current != null){
        checkRef.current.className = "f_chk";
      }
    } else {
      if(checkRef.current != null){
        checkRef.current.className = "f_chk on";
      }

    }
  }, []);

  useEffect(() => {
    let data = getLocalItem(KEY_ID);
    if (data !== null) {
      setUserInfo({ id: data, password: "default", userSe: "USR", loginType: "base", confirmPass : "N"});
    }
  }, []);

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFormHandler();
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
        // if(resp.resultCode == "502"){
        //   Swal.fire({
        //     title: resp.resultMessage,
        //     showCloseButton: true,
        //     showCancelButton: true,
        //     confirmButtonText: "예",
        //     cancelButtonText: "아니오"
        //   }).then((result) => {
        //     if(result.isConfirmed) {
        //       submitFormHandler("Y");
        //     }
        //   });
        // }else{
        //   Swal.fire(resp.resultMessage);
        //   return;
        // }
        Swal.fire({
          title: "로그인 실패",
          html: resp.resultMessage
        });
        return;
      }else{
        setSessionItem("loginUser", {userSn : resp.result.userSn, name : resp.result.userName, id : resp.result.userId, userSe : resp.result.userSe});
        // setSessionItem("userName", resp.userName);
        setSessionItem("jToken", resp.result.jToken);
        setSessionItem("userSn", resp.result.userSn);
        //if (saveIDFlag) setLocalItem(KEY_ID, resultVO?.id);
        if (saveIDFlag) setLocalItem(KEY_ID, resp.result.userId);
        // Swal.fire("로그인 성공");
        document.getElementById("commonTop").style.display = "flex";
        navigate(URL.MANAGER);
      }
    });
  };

  useEffect(() => {
    if(document.getElementById("commonTop") != null){
      document.getElementById("commonTop").style.display = "none";
    }
    if(location.pathname.split("/")[1] === "manager"){
      import('../../../css/manager/admin.css');
      import('../../../css/manager/customAdmin.css');
    }
  }, [location.pathname]);

  useEffect(() => {
    if( sessionUser !== null){
      document.getElementById("commonTop").style.display = "flex";
      navigate(URL.MANAGER);
    }
  }, []);
  return (
      <div id="container" className="container login">
        <div className="leftWrap">
          <img src={loginBg} alt="image"/>
        </div>
        <div className="rightWrap">
          <div className="inner">
            <h1><a href="#"><img src={loginLogo} alt="images"/><span className="hidden">K BIO LabHub</span></a>
            </h1>
            <form>
              <div className="box">
                <ul className="inputWrap">
                  <li className="inputBox type1 li01">
                    <label className="input">
                      <input
                          type="text"
                          name=""
                          title="아이디"
                          placeholder="아이디"
                          value={userInfo?.id}
                          onChange={(e) =>
                              setUserInfo({ ...userInfo, id: e.target.value })
                          }
                          ref={idRef}
                          onKeyDown={activeEnter}
                      />
                    </label>
                  </li>
                  <li className="inputBox type1 li02">
                    <label className="input">
                      <input
                          type="password"
                          name=""
                          title="비밀번호"
                          placeholder="비밀번호"
                          onChange={(e) =>
                              setUserInfo({ ...userInfo, password: e.target.value })
                          }
                          ref={passwordRef}
                          onKeyDown={activeEnter}
                      />
                    </label>
                  </li>
                </ul>
                <div className="stateBtn">
                  <label className="checkBox type2">
                    <input
                        type="checkbox"
                        name=""
                        id="saveid"
                        onChange={handleSaveIDFlag}
                        checked={saveIDFlag}
                    />
                    <small>ID저장</small></label>
                </div>
                <button type="button" className="loginBtn" onClick={submitFormHandler}><span>로그인</span></button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default ManagerLogin;
