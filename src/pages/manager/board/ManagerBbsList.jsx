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
    const [bbsList, setAuthorityList] = useState([]);

    const checkGroupAllCheck = (e) => {
        let checkBoolean = e.target.checked;
        document.getElementsByName("bbsCheck").forEach(function (item, index){
            item.checked = checkBoolean;
        });
    }

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
                    bbsList.push(
                        <tr>
                            <td colSpan="9">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.bbsList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.bbsSn}>
                                <td>
                                    <input type="checkbox" name="bbsCheck" value={item.bbsSn}/>
                                </td>
                                <td>{item.bbsNm}</td>
                                <td>{item.bbsType == "0" ? "일반게시판" : item.bbsType == "1" ? "faQ" : "QnA"}</td>
                                <td>{item.wrtrRlsYn === "Y" ? "공개" : "비공개"}</td>
                                <td>{item.atchFileYn === "Y" ? "가능" : "불가능"}</td>
                                <td>{item.cmntPsbltyYn === "Y" ? "가능" : "불가능"}</td>
                                <td>{item.replyPsbltyYn === "Y" ? "사용" : "미사용"}</td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "미사용"}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                            </tr>
                        );
                    });
                    setAuthorityList(dataList);
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
                                                bbsTypeRef.current.value = e.target.value;
                                            }}
                                        >
                                            <option value="0">일반게시판</option>
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
                                                searchDto && searchDto.searchWrd
                                            }
                                            placeholder=""
                                            ref={bbsNmRef}
                                            onChange={(e) => {
                                                bbsNmRef.current.value = e.target.value;
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                retrieveList({
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
                                <li>
                                    <Link
                                        to={URL.MANAGER_BBS_CREATE}
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
                                    <col width="50"/>
                                    <col/>
                                    <col width="100"/>
                                    <col width="150"/>
                                    <col width="150"/>
                                    <col width="100"/>
                                    <col width="100"/>
                                    <col width="80"/>
                                    <col width="100"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox" name="authorityCheck"
                                           onClick={checkGroupAllCheck}
                                        />
                                    </th>
                                    <th>게시판명</th>
                                    <th>게시판유형</th>
                                    <th>작성자공개유무</th>
                                    <th>파일첨부가능여부</th>
                                    <th>댓글가능여부</th>
                                    <th>답글사용유무</th>
                                    <th>사용여부</th>
                                    <th>생성일</th>
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
                                        getAuthorityList({
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
