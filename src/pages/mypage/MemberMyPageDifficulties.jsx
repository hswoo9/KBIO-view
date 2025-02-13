import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';
import {getComCdList} from "@/components/CommonComponents";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";

function MemberMyPageDifficulties(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();

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
            userSn: sessionUser?.userSn || "",
        }
    );

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getDfclMttrList(searchDto);
        }
    };
    const [dfclMttrFldList, setDfclMttrFldList] = useState([]);
    const [dfclMttrList, setDfclMttrList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});

    useEffect(() => {
        getComCdList(15).then((data) => {
            setDfclMttrFldList(data);
        })
    }, []);



    const getDfclMttrList = useCallback(
        (searchDto) => {
            const dfclMttrListUrl = "/memeberApi/getMyPageDfclMttrList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                dfclMttrListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan="5">애로사항 내역이 없습니다.</td>
                        </tr>
                    );

                    resp.result.diffList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.pstSn}>
                                <td>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td>{item.dfclMttrFldNm}</td>
                                <td>
                                    {item.answer === "Y" ? (
                                        <Link to={{pathname: URL.MEMBER_MYPAGE_DIFFICULTIES_DETAIL}}
                                              state={{
                                                  dfclMttrSn: item.dfclMttrSn
                                              }}
                                              style={{cursor: 'pointer', textDecoration: 'underline'}}
                                        >
                                            {item.ttl}
                                        </Link>
                                    ) : (
                                        <Link to={{pathname: URL.MEMBER_MYPAGE_DIFFICULTIES_MODIFY}}
                                              state={{
                                                  dfclMttrSn: item.dfclMttrSn
                                              }}
                                              style={{cursor: 'pointer', textDecoration: 'underline'}}
                                        >
                                            {item.ttl}
                                        </Link>
                                    )}
                                </td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>{item.answer == "Y" ? "답변완료" : "답변대기"}</td>
                            </tr>
                        );
                    });
                    setDfclMttrList(dataList);
                    setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            );

        },
        [dfclMttrList, searchDto]
    );

    useEffect(() => {
        getDfclMttrList(searchDto);
    }, []);


    return (
        <div id="container" className="container ithdraw join_step">
            <div className="inner">
                {/* Step Indicator */}
                <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_MODIFY} >
                            <div className="num"><p>1</p></div>
                            <p className="text">회원정보수정</p>
                        </NavLink>
                    </li>
                    <li>
                    <NavLink to={URL.MEMBER_MYPAGE_CONSULTING} >
                            <div className="num"><p>2</p></div>
                            <p className="text">컨설팅의뢰 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE} >
                            <div className="num"><p>3</p></div>
                            <p className="text">간편상담 내역</p>
                        </NavLink>
                    </li>
                    <li  className="active">
                        <NavLink to={URL.MEMBER_MYPAGE_DIFFICULTIES} >
                            <div className="num"><p>4</p></div>
                            <p className="text">애로사항 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CANCEL} >
                            <div className="num"><p>5</p></div>
                            <p className="text">회원탈퇴</p>
                        </NavLink>
                    </li>
                </ul>
                <h2 className="pageTitle"><p>애로사항 내역</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList" style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                            <li className="inputBox type1" style={{flex: '1  10%'}}>
                                <p className="title">상태</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{flex: '1  10%'}}>
                                <p className="title">분야</p>
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
                            <li className="inputBox type1" style={{flex: '1  10%'}}>
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
                                        <option value="dfclMttrCn">내용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1" style={{flex: '1 40%', marginTop: "25px"}}>
                                <label className="input">
                                    <input type="text" id="search" name="search" placeholder="검색어를 입력해주세요"/>
                                </label>
                            </li>
                            <div className="rightBtn" style={{display: 'flex', gap: '10px', marginTop: "25px"}}>
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
                        </ul>

                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">Total : <span className="red">{paginationInfo.totalRecordCount}</span>
                        </p>
                    </div>
                    <div className="tableBox type1">
                        <table>
                        <caption>애로사항목록</caption>
                            <col width="80"/>
                            <col width="150"/>
                            <col width="300"/>
                            <col width="150"/>
                            <col width="150"/>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>분류</th>
                                <th>제목</th>
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
                                    pageIndex: passedPage,
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberMyPageDifficulties;
