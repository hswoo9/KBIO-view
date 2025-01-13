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

                <div className="contents" id="contents">
                    {/* <!-- 본문 --> */}

                    <div className="Flogin">
                        <h1>ID/비밀번호 찾기</h1>


                        <div className="box id_box">
                            <form name="" method="" action="">
                                <fieldset>
                                    <legend>ID찾기</legend>
                                    <h2>ID 찾기</h2>
                                    <span className="group">
                                        <input
                                            type="text"
                                            name=""
                                            title="이름"
                                            placeholder="이름"
                                        />
                                        <input
                                            type="text"
                                            name=""
                                            title="이메일"
                                            placeholder="이메일"
                                        />
                                        <button className="btn id_btn" type="button">
                                        <span>아이디 찾기</span>
                                        </button>
                                      </span>
                                </fieldset>
                            </form>
                        </div>

                        <div className="box pswd_box">
                            <form name="" method="" action="">
                                <fieldset>
                                    <legend>비밀번호 찾기</legend>
                                    <h2>비밀번호 찾기</h2>
                                    <span className="group">
                                        <input
                                            type="text"
                                            name=""
                                            title="아이디"
                                            placeholder="아이디"
                                        />
                                        <input
                                            type="text"
                                            name=""
                                            title="이름"
                                            placeholder="이름"
                                        />
                                        <input
                                            type="text"
                                            name=""
                                            title="이메일"
                                            placeholder="이메일"
                                        />
                                        <button className="btn pswd_btn" type="button">
                                        <span>비밀번호 찾기</span>
                                        </button>
                                      </span>
                                </fieldset>
                            </form>
                        </div>

                        <ul className="list">
                            <li>
                                SNS회원은 가입한 홈페이지에서 아이디 및 비밀번호 찾기를 진행 바랍니다.
                            </li>
                        </ul>

                    </div>
                    {/* <!-- 본문 --> */}
                </div>

            </div>
            {/* <!-- c_wrap --> */}
            </div>
        </div>

);
}

export default EgovFindIdPswd;
