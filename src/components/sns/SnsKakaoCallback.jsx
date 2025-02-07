import { useEffect } from "react";
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";
import { setSessionItem } from "@/utils/storage";
import KaKaoLogin from "react-kakao-login";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SnsKakaoCallback = () => {
  const navigate = useNavigate();
  const KAKAO_SCRIPT_ID = import.meta.env.VITE_APP_KAKAO_SCRIPTID;
  const REDIRECT_URI = import.meta.env.VITE_APP_KAKAO_CALLBACKURL;
  const STATE = import.meta.env.VITE_APP_STATE; //다른 서버와 통신 시 암호화문자

  //백엔드 호출
  const callBackEnd = () => {
    // 백엔드로 코드값을 넘겨주는 로직
    let code = new URL(window.location.href).searchParams.get("code");
    let state = new URL(window.location.href).searchParams.get("state");
    if (code) {
      const kakaoLoginUrl = `/loginApi/loginAction`;
      const parmas = {
        code: code,
        state: state,
        loginType : "sns",
        snsType : "kakao"
      }
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(parmas)
      };
      EgovNet.requestFetch(kakaoLoginUrl, requestOptions, (resp) => {
        if(resp.resultCode == "999"){
          Swal.fire("회원가입이 필요합니다.\n회원가입 페이지로 이동합니다.");
          navigate({ pathname : "/mypage/agreement" }, {state : resp.result.dto} );
        }else{
          setSessionItem("loginUser", {
            userSn : resp.result.userSn,
            name : resp.result.userName,
            id : resp.result.userId,
            userSe : resp.result.userSe
          });
          // setSessionItem("userName", resp.result.userName);
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

export default SnsKakaoCallback;
