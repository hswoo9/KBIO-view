import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import CommonSubMenu from "@/components/CommonSubMenu";
import URL from "@/constants/url";

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
                                <img
                                    src="/src/assets/images/ico_logo_kakao.svg"
                                    alt="기업 로고"
                                />
                            </figure>
                            <div className="textBox">
                                <div className="nameBox">
                                    <strong className="name">{operationalDetail?.mvnEntNm}</strong>
                                    <p className="address">경기도 성남시 수정구 산성대로 10 (9층)</p>
                                </div>
                                <p className="intro">메가인베스트먼트는 풍부한 초기기업 투자경험과 Edu tech, O2O, 바이오, IoT, 서비스 분야 투자 전문성을 가진
                                    신기술금융회사입니다. 메가스터디의 손주은 회장이 스타트업 발굴과 육성을 위해 설립한 회사로서 초기 투자 펀드의 성공적인 운용경험이 많은 김정민 대표를
                                    중심으로 초기 투자와 시리즈 A 투자를 진행하고 있습니다.</p>
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
                                        href={`tel:${operationalDetail?.entTelno}`}><span>{operationalDetail?.entTelno}</span></a>
                                    </p>
                                </li>
                                <li>
                                    <strong className="left">대표메일</strong>
                                    <p className="right">
                                        <a href={`mailto:${operationalDetail?.email}`}><span>{operationalDetail?.email}</span></a>
                                    </p>
                                </li>
                                <li>
                                    <strong className="left">참여기관 <span className="blue">BI</span></strong>
                                    <p className="right">{operationalDetail?.partOrg}</p>
                                </li>
                                <li>
                                    <strong className="left">업종</strong>
                                    <p className="right">{operationalDetail?.bizType}</p>
                                </li>
                                <li>
                                    <strong className="left">소재지 <span className="blue">BI</span></strong>
                                    <p className="right">{operationalDetail?.address}</p>
                                </li>
                            </ul>
                        </div>
                        <div className="infoBox2">
                            <strong className="left">주요이력</strong>
                            <ul className="right">
                                {operationalDetail?.historyList?.length > 0 ? (
                                    operationalDetail?.historyList.map((history, index) => (
                                        <li key={index}><p>{history}</p></li>
                                    ))
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
