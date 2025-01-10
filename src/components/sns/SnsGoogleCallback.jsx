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

  //백엔드 호출
  const callBackEnd = () => {

    // 백엔드로 코드값을 넘겨주는 로직
    let authorizationCode  = new URL(window.location.href).searchParams.get("code");
    console.log("authorizationCode =====>", authorizationCode);
    if (authorizationCode) {
      const googleLoginAction = async () => {
        const response = await axios.post(
            "http://localhost:8080/loginAction",
            JSON.stringify({ code : authorizationCode, snsType : "google"}),
  {
          headers: {
            "Content-Type": "application/json",
          }
        });

        console.log(response);
        console.log("response.data:",response.data);
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
