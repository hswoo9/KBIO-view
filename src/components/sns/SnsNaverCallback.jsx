import { useEffect } from "react";
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";
import { setSessionItem } from "@/utils/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SnsNaverCallback = () => {
  const navigate = useNavigate();
  const NAVER_CLIENT_ID = import.meta.env.VITE_APP_NAVER_CLIENTID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = import.meta.env.VITE_APP_NAVER_CALLBACKURL; // Callback URL
  const STATE = import.meta.env.VITE_APP_STATE; //다른 서버와 통신 시 암호화문자

  //백엔드 호출
  const callBackEnd = () => {
    let code = new URL(window.location.href).searchParams.get("code");
    let state = new URL(window.location.href).searchParams.get("state");
    if (code) {
      const naverLoginUrl = `/loginApi/loginAction`;
      const parmas = {
        code: code,
        state: state,
        loginType : "sns",
        snsType : "naver"
      }
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(parmas)
      };
      EgovNet.requestFetch(naverLoginUrl, requestOptions, (resp) => {
        if(resp.resultCode == "999"){
          Swal.fire("회원가입이 필요합니다.\n회원가입 페이지로 이동합니다.");
          navigate("/mypage/agreement");
        }else{
          setSessionItem("loginUser", {userSn : resp.result.userSn, name : resp.result.userName, id : resp.result.userId, userSe : resp.result.userSe});
          // setSessionItem("userName", resp.userName);
          setSessionItem("jToken", resp.result.jToken);
          navigate("/");
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
