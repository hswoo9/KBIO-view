import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import CommonSubMenu from "@/components/CommonSubMenu";
import URL from "@/constants/url";


function ConsultantDetail(props) {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchDto, setSearchDto] = useState({
        userSn: location.state?.userSn || "",
    });

    const [consultantDetail, setConsultantDetail] = useState(null);

    const getConsultantDetail = () => {

    };


    return(
        <div id="container" className="container layout">
            <div className="inner">
                <CommonSubMenu/>
                <h2 className="pageTitle">
                    <p>{consultantDetail?.mvnEntNm || "기업"} 상세보기</p>
                </h2>

                {consultantDetail && (
                    <div style={{padding: "20px", border: "1px solid #ddd", borderRadius: "8px"}}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            paddingBottom: "20px",
                            borderBottom: "1px solid #ddd"
                        }}>
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src="/src/assets/images/ico_logo_kakao.svg"
                                    alt="기업 로고"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>

                            <div style={{flex: 1}}>
                                <p style={{fontSize: "30px", fontWeight: "bold", marginBottom: "10px"}}>
                                    {consultantDetail.mvnEntNm}
                                </p>
                                <p style={{fontSize: "14px", color: "#555", lineHeight: "1.6"}}>
                                    {consultantDetail.description}
                                </p>
                            </div>
                        </div>

                        <div style={{padding: "20px 0", borderBottom: "1px solid #ddd"}}>
                            <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>상세정보</h3>
                            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px"}}>
                                <p><strong>대표 성함:</strong> {consultantDetail.rpsvNm}</p>
                                <p><strong>참여 기관:</strong> {consultantDetail.partOrg || "-"}</p>
                                <p><strong>대표 전화:</strong> {consultantDetail.entTelno}</p>
                                <p><strong>업종:</strong> {consultantDetail.bizType || "-"}</p>
                                <p><strong>대표 메일:</strong> {consultantDetail.email || "-"}</p>
                                <p><strong>소재지:</strong> {consultantDetail.address || "-"}</p>
                                <p style={{gridColumn: "span 2"}}>
                                    <strong>홈페이지 주소:</strong>{" "}
                                    <a
                                        href={consultantDetail.hmpgAddr}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{color: "#007bff", textDecoration: "none"}}
                                    >
                                        {consultantDetail.hmpgAddr}
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div style={{padding: "20px 0"}}>
                            <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>주요 이력</h3>
                            <ul style={{paddingLeft: "20px", lineHeight: "1.8", color: "#555"}}>
                                {consultantDetail.historyList?.length > 0 ? (
                                    consultantDetail.historyList.map((history, index) => (
                                        <li key={index}>{history}</li>
                                    ))
                                ) : (
                                    <li>등록된 이력이 없습니다.</li>
                                )}
                            </ul>
                        </div>
                        <div className="buttonBox">
                            <div className="leftBox">
                                <NavLink
                                    to={URL.CONSULTANT_LIST}
                                    state={{
                                        menuSn : location.state?.menuSn,
                                        menuNmPath : location.state?.menuNmPath,
                                    }}>
                                    <button type="button" className="clickBtn black">
                                        <span>목록</span>
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default ConsultantDetail;