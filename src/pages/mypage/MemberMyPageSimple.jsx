import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { getSessionItem } from "@/utils/storage";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

function MemberMyPageSimple(props) {

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            actvtnYn: "",
            kornFlnm: "",
            companyName: "",
            mbrType: "2",
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
    const [consultMemberList, setAuthorityList] = useState([]);

    const getConsultMemberList = useCallback(
        (searchDto) => {
            const consultMemberListUrl = "/memberApi/getNormalMemberList.do"; //임시로 회원조회 url을 사용하나 나중에 join된 걸 불러와야할듯
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                consultMemberListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="no-data">
                            <td colSpan="9">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getNormalMemberList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        const totalItems = resp.result.getNormalMemberList.length;
                        const itemNumber = totalItems - index;

                        dataList.push(
                            <tr key={item.userSn}>
                                <td>{itemNumber}</td>
                                <td></td>
                                <td>{item.kornFlnm}</td>
                                <td></td>
                                <td>{item.actvtnYn === 'Y' ? '공개' :
                                    item.actvtnYn === 'W' ? '비공개' :
                                        item.actvtnYn === 'R' ? '비공개' :
                                            item.actvtnYn === 'C' ? '비공개' :
                                                item.actvtnYn === 'S' ? '비공개' : ''}
                                </td>
                                <td></td>
                                <td></td>
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
        [consultMemberList, searchDto]
    );

    useEffect(()=>{
        getConsultMemberList(searchDto);
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
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING} activeClassName="active">
                            <div className="num"><p>2</p></div>
                            <p className="text">컨설팅의뢰 내역</p>
                        </NavLink>
                    </li>
                    <li className="active">
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
                                <button type="button" className="refreshBtn btn btn1 gray">
                                    <div className="icon"></div>
                                </button>
                                <button type="button" className="searchBtn btn btn1 point">
                                    <div className="icon"></div>
                                </button>
                            </div>
                        </ul>

                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">Total <span className="red">50</span></p>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>전문가목록</caption>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>분야</th>
                                <th>컨설턴트</th>
                                <th>제목</th>
                                <th>의뢰일시</th>
                                <th>상태</th>
                                <th>만족도</th>
                            </tr>
                            </thead>
                            <tbody>
                            {consultMemberList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getConsultMemberList({
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

export default MemberMyPageSimple;
