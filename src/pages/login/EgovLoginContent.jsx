import { useState, useEffect, useRef } from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";

import URL from "@/constants/url";
import CODE from "@/constants/code";
import { getLocalItem, setLocalItem, setSessionItem } from "@/utils/storage";
import SnsNaverBt from "@/components/sns/SnsNaverBt";
import SnsKakaoBt from "@/components/sns/SnsKakaoBt";
import SnsGoogleBt from "@/components/sns/SnsGoogleBt.jsx";

function EgovLoginContent(props) {
  console.group("EgovLoginContent");
  console.log("[Start] EgovLoginContent ------------------------------");
  console.log("EgovLoginContent [props] : ", props);

  const navigate = useNavigate();
  const location = useLocation();
  console.log("EgovLoginContent [location] : ", location);

  const [userInfo, setUserInfo] = useState({
    id: "",
    password: "default",
    userSe: "USR",
    loginType : "base"
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
      alert("아이디를 입력해주세요.");
      idRef.current.focus();
      return;
    }else if(!passwordRef.current.value){
      alert("비밀번호를 입력해주세요.");
      passwordRef.current.focus();
      return;
    }

    const loginUrl = "/loginAction";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userInfo),
    };

    EgovNet.requestFetch(loginUrl, requestOptions, (resp) => {
      if(resp.resultCode != "200"){
        alert(resp.resultMessage);
        return;
      }else{
        setSessionItem("userName", resp.userName);
        setSessionItem("jToken", resp.jToken);
        if (saveIDFlag) setLocalItem(KEY_ID, resultVO?.id);
        navigate("/");
      }
    });
  };

  return (
    <div className="contents" id="contents">
      {/* <!-- 본문 --> */}
      <div className="Plogin">
        <h1>로그인</h1>
        <p className="txt">
          전자정부표준프레임워크 경량환경 홈페이지 로그인 페이지입니다.
          <br />
          로그인을 하시면 모든 서비스를 제한없이 이용하실 수 있습니다.
        </p>

        <div className="login_box">
          <form name="" method="" action="">
            <fieldset>
              <legend>로그인</legend>
              <span className="group">
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
              </span>
              <div className="chk">
                <NavLink to={URL.MYPAGE_CREATE} className={({ isActive }) => (isActive ? "btn" : "btn")}>
                  회원가입
                </NavLink>
                <NavLink to={URL.FIND_ID_PSWD} className={({ isActive }) => (isActive ? "btn" : "btn")}>
                  ID/비밀번호 찾기
                </NavLink>
                <label className="f_chk" htmlFor="saveid" ref={checkRef}>
                  <input
                    type="checkbox"
                    name=""
                    id="saveid"
                    onChange={handleSaveIDFlag}
                    checked={saveIDFlag}
                  />{" "}
                  <em>ID저장</em>
                </label>
              </div>
              <button className="login_button" type="button" onClick={submitFormHandler}>
                <span>LOGIN</span>
              </button>
            </fieldset>
          </form>
        </div>

        <ul className="list">
          <li>
            비밀번호는 6~12자의 영문 대/소문자, 숫자, 특수문자를 혼합해서
            사용하실 수 있습니다.
          </li>
          <li>
            쉬운 비밀번호나 자주 쓰는 사이트의 비밀번호가 같을 경우, 도용되기
            쉬우므로 주기적으로 변경하셔서 사용하는 것이 좋습니다.
          </li>
        </ul>
        <div className="btn_social">
          <SnsNaverBt />
          <SnsKakaoBt />
          <SnsGoogleBt />
        </div>
      </div>
      {/* <!--// 본문 --> */}
    </div>
  );
}

export default EgovLoginContent;
