import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import CommonSubMenu from "@/components/CommonSubMenu";
import URL from "@/constants/url";
import * as ComScript from "@/components/CommonScript";

function OperationalDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchDto, setSearchDto] = useState({
        mvnEntSn: location.state?.mvnEntSn || "",
    });

    const [operationalDetail, setOperationalDetail] = useState({});

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
                console.log(resp);
                setOperationalDetail(resp.result.operational);
            },
            (error) => {

            }
        );
    };

    useEffect(() => {
        getOperationalDetail();
    }, [searchDto]);

    return (
        <div id="container" className="container resident_view">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="profileWrap">
                        <div className="profileBox">
                            <figure className="imgBox">
                                {operationalDetail.tblComFile != null ? (
                                    <img
                                        src={`http://133.186.250.158${operationalDetail.tblComFile.atchFilePathNm}/${operationalDetail.tblComFile.strgFileNm}.${operationalDetail.tblComFile.atchFileExtnNm}`}
                                        alt={`${operationalDetail.mvnEntNm}_로고`}
                                    />
                                ) : (
                                    <img
                                        src="/src/assets/images/user_business_overview_box04_icon01.png"
                                        alt={`${operationalDetail.mvnEntNm}_로고 없음`}
                                        height="100"
                                    />
                                )}
                            </figure>
                            <div className="textBox">
                                <div className="nameBox">
                                    <strong className="name">{operationalDetail?.mvnEntNm || ""}</strong>
                                    <p className="address">{operationalDetail?.entAddr || ""} {operationalDetail?.entDaddr || ""}</p>
                                </div>
                                <p className="intro" dangerouslySetInnerHTML={{__html: operationalDetail?.bzentyExpln || ""}}></p>
                            </div>
                        </div>
                        <a
                            href={operationalDetail?.hmpgAddr}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="clickBtn black"
                        >
                            <span>홈페이지 방문</span>
                        </a>
                    </div>
                    <ul className="infoWrap">
                        <div className="infoBox">
                            <ul className="list">
                                <li>
                                    <strong className="left">대표성함</strong>
                                    <p className="right">{operationalDetail?.rpsvNm}</p>
                                </li>
                                <li>
                                    <strong className="left">대표전화</strong>
                                    <p className="right"><a
                                        href={`tel:${ComScript.formatTelNumber(operationalDetail?.entTelno)}`}><span>{ComScript.formatTelNumber(operationalDetail?.entTelno)}</span></a>
                                    </p>
                                </li>
                                <li>
                                    <strong className="left">대표메일</strong>
                                    <p className="right">
                                        <a href={`mailto:${operationalDetail?.bzentyEmlAddr || ""}`}><span>{operationalDetail?.bzentyEmlAddr || ""}</span></a>
                                    </p>
                                </li>
                                <li>
                                    <strong className="left">참여기관 <span className="blue">BI</span></strong>
                                    <p className="right">{operationalDetail?.partOrg}</p>
                                </li>
                                <li>
                                    <strong className="left">업종</strong>
                                    <p className="right">{operationalDetail?.entTpbizNm}</p>
                                </li>
                                <li>
                                    <strong className="left">소재지 <span className="blue">BI</span></strong>
                                    <p className="right">{operationalDetail?.entAddr || ""} {operationalDetail?.entDaddr || ""}</p>
                                </li>
                            </ul>
                        </div>
                        <div className="infoBox2">
                            <strong className="left">주요이력</strong>
                            <ul className="right">
                                {operationalDetail?.mainHstry ? (
                                    <li><p dangerouslySetInnerHTML={{__html: operationalDetail?.mainHstry || ""}}></p></li>
                                ) : (
                                    <li><p>등록된 이력이 없습니다.</p></li>
                                )}
                            </ul>

                        </div>
                    </ul>
                    <div className="buttonBox">
                        <NavLink
                            to={URL.INTRODUCE_OPERATIONAL_LIST}
                            state={{
                                menuSn: location.state?.menuSn,
                                menuNmPath: location.state?.menuNmPath,
                                thisMenuSn : location.state?.thisMenuSn,
                            }}
                            className="clickBtn listBtn"
                        >
                            <div className="icon"></div>
                            <span>목록</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OperationalDetail;
