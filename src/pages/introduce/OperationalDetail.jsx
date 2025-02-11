import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";

function OperationalDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchDto, setSearchDto] = useState({
        mvnEntSn: location.state?.mvnEntSn || "",
    });

    const [operationalDetail, setOperationalDetail] = useState(null);

    const getOperationalDetail = () => {
        if (!searchDto.mvnEntSn) return;

        const getOperationalDetailURL = "/introduceApi/getOperationalDetail";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(
            getOperationalDetailURL,
            requestOptions,
            (resp) => {
                setOperationalDetail(resp.result.operational);
            },
            (error) => {
                console.error("Error fetching operational detail:", error);
            }
        );
    };

    useEffect(() => {
        getOperationalDetail();
    }, [searchDto]);

    return (
        <div id="container" className="container layout">
            <div className="inner">
                <h2 className="pageTitle">
                    <p>{operationalDetail?.mvnEntNm || "기업"} 상세보기</p>
                </h2>

                {operationalDetail && (
                    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
                        <div style={{ display: "flex", gap: "20px" }}>
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

                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: "30px", fontWeight: "bold" }}>
                                    {operationalDetail.mvnEntNm}
                                </p>

                                <p style={{ fontSize: "14px", color: "#555" }}>
                                    <strong>대표 성함:</strong> {operationalDetail.rpsvNm}
                                </p>
                                <p style={{ fontSize: "14px", color: "#555" }}>
                                    <strong>대표전화:</strong> {operationalDetail.entTelno}
                                </p>
                                <p style={{ fontSize: "14px", color: "#555" }}>
                                    <strong>홈페이지:</strong>{" "}
                                    <a
                                        href={operationalDetail.hmpgAddr}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "#007bff" }}
                                    >
                                        {operationalDetail.hmpgAddr}
                                    </a>
                                </p>
                                <p style={{ fontSize: "14px", color: "#555" }}>
                                    <strong>설명:</strong> {operationalDetail.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OperationalDetail;
