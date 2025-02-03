import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import EgovPaging from "@/components/EgovPaging";
import OperationalSupport from "./OperationalSupport.jsx";

function OperationalResidentMember(props) {


    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>입주기업 관리</p></h2>
                {/*회사 로고*/}
                <div className="company_info">
                    <div className="left">
                        <figure className="logo">
                            {/*기업 로고 이미지 추가할 것*/}
                        </figure>
                        <p className="name" id="mvnEntNm"></p>
                    </div>
                    <ul className="right">
                        <li>
                            <p className="tt1">대표자</p>
                            <p className="tt2"></p>
                        </li>
                        <li>
                            <p className="tt1">대표전화</p>
                            <p className="tt2"></p>
                        </li>
                        <li>
                            <p className="tt1">업종</p>
                            <p className="tt2"></p>
                        </li>
                    </ul>
                </div>
                {/*본문리스트영역*/}
                <div className="contBox board type2 customContBox">
                    <div className="topBox">
                        <p className="resultText"><span className="red">12,345</span>건의 입주기업 정보가 조회되었습니다.</p>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>게시판</caption>
                            <thead>
                            <tr>
                                <th className="th1"><p>번호</p></th>
                                <th className="th2"><p>아이디</p></th>
                                <th className="th2"><p>성명</p></th>
                                <th className="th3"><p>휴대전화번호</p></th>
                                <th className="th4"><p>이메일</p></th>
                                <th className="th5"><p>등록일</p></th>
                                <th className="th6"><p>삭제</p></th>
                            </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    {/*페이징, 버튼 영역*/}
                    <div className="pageWrap">
                        <EgovPaging
                        />
                        <Link
                            to={URL.MANAGER_OPERATIONAL_SUPPORT}
                        >
                            <button type="button" className="clickBtn black"><span>목록</span></button>
                        </Link>
                        <NavLink
                            to={""}
                        >
                            <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default OperationalResidentMember;