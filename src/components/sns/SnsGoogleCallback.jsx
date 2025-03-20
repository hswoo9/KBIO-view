import { useEffect } from "react";
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";
import { setSessionItem } from "@/utils/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Swal from "sweetalert2";

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
            "http://127.0.0.1:8080/loginApi/loginAction",
            JSON.stringify({code : authorizationCode, loginType : "sns", snsType : "google"}),
  {
          headers: {
            "Content-Type": "application/json",
          }
        });

        if(resp.data.resultCode == "999"){
          Swal.fire("회원가입이 필요합니다.\n회원가입 페이지로 이동합니다.");
          navigate({ pathname : "/mypage/agreement" }, {state : resp.data.result.dto} );
        }else{
          setSessionItem("loginUser", {
            userSn : resp.data.result.userSn,
            name : resp.data.result.userName,
            id : resp.data.result.userId,
            userSe : resp.data.result.userSe
          });
          setSessionItem("jToken", resp.data.result.jToken);
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
