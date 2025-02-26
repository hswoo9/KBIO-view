import ManagerMatching from "./ManagerMatching.jsx";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as ComScript from "@/components/CommonScript";
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
    const [cnsltCertificateFile , setCnsltCertificateFile] = useState([]);

    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };

    const setCnslttMbrActv = (e) =>{
        const setCnslttMbrActvUrl = "/consultingApi/setCnslttMbrActv";

        const updatedConsultant = { ...consultantDetail};


        Swal.fire({
            title: "수정하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(updatedConsultant),
                };

                EgovNet.requestFetch(setCnslttMbrActvUrl,requestOptions, (resp) =>{
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("수정되었습니다.");
                        window.location.reload();
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                 });

            }else{
                //취소
            }
        });
    }

    const handleDownload = (file) => {

        const downloadUrl = `http://133.186.250.158${file.atchFilePathNm}/${file.strgFileNm}.${file.atchFileExtnNm}`; // 실제 파일 경로로 변경

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.atchFileNm; // 파일명을 다운로드할 이름으로 지정
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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

                if (resp.result.cnsltCertificateFile) {
                    setCnsltCertificateFile(resp.result.cnsltCertificateFile);
                }

            },
            (error) => {

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
                    <div key="tabIndex0">
                    <div className="contBox infoWrap customContBox">
                        {/* 개인정보 탭 내용 */}
                            <ul className="inputWrap">
                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>자문분야</label>
                                    <div className="input">
                                        <div>
                                            {comCdList.find(item => item.comCd === String(consultantDetail.cnsltFld))?.comCdNm || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>사진</label>
                                    <div className="input">
                                        <div>
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
                                        <div>
                                            {memberDetail.kornFlnm || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>휴대폰</label>
                                    <div className="input">
                                        <div>
                                            {ComScript.formatTelNumber(memberDetail.mblTelno)}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>이메일</label>
                                    <div className="input">
                                        <div>
                                            {memberDetail.email || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>주소</label>
                                    <div className="input">
                                        <div>
                                            {`${memberDetail.addr || ''} ${memberDetail.daddr || ''}`}
                                        </div>
                                    </div>
                                </li>


                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>소속</label>
                                    <div className="input">
                                        <div>
                                            {consultantDetail.ogdpNm || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>직위</label>
                                    <div className="input">
                                        <div>
                                            {consultantDetail.jbpsNm || ""}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>경력</label>
                                    <div className="input">
                                        <div>
                                            {`${consultantDetail.crrPrd || ''} 년`}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>컨설팅항목</label>
                                    <div className="input">
                                        <div>
                                            {consultantDetail.cnsltArtcl || ""}
                                        </div>
                                    </div>
                                </li>
                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>소개</label>
                                    <div className="input"
                                         dangerouslySetInnerHTML={{__html: consultantDetail.cnsltSlfint}}>
                                    </div>
                                </li>


                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>자격증</label>
                                    <div className="input">
                                        <div>
                                            {cnsltCertificateFile.length > 0 ? (
                                                cnsltCertificateFile.map((file, index) => (
                                                    <div key={index} style={{ cursor: "pointer" }} onClick={() => handleDownload(file)}>
                                                        {index + 1}. {file.atchFileNm}
                                                    </div>
                                                ))
                                            ) : (
                                                <p key="noData"></p>
                                            )}
                                        </div>

                                    </div>
                                </li>

                                <ul className="box03 inputWrap">
                                <li className="inputBox type2 white">
                                    <div className="input">
                                        <span className="tt1">컨설팅활동</span>
                                        <div className="checkWrap"
                                             style={{
                                                 border: "1px solid #ddd",
                                                 borderRadius: "10px",
                                                 padding: "10px",
                                             }}>
                                            <label className="checkBox type3">
                                            <input
                                                type="radio"
                                                className="signUpRadio"
                                                value="Y"
                                                checked={consultantDetail.cnsltActv === "Y"}
                                                onChange={(e) => setConsultantDetail({...consultantDetail, cnsltActv : e.target.value})}
                                            />
                                            공개
                                            </label>
                                            <label className="checkBox type3">
                                            <input
                                                type="radio"
                                                className="signUpRadio"
                                                value="N"
                                                checked={consultantDetail.cnsltActv === "N"}
                                                onChange={(e) => setConsultantDetail({...consultantDetail, cnsltActv : e.target.value})}
                                            />
                                            비공개
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                </ul>

                            </ul>
                    </div>

                        {/*버튼영역*/}
                        <div style={{marginTop : "30px"}} className="pageWrap">
                            <div className="leftBox">
                                <button type="button" className="writeBtn clickBtn"
                                onClick={()=>{setCnslttMbrActv()}}>
                                    <span>수정</span>
                                </button>
                            </div>
                            <div className="rightBox">
                                <Link
                                    to={URL.MANAGER_CONSULTING_EXPERT}
                                >
                                    <button type="button" className="clickBtn black">
                                        <span>목록</span>
                                    </button>
                                </Link>
                            </div>

                        </div>
                        {/*버튼영역끝*/}
                    </div>
                );
            case 1:
                return (
                    <div key="tabIndex1">
                        {/* 컨설팅의뢰 탭 내용 */}
                        <ManagerCnslttCnsltList
                        cnsltSe={26}
                        userSn={searchDto.userSn}/>
                    </div>
                );
            case 2:
                return (
                    <div key="tabIndex2">
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
                            key={`${index}_tab`}
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