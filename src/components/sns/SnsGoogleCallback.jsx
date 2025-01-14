import { useEffect } from "react";
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";
import { setSessionItem } from "@/utils/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const SnsGoogleCallback = () => {
  const navigate = useNavigate();
  const NAVER_CLIENT_ID = import.meta.env.VITE_APP_NAVER_CLIENTID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = import.meta.env.VITE_APP_NAVER_CALLBACKURL; // Callback URL
  const STATE = import.meta.env.VITE_APP_STATE; //다른 서버와 통신 시 암호화문자

  const callBackEnd = () => {
    let authorizationCode  = new URL(window.location.href).searchParams.get("code");
    if (authorizationCode) {
      const googleLoginAction = async () => {
        const resp = await axios.post(
            "http://localhost:8080/loginAction",
            JSON.stringify({code : authorizationCode, loginType : "sns", snsType : "google"}),
  {
          headers: {
            "Content-Type": "application/json",
          }
        });

        if(resp.resultCode == "999"){
          alert("회원가입이 필요합니다.\n회원가입 페이지로 이동합니다.");
          navigate("/mypage/agreement");
        }else{
          setSessionItem("loginUser", {name : resp.result.userName, id : resp.result.userId, userSe : resp.result.userSe});
          // setSessionItem("userName", resp.result.userName);
          setSessionItem("jToken", resp.result.jToken);
          navigate("/");
        }
      }
      googleLoginAction();
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

export default SnsGoogleCallback;
