import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';

import ManagerLeft from "@/components/manager/ManagerLeftMember";
import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";

function WaitMemberList(props) {
    const userStatusRef = useRef();
    const searchTypeRef = useRef();
    const searchValRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            userId: "",
            searchWrd: "",
            mbrStts: "",
            searchType: "",
            searchVal : "",
            kornFlnm: "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({});
    const userTypeRef = useRef();
    const userNmRef = useRef();
    const [waitMemberList, setAuthorityList] = useState([]);
    const [saveEvent, setSaveEvent] = useState({});

    useEffect(() => {
        if(saveEvent.save){
            if(saveEvent.mode === "delete"){
                delMemberData(saveEvent);
            }
        }
    }, [saveEvent]);

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getwaitMemberList(searchDto);
        }
    };

    const setWaitMemberApproval = (userSn) => {
        const setWaitMemberApprovalUrl = "/memberApi/setWaitMemberApproval";

        Swal.fire({
            title: `<span style="font-size: 14px; line-height: 0.8;">
                    승인 시 해당 계정은 홈페이지 접속 및 서비스<br>
                    를 이용할 수 있습니다.<br>
                    해당 회원의 계정을 승인하시겠습니까?
                </span>
            `,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        userSn: userSn
                    }),
                };

                EgovNet.requestFetch(setWaitMemberApprovalUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("승인되었습니다.");
                        getwaitMemberList(searchDto);
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                //취소
            }
        });
    };

    const setWaitMemberReject = (userSn) => {
        const setWaitMemberRejectUrl = "/memberApi/setWaitMemberReject";

        Swal.fire({
            title: `<span style="font-size: 14px; line-height: 0.8;">
                    거절 시 해당 계정은 홈페이지 접속 및 서비스<br>
                    를 이용할 수 없습니다.<br>
                    해당 회원의 계정을 거절하시겠습니까?
                </span>
            `,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        userSn: userSn
                    }),
                };

                EgovNet.requestFetch(setWaitMemberRejectUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("거절되었습니다.");
                        getwaitMemberList(searchDto);
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
            }
        });
    };

    const getwaitMemberList = useCallback(
        (searchDto) => {
            const waitMemberListURL = "/memberApi/getWaitMemberList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                waitMemberListURL,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="no-data">
                            <td colSpan="8">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getWaitMemberList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        const totalItems = resp.result.getWaitMemberList.length;
                        const itemNumber = totalItems - index;

                        dataList.push(
                            <tr key={item.userSn}>
                                <td>{itemNumber}</td>
                                <td>
                                    {item.mbrType === 9 ? '관리자' :
                                     item.mbrType === 1 ? '입주기업' :
                                     item.mbrType === 2 ? '컨설턴트' :
                                     item.mbrType === 3 ? '유관기관' :
                                     item.mbrType === 4 ? '비입주기업' :
                                     '테스트'}
                                </td>
                                <td>
                                    <Link
                                        to={{pathname: URL.MANAGER_WAIT_MEMBER_MODIFY}}
                                        state={{
                                            userSn: item.userSn
                                        }}
                                        style={{cursor: 'pointer', textDecoration: 'underline'}}
                                    >
                                        {item.userId}
                                    </Link>
                                </td>
                                <td>{item.kornFlnm}</td>
                                <td>{item.companyNm}</td>
                                <td>{item.socialType}</td>
                                <td>{new Date(item.frstCrtDt).toISOString().split("T")[0]}</td>
                                <td style={{
                                    padding: '6px 0',
                                    verticalAlign: 'middle',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button
                                            type="button"
                                            className="btn btn1 blue"
                                            style={{ marginLeft: '40px' }}
                                            onClick={() => {
                                                setWaitMemberApproval(item.userSn);
                                            }}
                                        >
                                            승인
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn1 red"
                                            style={{ marginRight: '40px' }}
                                            onClick={() => {
                                                setWaitMemberReject(item.userSn);
                                            }}
                                        >
                                            거절
                                        </button>
                                    </div>
                                </td>
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
        [waitMemberList, searchDto]
    );

    useEffect(() => {
        getwaitMemberList(searchDto);
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>승인대기</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">회원분류</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        name="mbrType"
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, mbrType: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="1">입주기업</option>
                                        <option value="3">유관기관</option>
                                        <option value="4">비입주기업</option>
                                        <option value="2">컨설턴트</option>
                                        <option value="9">관리자</option>
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
                                        <option value="userId">아이디</option>
                                        <option value="kornFlnm">성명</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1" style={{width: "100%"}}>
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
                            <button
                                type="button"
                                className="refreshBtn btn btn1 gray"
                                onClick={(e) => {
                                    e.preventDefault();
                                    searchTypeRef.current.value = "";
                                    searchValRef.current.value = "";

                                    const initialSearchDto = {
                                        pageIndex: 1,
                                        mbrStts: "",
                                        kornFlnm: "",
                                        userId: "",
                                        searchType: "",
                                        searchWrd: "",
                                    };
                                    setSearchDto(initialSearchDto);
                                    getwaitMemberList(initialSearchDto);
                                }}
                            >
                                <div className="icon"></div>
                            </button>
                            <button
                                type="button"
                                className="searchBtn btn btn1 point"
                                onClick={(e) => {
                                    e.preventDefault();
                                    getwaitMemberList({
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
                        <p className="resultText">전체 : <span className="red">{paginationInfo.totalRecordCount}</span>건
                            페이지 : <span
                                className="red">{paginationInfo.currentPageNo}/{paginationInfo.totalPageCount}</span>
                        </p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red">
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                        </div>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>회원목록</caption>
                            <colgroup>
                                <col width="50px"/>
                                <col width="100px"/>
                                <col width="130px"/>
                                <col width="100px"/>
                                <col width="150px"/>
                                <col width="100px"/>
                                <col width="150px"/>
                                <col width="180px"/>
                                {/*<col width="80px"/>
                                <col width="80px"/>*/}
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>회원분류</th>
                                <th>아이디</th>
                                <th>성명</th>
                                <th>기업명</th>
                                <th>소셜구분</th>
                                <th>가입일</th>
                                <th colSpan="2" style={{textAlign: 'center'}}>승인여부</th>
                            </tr>
                            </thead>
                            <tbody>
                            {waitMemberList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getwaitMemberList({
                                    ...searchDto,
                                    pageIndex: passedPage,
                                });
                            }}
                        />
                        {/*<NavLink to={URL.MANAGER_NORMAL_MEMBER_CREATE}>
                            <button type="button" className="writeBtn clickBtn">
                                <span>등록</span>
                            </button>
                        </NavLink>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WaitMemberList;