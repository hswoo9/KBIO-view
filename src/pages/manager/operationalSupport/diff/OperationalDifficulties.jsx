import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import { getSessionItem } from "@/utils/storage";
import {getComCdList, excelExport} from "@/components/CommonComponents";
import moment from "moment/moment.js";
import ManagerLeftOperationalSupport from "@/components/manager/ManagerLeftOperationalSupport";

function OperationalDifficulties(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();

    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            startDt : "",
            endDt : "",
            answerYn: "",
            dfclMttrFld : "",
            searchType: "",
            searchVal : "",
        }
    );
    /** 애로사항 분야 코드 */
    const [dfclMttrFldList, setDfclMttrFldList] = useState([]);

    const [dfclMttrList, setDfclMttrList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getDfclMttrList(searchDto);
        }
    };

    const dataExcelDownload = useCallback(() => {
        let excelParams = searchDto;
        excelParams.pageIndex = 1;
        excelParams.pageUnit = paginationInfo?.totalRecordCount || 9999999999

        const requestURL = "/diffApi/getDfclMttrList.do";
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
                if(resp.result.diffList != null){
                    resp.result.diffList.forEach(function (item, index) {
                        rowDatas.push(
                            {
                                number : resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index,
                                dfclMttrFldNm : item.dfclMttrFldNm || " ",
                                ttl : item.ttl || " ",
                                kornFlnm : item.kornFlnm || " ",
                                frstCrtDt : moment(item.frstCrtDt).format('YYYY-MM-DD'),
                                answer : item.answer == "Y" ? "답변완료" : "답변대기"
                            }
                        )
                    });
                }

                let sheetDatas = [{
                    sheetName : "애로사항관리",
                    header : ['번호', '분류', '제목', '신청자', '신청일', '상태'],
                    row : rowDatas
                }];
                excelExport("애로사항관리", sheetDatas);
            }
        )
    });

    const getDfclMttrList = useCallback(
        (searchDto) => {
            const pstListURL = "/diffApi/getDfclMttrList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                pstListURL,
                requestOptions,
                (resp) => {
                    let dataList = [];
                    dataList.push(
                        <tr key="noData">
                            <td colSpan="6">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.diffList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={`${item.pstSn}_${index}`}>
                                <td>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td>{item.dfclMttrFldNm}</td>
                                <td>
                                    <NavLink to={URL.MANAGER_DIFFICULTIES_MODIFY}
                                          mode={CODE.MODE_MODIFY}
                                          state={{dfclMttrSn: item.dfclMttrSn}}
                                    >
                                        {item.ttl}
                                    </NavLink>
                                </td>
                                <td>{item.kornFlnm}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>{item.answer == "Y" ? "답변완료" : "답변대기"}</td>
                            </tr>
                        );
                    });
                    setDfclMttrList(dataList);
                    setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {

                }
            )
        },
        [dfclMttrList, searchDto]
    );

    useEffect(() => {
        getDfclMttrList(searchDto);
    }, []);

    useEffect(() => {
        getComCdList(15).then((data) => {
            setDfclMttrFldList(data);
        })
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftOperationalSupport/>
            <div className="inner">
                <h2 className="pageTitle"><p>애로사항관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="searchBox inputBox type1" style={{width: "55%"}}>
                                <p className="title">신청일</p>
                                <div className="input">
                                    <input type="date"
                                           id="startDt"
                                           name="startDt"
                                           style={{width: "47%"}}
                                           onChange={(e) =>
                                               setSearchDto({
                                                   ...searchDto,
                                                   startDt: moment(e.target.value).format('YYYY-MM-DD')
                                               })
                                           }
                                    /> ~&nbsp;
                                    <input type="date"
                                           id="endDt"
                                           name="endDt"
                                           style={{width: "47%"}}
                                           onChange={(e) =>
                                               setSearchDto({
                                                   ...searchDto,
                                                   endDt: moment(e.target.value).format('YYYY-MM-DD')
                                               })
                                           }
                                    />
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width: "25%"}}>
                                <p className="title">상태</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        name="answer"
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, answerYn: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="N">답변대기</option>
                                        <option value="Y">답변완료</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width: "25%"}}>
                                <p className="title">분류</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        name="dfclMttrFld"
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, dfclMttrFld: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        {dfclMttrFldList.map((item, index) => (
                                            <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width: "25%"}}>
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
                                        <option value="ttl">제목</option>
                                        <option value="kornFlnm">신청자</option>
                                        <option value="dfclMttrCn">내용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1" style={{width: "30%"}}>
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
                                    getDfclMttrList({
                                        ...searchDto,
                                        pageIndex: 1
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
                        <p className="resultText">
                            전체 : <span className="red">{paginationInfo.totalRecordCount}</span>건
                            페이지 : <span className="red">{paginationInfo.currentPageNo}/{paginationInfo.totalPageCount}</span>
                        </p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red" onClick={dataExcelDownload}>
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                        </div>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>애로사항목록</caption>
                            <colgroup>
                                <col width="80"/>
                                <col width="150"/>
                                <col/>
                                <col width="150"/>
                                <col width="150"/>
                                <col width="150"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>분류</th>
                                <th>제목</th>
                                <th>신청자</th>
                                <th>신청일</th>
                                <th>상태</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dfclMttrList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getDfclMttrList({
                                    ...searchDto,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OperationalDifficulties;
