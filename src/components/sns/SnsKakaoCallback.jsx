import { useEffect } from "react";
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";
import { setSessionItem } from "@/utils/storage";
import KaKaoLogin from "react-kakao-login";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    console.log("code, state=====>", code, state);
    const kakaoLoginUrl = 'https://kauth.kakao.com/oauth/token';
    const tokenData = {
      grant_type: 'authorization_code',
      client_id: KAKAO_SCRIPT_ID, // 카카오에서 발급받은 스크립트 ID
      redirect_uri: REDIRECT_URI, // 카카오에서 설정한 리디렉션 URI
      code: code, // 로그인 후 리디렉션에서 받은 인증 코드
    };

    // 요청이 성공하면
    if (code) {
      // const kakaoLoginUrl = `https://kauth.kakao.com/oauth/token?code=${code}&state=${state}`;
      const kakoLoginAction = async () => {
        //const response = await axios.get(kakaoLoginUrl);
        const response = await axios.post(kakaoLoginUrl, new URLSearchParams(tokenData), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        console.log(response);
        console.log("response.data:",response.data);
        const accessToken = response.data.access_token;
        console.log("access Token:", accessToken);
        axios.defaults.headers.common[
            'Authorization'
            ] = `Bearer ${accessToken}`;
        const userInfoUrl = `https://kapi.kakao.com/v2/user/me`;
        const useInfo = await axios.get(userInfoUrl);
        console.log(useInfo.data);
        if (useInfo.status) {
          let result = {
            //id: useInfo.data.response.email,
            password: "?",
            name: useInfo.data.properties.nickname,
            //userSe: "USR",
            userSe: "ADM"
          };
          setSessionItem("loginUser", result);
          navigate("/");
          // PC와 Mobile 열린메뉴 닫기
          document.querySelector(".all_menu.WEB").classList.add("closed");
          document.querySelector(".btnAllMenu").classList.remove("active");
          document.querySelector(".btnAllMenu").title = "전체메뉴 닫힘";
          document.querySelector(".all_menu.Mobile").classList.add("closed");
        }
      }
      kakoLoginAction();
    }
  };
  useEffect(callBackEnd, []);



  /*if (code) {
    const kakaoLoginUrl = `/login/kakao/callback?code=${code}&state=${state}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    };
    EgovNet.requestFetch(kakaoLoginUrl, requestOptions, (resp) => {
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
useEffect(callBackEnd, []);*/

  return (
      <>
        {/* 로그인중이라는 것을 표시할 수 있는 로딩중 화면 */}
        <h1 className="btn_social">로그인 중...</h1>
      </>
  );
};

export default SnsKakaoCallback;
