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

function NormalMemberList(props) {
    const navigate = useNavigate();
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
    const userTypeRef = useRef();
    const userNmRef = useRef();
    const [normalMemberList, setAuthorityList] = useState([]);
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
            getnormalMemberList(searchDto);
        }
    };

    const setNormalMemberDel = (userSn) => {
        const setNormalMemberUrl = "/memberApi/setNormalMemberDel";

        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        ...memberDetail,
                        zip: "N",
                        userSn: userSn
                    }),
                };

                EgovNet.requestFetch(setNormalMemberUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("삭제되었습니다.");
                        navigate(URL.MANAGER_NORMAL_MEMBER);
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                //취소
            }
        });
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
                        <tr key="no-data">
                            <td colSpan="8">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getNormalMemberList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        const totalItems = resp.result.getNormalMemberList.length;
                        const itemNumber = totalItems - index;

                        dataList.push(
                            <tr key={item.userSn}>
                                <td>{itemNumber}</td>
                                <td>{item.mbrType}</td>
                                <td>
                                    <Link
                                        to={{pathname: URL.MANAGER_NORMAL_MEMBER_MODIFY}}
                                        state={{
                                            userSn: item.userSn
                                        }}
                                        style={{cursor: 'pointer', textDecoration: 'underline'}}
                                    >
                                        {item.userId}
                                    </Link>
                                </td>

                                <td>{item.kornFlnm}</td>
                                <td>{item.userType}</td>
                                <td></td>
                                <td>{new Date(item.frstCrtDt).toISOString().split("T")[0]}</td>
                                <td></td>
                                <td>
                                    {item.actvtnYn === 'Y' ? '정상회원' :
                                    item.actvtnYn === 'W' ? '대기회원' :
                                    item.actvtnYn === 'R' ? '반려회원' :
                                    item.actvtnYn === 'C' ? '정지회원' :
                                    item.actvtnYn === 'S' ? '탈퇴회원' : ''}
                                </td>
                                {/*<td>{item.replyPosblYn}</td>
                                <td>{item.answerPosblYn}</td>
                                <td>
                                    <Link
                                        to={{pathname: URL.MANAGER_NORMAL_MEMBER_MODIFY}}
                                        state={{
                                            userSn: item.userSn
                                        }}
                                    >
                                        <button type="button">
                                            수정
                                        </button>
                                    </Link>
                                </td>
                                <td>
                                    <button type="button"
                                            onClick={() => {
                                                setNormalMemberDel(item.userSn);
                                            }}
                                    >
                                        삭제
                                    </button>
                                </td>*/}
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

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>회원관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">회원분류</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        ref={userTypeRef}
                                        onChange={(e) => {
                                            getnormalMemberList({
                                                ...searchDto,
                                                pageIndex: 1,
                                                userType: userTypeRef.current.value,
                                                userNm: userNmRef.current.value,
                                            });
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="1">입주기업</option>
                                        <option value="2">유관기관</option>
                                        <option value="3">비입주기업</option>
                                        <option value="4">컨설턴트</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">회원상태</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                    >
                                        <option value="">전체</option>
                                        <option value="">승인</option>
                                        <option value="">승인대기</option>
                                        <option value="">승인반려</option>
                                        <option value="">이용정지</option>
                                        <option value="">탈퇴</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                    >
                                        <option value="">전체</option>
                                        <option value="">아이디</option>
                                        <option value="">성명</option>
                                        <option value="">기업명</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input
                                        type="text"
                                        defaultValue={searchDto && searchDto.userNm}
                                        placeholder="검색어를 입력해주세요"
                                        ref={userNmRef}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, userNm: e.target.value});
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
                                    userTypeRef.current.value = "";
                                    userNmRef.current.value = "";
                                    setSearchDto({
                                        pageIndex: 1,
                                        emplyrId: "",
                                        searchWrd: "",
                                        actvtnYn: "",
                                        userType: "",
                                        userNm: "",
                                    });
                                    getnormalMemberList({});
                                }}
                            >
                                <div className="icon"></div>
                            </button>
                            <button
                                type="button"
                                className="searchBtn btn btn1 point"
                                onClick={(e) => {
                                    e.preventDefault();
                                    getnormalMemberList({
                                        ...searchDto,
                                        pageIndex: 1,
                                        userType: userTypeRef.current.value,
                                        userNm: userNmRef.current.value,
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
                        <p className="resultText">전체 : <span className="red">1234</span>건 페이지 : <span
                            className="red">1/400</span></p>
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
                                <col width="150px"/>
                                <col width="100px"/>
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
                                <th>최근 접속일시</th>
                                <th>회원상태</th>
                                {/*<th>수정</th>
                                <th>삭제</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {normalMemberList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
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
    );
}

export default NormalMemberList;