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
import 'bootstrap/dist/css/bootstrap.css';
import moment from "moment/moment.js";


function ManagerPst(props) {
    const location = useLocation();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
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
            const pstListURL = "/bbsApi/getPstList.do";
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
                            <td colSpan="4">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.pstList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.pstSn}>
                                <td>{resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}</td>
                                <td style={{textAlign:"left", paddingLeft:"15px"}}>
                                    <Link to={URL.MANAGER_PST_MODIFY}
                                          mode={CODE.MODE_MODIFY}
                                          state={{ pstSn: item.pstSn }}
                                          >
                                        {item.pstTtl}
                                    </Link>
                                </td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "미사용"}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
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
                            <Link to={URL.MANAGER_BBS_LIST2}>게시글관리</Link>
                        </li>
                        <li>게시판관리</li>
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
                                                setSearchDto({ ...searchDto, searchVal: e.target.value })
                                            }}
                                            onKeyDown={activeEnter}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                getPstList({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    searchType : searchTypeRef.current.value,
                                                    searchVal : searchValRef.current.value,
                                                });
                                            }}
                                        >
                                          조회
                                        </button>
                                  </span>
                                </li>
                                <li>
                                    <Link
                                        to={URL.MANAGER_PST_CREATE}
                                        className="btn btn_blue_h46 pd35"
                                        mode={CODE.MODE_CREATE}
                                    >
                                        등록
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
                                    <col width="80"/>
                                    <col width="100"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>제목</th>
                                    <th>사용여부</th>
                                    <th>생성일</th>
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
