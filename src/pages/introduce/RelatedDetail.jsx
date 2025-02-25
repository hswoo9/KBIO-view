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

            }
        );
    };

    useEffect(() => {
        getRelInstDetail();
    }, [searchDto]);

    return (
        <div id="container" className="container resident_view">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="profileWrap">
                        <div className="profileBox">
                            <figure className="imgBox">
                                <img
                                    src="/src/assets/images/ico_logo_kakao.svg"
                                    alt="기업 로고"
                                />
                            </figure>
                            <div className="textBox">
                                <div className="nameBox">
                                    <strong className="name">{relatedDetail?.relInstNm}</strong>
                                    <p className="address">{relatedDetail?.entAddr || ""} {relatedDetail?.entDaddr || ""}</p>
                                </div>
                                <p className="intro" dangerouslySetInnerHTML={{__html: relatedDetail?.bzentyExpln || ""}}></p>
                            </div>
                        </div>
                        <a
                            href={relatedDetail?.hmpgAddr}
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
                                    <p className="right">{relatedDetail?.rpsvNm}</p>
                                </li>
                                <li>
                                    <strong className="left">대표전화</strong>
                                    <p className="right"><a
                                        href={`tel:${relatedDetail?.entTelno}`}><span>{relatedDetail?.entTelno}</span></a>
                                    </p>
                                </li>
                                <li>
                                    <strong className="left">대표메일</strong>
                                    <p className="right">
                                        <a href={`mailto:${relatedDetail?.bzentyEmlAddr}`}><span>{relatedDetail?.bzentyEmlAddr}</span></a>
                                    </p>
                                </li>
                                <li>
                                    <strong className="left">참여기관 <span className="blue">BI</span></strong>
                                    <p className="right">{relatedDetail?.partOrg}</p>
                                </li>
                                <li>
                                    <strong className="left">업종</strong>
                                    <p className="right">{relatedDetail?.clsNm}</p>
                                </li>
                                <li>
                                    <strong className="left">소재지 <span className="blue">BI</span></strong>
                                    <p className="right">{relatedDetail?.entAddr || ""} {relatedDetail?.entDaddr || ""}</p>
                                </li>
                            </ul>
                        </div>
                        <div className="infoBox2">
                            <strong className="left">주요이력</strong>
                            <ul className="right">
                                {relatedDetail?.mainHstry ? (
                                    <li><p dangerouslySetInnerHTML={{__html: relatedDetail?.mainHstry || ""}}></p>
                                    </li>
                                ) : (
                                    <li><p>등록된 이력이 없습니다.</p></li>
                                )}
                            </ul>
                        </div>
                    </ul>
                    <div className="buttonBox">
                        <NavLink
                            to={URL.INTRODUCE_RELATED_LIST}
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

export default RelatedDetail;
