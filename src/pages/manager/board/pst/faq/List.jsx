import React, {useState, useEffect, useCallback, useRef} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import { getComCdList } from "@/components/CommonComponents";
import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";
import moment from "moment/moment.js";
import {getSessionItem} from "@/utils/storage";

import PstSatisfaction from "@/components/PstSatisfaction";
import * as ComScript from "@/components/CommonScript";

function ManagerPst(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            atchFileYn : location.state?.atchFileYn,
            pageIndex: 1,
            bbsSn : location.state?.bbsSn,
            searchType: "",
            searchVal : "",
            actvtnYn : "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({});
    const [bbsDetail, setBbsDetail] = useState([]);
    const [pstList, setPstList] = useState([]);
    const searchTypeRef = useRef();
    const searchValRef = useRef();
    const [selectPstSn, setSelectPstSn] = useState("");
    useEffect(() => {
    }, [selectPstSn]);
    const [pstEvlData, setPstEvlData] = useState({});
    useEffect(() => {
    }, [pstEvlData]);

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getPstList(searchDto);
        }
    };

    const modelOpenEvent = (e) => {
        setSelectPstSn(e.currentTarget.closest("tr").getAttribute("fk"));
        ComScript.openModal("programModal");
    }

    const getPstList = useCallback(
        (searchDto) => {
            const pstListURL = "/pstApi/getPstList.do";
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
                    setBbsDetail(resp.result.bbs);
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="0">
                            <td colSpan="5">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.pstList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.pstSn} fk={item.pstSn}>
                                <td> {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}</td>
                                {resp.result.bbs.pstCtgryYn == "Y" && (
                                    <td>{item.pstClsfNm}</td>
                                )}
                                <td style={{textAlign: "left", paddingLeft: "15px"}}>
                                    <Link to={URL.MANAGER_PST_FAQ_DETAIL}
                                          mode={CODE.MODE_READ}
                                          state={{pstSn: item.pstSn}}
                                    >
                                        {item.pstTtl}
                                    </Link>
                                </td>
                                {resp.result.bbs.atchFileYn == "Y" && (
                                    <td>{item.fileCnt != 0 ? "있음" : "없음"}</td>
                                )}
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "미사용"}</td>
                                <td><button type="button" onClick={modelOpenEvent}><span>보기</span></button></td>
                            </tr>
                        );
                    });
                    setPstList(dataList);
                },
                function (resp) {

                }
            )
        },
        [pstList, searchDto]
    );

    useEffect(() => {
        getPstList(searchDto);
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>게시글관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">검색유형</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="bbsTypeNm"
                                            name="bbsTypeNm"
                                            title="검색유형"
                                            ref={searchTypeRef}
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, searchType: e.target.value})
                                            }}
                                    >
                                        <option value="">전체</option>
                                        <option value="pstTtl">제목</option>
                                        <option value="pstCn">내용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input type="text"
                                           name=""
                                           defaultValue={
                                               searchDto && searchDto.searchVal
                                           }
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
                            <button type="button"
                                    className="searchBtn btn btn1 point"
                                    onClick={() => {
                                        getPstList({
                                            ...searchDto,
                                            pageIndex: 1,
                                            searchType: searchTypeRef.current.value,
                                            searchVal: searchValRef.current.value,
                                        });
                                    }}
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>게시글목록</caption>
                            <colgroup>
                                <col width="80"/>
                                {bbsDetail.pstCtgryYn == "Y" && (
                                    <col width="80"/>
                                )}
                                <col/>
                                {bbsDetail.atchFileYn == "Y" && (
                                    <col width="80"/>
                                )}
                                <col width="120"/>
                                <col width="80"/>
                                <col width="80"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                {bbsDetail.pstCtgryYn == "Y" && (
                                    <th>분류</th>
                                )}
                                <th>제목</th>
                                {bbsDetail.atchFileYn == "Y" && (
                                    <th>첨부파일</th>
                                )}
                                <th>등록일</th>
                                <th>사용여부</th>
                                <th>만족도</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pstList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getPstList({
                                    ...searchDto,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                        <NavLink
                            to={URL.MANAGER_PST_FAQ_CREATE}
                            state={{bbsSn: searchDto.bbsSn}}
                            mode={CODE.MODE_CREATE}
                        >
                            <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>
                        <NavLink
                            to={URL.MANAGER_BBS_LIST2}
                        >
                            <button type="button" className="clickBtn black"><span>게시판 목록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
            <PstSatisfaction  data={selectPstSn}/>
        </div>
    );
}

export default ManagerPst;
