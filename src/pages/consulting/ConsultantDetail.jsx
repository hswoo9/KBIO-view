import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import CommonSubMenu from "@/components/CommonSubMenu";
import ConsultingModal from "@/components/ConsultingModal";
import URL from "@/constants/url";
import Swal from "sweetalert2";
import {getSessionItem} from "../../utils/storage.js";
import * as ComScript from "@/components/CommonScript";
import notProfile from "@/assets/images/no_profile.png";

import user_consultant_img3 from "@/assets/images/user_consultant_img3.jpg";

function ConsultantDetail(props) {
    const sessionUser = getSessionItem("loginUser");
    const navigate = useNavigate();
    const location = useLocation();

    const [searchDto, setSearchDto] = useState({
        userSn: location.state?.userSn || "",
    });

    const [consultantDetail, setConsultantDetail] = useState(null);
    const [memberDetail, setMemberDetail] = useState(null);
    const [cnsltProfileFile, setCnsltProfileFile] = useState(null);
    const [cnsltCrr, setCnsltCrr] = useState([]);
    const [cnsltCert, setCnsltCert] = useState([]);
    const [cnsltAcbg, setCnsltAcbg] = useState([]);


    const [modalData, setModalData] = useState({});
    useEffect(() => {
    }, [modalData]);
    const editClick = (cnsltSe) => {
        if(sessionUser){
            setModalData({
                ...modalData,
                cnsltSe : cnsltSe,
                cnslttUserSn : memberDetail?.userSn,
                userSn : sessionUser?.userSn,
                kornFlnm: memberDetail?.kornFlnm
            })
            ComScript.openModal("requestModal");
            
            /*navigate(
                { pathname : URL.CONSULTING_CREATE },
                {
                    state : {
                        cnsltSe : cnsltSe,
                        cnslttUserSn : userSn,
                        callBackUrl : URL.CONSULTANT_LIST,
                        menuSn : location.state?.menuSn,
                        menuNmPath : location.state?.menuNmPath,
                    }
                });*/
        }else{
            Swal.fire("로그인이 필요한 서비스 입니다.").then((result) => {
                if(result.isConfirmed) {
                    navigate("/");
                    ComScript.openModal("loginModal");
                }
            });
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

                if (resp.result.cnsltProfileFile) {
                    setCnsltProfileFile(resp.result.cnsltProfileFile);
                }

                if (resp.result.tblQlfcLcnsList) {
                    setCnsltCert(resp.result.tblQlfcLcnsList);
                }

                if (resp.result.tblCrrList) {
                    setCnsltCrr(resp.result.tblCrrList);
                }

                if (resp.result.tblAcbgList) {
                    setCnsltAcbg(resp.result.tblAcbgList);
                }

            },
            (error) => {

            }
        );
    };

    useEffect(() => {
        getConsultantDetail();
    }, [searchDto]);


    return(
        <div id="container" className="container consultant view">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="leftBox">
                        <div className="profileBox">
                            <strong className="name">{memberDetail?.kornFlnm}</strong>
                            <div className="cent">
                                <p className="company">{consultantDetail?.ogdpNm} ({consultantDetail?.jbpsNm})</p>
                                <p className="address">경기도 성남시 수정구 산성대로 10 (9층)</p>
                            </div>
                            <div className="tel">
                                <p className="text">연락처</p>
                                <a href="tel:02-1234-5678"><span>02-1234-5678</span></a>
                            </div>
                        </div>
                        <div className="introBox">
                            <ul>
                                <li>
                                    <strong className="left">직위</strong>
                                    <div className="right"><p>{consultantDetail?.jbpsNm}</p></div>
                                </li>
                                <li>
                                    <strong className="left">이메일</strong>
                                    <a href={`mailto:${memberDetail?.email}`}
                                       className="right"><span>{memberDetail?.email}</span></a>
                                </li>
                                <li>
                                    <strong className="left">컨설팅항목</strong>
                                    <div className="right">
                                        <p>{consultantDetail?.cnsltArtcl}</p>
                                        {/*<p>기업 맞춤형 마케팅 전략 수립</p>
                                        <p>브랜드 아이덴티티 구축</p>
                                        <p>온라인 광고 최적화 (SEO, SNS, PPC)</p>
                                        <p>고객 데이터 분석 및 활용 방안 제시</p>*/}
                                    </div>
                                </li>
                                <li>
                                    <strong className="left">경력</strong>
                                    <div className="right">
                                        {cnsltCrr.length > 0 ? (
                                            cnsltCrr.map((item, index) => <p key={index}>{item.ogdpCoNm}</p>)
                                        ) : (
                                            <p>{consultantDetail?.crrPrd || "-"} 년</p>
                                        )}
                                    </div>
                                </li>

                                <li>
                                    <strong className="left">학력</strong>
                                    <div className="right">
                                        {cnsltAcbg.length > 0 ? (
                                            cnsltAcbg.map((item, index) => <p key={index}>{item.schlNm}</p>)
                                        ) : (
                                            <p>학력 사항이 없습니다.</p>
                                        )}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="box qualifications">
                            <div className="titleWrap type2 left">
                                <p className="tt1">자격증</p>
                            </div>
                            <ul className="list">
                                <li>
                                    <figure><img src={user_consultant_img3} alt="images"/></figure>
                                </li>
                                <li>
                                    <figure><img src={user_consultant_img3} alt="images"/></figure>
                                </li>
                                <li>
                                    <figure><img src={user_consultant_img3} alt="images"/></figure>
                                </li>
                                <li>
                                    <figure><img src={user_consultant_img3} alt="images"/></figure>
                                </li>
                            </ul>
                        </div>
                        <div className="box overview">
                            <div className="titleWrap type2 left">
                                <p className="tt1">운영개요</p>
                            </div>
                            {consultantDetail?.cnsltSlfint?.length > 0 ? (
                                <div className="textBox"
                                     dangerouslySetInnerHTML={{__html: consultantDetail.cnsltSlfint}}>
                                </div>
                            ) : (
                                <div className="textBox">
                                    <p>등록된 소개가 없습니다.</p>
                                </div>
                            )}
                        </div>
                        <NavLink
                            to={URL.CONSULTANT_LIST}
                            state={{
                                menuSn: location.state?.menuSn,
                                menuNmPath: location.state?.menuNmPath,
                            }}
                            className="clickBtn listBtn"
                        >
                            <div className="icon"></div>
                            <span>목록</span>
                        </NavLink>
                    </div>
                    <div className="profileBox rightBox">
                        <figure className="imgBox">
                            <img
                                src={
                                    cnsltProfileFile
                                        ? `http://133.186.250.158${cnsltProfileFile.atchFilePathNm}/${cnsltProfileFile.strgFileNm}.${cnsltProfileFile.atchFileExtnNm}`
                                        : notProfile
                                }
                                onError={(e) => {
                                    e.target.src = notProfile;
                                }}
                                alt="컨설턴트사진"
                            />
                        </figure>
                        <div className="textBox">
                            <div className="departBox cate4">
                                <div className="icon"></div>
                                <p className="text">분야</p></div>
                            <div className="nameBox">
                                <strong className="name">{memberDetail?.kornFlnm}</strong>
                                <p className="company">{consultantDetail?.ogdpNm}({consultantDetail?.jbpsNm})</p>
                            </div>
                        </div>
                        <div className="buttonBox">
                            <button type="button" className="clickBtn requestBtn"
                                    onClick={() => editClick(26)}
                            >
                                <div className="icon"></div>
                                <span>컨설팅 의뢰</span>
                            </button>
                            <button type="button" className="clickBtn contactBtn"
                                    onClick={() => editClick(27)}
                            >
                                <div className="icon"></div>
                                <span>간편 상담</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ConsultingModal data={modalData} />
        </div>
    );

}

