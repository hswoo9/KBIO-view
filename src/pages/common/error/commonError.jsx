import { useLocation } from "react-router-dom";
import '@/css/commonError.css';
import error1 from '@/assets/images/error404.png'
import error2 from '@/assets/images/error500.png'
import 'moment/locale/ko';

const CommonError = (props) => {
    const location = useLocation();
    const errorCode = location.state?.errorCode;

    return (
        <div id="wrap" className="user">
            <div id="container" className="error">
                {errorCode === "404" ? (
                    <div className="inner">
                        <div className="inner2" data-aos="fade-in">
                            <figure className="imgBox"><img src={error1} alt="404 Error"/></figure>
                            <div className="textBox">
                                <strong className="title"><span className="blue">404</span> ERROR</strong>
                                <p className="text">죄송합니다. 페이지를 찾을 수 없습니다. <br/>존재하지 않는 주소를 입력하셨거나 <br/>요청하신 페이지의 주소가 변경,
                                    삭제되어 찾을 수 없습니다.</p>
                            </div>
                            <button type="button" className="clickBtn"><span>뒤로가기</span></button>
                        </div>
                    </div>
                ) : errorCode === "500" ? (
                    <div className="inner">
                        <div className="inner2" data-aos="fade-in">
                            <figure className="imgBox"><img src={error2} alt="500 Error"/></figure>
                            <div className="textBox">
                                <strong className="title">페이지가 작동하지 않습니다.</strong>
                                <p className="text">현재 <strong>kbiolabhub.com</strong>에서 요청을 처리할 수 없습니다. <br/><span className="gray">HTTP ERROR 500</span></p>
                            </div>
                            <button type="button" className="clickBtn"><span>새로고침</span></button>
                        </div>
                    </div>
                ) : (
                    <div className="error-code-container">
                        <h1 className="error-code">{errorCode}</h1>
                        <p className="error-message">{location.state?.errorMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommonError;
