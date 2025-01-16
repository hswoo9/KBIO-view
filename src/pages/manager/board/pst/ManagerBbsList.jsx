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


function ManagerBbs(props) {
    const location = useLocation();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            bbsType: "",
            searchWrd: "",
            bbsNm : "",
            actvtnYn : "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({});
    const bbsTypeRef = useRef();
    const bbsNmRef = useRef();
    const [bbsList, setBbsList] = useState([]);

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getBbsList(searchDto);
        }
    };

    const getBbsList = useCallback(
        (searchDto) => {
            const bbsListURL = "/bbsApi/getBbsList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                bbsListURL,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan="4">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.bbsList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.bbsSn}>
                                <td>
                                    {item.bbsNm}
                                    {/*<Link to={URL.MANAGER_BBS_MODIFY}*/}
                                    {/*      mode={CODE.MODE_MODIFY}*/}
                                    {/*      state={{ bbsSn: item.bbsSn }}*/}
                                    {/*      >*/}
                                    {/*    {item.bbsNm}*/}
                                    {/*</Link>*/}
                                </td>
                                <td>{item.bbsType == "0" ? "일반" : item.bbsType == "1" ? "faQ" : "QnA"}</td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "미사용"}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>
                                    <Link to={URL.MANAGER_PST_LIST}
                                          state={{ bbsSn: item.bbsSn }}
                                    >
                                        <BTButton variant="primary" size="sm">게시글 관리</BTButton>
                                    </Link>
                                </td>
                            </tr>
                        );
                    });
                    setBbsList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [bbsList, searchDto]
    );

    useEffect(() => {
        getBbsList(searchDto);
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
                            <Link to={URL.MANAGER_BBS_LIST}>게시판관리</Link>
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
                                    <span className="lb">게시판유형</span>
                                    <label className="f_select" htmlFor="bbsType">
                                        <select
                                            id="bbsType"
                                            name="bbsType"
                                            title="게시판유형선택"
                                            ref={bbsTypeRef}
                                            onChange={(e) => {
                                                getBbsList({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    bbsType: bbsTypeRef.current.value,
                                                    bbsNm: bbsNmRef.current.value,
                                                });
                                            }}
                                        >
                                            <option value="">선택</option>
                                            <option value="0">일반</option>
                                            <option value="1">FAQ</option>
                                            <option value="2">QNA</option>
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
                                                searchDto && searchDto.bbsNm
                                            }
                                            placeholder=""
                                            ref={bbsNmRef}
                                            onChange={(e) => {
                                                setSearchDto({ ...searchDto, bbsNm: e.target.value })
                                            }}
                                            onKeyDown={activeEnter}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                getBbsList({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    bbsType: bbsTypeRef.current.value,
                                                    bbsNm: bbsNmRef.current.value,
                                                });
                                            }}
                                        >
                                          조회
                                        </button>
                                  </span>
                                </li>
                                {/*<li>*/}
                                {/*    <Link*/}
                                {/*        to={URL.MANAGER_BBS_CREATE}*/}
                                {/*        className="btn btn_blue_h46 pd35"*/}
                                {/*        mode={CODE.MODE_CREATE}*/}
                                {/*    >*/}
                                {/*        등록*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                            </ul>
                        </div>

                        <div className="board_list BRD006">
                            <BtTable
                                striped bordered hover size="sm"
                                className="btTable"
                            >
                                <colgroup>
                                    <col/>
                                    <col width="100"/>
                                    <col width="100"/>
                                    <col width="100"/>
                                    <col width="150"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>게시판명</th>
                                    <th>게시판유형</th>
                                    <th>사용여부</th>
                                    <th>생성일</th>
                                    <th>관리</th>
                                </tr>
                                </thead>
                                <tbody>
                                {bbsList}
                                </tbody>
                            </BtTable>
                            <div className="board_bot">
                            <EgovPaging
                                    pagination={paginationInfo}
                                    moveToPage={(passedPage) => {
                                        getBbsList({
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

export default ManagerBbs;
