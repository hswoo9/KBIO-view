import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import CommonSubMenu from "@/components/CommonSubMenu";
import URL from "@/constants/url";
function RelatedDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchDto, setSearchDto] = useState({
        relInstSn: location.state?.relInstSn || "",
    });

    const [relatedDetail, setRelInstDetail] = useState(null);

    const getRelInstDetail = () => {
        if (!searchDto.relInstSn) return;

        const getRelInstDetailURL = "/introduceApi/getRelInstDetail";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(
            getRelInstDetailURL,
            requestOptions,
            (resp) => {
                setRelInstDetail(resp.result.related);
            },
            (error) => {
                console.error("Error fetching related detail:", error);
            }
        );
    };

    useEffect(() => {
        getRelInstDetail();
    }, [searchDto]);

    return (
        <div id="container" className="container layout">
            <div className="inner">
                <CommonSubMenu/>
                <h2 className="pageTitle">
                    <p>{relatedDetail?.relInstNm || "기업"} 상세보기</p>
                </h2>

                {relatedDetail && (
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
                                    {relatedDetail.relInstNm}
                                </p>
                                <p style={{fontSize: "14px", color: "#555", lineHeight: "1.6"}}>
                                    {relatedDetail.description}
                                </p>
                            </div>
                        </div>

                        <div style={{padding: "20px 0", borderBottom: "1px solid #ddd"}}>
                            <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>상세정보</h3>
                            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px"}}>
                                <p><strong>대표 성함:</strong> {relatedDetail.rpsvNm}</p>
                                <p><strong>참여 기관:</strong> {relatedDetail.partOrg || "-"}</p>
                                <p><strong>대표 전화:</strong> {relatedDetail.entTelno}</p>
                                <p><strong>업종:</strong> {relatedDetail.bizType || "-"}</p>
                                <p><strong>대표 메일:</strong> {relatedDetail.email || "-"}</p>
                                <p><strong>소재지:</strong> {relatedDetail.address || "-"}</p>
                                <p style={{gridColumn: "span 2"}}>
                                    <strong>홈페이지 주소:</strong>{" "}
                                    <a
                                        href={relatedDetail.hmpgAddr}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{color: "#007bff", textDecoration: "none"}}
                                    >
                                        {relatedDetail.hmpgAddr}
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div style={{padding: "20px 0"}}>
                            <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>주요 이력</h3>
                            <ul style={{paddingLeft: "20px", lineHeight: "1.8", color: "#555"}}>
                                {relatedDetail.historyList?.length > 0 ? (
                                    relatedDetail.historyList.map((history, index) => (
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
                                    to={URL.INTRODUCE_RELATED_LIST}
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

export default RelatedDetail;
