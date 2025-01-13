import { Link } from "react-router-dom";


import URL from "@/constants/url";
import React from "react";

function EgovFindIdPswd(props) {

    return (
        <div className="container">
            <div className="c_wrap">
                {/* <!-- Location --> */}
                <div className="location">
                    <ul>
                        <li>
                            <Link to={URL.MAIN} className="home">
                                Home
                            </Link>
                        </li>
                        <li><Link to={URL.LOGIN}>
                            로그인
                        </Link></li>
                        <li>ID/비밀번호 찾기</li>
                    </ul>
                </div>
                {/* <!--// Location --> */}

                <div className="layout">
                    

                </div>

            </div>
            {/* <!-- c_wrap --> */}
        </div>

);
}

export default EgovFindIdPswd;
