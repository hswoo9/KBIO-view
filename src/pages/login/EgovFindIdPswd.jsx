import { Link } from "react-router-dom";
import URL from "@/constants/url";
import React, { useState } from "react";
import * as EgovNet from "@/api/egovFetch";

import CODE from "@/constants/code";
import axios from "axios";
import Swal from "sweetalert2";

function EgovFindIdPswd(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleFindId = async () => {
        // 유효성 검사: 이름과 이메일 입력 확인
        if (!name || !email) {
            Swal.fire({
                title: "입력 오류",
                text: "이름과 이메일을 모두 입력해주세요.",
            });
            return;
        }

        try {
            const checkIdURL = "/memberApi/findId.do";
            const reqOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email }),
            };

            // 서버 응답 처리
            await EgovNet.requestFetch(checkIdURL, reqOptions, function (response) {
                if (response.resultCode === 200) {
                    const memberId = response.result.memberId;
                    if (memberId) {
                        Swal.fire({
                            title: "ID 찾기 성공",
                            text: `회원님의 ID는 '${memberId}'입니다.`,
                        });
                    } else {
                        Swal.fire({
                            title: "찾기 실패",
                            text: "회원 정보가 없습니다. 다시 확인해주세요.",
                        });
                    }
                } else {
                    Swal.fire({
                        title: "오류 발생",
                        text: "ID 찾기 요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
                    });
                }
            });
        } catch (error) {
            console.error("ID 찾기 요청 실패:", error);
            Swal.fire({
                title: "오류 발생",
                text: "서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
            });
        }
    };


    return (
        <div className="container">
            <div className="c_wrap">
                {/* Location */}
                <div className="location">
                    <ul>
                        <li>
                            <Link to={URL.MAIN} className="home">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to={URL.LOGIN}>로그인</Link>
                        </li>
                        <li>ID/비밀번호 찾기</li>
                    </ul>
                </div>
                {/* // Location */}

                <div className="layout">
                    <div className="contents" id="contents">
                        <div className="Flogin">
                            <h1>ID/비밀번호 찾기</h1>

                            <div className="box id_box">
                                <form>
                                    <fieldset>
                                        <legend>ID찾기</legend>
                                        <h2>ID 찾기</h2>
                                        <span className="group">
                      <input
                          type="text"
                          name="name"
                          title="이름"
                          placeholder="이름"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                      <input
                          type="text"
                          name="email"
                          title="이메일"
                          placeholder="이메일"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                      <button
                          className="btn id_btn"
                          type="button"
                          onClick={handleFindId}
                      >
                        <span>아이디 찾기</span>
                      </button>
                    </span>
                                    </fieldset>
                                </form>
                            </div>

                            <div className="box pswd_box">
                                <form>
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
                                    SNS회원은 가입한 홈페이지에서 아이디 및 비밀번호 찾기를 진행
                                    바랍니다.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EgovFindIdPswd;
