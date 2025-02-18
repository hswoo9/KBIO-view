import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import EgovPaging from "@/components/EgovPaging";
import OperationalSupport from "./OperationalSupport.jsx";
import base64 from 'base64-js';

function OperationalRelatedMember(props) {
    const location = useLocation();
    const [residentMemberList, setAuthorityList] = useState([]);
    const [searchDto, setSearchDto] = useState(
        {
            pageIndex : 1,
            relInstSn : location.state?.relInstSn,
            sysMngrYn : "Y",
            actvtnYn: "",
            kornFlnm: "",
            userId: ""
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
    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };

    const getRelatedMemberList = useCallback(
        (searchDto) =>{
            const getUrl = "/relatedApi/getRelatedtMemberList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                getUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan="6">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getRelatedMemberList.forEach(function (item,index){
                        if(index === 0) dataList = [];
                        const decodedPhoneNumber = decodePhoneNumber(item.mblTelno);

                        dataList.push(
                            <tr key={item.userSn}>
                                <td>{index + 1}</td>
                                <td>{item.userId}</td>
                                <td>
                                    <Link to={URL.MANAGER_RESIDENT_MEMBER_EDIT}
                                          state={{
                                              relInstSn: searchDto.relInstSn,
                                              mode:CODE.MODE_MODIFY,
                                              userSn: item.userSn
                                          }}
                                    >
                                        {item.kornFlnm}
                                    </Link>
                                </td>
                                <td>{decodedPhoneNumber}</td>
                                <td>{item.email}</td>
                                <td>{new Date(item.frstCrtDt).toISOString().split("T")[0]}</td>
                                <td>
                                    <button type="button" className="settingBtn"><span>삭제</span></button>
                                </td>
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
        [residentMemberList, searchDto]
    );

    useEffect(() => {
        getRelatedMemberList(searchDto);
    },[]);


    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>유관기관 관리</p></h2>
                {/*회사 로고*/}
                <div className="company_info">
                    <div className="left">
                        <figure className="logo">
                            {/*기업 로고 이미지 추가할 것*/}
                        </figure>
                        <p className="name" id="relInstNm"></p>
                    </div>
                    <ul className="right">
                        <li>
                            <p className="tt1">대표자</p>
                            <p className="tt2">{location.state?.rpsvNm}</p>
                        </li>
                        <li>
                            <p className="tt1">대표전화</p>
                            <p className="tt2">{location.state?.entTelno}</p>
                        </li>
                        <li>
                            <p className="tt1">업종</p>
                            <p className="tt2">{location.state?.clsNm}</p>
                        </li>
                    </ul>
                </div>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">회원상태</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                    >
                                        <option value="">전체</option>
                                        <option value="Y">승인</option>
                                        <option value="W">승인대기</option>
                                        <option value="R">승인반려</option>
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
                                        <option value="userId">아이디</option>
                                        <option value="kornFlnm">성명</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input
                                        type="text"
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button
                                type="button"
                                className="refreshBtn btn btn1 gray"
                            >
                                <div className="icon"></div>
                            </button>
                            <button
                                type="button"
                                className="searchBtn btn btn1 point"
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                {/*본문리스트영역*/}
                <div className="contBox board type2 customContBox">
                    <div className="topBox">
                        <p className="resultText"><span className="red">{paginationInfo.totalRecordCount}</span>건의 유관기관 정보가 조회되었습니다.</p>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>게시판</caption>
                            <thead>
                            <tr>
                                <th className="th1"><p>번호</p></th>
                                <th className="th2"><p>아이디</p></th>
                                <th className="th2"><p>성명</p></th>
                                <th className="th3"><p>휴대전화번호</p></th>
                                <th className="th4"><p>이메일</p></th>
                                <th className="th5"><p>등록일</p></th>
                                <th className="th6"><p>삭제</p></th>
                            </tr>
                            </thead>
                            <tbody>
                            {residentMemberList}
                            </tbody>
                        </table>
                    </div>
                    {/*페이징, 버튼 영역*/}
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getRelatedMemberList({
                                    ...searchDto,
                                    pageIndex: passedPage,
                                });
                            }}
                        />
                        <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        <Link
                            to={URL.MANAGER_OPERATIONAL_SUPPORT}
                        >
                            <button type="button" className="clickBtn black"><span>목록</span></button>
                        </Link>

                    </div>
                </div>


            </div>
            {/*등록 모달 창*/}
            <div className="uploadModal modalCon">

            </div>

        </div>
    );
}

export default OperationalRelatedMember;