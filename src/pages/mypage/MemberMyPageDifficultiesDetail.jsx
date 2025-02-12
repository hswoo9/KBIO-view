import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';
import {getComCdList} from "@/components/CommonComponents";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";

function MemberMyPageDifficultiesDetail(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();

    const searchTypeRef = useRef();
    const searchValRef = useRef();

    <div id="container" className="container ithdraw join_step">
        <div className="inner">
            {/* Step Indicator */}
            <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                <li>
                    <NavLink to={URL.MEMBER_MYPAGE_MODIFY} activeClassName="active">
                        <div className="num"><p>1</p></div>
                        <p className="text">회원정보수정</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={URL.MEMBER_MYPAGE_CONSULTING} activeClassName="active">
                        <div className="num"><p>2</p></div>
                        <p className="text">컨설팅의뢰 내역</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={URL.MEMBER_MYPAGE_SIMPLE} activeClassName="active">
                        <div className="num"><p>3</p></div>
                        <p className="text">간편상담 내역</p>
                    </NavLink>
                </li>
                <li className="active">
                    <NavLink to={URL.MEMBER_MYPAGE_DIFFICULTIES} activeClassName="active">
                        <div className="num"><p>4</p></div>
                        <p className="text">애로사항 내역</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={URL.MEMBER_MYPAGE_CANCEL} activeClassName="active">
                        <div className="num"><p>5</p></div>
                        <p className="text">회원탈퇴</p>
                    </NavLink>
                </li>
            </ul>
        </div>
    </div>
}

export default MemberMyPageDifficultiesDetail;