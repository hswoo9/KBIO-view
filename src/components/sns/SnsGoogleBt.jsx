import Swal from "sweetalert2";

const SnsGoogleBt = () => {
  const GOOGLE_CLIENTID = import.meta.env.VITE_APP_GOOGLE_CLIENTID; // 발급받은 클라이언트 아이디
  const GOOGLE_CALLBACKURL = import.meta.env.VITE_APP_GOOGLE_CALLBACKURL; // 발급받은 클라이언트 아이디

  const GoogleLogin = () => {
    // 구글 로그인 화면으로 이동시키기
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?
		client_id=${GOOGLE_CLIENTID}
		&redirect_uri=${GOOGLE_CALLBACKURL}
		&response_type=code
		&scope=email profile`;
  };

    const handleServiceNotReady = () => {
        Swal.fire("서비스 준비중입니다.");
    };

  /*return (
      <button type="button" onClick={GoogleLogin}>
        <div className="icon"></div>
        <p style={{ margin: 0, textAlign: "center" }}>구글 아이디 로그인</p>
      </button>
  );*/
    return (
        <button type="button" onClick={handleServiceNotReady}>
            <div className="icon"></div>
            <p style={{ margin: 0, textAlign: "center" }}>구글 아이디 로그인</p>
        </button>
    );
};

export default SnsGoogleBt;

