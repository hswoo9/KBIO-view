import { useEffect } from "react";
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";
import { setSessionItem } from "@/utils/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SnsNaverCallback = () => {
  const navigate = useNavigate();
  const NAVER_CLIENT_ID = import.meta.env.VITE_APP_NAVER_CLIENTID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = import.meta.env.VITE_APP_NAVER_CALLBACKURL; // Callback URL
  const STATE = import.meta.env.VITE_APP_STATE; //다른 서버와 통신 시 암호화문자

  //백엔드 호출
  const callBackEnd = () => {



    // 백엔드로 코드값을 넘겨주는 로직
    let code = new URL(window.location.href).searchParams.get("code");
    let state = new URL(window.location.href).searchParams.get("state");
    console.log("code, state=====>", code, state);
    // 요청이 성공하면
    if (code) {
      const naverLoginUrl = `/naver/callback`;
      const parmas = {
        code: code,
        state: state
      }
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(parmas)
      };
      EgovNet.requestFetch(naverLoginUrl, requestOptions, (resp) => {
        let resultVO = resp.resultVO;
        let jToken = resp?.jToken || null;
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          setSessionItem("jToken", jToken);
          //setLoginVO(resultVO);
          setSessionItem("loginUser", resultVO);
          //props.onChangeLogin(resultVO);
          // PC와 Mobile 열린메뉴 닫기
          document.querySelector(".all_menu.WEB").classList.add("closed");
          document.querySelector(".btnAllMenu").classList.remove("active");
          document.querySelector(".btnAllMenu").title = "전체메뉴 닫힘";
          document.querySelector(".all_menu.Mobile").classList.add("closed");
          alert("Sns 간편 로그인 중..."); //공통 alert 사용대신해서
        } else {
          //React.StrictMode 에서 fetch가 자동으로 2번 실행할 때 아래 메인화면으로 이동된다.
          window.location.replace("/");
        }
      });
    }
  };
  useEffect(callBackEnd, []);

  return (
    <>
      {/* 로그인중이라는 것을 표시할 수 있는 로딩중 화면 */}
      <h1 className="btn_social">로그인 중...</h1>
    </>
  );
};

export default SnsNaverCallback;
