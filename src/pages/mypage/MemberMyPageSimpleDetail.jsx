import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import { fileDownLoad } from "@/components/CommonComponents";

function MemberMyPageSimpleDetail(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const [cnsltDsctnList, setCnsltDsctnList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});

    const [searchDto, setSearchDto] = useState({
        cnsltAplySn: location.state?.cnsltAplySn || "",
    });

    const [simpleDetail, setSimpleDetail] = useState(null);

    const getSimpleDetail = () => {
        if (!searchDto.cnsltAplySn) return;

        const getSimpleDetailURL = "/memberApi/getSimpleDetail";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(
            getSimpleDetailURL,
            requestOptions,
            (resp) => {
                setSimpleDetail(resp.result.simple);
            },
            (error) => {
                console.error("Error fetching simple detail:", error);
            }
        );
    };

    useEffect(() => {
        getSimpleDetail();
    }, [searchDto]);

    return (
        <div id="container" className="container ithdraw join_step">
            <div className="inner">
                {/* Step Indicator */}
                <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_MODIFY} >
                            <div className="num"><p>1</p></div>
                            <p className="text">회원정보수정</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING} >
                            <div className="num"><p>2</p></div>
                            <p className="text">컨설팅의뢰 내역</p>
                        </NavLink>
                    </li>
                    <li className="active">
                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE} >
                            <div className="num"><p>3</p></div>
                            <p className="text">간편상담 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_DIFFICULTIES} >
                            <div className="num"><p>4</p></div>
                            <p className="text">애로사항 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CANCEL} >
                            <div className="num"><p>5</p></div>
                            <p className="text">회원탈퇴</p>
                        </NavLink>
                    </li>
                </ul>

                {/* 애로사항 상세 내용 */}
                <div className="detailBox" style={{marginTop: "20px"}}>
                    {simpleDetail ? (
                        <div className="contBox infoWrap customContBox"
                             style={{padding: "20px", background: "#f9f9f9", borderRadius: "5px"}}>
                            <ul className="inputWrap" style={{listStyleType: "none", paddingLeft: "0"}}>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>등록일</small></label>
                                    <div className="input"
                                         style={{marginTop: "5px"}}>{moment(simpleDetail.frstCrtDt).format('YYYY-MM-DD')}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>분류</small></label>
                                    <div className="input"
                                         style={{marginTop: "5px"}}>{simpleDetail.cnsltAplyFldNm}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>제목</small></label>
                                    <div className="input" style={{marginTop: "5px"}}>{simpleDetail.ttl}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>의뢰내용</small></label>
                                    <div className="input" style={{marginTop: "5px"}}
                                         dangerouslySetInnerHTML={{__html: simpleDetail.cn}}></div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>첨부파일</small></label>
                                    <div className="input" style={{marginTop: "5px"}}>
                                        {simpleDetail.simpleFile && simpleDetail.simpleFile.length > 0 ? (
                                            <ul style={{paddingLeft: "20px"}}>
                                                {simpleDetail.simpleFile.map((file, index) => (
                                                    <li key={index} style={{marginBottom: "5px"}}>
                                                <span onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}
                                                      style={{cursor: "pointer"}}>
                                                    {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                                                </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : "첨부파일이 없습니다."}
                                    </div>
                                </li>
                            </ul>

                            {/* 답변 */}
                            <div className="contBox infoWrap customContBox" style={{
                                padding: "20px",
                                background: "#f0f0f0",
                                borderRadius: "5px",
                                marginTop: "20px"
                            }}>
                                <ul className="inputWrap" style={{listStyleType: "none", paddingLeft: "0"}}>
                                    <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                        <label className="title"
                                               style={{fontWeight: "bold"}}><small>답변내용</small></label>
                                        <div className="input" style={{marginTop: "5px"}}
                                             dangerouslySetInnerHTML={{__html: simpleDetail.ansCn}}></div>
                                    </li>
                                    <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                        <label className="title"
                                               style={{fontWeight: "bold"}}><small>답변날짜</small></label>
                                        <div className="input" style={{marginTop: "5px"}}>
                                            {simpleDetail.ansRegDt ? moment(simpleDetail.ansRegDt).format('YYYY-MM-DD') : ""}
                                        </div>
                                    </li>
                                    <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                        <label className="title" style={{fontWeight: "bold"}}><small>답변
                                            첨부파일</small></label>
                                        <div className="input" style={{marginTop: "5px"}}>
                                            {simpleDetail?.answerFiles && simpleDetail?.answerFiles.length > 0 ? (
                                                <ul style={{paddingLeft: "20px"}}>
                                                    {simpleDetail.answerFiles.map((file, index) => (
                                                        <li key={index} style={{marginBottom: "5px"}}>
                                                    <span onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}
                                                          style={{cursor: "pointer"}}>
                                                        {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                                                    </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : "첨부파일이 없습니다."}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="contBox infoWrap customContBox"
                             style={{padding: "20px", background: "#f9f9f9", borderRadius: "5px"}}>
                            <ul className="inputWrap" style={{listStyleType: "none", paddingLeft: "0"}}>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>상세 정보가
                                        없습니다.</small></label>
                                    <div className="input" style={{marginTop: "5px"}}>해당 간편상담의 상세 정보가 없습니다.</div>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default MemberMyPageSimpleDetail;