export default ConsultantDetail;


/*

<h2 className="pageTitle">
    <p>
        {consultantDetail?.ogdpNm || ""} ({consultantDetail?.jbpsNm || "-"}) {memberDetail?.kornFlnm || ""}
    </p>

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
                    src={
                        cnsltProfileFile
                            ? `http://133.186.250.158${cnsltProfileFile.atchFilePathNm}/${cnsltProfileFile.strgFileNm}.${cnsltProfileFile.atchFileExtnNm}`
                            : notProfile
                    }
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
                <p><strong>분야:</strong> {consultantDetail.cnsltFld || "-"} </p>
                <p><strong>컨설팅 항목:</strong> {consultantDetail.cnsltArtcl || "-"}</p>
            </div>
        </div>

        <div style={{padding: "20px 0"}}>
            <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>컨설턴트 소개</h3>
            <ul style={{paddingLeft: "20px", lineHeight: "1.8", color: "#555"}}>
                {consultantDetail.cnsltSlfint?.length > 0 ? (
                    <div className="input" style={{marginTop: "5px"}}     dangerouslySetInnerHTML={{__html: consultantDetail.cnsltSlfint}}></div>
                ) : (
                    <div className="input" style={{marginTop: "5px"}}> 등록된 소개가 없습니다. </div>
                )}
            </ul>
        </div>
        <div className="buttonBox">
            <div className="leftBox">
                <button
                    type="button"
                    className="writeBtn clickBtn"
                    onClick={() => editClick(26, memberDetail.userSn)}
                >
                    <span>컨설팅 의뢰</span>
                </button>
                <button
                    type="button"
                    className="writeBtn clickBtn"
                    onClick={() => editClick(27, memberDetail.userSn)}
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

 */