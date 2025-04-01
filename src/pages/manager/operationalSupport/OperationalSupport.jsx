import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as ComScript from "@/components/CommonScript";
import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

import moment from "moment/moment.js";
import {getComCdList, excelExport, fileUpload} from "@/components/CommonComponents";

function OperationalSupport(props) {
    const sessionUser = getSessionItem("loginUser");
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            searchVal: "",
            searchType: "",
            entClsf : "",
            // entTpbiz: "",
            actvtnYn : ""
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({});
    const [rcList, setAuthorityList] = useState([]);
    const [comCdClsfList, setComCdClsfList] = useState([]);
    const [comCdTpbizList, setComCdTpbizList] = useState([]);

    const [uploadFileName, setUploadFileName] = useState("");
    const [uploadExcelData, setUploadExcelData] = useState([]);
    useEffect(() => {
        if(uploadExcelData.length > 0){
            uploadExcelData.forEach(function(item, index){
                item.mvnEntNm = item['기업명'];
                item.brno = String(item['사업자등록번호']).replaceAll("-", "");
                item.rpsvNm = item['대표자'];
                item.entTelno = String(item['대표전화']).replaceAll("-", "");
                item.bzentyEmlAddr = item['대표이메일'];
                item.hmpgAddr = item['홈페이지'];
                item.zip = item['우편번호'];
                item.entAddr = item['주소'];
                item.entDaddr = item['상세주소'];
                item.entClsf = item['분류코드(시트참조)'];
                item.entTpbiz = item['업종코드(시트참조)'];
                item.creatrSn = sessionUser?.userSn;
                item.actvtnYn = "Y";
                item.rlsYn = "N";
                item.empJoinYn = "N";
            });
            console.log(uploadExcelData);
        }
    }, [uploadExcelData]);

    const excelDataSave = useCallback(
        () => {
            Swal.fire({
                title: "등록하시겠습니까?",
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: "등록",
                cancelButtonText: "취소"
            }).then((result) => {
                if(result.isConfirmed) {
                    if(uploadExcelData.length > 0){
                        const requestURL = "/mvnEntApi/setMvnEntList.do";
                        const requestOptions = {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json",
                            },
                            body: JSON.stringify({tblMvnEntList : uploadExcelData})
                        };
                        EgovNet.requestFetch(
                            requestURL,
                            requestOptions,
                            (resp) => {
                                if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                                    Swal.fire("등록되었습니다");
                                    setUploadFileName("");
                                    setUploadExcelData([]);
                                    ComScript.closeModal("uploadModal");
                                    getRcList(searchDto);
                                } else {
                                    Swal.fire("엑셀파일의 양식을 확인해주세요.");
                                }
                            }
                        )

                    }else{
                        Swal.fire("엑셀 데이터가 없습니다.");
                    }
                } else {
                }
            });


        }
    )

    const excelUploadEvent = (e) => {
        fileUpload(e.target.files[0]).then((data) => {
            if(e.target.files[0].name != null){
                setUploadFileName(e.target.files[0].name);
            }
            if(data[0].sheet0 != null){
                setUploadExcelData(data[0].sheet0);
            }
        });
    }

    const excelUploadSample = () => {
        let sheetDatas = [{
            sheetName : "입주기업 업로드 양식",
            header : ['기업명', '사업자등록번호', '대표자', '대표전화', '대표이메일', '홈페이지' ,'우편번호', '주소' , '상세주소', '분류코드(시트참조)', '업종코드(시트참조)'],
            row : []
        }];

        let comCdClsfRow = [];
        comCdClsfList.forEach(function(item, index){
            comCdClsfRow.push({
                comCd: item.comCd,
                comCdNm: item.comCdNm
            })
        });
        let comCdClsf = {
            sheetName: "분류코드",
            header: ['코드', '코드명'],
            row: comCdClsfRow
        }
        sheetDatas.push(comCdClsf);

        let comCdTpbizRow = [];
        comCdTpbizList.forEach(function(item, index){
            comCdTpbizRow.push({
                comCd: item.comCd,
                comCdNm: item.comCdNm
            })
        });
        let comCdTpbiz = {
            sheetName: "업종코드",
            header: ['코드', '코드명'],
            row: comCdTpbizRow
        }
        sheetDatas.push(comCdTpbiz);
        excelExport("입주기업 업로드 양식", sheetDatas);
    }
    
    const dataExcelDownload = useCallback(() => {
        //let excelParams = searchDto;
        let excelParams = { ...searchDto };
        excelParams.pageIndex = 1;
        excelParams.pageUnit = paginationInfo?.totalRecordCount || 9999999999

        const requestURL = "/mvnEntApi/getMvnEntList.do";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(excelParams)
        };
        EgovNet.requestFetch(
            requestURL,
            requestOptions,
            (resp) => {
                let rowDatas = [];
                if(resp.result.rcList != null){
                    resp.result.rcList.forEach(function (item, index) {
                        rowDatas.push(
                            {
                                number : resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index,
                                entClsfNm : item.entClsfNm || " ",
                                entTpbizNm : item.entTpbizNm || " ",
                                mvnEntNm : item.tblMvnEnt.mvnEntNm || " ",
                                rpsvNm : item.tblMvnEnt.rpsvNm || " ",
                                entTelno : ComScript.formatTelNumber(item.tblMvnEnt.entTelno),
                                rlsYn : item.tblMvnEnt.rlsYn === "Y" ? "공개" : "비공개",
                            }
                        )
                    });
                }

                let sheetDatas = [{
                    sheetName : "입주기업 관리",
                    header : ['번호', '분류', '업종', '기업명', '대표자', '대표전화', '공개여부'],
                    row : rowDatas
                }];
                excelExport("입주기업 관리", sheetDatas);
            }
        )
    });

    const getRcList = useCallback(
        (searchDto)=>{


            const rcListUrl = "/mvnEntApi/getMvnEntList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                rcListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    rcList.push(
                        <tr key="noData">
                            <td colSpan="5">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.rcList.forEach(function (item,index){
                        if(index === 0) dataList = [];

                        dataList.push(
                            <tr key={`${item.mvnEntSn}_${index}`}>
                                <td> {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}</td>
                                <td>{item.entClsfNm || ""}</td>
                                <td>
                                    <Link to={{pathname: URL.RESIDENT_COMPANY_MODIFY}}
                                          state={{
                                              mvnEntSn: item.tblMvnEnt.mvnEntSn,
                                              mode: CODE.MODE_MODIFY
                                          }}
                                    >
                                        {item.tblMvnEnt.mvnEntNm}
                                    </Link>
                                </td>
                                <td>{item.tblMvnEnt.rpsvNm}</td>
                                <td>{ComScript.formatTelNumber(item.tblMvnEnt.entTelno)}</td>
                                <td>{item.entTpbizNm || ""}</td>
                                <td>{item.tblMvnEnt.rlsYn === "Y" ? "공개" : "비공개"}</td>
                                <td>
                                    <Link to={URL.MANAGER_RESIDENT_MANAGER}
                                          state={{
                                              mvnEntSn: item.tblMvnEnt.mvnEntSn,
                                              rpsvNm: item.tblMvnEnt.rpsvNm,
                                              entTelno: item.tblMvnEnt.entTelno,
                                              entTpbiz: item.tblMvnEnt.entTpbiz
                                          }}>
                                        <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                    </Link>
                                </td>
                                <td>
                                    <Link to={URL.MANAGER_RESIDENT_MEMBER}
                                          state={{
                                              mvnEntSn: item.tblMvnEnt.mvnEntSn,
                                              rpsvNm: item.tblMvnEnt.rpsvNm,
                                              entTelno: item.tblMvnEnt.entTelno,
                                              entTpbiz: item.tblMvnEnt.entTpbiz
                                          }}>
                                        <button type="button" className="listBtn"><span>직원 목록</span></button>
                                    </Link>
                                </td>
                            </tr>
                        );
                    });
                    setAuthorityList(dataList);

                },
                function (resp) {

                }
            )
        },
        [rcList, searchDto]
    );

    useEffect(()=>{
        getRcList(searchDto);

        getComCdList(17).then((data) => {
            setComCdClsfList(data);
        })

        getComCdList(18).then((data) => {
            setComCdTpbizList(data);
        })
    }, []);

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getRcList(searchDto);
        }
    };

    const searchHandle = () => {
        getRcList(searchDto);
    }

    const searchReset = () => {
        setSearchDto({
            ...searchDto,
            pageIndex: 1,
            searchVal: "",
            searchType: "",
            entClsf : "",
            // entTpbiz: "",
            actvtnYn : ""
        });

        getRcList({
            ...searchDto,
            pageIndex: 1,
            searchVal: "",
            searchType: "",
            entClsf : "",
            // entTpbiz: "",
            actvtnYn : ""
        });
    }

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>입주기업 관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">분류</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="entClsf"
                                            value={searchDto.entClsf || ""}
                                            onChange={(e) =>
                                                setSearchDto({...searchDto, entClsf: e.target.value})
                                            }
                                    >
                                        <option value="">전체</option>
                                        {comCdClsfList.map((item, index) => (
                                            <option value={item.comCd} key={item.comCd}>
                                                {item.comCdNm}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>

                            {/*<li className="inputBox type1">*/}
                            {/*    <p className="title">업종</p>*/}
                            {/*    <div className="itemBox">*/}
                            {/*        <select className="selectGroup"*/}
                            {/*                id="entTpbiz"*/}
                            {/*                value={searchDto.entTpbiz || ""}*/}
                            {/*                onChange={(e) =>*/}
                            {/*                    setSearchDto({...searchDto, entTpbiz: e.target.value})*/}
                            {/*                }*/}
                            {/*        >*/}
                            {/*            <option value="">전체</option>*/}
                            {/*            {comCdTpbizList.map((item, index) => (*/}
                            {/*                <option value={item.comCd} key={item.comCd}>*/}
                            {/*                    {item.comCdNm}*/}
                            {/*                </option>*/}
                            {/*            ))}*/}
                            {/*        </select>*/}
                            {/*    </div>*/}
                            {/*</li>*/}

                            <li className="inputBox type1">
                                <p className="title">공개 여부</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="actvtnYn"
                                            value={searchDto.rlsYn || ""}
                                            onChange={(e) =>
                                                setSearchDto({...searchDto, rlsYn: e.target.value})
                                            }
                                    >
                                        <option value="">전체</option>
                                        <option value="Y">공개</option>
                                        <option value="N">비공개</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="searchType"
                                            name="searchType"
                                            value={searchDto.searchType || ""}
                                            title="검색유형"
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, searchType: e.target.value})
                                            }}>
                                        <option value="">전체</option>
                                        <option value="mvnEntNm">기업명</option>
                                        <option value="rpsvNm">대표자</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input
                                        type="text"
                                        name="searchVal"
                                        value={searchDto.searchVal || ""}
                                        placeholder=""
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchVal: e.target.value})
                                        }}
                                        onKeyDown={activeEnter}
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button
                                type="button"
                                className="refreshBtn btn btn1 gray"
                                onClick={searchReset}
                            >
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point" onClick={searchHandle}>
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">
                            전체 : <span className="red">{paginationInfo?.totalRecordCount}</span>건
                            페이지 : <span
                            className="red">{paginationInfo?.currentPageNo}/{paginationInfo?.totalPageCount}</span>
                        </p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red" onClick={dataExcelDownload}>
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                            <button type="button" className="btn btn2 uploadBtn black" onClick={() => ComScript.openModal("uploadModal")}>
                                <div className="icon"></div>
                                <span>엑셀 업로드</span>
                            </button>
                        </div>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>게시판</caption>
                            <thead>
                            <tr>
                                <th className="th1"><p>번호</p></th>
                                <th className="th3"><p>분류</p></th>
                                <th className="th4"><p>기업명</p></th>
                                <th className="th1"><p>대표자</p></th>
                                <th className="th2"><p>대표전화</p></th>
                                <th className="th1"><p>업종</p></th>
                                <th className="th5"><p>공개여부</p></th>
                                <th className="th5"><p>설정 보기</p></th>
                                <th className="th5"><p>목록 보기</p></th>
                            </tr>
                            </thead>
                            <tbody>
                            {rcList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) =>{
                                getRcList({
                                   ...searchDto,
                                   pageIndex: passedPage
                                });
                            }
                        }
                        />
                        <NavLink
                            to={URL.RESIDENT_COMPANY_CREATE}
                            state={{
                                mode:CODE.MODE_CREATE
                            }}
                        >
                        <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="uploadModal modalCon">
                <div className="bg" onClick={() => ComScript.closeModal("uploadModal")}></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="top">
                            <h2 className="title">기업정보 일괄 등록</h2>
                            <div className="close" onClick={() => ComScript.closeModal("uploadModal")}>
                                <div className="icon"></div>
                            </div>
                        </div>
                        <div className="box">
                            <form>
                                <div className="inputBox type1 file">
                                    <p className="title">기업정보 파일</p>
                                    <div className="input">
                                        <p className="file_name">{uploadFileName}</p>
                                        <label>
                                            <small className="text btn">파일 선택</small>
                                            <input type="file" name="file" id="file"
                                                   accept=".xlsx"
                                                   onChange={excelUploadEvent}/>
                                        </label>
                                    </div>
                                </div>
                                <div className="botText">
                                    <a onClick={excelUploadSample} className="cursorTag">
                                        <span className="point">[ 양식파일.xlsx ]</span>
                                    </a>
                                    <span>양식파일을 다운로드 받은 후 작성해서 업로드 해주세요.</span>
                                </div>
                                <div className="buttonBox">
                                    <button type="button" className="clickBtn" onClick={excelDataSave}><span>등록</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OperationalSupport;
