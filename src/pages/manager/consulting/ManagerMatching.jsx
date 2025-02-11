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
import {getComCdList} from "../../../components/CommonComponents.jsx";
import moment from "moment/moment.js";

function ManagerMatching(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();

    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            cnsltSttsCd : 26,
            startDt : "",
            endDt : "",
            cnsltFld: "",
            searchType: "",
            searchVal : "",
        }
    );
    const [consultingList, setConsultingList] = useState([]);
    /** 컨설팅 분야 코드 */
    const [cnsltFldList, setCnsltFldList] = useState([]);
    /** 컨설팅 상태 코드 */
    const [cnsltSttsCdList, setCnsltSttsCd] = useState([]);

    const [paginationInfo, setPaginationInfo] = useState({});

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getConsultingList(searchDto);
        }
    };

    const getConsultingList = useCallback(
        (searchDto) => {
            const pstListURL = "/consultingApi/getConsultingList.do";
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
                    // let dataList = [];
                    // dataList.push(
                    //     <tr>
                    //         <td colSpan={resp.result.bbs.atchFileYn == "Y" ? "5" : "4"}>검색된 결과가 없습니다.</td>
                    //     </tr>
                    // );
                    //
                    // resp.result.pstList.forEach(function (item, index) {
                    //     if (index === 0) dataList = []; // 목록 초기화
                    //
                    //     dataList.push(
                    //         <tr key={item.pstSn}>
                    //             <td>
                    //                 {item.upendNtcYn == "Y" ?
                    //                     "공지" :
                    //                     resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                    //             </td>
                    //             <td style={{textAlign: "left", paddingLeft: "15px"}}>
                    //                 <a onClick={() => {
                    //                     resp.result.authrt.inqAuthrt == "Y" ? pstDetailHandler(item, rlsYnFlag) : Swal.fire("읽기 권한이 없습니다.")
                    //                 }}
                    //                    style={{cursor:"pointer"}}>
                    //                     {reTag ? <span dangerouslySetInnerHTML={{__html: reTag}} style={{marginRight: "5px"}}></span> : ""}
                    //                     {item.rlsYn == "Y" ? (rlsYnFlag ? item.pstTtl : item.pstTtl.replaceAll(/./g, '*')) : item.pstTtl}
                    //                 </a>
                    //             </td>
                    //             {resp.result.bbs.atchFileYn == "Y" && (
                    //                 <td>{item.fileCnt != 0 ? "있음" : "없음"}</td>
                    //             )}
                    //             <td>{item.pstInqCnt}</td>
                    //             <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                    //             <td>{item.rlsYn == "Y" ? (rlsYnFlag ? item.kornFlnm : item.kornFlnm.replaceAll(/./g, '*')) : item.kornFlnm}</td>
                    //         </tr>
                    //     );
                    // });
                    // setConsultingList(dataList);
                    // setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [consultingList, searchDto]
    );

    useEffect(() => {
        getConsultingList(searchDto);
    }, []);

    useEffect(() => {
        getComCdList(10).then((data) => {
            setCnsltFldList(data);
        })
    }, []);

    useEffect(() => {
        getComCdList(14).then((data) => {
            setCnsltSttsCd(data);
        })
    }, []);


    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>전문가매칭관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="searchBox inputBox type1" style={{width:"55%"}}>
                                <p className="title">신청일</p>
                                <div className="input">
                                    <input type="date"
                                           id="startDt"
                                           name="startDt"
                                           style={{width:"47%"}}
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
                                           style={{width:"47%"}}
                                           onChange={(e) =>
                                               setSearchDto({
                                                   ...searchDto,
                                                   endDt: moment(e.target.value).format('YYYY-MM-DD')
                                               })
                                           }
                                    />
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width:"25%"}}>
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
                                            <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width:"25%"}}>
                                <p className="title">상태</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        name="cnsltSttsCd"
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, cnsltSttsCd: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        {cnsltSttsCdList.map((item, index) => (
                                            <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width:"25%"}}>
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
                            <li className="searchBox inputBox type1" style={{width:"30%"}}>
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
                            <button type="button" className="searchBtn btn btn1 point">
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">전체 : <span className="red">0</span>건 페이지 : <span
                            className="red">1/400</span></p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red">
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
                                <th>컨설턴트</th>
                                <th>소속</th>
                                <th>제목</th>
                                <th>신청자</th>
                                <th>신청일</th>
                                <th>상태</th>
                                <th>만족도</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getConsultingList({
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

export default ManagerMatching;
