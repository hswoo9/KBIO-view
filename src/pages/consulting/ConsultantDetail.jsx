import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import CommonSubMenu from "@/components/CommonSubMenu";
import URL from "@/constants/url";
import Swal from "sweetalert2";
import {getSessionItem} from "../../utils/storage.js";


function ConsultantDetail(props) {
    const sessionUser = getSessionItem("loginUser");
    const navigate = useNavigate();
    const location = useLocation();

    const [searchDto, setSearchDto] = useState({
        userSn: location.state?.userSn || "",
    });

    const [consultantDetail, setConsultantDetail] = useState(null);
    const [memberDetail, setMemberDetail] = useState(null);


    const editClick = () => {
        if(sessionUser){
            navigate(
                { pathname : URL.CONSULTING_CREATE },
                {
                    state : {
                        callBackUrl : URL.CONSULTANT_LIST,
                        menuSn : location.state?.menuSn,
                        menuNmPath : location.state?.menuNmPath,
                    }
                });
        }else{
            Swal.fire("로그인이 필요한 서비스 입니다.");
            document.getElementsByClassName("loginModal").item(0).classList.add("open")
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        }
    }
    const getConsultantDetail = () => {
        const getConsultantDetailUrl = "/consultingApi/getConsultantDetail.do";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(
            getConsultantDetailUrl,
            requestOptions,
            (resp) => {
                setConsultantDetail(resp.result.consultant);
                setMemberDetail(resp.result.memberDetail);
            },
            (error) => {
                console.error("Error fetching operational detail:", error);
            }
        );
    };

    useEffect(() => {
        getConsultantDetail();
    }, [searchDto]);


    return(
        <div id="container" className="container layout">
            <div className="inner">
                <CommonSubMenu/>
                <h2 className="pageTitle">
                    <p>{consultantDetail?.ogdpNm || ""} (대표) {memberDetail?.kornFlnm || ""}</p>
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
                                    alt="컨설턴트사진"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>

                            <div style={{flex: 1}}>
                                <p style={{fontSize: "30px", fontWeight: "bold", marginBottom: "10px"}}>
                                    {memberDetail.kornFlnm || ""}
                                </p>
                            </div>
                        </div>

                        <div style={{padding: "20px 0", borderBottom: "1px solid #ddd"}}>
                            <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>상세정보</h3>
                            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px"}}>
                                <p><strong>소속:</strong> {consultantDetail.ogdpNm || "-"}</p>
                                <p><strong>직위:</strong> {consultantDetail.jbpsNm || "-"}</p>
                                <p><strong>이름:</strong> {memberDetail.kornFlnm}</p>
                                <p><strong>이메일:</strong> {memberDetail.email || "-"}</p>
                                <p><strong>경력:</strong> {consultantDetail.crrPrd || "-"} 년</p>
                                <p><strong>컨설팅 항목:</strong> {consultantDetail.cnsltArtcl || "-"}</p>
                            </div>
                        </div>

                        <div style={{padding: "20px 0"}}>
                            <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>컨설턴트 소개</h3>
                            <ul style={{paddingLeft: "20px", lineHeight: "1.8", color: "#555"}}>
                                {consultantDetail.cnsltSlfint?.length > 0 ? (
                                    <li>{consultantDetail.cnsltSlfint}</li>
                                ) : (
                                    <li>등록된 이력이 없습니다.</li>
                                )}
                            </ul>
                        </div>
                        <div className="buttonBox">
                            <div className="leftBox">
                                <button
                                    type="button"
                                    className="writeBtn clickBtn"
                                    onClick={editClick}
                                >
                                    <span>컨설팅 의뢰</span>
                                </button>
                                <button
                                    type="button"
                                    className="writeBtn clickBtn"
                                    onClick={editClick}
                                >
                                    <span>간편상담</span>
                                </button>
                            </div>
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
                )}
            </div>
        </div>
    );

}

export default ConsultantDetail;