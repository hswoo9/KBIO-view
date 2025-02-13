import ManagerMatching from "./ManagerMatching.jsx";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftConsulting";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';
import base64 from 'base64-js';

/* bootstrip */
import { getSessionItem } from "@/utils/storage";
import {getComCdList} from "../../../components/CommonComponents.jsx";
import moment from "moment/moment.js";

function ManagerCnsltDetail(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const checkRef = useRef([]);

    const [searchDto, setSearchDto] = useState(
        {userSn: location.state?.userSn,
            cnsltAplySn : location.state?.cnsltAplySn,
            cnslttUserSn : location.state?.cnslttUserSn
        }
    );

    const [consulttUser, setConsulttUser] = useState({});
    const [consulttDtl, setConsulttDtl] = useState({});
    const [userDetail, setUserDetail] = useState({});
    const [userCompDetail, setUserCompDetail] = useState({});
    const [cnslt, setCnslt] = useState({});

    const [cnsltDsctnList, setCnsltDsctnList] = useState([]);
    const [cnsltDgstfnList, setcnsltDgstfnList] = useState([]);

    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };
    const getCnsltDetail = (searchDto) => {
        const getCnsltDetailUrl = `/consultingApi/getConsultingDetail.do`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getCnsltDetailUrl, requestOptions, function (resp) {
            const decodedPhoneNumber = decodePhoneNumber(resp.result.consulttUser.mblTelno);
            setConsulttUser({
                ...resp.result.consulttUser,
                mblTelno: decodedPhoneNumber
            });
            setConsulttDtl({
                ...resp.result.consulttDtl
            });
            setUserDetail({
                ...resp.result.userDetail
            });
            if (resp.result.userCompDetail) {
                setUserCompDetail({
                    ...resp.result.userCompDetail
                });
            }
            setCnslt({
                ...resp.result.cnslt
            });

            let dataList = [];
            dataList.push(
                <p>내역이 없습니다.</p>
            );

            resp.result.cnsltDsctnList.forEach(function (item,index){
                if(index === 0) dataList =[];

                dataList.push(
                    <div className="input"
                         style={{
                             display: "flex",
                             justifyContent: "center",
                             alignItems: "center",
                             gap : "20px"
                         }}>
                    <div
                        style={{order: item.dsctnSe === "0" ? 1 : 2,  border: "1px solid #333", borderRadius: "10px" , padding : "10px", width : "80%"}}
                    >
                        <div dangerouslySetInnerHTML={{__html: item.cn}}>
                        </div>
                        <p style={{textAlign : "right"}}
                        >{moment(item.frstCrtDt).format('YYYY.MM.DD  HH:MM')}</p>
                    </div>
                    <div
                        style={{order: item.dsctnSe === "0" ? 1 : 2, border: "1px solid #333", borderRadius: "20px", padding : "10px", width : "7%"}}
                    >
                        <p style={{textAlign : "center"}}
                        >{item.dsctnSe === "0" ? "신청자" : "컨설턴트"}</p>
                    </div>
                    </div>
                );
            });
            setCnsltDsctnList(dataList);


        });
    };

    const memberTypeLabel =
        userDetail.mbrType === 9 ? '관리자' :
            userDetail.mbrType === 1 ? '입주기업' :
                userDetail.mbrType === 2 ? '컨설턴트' :
                    userDetail.mbrType === 3 ? '유관기관' :
                        userDetail.mbrType === 4 ? '비입주기업' :
                            '테스트';

    const initMode = () => {
        console.log("state : ",searchDto);
        getCnsltDetail(searchDto);
    };

    useEffect(() => {
        initMode();
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle">
                    <p>컨설턴트 정보</p>
                </h2>

                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 width1">
                            <label className="title"><small>자문분야</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>성명</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={consulttUser.kornFlnm || ""}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>휴대폰</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={consulttUser.mblTelno || ""}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>이메일</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={consulttUser.email || ""}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>주소</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={`${consulttUser.addr || ''} ${consulttUser.daddr || ''}`} // addr과 daddr을 합쳐서 표시
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width1">
                            <label className="title"><small>사진</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>소속</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={consulttDtl.ogdpNm || ""}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>직위</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={consulttDtl.jbpsNm || ""}
                                    readOnly
                                />
                            </div>
                        </li>

                        <li className="inputBox type1 width2">
                            <label className="title"><small>경력</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={`${consulttDtl.crrPrd || ''} 년`}
                                    readOnly
                                />
                            </div>
                        </li>

                            <li className="inputBox type1 width2">
                                <label className="title"><small>컨설팅항목</small></label>
                                <div className="input">
                                    <input
                                        type="text"
                                        readOnly
                                    />
                                </div>
                            </li>
                            <li className="inputBox type1 width1">
                                <label className="title"><small>소개</small></label>
                                <div className="input"
                                     dangerouslySetInnerHTML={{__html: consulttDtl.cnsltSlfint}}>
                                    {/*<input
                                        type="text"
                                        value={consulttDtl.cnsltSlfint || ""}
                                        readOnly
                                    />*/}
                                </div>
                            </li>


                        <li className="inputBox type1 width1">
                            <label className="title"><small>자격증</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    readOnly
                                />
                            </div>
                        </li>
                    </ul>
                </div>
                {/*컨설턴트정보끝*/}

                <h2 className="pageTitle">
                    <p>신청자 정보</p>
                </h2>
                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 email width1">
                            <label className="title"><small>회원분류</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={memberTypeLabel}
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                        <li className="inputBox type1 email width1">
                            <label className="title"><small>신청자</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    value={userDetail.kornFlnm}
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                        {/*만약 기업 정보가 없는 경우 숨김처리할것*/}
                        <li className="inputBox type1 email width2">
                            <label className="title"><small>기업명</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    name="clsNm"
                                    id="clsNm"
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                        <li className="inputBox type1 email width2">
                            <label className="title"><small>산업</small></label>
                            <div className="input">
                                <input
                                    type="text"
                                    name="brno"
                                    id="brno"
                                    readOnly
                                >
                                </input>
                            </div>
                        </li>
                    </ul>
                </div>
                {/*신청자정보끝*/}

                {/*컨설팅 내역*/}
                <h2 className="pageTitle">
                    <p>컨설팅의뢰 내역</p>
                </h2>
                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 email width1">
                            <label className="title"><small>{cnslt.ttl}</small></label>
                                {cnsltDsctnList}
                        </li>
                    </ul>
                </div>
                {/*컨설팅 내역 끝*/}

                {/*만족도*/}
                <h2 className="pageTitle">
                    <p>만족도</p>
                </h2>
                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <table></table>
                    </ul>
                </div>
                {/*만족도끝*/}


                {/*버튼영역*/}
                <div className="pageWrap">
                    <div className="rightBox">
                        <Link
                            to={URL.MANAGER_CONSULTING_MATCHING}
                        >

                            <button type="button" className="clickBtn black">
                                <span>목록</span>
                            </button>
                        </Link>
                    </div>

                </div>
                {/*버튼영역끝*/}
            </div>
        </div>
    );
}


export default ManagerCnsltDetail;
