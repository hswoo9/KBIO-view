import { SERVER_URL } from "../config";

import URL from "@/constants/url";
import CODE from "@/constants/code";

export function requestFetch(url, requestOptions, handler, errorHandler) {

  //CORS ISSUE 로 인한 조치 - origin 및 credentials 추가
  // origin 추가
  if (!requestOptions["origin"]) {
    requestOptions = { ...requestOptions, origin: SERVER_URL };
  }
  // credentials 추가
  if (!requestOptions["credentials"]) {
    requestOptions = { ...requestOptions, credentials: "include" };
  }

  fetch(SERVER_URL + url, requestOptions)
    .then((response) => {
      // response Stream. Not completion object
      return response.json();
    })
    .then((resp) => {
      if (Number(resp.resultCode) === Number(CODE.RCV_ERROR_AUTH)) {
        alert("Login Alert"); //index.jsx라우터파일에 jwtAuthentication 함수로 공통 인증을 사용하는 코드 추가로 alert 원상복구
        sessionStorage.setItem("loginUser", JSON.stringify({ id: "" }));
        window.location.href = URL.LOGIN;
        return false;
      } else {
        return resp;
      }
    })
    .then((resp) => {
      if (typeof handler === "function") {
        handler(resp);
      } else {

      }
    })
    .catch((error) => {
      if (error === "TypeError: Failed to fetch") {
        alert("서버와의 연결이 원활하지 않습니다. 서버를 확인하세요.");
      }

      if (typeof errorHandler === "function") {
        errorHandler(error);
      } else {
        alert("ERR : " + error.message);
      }
    })
    .finally(() => {
    });
}
