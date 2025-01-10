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

  return (
    <a href="#!" onClick={GoogleLogin} className="btn_center social google">
      <button>구글 로그인</button>
    </a>
  );
};

export default SnsGoogleBt;

