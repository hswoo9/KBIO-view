import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import { fileDownLoad } from "@/components/CommonComponents";
import CommonSubMenu from "@/components/CommonSubMenu";
function MemberMyPageDifficultiesDetail(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();

    const [searchDto, setSearchDto] = useState({
        dfclMttrSn: location.state?.dfclMttrSn || "",
    });

    const [difficultiesDetail, setDifficultiesDetail] = useState(null);

    const getDifficultiesDetail = () => {
        if (!searchDto.dfclMttrSn) return;

        const getDifficultiesDetailURL = "/memberApi/getDifficultiesDetail";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(
            getDifficultiesDetailURL,
            requestOptions,
            (resp) => {
                setDifficultiesDetail(resp.result.difficulties);
            },
            (error) => {
            }
        );
    };

    useEffect(() => {
        getDifficultiesDetail();
    }, [searchDto]);

    return (
        <div id="container" className="container ithdraw join_step">
            <div className="inner">
                <CommonSubMenu/>

                {/* 애로사항 상세 내용 */}
                <div className="detailBox" style={{marginTop: "20px"}}>
                    {difficultiesDetail ? (
                        <div className="contBox infoWrap customContBox"
                             style={{padding: "20px", background: "#f9f9f9", borderRadius: "5px"}}>
                            <ul className="inputWrap" style={{listStyleType: "none", paddingLeft: "0"}}>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>등록일</small></label>
                                    <div className="input"
                                         style={{marginTop: "5px"}}>{moment(difficultiesDetail.frstCrtDt).format('YYYY-MM-DD')}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>분류</small></label>
                                    <div className="input"
                                         style={{marginTop: "5px"}}>{difficultiesDetail.dfclMttrFldNm}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>제목</small></label>
                                    <div className="input" style={{marginTop: "5px"}}>{difficultiesDetail.ttl}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>의뢰내용</small></label>
                                    <div className="input" style={{marginTop: "5px"}}
                                         dangerouslySetInnerHTML={{__html: difficultiesDetail.dfclMttrCn}}></div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>첨부파일</small></label>
                                    <div className="input" style={{marginTop: "5px"}}>
                                        {difficultiesDetail.diffFiles && difficultiesDetail.diffFiles.length > 0 ? (
                                            <ul style={{paddingLeft: "20px"}}>
                                                {difficultiesDetail.diffFiles.map((file, index) => (
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
                                             dangerouslySetInnerHTML={{__html: difficultiesDetail.ansCn}}></div>
                                    </li>
                                    <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                        <label className="title"
                                               style={{fontWeight: "bold"}}><small>답변날짜</small></label>
                                        <div className="input" style={{marginTop: "5px"}}>
                                            {difficultiesDetail.ansRegDt ? moment(difficultiesDetail.ansRegDt).format('YYYY-MM-DD') : ""}
                                        </div>
                                    </li>
                                    <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                        <label className="title" style={{fontWeight: "bold"}}><small>답변
                                            첨부파일</small></label>
                                        <div className="input" style={{marginTop: "5px"}}>
                                            {difficultiesDetail?.answerFiles && difficultiesDetail?.answerFiles.length > 0 ? (
                                                <ul style={{paddingLeft: "20px"}}>
                                                    {difficultiesDetail.answerFiles.map((file, index) => (
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
                                    <div className="input" style={{marginTop: "5px"}}>해당 애로사항의 상세 정보가 없습니다.</div>
                                </li>
                            </ul>
                        </div>
                    )}
                    <div className="buttonBox">
                        <NavLink
                            className = "btn btn_blue_h46 w_100"
                            to={URL.MEMBER_MYPAGE_DIFFICULTIES}
                            state={{
                                menuSn: location.state?.menuSn,
                                menuNmPath: location.state?.menuNmPath
                            }}>
                            <button type="button" className="clickBtn black"><span>목록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default MemberMyPageDifficultiesDetail;