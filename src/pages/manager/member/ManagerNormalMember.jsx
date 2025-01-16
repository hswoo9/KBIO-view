import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';

import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftMember";

import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";

/* bootstrip */
import MtTable from 'react-bootstrap/Table';
import MTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import moment from "moment/moment.js";

function NormalMemberList(props) {
    const location = useLocation();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            emplyrId: "",
            searchWrd: "",
            actvtnYn: "",
            userType: "",
            userNm: "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({});
    const userType = useRef();
    const userNmRef = useRef();
    const [normalMemberList, setAuthorityList] = useState([]);

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getnormalMemberList(searchDto);
        }
    };

    const getnormalMemberList = useCallback(
        (searchDto) => {
            const normalMemberListURL = "/memberApi/getNormalMemberList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                normalMemberListURL,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan="8">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getNormalMemberList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.userSn}>
                                <td>
                                <Link
                                    to={URL.MANAGER_NORMAL_MEMBER_MODIFY}
                                    mode={CODE.MODE_MODIFY}
                                    state={{userSn: item.userSn}}
                                    >
                                    {item.userNm}
                                </Link>
                                </td>
                                <td>{item.userType}</td>
                                <td>{item.emplyrId}</td>
                                <td>{item.mbtlnum}</td>
                                <td>{item.replyPosblYn}</td>
                                <td>{item.answerPosblYn}</td>
                                <td>{item.useYn}</td>
                                <td>{item.creatDt}</td>
                            </tr>
                        );
                    });
                    setAuthorityList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            );
        },
        [normalMemberList, searchDto]
    );

    useEffect(() => {
        getnormalMemberList(searchDto);
    }, []);

    const Location = React.memo(function Location() {
        return (
            <div className="location">
                <ul>
                    <li>
                        <Link to={URL.MANAGER} className="home">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to={URL.MANAGER_NORMAL_MEMBER}>회원관리</Link>
                    </li>
                    <li>일반회원</li>
                </ul>
            </div>
        );
    });

    return (
        <div className="container">
            <div className="c_wrap">
                {/* <!-- Location --> */}
                <Location />
                {/* <!--// Location --> */}

                <div className="layout">
                    {/* <!-- Navigation --> */}
                    <EgovLeftNav />
                    {/* <!--// Navigation --> */}

                    <div className="contents BOARD_CREATE_LIST" id="contents">
                        <div className="top_tit">
                            <h1 className="tit_1">회원 관리</h1>
                        </div>

                        <h2 className="tit_2">회원 관리</h2>

                        <div className="condition">
                            <ul>
                                <li className="third_1 L">
                                    <span className="lb">검색유형선택</span>
                                    <label className="f_select" htmlFor="userType">
                                        <select
                                            id="searchCnd"
                                            name="searchCnd"
                                            title="검색유형선택"
                                            ref={userNmRef}
                                            onChange={(e) => {
                                                getBbsList({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    userType: userTypeRef.current.value,
                                                    userNm: userNmRef.current.value,
                                                });
                                            }}
                                        >
                                            <option value="">선택</option>
                                            <option value="0">일반회원</option>
                                            <option value="1">입주기업</option>
                                            <option value="2">유관기관</option>
                                            <option value="3">비입주기업</option>
                                            <option value="4">컨설턴트</option>
                                        </select>
                                    </label>
                                </li>
                                <li className="third_2 R">
                                    <span className="lb">검색어</span>
                                    <span className="f_search w_400">
                                        <input
                                            type="text"
                                            defaultValue={searchDto && searchDto.userNm}
                                            placeholder=""
                                            ref={userNmRef}
                                            onChange={(e) => {
                                                setSearchDto({ ...searchDto, userNm: e.target.value });
                                            }}
                                            onKeyDown={activeEnter}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                getnormalMemberList({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    userType: userTypeRef.current.value,
                                                    emplyrId: emplyrIdRef.current.value,
                                                });
                                            }}
                                        >
                                            조회
                                        </button>
                                    </span>
                                </li>
                                <li>
                                    <Link
                                        to={URL.ADMIN_MEMBERS_CREATE}
                                        className="btn btn_blue_h46 pd35"
                                    >
                                        등록
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="board_list BRD006">
                            <MtTable striped bordered hover size="sm" className="mtTable">
                                <colgroup>
                                    <col />
                                    <col width="120" />
                                    <col width="130" />
                                    <col width="150" />
                                    <col width="100" />
                                    <col width="100" />
                                    <col width="100" />
                                    <col width="100" />
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>회원명</th>
                                    <th>회원유형</th>
                                    <th>회원ID</th>
                                    <th>휴대전화번호</th>
                                    <th>메일수신</th>
                                    <th>SMS수신</th>
                                    <th>사용여부</th>
                                    <th>생성일</th>
                                </tr>
                                </thead>
                                <tbody>{normalMemberList}</tbody>
                            </MtTable>

                            <div className="board_bot">
                                <EgovPaging
                                    pagination={paginationInfo}
                                    moveToPage={(passedPage) => {
                                        getnormalMemberList({
                                            ...searchDto,
                                            pageIndex: passedPage,
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

export default NormalMemberList;
