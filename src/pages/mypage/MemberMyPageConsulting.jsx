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

function MemberMyPageConsult(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();

    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            cnsltSe : 26,
            startDt : "",
            endDt : "",
            answerYn: "",
            dfclMttrFld : "",
            searchType: "",
            searchVal : "",
            userSn: sessionUser?.userSn || "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({});
    const [simpleList, setSimpleListList] = useState([]);
    const [dfclMttrFldList, setDfclMttrFldList] = useState([]);

    useEffect(() => {
        getComCdList(15).then((data) => {
            setDfclMttrFldList(data);
        })
    }, []);

    const getSimpleList = useCallback(
        (searchDto) => {
            const simpleListUrl = "/memberApi/getMyPageSimpleList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                simpleListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan="6">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.consultantList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.pstSn}>
                                <td>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td>{item.dfclMttrFldNm}</td>
                                <td>
                                    <Link to={{pathname: URL.test}}
                                          state={{
                                              dfclMttrSn: item.dfclMttrSn
                                          }}
                                          style={{cursor: 'pointer', textDecoration: 'underline'}}
                                    >
                                        {item.ttl}
                                    </Link>
                                </td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>{item.answer == "Y" ? "답변완료" : "답변대기"}</td>
                            </tr>
                        );
                    });
                    setSimpleListList(dataList);
                    setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            );

        },
        [simpleList, searchDto]
    );

    useEffect(() => {
        getSimpleList(searchDto);
    }, []);

    return (
        <div id="container" className="container ithdraw join_step">
            <div className="inner">
                {/* Step Indicator */}
                <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_MODIFY} activeClassName="active">
                            <div className="num"><p>1</p></div>
                            <p className="text">회원정보수정</p>
                        </NavLink>
                    </li>
                    <li className="active">
                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING} activeClassName="active">
                            <div className="num"><p>2</p></div>
                            <p className="text">컨설팅의뢰 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE} activeClassName="active">
                            <div className="num"><p>3</p></div>
                            <p className="text">간편상담 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_DIFFICULTIES} activeClassName="active">
                            <div className="num"><p>4</p></div>
                            <p className="text">애로사항 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CANCEL} activeClassName="active">
                            <div className="num"><p>5</p></div>
                            <p className="text">회원탈퇴</p>
                        </NavLink>
                    </li>
                </ul>
                <h2 className="pageTitle"><p>간편상담 내역</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList" style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                            <li className="inputBox type1" style={{flex: '1  10%'}}>
                                <p className="title">자문분야</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{flex: '1  10%'}}>
                                <p className="title">컨설팅 활동</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="1">공개</option>
                                        <option value="2">비공개</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{flex: '1  10%'}}>
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="1">성명</option>
                                        <option value="2">소속</option>
                                        <option value="3">직위</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1" style={{flex: '1 40%', marginTop:"25px"}}>
                                <label className="input">
                                    <input type="text" id="search" name="search" placeholder="검색어를 입력해주세요"/>
                                </label>
                            </li>
                            <div className="rightBtn" style={{display: 'flex', gap: '10px', marginTop:"25px"}}>
                                <button type="button" className="searchBtn btn btn1 point"
                                        onClick={() => {
                                            getSimpleList({
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
                        <p className="resultText">Total <span className="red">{paginationInfo.totalRecordCount}</span>
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
                            <col width="150"/>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>분류</th>
                                <th>제목</th>
                                <th>신청일</th>
                                <th>상태</th>
                                <th>만족도</th>
                            </tr>
                            </thead>
                            <tbody>
                            {simpleList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getSimpleList({
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

export default MemberMyPageConsult;
