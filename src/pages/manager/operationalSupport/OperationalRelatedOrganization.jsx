import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { getSessionItem } from "@/utils/storage";
import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import EgovPaging from "@/components/EgovPaging";
import {getComCdList, excelExport, fileUpload} from "@/components/CommonComponents";
import Swal from 'sweetalert2';
import * as ComScript from "@/components/CommonScript";

function OperationalRelatedOrganization(props) {
    const sessionUser = getSessionItem("loginUser");
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            searchVal: "",
            searchType: "",
            clsf : "",
            // tpbiz: "",
            actvtnYn : ""
        }
    );

    const [selectedOption, setSelectedOption] = useState("");
    const [paginationInfo, setPaginationInfo] = useState({});
    const [rcList, setRcList] = useState([]);

    const [comCdClsfList, setComCdClsfList] = useState([]);
    const [comCdTpbizList, setComCdTpbizList] = useState([]);

    const [uploadFileName, setUploadFileName] = useState("");
    const [uploadExcelData, setUploadExcelData] = useState([]);
    useEffect(() => {
        if(uploadExcelData.length > 0){
            uploadExcelData.forEach(function(item, index){
                item.relInstNm = item['기업명'];
                item.brno = String(item['사업자등록번호']).replaceAll("-", "");
                item.rpsvNm = item['대표자'];
                item.entTelno = String(item['대표전화']).replaceAll("-", "");
                item.clsf = item['분류코드(시트참조)'];
                item.tpbiz = item['업종코드(시트참조)'];
                item.creatrSn = sessionUser?.userSn;
                item.actvtnYn = "Y";
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
                        const requestURL = "/relatedApi/setRelInstList.do";
                        const requestOptions = {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json",
                            },
                            body: JSON.stringify({tblRelInstList : uploadExcelData})
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

    const handleSearch = () => {
        setSearchDto({ ...searchDto, pageIndex: 1 });
        getRcList(searchDto);
    };

    const dataExcelDownload = useCallback(() => {
        let excelParams = searchDto;
        excelParams.pageIndex = 1;
        excelParams.pageUnit = paginationInfo?.totalRecordCount || 9999999999

        const requestURL = "/relatedApi/getRelInstList.do";
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
                                clsfNm : item.clsfNm || " ",
                                tpbizNm : item.tpbizNm || " ",
                                relInstNm : item.tblRelInst.relInstNm || " ",
                                rpsvNm : item.tblRelInst.rpsvNm || " ",
                                entTelno : ComScript.formatTelNumber(item.tblRelInst.entTelno),
                                actvtnYn : item.tblRelInst.actvtnYn === "Y" ? "공개" : "비공개"
                            }
                        )
                    });
                }

                let sheetDatas = [{
                    sheetName : "유관기관 관리",
                    header : ['번호', '분류', '업종', '기업명', '대표자', '대표전화', '공개여부'],
                    row : rowDatas
                }];
                excelExport("유관기관 관리", sheetDatas);
            }
        )
    });

    const excelUploadSample = () => {
        let sheetDatas = [{
            sheetName : "유관기관 업로드 양식",
            header : ['기업명', '사업자등록번호', '대표자', '대표전화', '분류코드(시트참조)', '업종코드(시트참조)'],
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
        excelExport("유관기관 업로드 양식", sheetDatas);
    }

    const getRcList = useCallback(
        (searchDto)=>{


            const rcListUrl = "/relatedApi/getRelInstList.do";
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
                    dataList.push(
                        <tr key="noData">
                            <td colSpan="5">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.rcList.forEach(function (item,index){
                        if(index === 0) dataList = [];

                        dataList.push(
                            <tr key={`${item.relInstSn}_${index}`}>
                                <td>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td>{item.clsfNm}</td>
                                <td>{item.tpbizNm}</td>
                                <td>
                                    <Link to={{pathname: URL.RELATED_COMPANY_MODIFY}}
                                          state={{
                                              relInstSn: item.tblRelInst.relInstSn,
                                              mode: CODE.MODE_MODIFY
                                          }}
                                    >
                                        {item.tblRelInst.relInstNm}
                                    </Link>
                                </td>
                                <td>{item.tblRelInst.rpsvNm}</td>
                                <td>{ComScript.formatTelNumber(item.tblRelInst.entTelno)}</td>
                                <td>{item.tblRelInst.rlsYn === "Y" ? "공개" : "비공개"}</td>
                                <td>
                                    <Link to={URL.MANAGER_RELATED_MANAGER}
                                          state={{
                                              relInstSn: item.tblRelInst.relInstSn,
                                              rpsvNm: item.tblRelInst.rpsvNm,
                                              entTelno: item.tblRelInst.entTelno,
                                              tpbiz: item.tblRelInst.tpbiz
                                          }}>
                                        <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                    </Link>
                                </td>
                                <td>
                                    <NavLink to={URL.MANAGER_RELATED_MEMBER}
                                             state={{
                                                 relInstSn: item.tblRelInst.relInstSn,
                                                 rpsvNm: item.tblRelInst.rpsvNm,
                                                 entTelno: item.tblRelInst.entTelno,
                                                 tpbiz: item.tblRelInst.tpbiz
                                             }}>
                                        <button type="button" className="listBtn"><span>직원 목록</span></button>
                                    </NavLink>
                                </td>
                            </tr>
                        );
                    });
                    setRcList(dataList);
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

    const searchReset = () => {
        setSearchDto({
            ...searchDto,
            pageIndex: 1,
            searchVal: "",
            searchType: "",
            clsf : "",
            // tpbiz: "",
            actvtnYn : ""
        });

        getRcList({
            ...searchDto,
            pageIndex: 1,
            searchVal: "",
            searchType: "",
            clsf : "",
            // tpbiz: "",
            actvtnYn : ""
        });
    }

    const searchHandle = () => {
        getRcList(searchDto);
    }


    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>유관기관 관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">분류</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                        id="clsf"
                                        value={searchDto.clsf || ""}
                                        onChange={(e) =>
                                            setSearchDto({...searchDto, clsf: e.target.value})
                                        }
                                    >
                                        <option value="">전체</option>
                                        {comCdClsfList.map((item, index) => (
                                            <option value={item.comCd} key={`${item.comCd}_clsf`}>
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
                            {/*                id="tpbiz"*/}
                            {/*                value={searchDto.tpbiz || ""}*/}
                            {/*                onChange={(e) =>*/}
                            {/*                    setSearchDto({...searchDto, tpbiz: e.target.value})*/}
                            {/*                }*/}
                            {/*        >*/}
                            {/*            <option value="">전체</option>*/}
                            {/*            {comCdTpbizList.map((item, index) => (*/}
                            {/*                <option value={item.comCd} key={`${item.comCd}_tpbiz`}>*/}
                            {/*                    {item.comCdNm}*/}
                            {/*                </option>*/}
                            {/*            ))}*/}
                            {/*        </select>*/}
                            {/*    </div>*/}
                            {/*</li>*/}

                            <li className="inputBox type1">
                                <p className="title">공개 여부</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
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
                                    <select
                                        className="selectGroup"
                                        value={searchDto.searchType || ""}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchType: e.target.value})
                                        }}>
                                        <option value="">전체</option>
                                        <option value="relInstNm">기업명</option>
                                        <option value="rpsvNm">대표자</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input
                                        type="text"
                                        value={searchDto.searchVal}
                                        name="search"
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchVal: e.target.value});
                                        }}
                                        placeholder="검색어를 입력해주세요"
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
                            <caption>유관기관</caption>
                            <thead>
                            <tr>
                                <th className="th1"><p>번호</p></th>
                                <th className="th2"><p>분류</p></th>
                                <th className="th3"><p>업종</p></th>
                                <th className="th3"><p>기업명</p></th>
                                <th className="th4"><p>대표자</p></th>
                                <th className="th2"><p>대표전화</p></th>
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
                            to={URL.RELATED_COMPANY_CREATE}
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

export default OperationalRelatedOrganization;
