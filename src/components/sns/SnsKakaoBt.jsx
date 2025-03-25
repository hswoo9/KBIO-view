import Swal from "sweetalert2";

const SnsKakaoBt = () => {
    const KAKAO_CLIENT_ID = import.meta.env.VITE_APP_KAKAO_CLIENTID; // 발급받은 클라이언트 아이디
    const REDIRECT_URI = import.meta.env.VITE_APP_KAKAO_CALLBACKURL; // Callback URL
    const STATE = import.meta.env.VITE_APP_STATE;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}&reponse_type=code`;

    const KakaoLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    };

    const handleServiceNotReady = () => {
        Swal.fire("서비스 준비중입니다.");
    };


    /*return (
        <button type="button" onClick={KakaoLogin}>
            <div className="icon"></div>
            <p style={{margin: 0, textAlign: "center"}}>카카오 아이디 로그인</p>
        </button>
    );*/
    return (
        <button type="button" onClick={handleServiceNotReady}>
            <div className="icon"></div>
            <p style={{margin: 0, textAlign: "center"}}>카카오 아이디 로그인</p>
        </button>
    );
};

export default SnsKakaoBt;