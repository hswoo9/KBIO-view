import {useEffect} from "react";
import AOS from "aos";
import error1 from '@/css/images/error404.png'
import {useNavigate} from "react-router-dom";

function UserError404(props) {
  const goBack = () => {
    window.location.href = "/"
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
      <div id="wrap" className="user">
        <div id="container" className="error">
          <div className="inner">
            <div className="inner2" data-aos="fade-in">
              <figure className="imgBox"><img src={error1} alt="에러이미지"/></figure>
              <div className="textBox">
                <strong className="title"><span className="blue">404</span> ERROR</strong>
                <p className="text">
                  죄송합니다. 페이지를 찾을 수 없습니다. <br/>존재하지 않는 주소를 입력하셨거나 <br/>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수
                  없습니다.
                </p>
              </div>
              <button type="button" className="clickBtn" onClick={goBack}>
                <span>메인으로 돌아가기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default UserError404;
