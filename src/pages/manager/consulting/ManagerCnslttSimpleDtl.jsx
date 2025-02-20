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

/* bootstrip */
import { getSessionItem } from "@/utils/storage";
import {getComCdList} from "../../../components/CommonComponents.jsx";
import moment from "moment/moment.js";

function ManagerCnslttSimpleDtl({ item, onBack }){

    const [searchDto, setSearchDto] = useState(
        {userSn: item.userSn,
            cnsltAplySn : item.cnsltAplySn,
            cnslttUserSn : item.cnslttUserSn
        }
    );

    const [comCdList, setComCdList] = useState([]);
    const [consulttUser, setConsulttUser] = useState({});
    const [consulttDtl, setConsulttDtl] = useState({});
    const [userDetail, setUserDetail] = useState({});
    const [userCompDetail, setUserCompDetail] = useState({});
    const [cnslt, setCnslt] = useState({});
    const [cnsltProfileFile , setCnsltProfileFile] = useState({});
    const [cnsltCertificateFile , setCnsltCertificateFile] = useState([]);

    const [cnsltDsctnList, setCnsltDsctnList] = useState([]);
    const [filesByDsctnSn, setFilesByDsctnSn] = useState([]);
    const [cnsltDgstfnList, setcnsltDgstfnList] = useState([]);

    const handleDownload = (file) => {

        const downloadUrl = `http://133.186.250.158${file.atchFilePathNm}/${file.strgFileNm}.${file.atchFileExtnNm}`; // 실제 파일 경로로 변경

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.atchFileNm; // 파일명을 다운로드할 이름으로 지정
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const getCnsltDetail = (searchDto) => {
        const getCnsltDetailUrl = `/consultingApi/getConsultingDetail.do`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getCnsltDetailUrl, requestOptions, function (resp) {

            setConsulttUser({
                ...resp.result.consulttUser
            });
            setConsulttDtl({
                ...resp.result.consulttDtl
            });
            setUserDetail({
                ...resp.result.userDetail
            });
            if (resp.result.cnsltCertificateFile) {
                setCnsltCertificateFile(resp.result.cnsltCertificateFile);
            }

            if (resp.result.cnsltProfileFile) {
                setCnsltProfileFile({
                    ...resp.result.cnsltProfileFile
                });
            }
            if (resp.result.userCompDetail) {
                setUserCompDetail({
                    ...resp.result.userCompDetail
                });
            }

            if (resp.result.filesByDsctnSn) {
                setFilesByDsctnSn(resp.result.filesByDsctnSn);
            }

            if(resp.result.cnsltDgstfnList) {
                setcnsltDgstfnList(resp.result.cnsltDgstfnList);
            }

            setCnslt({
                ...resp.result.cnslt
            });

            let dataList = [];
            dataList.push(
                <p>내역이 없습니다.</p>
            );

            resp.result.cnsltDsctnList.forEach(function (item, index) {
                if (index === 0) dataList = [];

                const files = resp.result.filesByDsctnSn[item.cnsltDsctnSn] || []; // 해당 cnsltDsctnSn의 파일 리스트 가져오기

                dataList.push(
                    <div className="input"
                         style={{
                             display: "flex",
                             justifyContent: "center",
                             alignItems: "center",
                             gap: "20px"
                         }}>
                        <div
                            style={{ order: item.dsctnSe === "0" ? 1 : 2, border: "1px solid #333", borderRadius: "10px", padding: "10px", width: "80%" }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: item.cn }}>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                                {/* 파일 리스트 추가 */}
                                <p style={{ textAlign: "left" }}>
                                    <label className="title" style={{cursor :"default"}}>첨부파일</label>
                                    {files.map((file, fileIndex) => (
                                        <div key={fileIndex} style={{ cursor: "pointer" }} onClick={() => handleDownload(file)}>
                                            {fileIndex + 1}. {file.atchFileNm}
                                        </div>
                                    ))}
                                </p>

                                {/*날짜*/}
                                <p style={{ textAlign: "right" }}>
                                    {moment(item.frstCrtDt).format('YYYY.MM.DD  HH:MM')}
                                </p>
                            </div>
                        </div>
                        <div
                            style={{ order: item.dsctnSe === "0" ? 2 : 1, border: "1px solid #333", borderRadius: "20px", padding: "10px", width: "7%" }}
                        >
                            <p style={{ textAlign: "center" }}>
                                {item.dsctnSe === "0" ? "신청자" : "컨설턴트"}
                            </p>
                        </div>
                    </div>
                );
            });
            setCnsltDsctnList(dataList);


        });
    };

    const memberTypeLabel =
        userDetail.mbrType === 9 ? '관리자' :
            userDetail.mbrType === 1 ? '입주기업' :
                userDetail.mbrType === 2 ? '컨설턴트' :
                    userDetail.mbrType === 3 ? '유관기관' :
                        userDetail.mbrType === 4 ? '비입주기업' :
                            '테스트';

    const initMode = () => {
        getCnsltDetail(searchDto);
    };

    useEffect(() => {
        getComCdList(10).then((data) => {
            setComCdList(data);
        })
    }, []);

    useEffect(() => {
        initMode();
    }, []);

    return (
        <div>
            <h2 className="pageTitle">
                <p>신청자 정보</p>
            </h2>
            <div style={{marginTop:"10px"}} className="contBox infoWrap customContBox">
                <ul className="inputWrap">
                    <li className="inputBox type1 width1">
                        <label className="title" style={{cursor :"default"}}>회원분류</label>
                        <div className="input">
                            <div>
                                {memberTypeLabel}
                            </div>
                        </div>
                    </li>
                    <li className="inputBox type1 width1">
                        <label className="title" style={{cursor :"default"}}>신청자</label>
                        <div className="input">
                            <div>{userDetail.kornFlnm}
                            </div>
                        </div>
                    </li>
                    {/*만약 기업 정보가 없는 경우 숨김처리할것*/}
                    <li className="inputBox type1 width2">
                        <label className="title" style={{cursor :"default"}}>기업명</label>
                        <div className="input">
                            <div>

                            </div>
                        </div>
                    </li>
                    <li className="inputBox type1 width2">
                        <label className="title" style={{cursor :"default"}}>산업</label>
                        <div className="input">
                            <div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            {/*신청자정보끝*/}

            {/*컨설팅 내역*/}
            <h2 style={{marginTop:"30px"}} className="pageTitle">
                <p>컨설팅의뢰 내역</p>
            </h2>
            <div style={{marginTop:"10px"}} className="contBox infoWrap customContBox">
                <ul className="inputWrap">
                    <li className="inputBox type1 email width1">
                        <label className="title" style={{cursor :"default"}}>{/*{cnslt.ttl}*/}</label>
                        {cnsltDsctnList}
                    </li>
                </ul>
            </div>
            {/*컨설팅 내역 끝*/}
            {/*만족도*/}
            <h2 style={{marginTop:"30px"}} className="pageTitle">
                <p>만족도</p>
            </h2>
            <div style={{marginTop:"10px"}} className="contBox infoWrap customContBox">
                <div className="tableBox">
                    {cnsltDgstfnList.length > 0 ? (
                        <table border="1" style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr>
                                {cnsltDgstfnList.map((item, index) => (
                                    <th key={index} style={{ border: '1px solid black', padding: '8px', textAlign : 'center' }}>
                                        {item.dgstfnArtcl}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                {cnsltDgstfnList.map((item, index) => (
                                    <td key={index} style={{ border: '1px solid black', padding: '8px', textAlign : 'center'}}>
                                        {item.chcScr}
                                    </td>
                                ))}
                            </tr>
                            </tbody>
                        </table>
                    ):(
                        <p>아직 만족도 조사가 이루어지지 않았습니다.</p>
                    )}
                </div>
            </div>
            {/*만족도끝*/}

            {/*버튼영역*/}
            <div style={{marginTop:"30px"}} className="pageWrap">
                <div className="rightBox">
                    <button type="button" className="clickBtn black" onClick={onBack}>
                        <span>목록</span>
                    </button>
                </div>

            </div>
            {/*버튼영역끝*/}
        </div>
    );
}
export default ManagerCnslttSimpleDtl;