import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftConsulting";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import { getSessionItem } from "@/utils/storage";
import {getComCdList, excelExport} from "@/components/CommonComponents";

function ManagerExpert(props) {

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            cnsltFld: "",
            searchType: "",
            searchVal : "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({
        currentPageNo: 1,
        firstPageNo: 1,
        firstPageNoOnPageList: 1,
        firstRecordIndex: 0,
        lastPageNo: 1,
        lastPageNoOnPageList: 1,
        lastRecordIndex: 10,
        pageSize: 10,
        recordCountPerPage: 10,
        totalPageCount: 15,
        totalRecordCount: 158
    });

    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const [consultMemberList, setAuthorityList] = useState([]);
    /** 컨설팅 분야 코드 */
    const [cnsltFldList, setCnsltFldList] = useState([]);

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getConsultMemberList(searchDto);
        }
    };

    const dataExcelDownload = useCallback(() => {
        let excelParams = searchDto;
        excelParams.pageIndex = 1;
        excelParams.pageUnit = paginationInfo?.totalRecordCount || 9999999999

        const requestURL = "/consultingApi/getConsultantAdminList.do";
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
                if(resp.result.consultantList != null){
                    resp.result.consultantList.forEach(function (item, index) {
                        rowDatas.push(
                            {
                                number : resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index,
                                cnsltFldNm : item.cnsltFldNm || " ",
                                kornFlnm : item.tblUser.kornFlnm || " ",
                                ogdpNm : item.tblCnslttMbr.ogdpNm || " ",
                                jbpsNm : item.tblCnslttMbr.jbpsNm || " ",
                                crrPrd : item.tblCnslttMbr.crrPrd + " 년" || " ",
                                cnsltActv : item.tblCnslttMbr.cnsltActv === "Y" ? "공개" : "비공개",
                                cnsltCount : item.cnsltCount + " 건" || " ",
                                simpleCount : item.simpleCount + " 건" || " ",
                            }
                        )
                    });
                }

                let sheetDatas = [{
                    sheetName : "전문가관리",
                    header : ['번호', '자문분야', '성명', '소속' ,'직위' ,'경력', '컨설팅 활동', '컨설팅의뢰', '간편상담'],
                    row : rowDatas
                }];
                excelExport("전문가관리", sheetDatas);
            }
        )
    });

    const getConsultMemberList = useCallback(
        (searchDto) => {
            const consultMemberListUrl = "/consultingApi/getConsultantAdminList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                consultMemberListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="no-data">
                            <td colSpan="9">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.consultantList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.tblUser.userSn}>
                                <td>{resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}</td>
                                <td>{item.cnsltFldNm}</td>
                                <td>
                                    <NavLink to={URL.MANAGER_COUSULTANT_DETAIL}
                                             state={{userSn : item.tblUser.userSn}}
                                    >
                                    {item.tblUser.kornFlnm}
                                    </NavLink>
                                </td>
                                <td>{item.tblCnslttMbr.ogdpNm}</td>
                                <td>{item.tblCnslttMbr.jbpsNm}</td>
                                <td>{item.tblCnslttMbr.crrPrd} 년</td>
                                <td>{item.tblCnslttMbr.cnsltActv === 'Y' ? '공개' :
                                     item.tblCnslttMbr.cnsltActv === 'N' ? '비공개' : ''}
                                </td>
                                <td>{item.cnsltCount} 건</td>
                                <td>{item.simpleCount} 건</td>
                            </tr>
                        );
                    });
                    setAuthorityList(dataList);
                },
                function (resp) {

                }
            );

        },
        [consultMemberList, searchDto]
    );

    useEffect(() => {
        getComCdList(10).then((data) => {
            setCnsltFldList(data);
        });
    }, []);

    useEffect(()=>{
        getConsultMemberList(searchDto);
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>전문가관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">자문분야</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        name="cnsltFld"
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, cnsltFld: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        {cnsltFldList.map((item, index) => (
                                            <option value={item.comCd} key={item.comCdSn}>{item.comCdNm}</option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">컨설팅 활동</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            name="cnsltActv"
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, cnsltActv: e.target.value})
                                            }}
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
                                        id="searchType"
                                        name="searchType"
                                        title="검색유형"
                                        ref={searchTypeRef}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchType: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="kornFlnm">성명</option>
                                        <option value="ogdpNm">소속</option>
                                        <option value="jbpsNm">직위</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input
                                        type="text"
                                        name="searchVal"
                                        defaultValue={searchDto.searchVal}
                                        placeholder=""
                                        ref={searchValRef}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchVal: e.target.value})
                                        }}
                                        onKeyDown={activeEnter}
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray">
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point"
                                    onClick={() => {
                                        getConsultMemberList({
                                            ...searchDto,
                                            pageIndex: 1,
                                        });
                                    }}
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">전체 : <span className="red">{paginationInfo?.totalRecordCount}</span>건 페이지 : <span className="red">{paginationInfo?.currentPageNo}/{paginationInfo?.totalPageCount}</span> </p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red" onClick={dataExcelDownload}>
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                        </div>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>전문가목록</caption>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>자문분야</th>
                                <th>성명</th>
                                <th>소속</th>
                                <th>직위</th>
                                <th>경력</th>
                                <th>컨설팅 활동</th>
                                <th>컨설팅의뢰</th>
                                <th>간편상담</th>
                            </tr>
                            </thead>
                            <tbody>
                            {consultMemberList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getConsultMemberList({
                                    ...searchDto,
                                    pageIndex: passedPage,
                                })

                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerExpert;
