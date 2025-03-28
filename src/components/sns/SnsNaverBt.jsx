import Swal from "sweetalert2";

const SnsNaverBt = () => {
  const NAVER_CLIENT_ID = import.meta.env.VITE_APP_NAVER_CLIENTID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = import.meta.env.VITE_APP_NAVER_CALLBACKURL; // Callback URL
  const STATE = import.meta.env.VITE_APP_STATE; //다른 서버와 통신 시 암호화문자
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;

  const NaverLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };

    const handleServiceNotReady = () => {
        Swal.fire("서비스 준비중입니다.");
    };

   /* return (
        <button type="button" onClick={NaverLogin}>
            <div className="icon"></div>
            <p style={{ margin: 0, textAlign: "center" }}>네이버 아이디 로그인</p>
        </button>
    );*/
    return (
        <button type="button" onClick={handleServiceNotReady}>
            <div className="icon"></div>
            <p style={{ margin: 0, textAlign: "center" }}>네이버 아이디 로그인</p>
        </button>
    );
};

export default SnsNaverBt;
