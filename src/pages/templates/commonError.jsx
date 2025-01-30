import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import '@/css/commonError.css';
import URL from "@/constants/url";

const commonError = (props) => {
    const location = useLocation();
    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-code-container">
                    <h1 className="error-code">{location.state?.errorCode}</h1>
                    <p className="error-message">{location.state?.errorMessage}</p>
                </div>
                <p className="error-description">
                    관리자에게 문의해주세요.
                </p>
                <Link to="/" className="go-home-button">메인으로</Link>
            </div>
        </div>
    );
};

export default commonError;
