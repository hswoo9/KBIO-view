import React, { useState, useEffect, useCallback, useRef } from "react";
import * as EgovNet from "@/api/egovFetch";
import {NavLink, useLocation} from "react-router-dom";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import CommonSubMenu from "../../components/CommonSubMenu.jsx";

function contentView(props) {
    return (
        <div id="container" className="container layout">
            <div className="inner">
                <CommonSubMenu/>
                <div>
                    K-BioLabHub는 고객님의 의견을 소중히 여기며, 더 나은 서비스를 제공하기 위해<br/>
                    애로사항 등록 서비스를 운영하고 있습니다.<br/>
                    사용 중 겪으신 불편사항이나 개선이 필요한 점이 있다면 언제든 알려주세요.
                </div>

                <NavLink
                    to={URL.CONSULTING_CREATE}
                    mode={CODE.MODE_CREATE}
                    state={{
                        callBackUrl : URL.DIFFICULTIES,

                    }}
                >
                    <button type="button" className="writeBtn clickBtn"><span>등록하기</span></button>
                </NavLink>

            </div>
        </div>
    );
}

export default contentView;
