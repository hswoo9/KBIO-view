import ManagerMatching from "./ManagerMatching.jsx";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftConsulting";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';
import base64 from 'base64-js';
import ManagerCnslttCnsltList from "./ManagerCnslttCnsltList.jsx";
import {getComCdList} from "../../../components/CommonComponents.jsx";
import ManagerCnslttSimple from "./ManagerCnslttSimple.jsx";

function ManagerConsultuntDetail(props) {
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(0);
    const tabs = ['개인정보', '컨설팅의뢰', '간편상담'];

    const [searchDto, setSearchDto] = useState({
        userSn: location.state?.userSn
    });
    const [comCdList, setComCdList] = useState([]);
    const [consultantDetail, setConsultantDetail] = useState({});
    const [memberDetail, setMemberDetail] = useState({});
    const [cnsltProfileFile, setCnsltProfileFile] = useState(null);

    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };
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
                const decodedPhoneNumber = decodePhoneNumber(resp.result.memberDetail.mblTelno);
                setConsultantDetail(resp.result.consultant);
                setMemberDetail({...resp.result.memberDetail,
                    mblTelno: decodedPhoneNumber
                });

                if (resp.result.cnsltProfileFile) {
                    setCnsltProfileFile(resp.result.cnsltProfileFile);
                }

            },
            (error) => {
                console.error("Error fetching operational detail:", error);
            }
        );
    };

    useEffect(() => {
        getComCdList(10).then((data) => {
            setComCdList(data);
        })
    }, []);


    useEffect(() => {
        getConsultantDetail();
    }, [searchDto]);

    const renderTabContent = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                return (
                    <div className="contBox infoWrap customContBox">
                        {/* 개인정보 탭 내용 */}
                            <ul className="inputWrap">
                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>자문분야</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px",
                                        }}>
                                            {comCdList.find(item => item.comCd === String(consultantDetail.cnsltFld))?.comCdNm || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>사진</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px",
                                            display:"inline-block"
                                        }}>
                                            <img
                                                src={
                                                    cnsltProfileFile
                                                        ? `http://133.186.250.158${cnsltProfileFile.atchFilePathNm}/${cnsltProfileFile.strgFileNm}.${cnsltProfileFile.atchFileExtnNm}`
                                                        : "" // 기본 이미지 (필요한 경우)
                                                }
                                                alt="컨설턴트사진"
                                                style={{
                                                    width: "200px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>성명</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>
                                            {memberDetail.kornFlnm || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>휴대폰</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>
                                            {memberDetail.mblTelno || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>이메일</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>
                                            {memberDetail.email || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>주소</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>
                                            {`${memberDetail.addr || ''} ${memberDetail.daddr || ''}`}
                                        </div>
                                    </div>
                                </li>


                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>소속</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>
                                            {consultantDetail.ogdpNm || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>직위</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>
                                            {consultantDetail.jbpsNm || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>경력</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>
                                            {`${consultantDetail.crrPrd || ''} 년`}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>컨설팅항목</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>
                                        </div>
                                    </div>
                                </li>
                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>소개</label>
                                    <div className="input"
                                         style={{
                                             border: "1px solid #ddd",
                                             borderRadius: "10px",
                                             padding: "10px"
                                         }}
                                         dangerouslySetInnerHTML={{__html: consultantDetail.cnsltSlfint}}>
                                    </div>
                                </li>


                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>자격증</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>
                                            {/*{cnsltCertificateFile.length > 0 ? (
                                                cnsltCertificateFile.map((file, index) => (
                                                    <p key={index}>
                                                        {index + 1}. {file.atchFileNm}
                                                    </p>
                                                ))
                                            ) : (
                                                <p></p>
                                            )}*/}
                                        </div>

                                    </div>
                                </li>

                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>컨설팅 활동</label>
                                    <div className="input">
                                        <div style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            padding: "10px"
                                        }}>

                                        </div>
                                    </div>
                                </li>
                            </ul>
                    </div>
                );
            case 1:
                return (
                    <div>
                        {/* 컨설팅의뢰 탭 내용 */}
                        <ManagerCnslttCnsltList
                        cnsltSe={26}
                        userSn={searchDto.userSn}/>
                    </div>
                );
            case 2:
                return (
                    <div>
                        {/* 간편상담 탭 내용 */}
                        <ManagerCnslttSimple
                            cnsltSe={27}
                            userSn={searchDto.userSn}/>
                    </div>
                );
            default:
                return <div>잘못된 접근입니다.</div>;
        }
    };

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">

                {/*탭버튼*/}
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveTab(index)}  // 클릭 시 활성화된 탭 상태 변경
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                backgroundColor: activeTab === index ? '#007BFF' : '#f1f1f1',
                                color: activeTab === index ? '#fff' : '#000',
                                borderRadius: '5px',
                                marginRight: '5px',
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/*컨텐츠영역*/}
                <div>
                    {renderTabContent(activeTab)} {/* activeTab 값에 따라 콘텐츠를 표시 */}
                </div>


            </div>
        </div>
            );


}
export default ManagerConsultuntDetail;