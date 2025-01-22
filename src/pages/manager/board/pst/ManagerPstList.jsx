import React, {useState, useEffect, useCallback, useRef} from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftBoard";

import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from "moment/moment.js";
import {getSessionItem} from "../../../../utils/storage.js";


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
    const [pstList, setPstList] = useState([]);
    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getPstList(searchDto);
        }
    };

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
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan={searchDto.atchFileYn == "Y" ? "5" : "4"}>검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.pstList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화
                        let reTag = "";
                        let rlsYnFlag = false;
                        let pstSn = "";

                        if(item.rlsYn == "N"){
                            rlsYnFlag = true;
                        }
                        if(sessionUser.userSe == "ADM"){
                            rlsYnFlag = true;
                        }

                        if(sessionUser.userSn == item.creatrSn){
                            rlsYnFlag = true;
                            pstSn = item.pstSn;
                        }

                        if(pstSn == item.orgnlPstSn){
                            rlsYnFlag = true;
                        }

                        if(item.orgnlPstSn != null) {  // 답글
                            reTag = "<span style='color:#5b72ff ' class='reply_row'>[RE]</span>"
                            if (resp.result.pstList.find(v => v.pstSn == item.orgnlPstSn).rlsYn == "N") {
                                rlsYnFlag = true;
                            }
                        }

                        dataList.push(
                            <tr key={item.pstSn}>
                                <td>
                                    {item.upendNtcYn == "Y" ?
                                        "공지" :
                                        resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td style={{textAlign: "left", paddingLeft: "15px"}}>
                                    <Link to={URL.MANAGER_PST_DETAIL}
                                          mode={CODE.MODE_READ}
                                          state={{pstSn: item.pstSn}}
                                    >
                                        {reTag ? <span dangerouslySetInnerHTML={{__html: reTag}} style={{marginRight: "5px"}}></span> : ""}
                                        {item.rlsYn == "Y" ? (rlsYnFlag ? item.pstTtl : item.pstTtl.replaceAll(/./g, '*')) : item.pstTtl}
                                    </Link>
                                </td>
                                {searchDto.atchFileYn == "Y" && (
                                    <td>{item.fileCnt != 0 ? "있음" : "없음"}</td>
                                )}
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "미사용"}</td>
                            </tr>
                        );
                    });
                    setPstList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [pstList, searchDto]
    );

    useEffect(() => {
        getPstList(searchDto);
    }, []);

    return (
        <div className="container">
            <div className="c_wrap">
                <div className="location">
                    <ul>
                        <li>
                            <Link to={URL.MANAGER} className="home">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={URL.MANAGER_BBS_LIST2}
                                state={{bbsSn : searchDto.bbsSn}}
                            >
                                게시글관리
                            </Link>
                        </li>
                        <li>게시글관리</li>
                    </ul>
                </div>
                <div className="layout">
                    <EgovLeftNav></EgovLeftNav>
                    <div className="contents BOARD_CREATE_LIST" id="contents">
                        <div className="condition">
                            <ul>
                                <li className="third_1 L">
                                    <span className="lb">검색유형</span>
                                    <label className="f_select" htmlFor="bbsType">
                                        <select
                                            id="bbsType"
                                            name="bbsType"
                                            title="검색유형"
                                            ref={searchTypeRef}
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, searchType: e.target.value})
                                            }}
                                        >
                                            <option value="">선택</option>
                                            <option value="pstTtl">제목</option>
                                            <option value="pstCn">내용</option>
                                        </select>
                                    </label>
                                </li>
                                <li className="third_2 R">
                                    <span className="lb">검색어</span>
                                    <span className="f_search w_400">
                                        <input
                                            type="text"
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
                                        <button
                                            type="button"
                                            onClick={() => {
                                                getPstList({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    searchType: searchTypeRef.current.value,
                                                    searchVal: searchValRef.current.value,
                                                });
                                            }}
                                        >
                                          조회
                                        </button>
                                  </span>
                                </li>
                                <li style={{
                                    float: "right",
                                    marginTop: "10px"
                                }}>
                                    <Link
                                        to={URL.MANAGER_PST_CREATE}
                                        className="btn btn_blue_h46 pd35"
                                        state={{bbsSn : searchDto.bbsSn}}
                                        mode={CODE.MODE_CREATE}
                                    >
                                        등록
                                    </Link>
                                    <Link to={URL.MANAGER_BBS_LIST2} className="btn btn_blue_h46 pd35" style={{marginLeft: "5px"}}>
                                        게시판 목록
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="board_list BRD006">
                            <BtTable
                                striped bordered hover size="sm"
                                className="btTable"
                            >
                                <colgroup>
                                    <col width="80"/>
                                    <col/>
                                    {searchDto.atchFileYn == "Y" && (
                                    <col width="80"/>
                                    )}
                                    <col width="100"/>
                                    <col width="80"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>제목</th>
                                    {searchDto.atchFileYn == "Y" && (
                                    <th>첨부파일</th>
                                    )}
                                    <th>등록일</th>
                                    <th>사용여부</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pstList}
                                </tbody>
                            </BtTable>
                            <div className="board_bot">
                                <EgovPaging
                                    pagination={paginationInfo}
                                    moveToPage={(passedPage) => {
                                        getPstList({
                                            ...searchDto,
                                            pageIndex: passedPage
                                        });
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerPst;
