import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftConsulting";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import { getSessionItem } from "@/utils/storage";

function ManagerExpert(props) {

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
            const consultMemberListUrl = "/consultingApi/getConsultantList.do"; //임시로 회원조회 url을 사용하나 나중에 join된 걸 불러와야할듯
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

                    resp.result.consultantList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        const totalItems = resp.result.consultantList.length;
                        const itemNumber = totalItems - index;

                        dataList.push(
                            <tr key={item.tblUser.userSn}>
                                <td>{itemNumber}</td>
                                <td>{item.cnsltFldNm}</td>
                                <td>
                                    <NavLink to={URL.MANAGER_COUSULTANT_DETAIL}
                                             state={{userSn : item.tblUser.userSn}}
                                    >
                                    {item.tblUser.kornFlnm}
                                    </NavLink>
                                </td>
                                <td>{item.tblCnslttMbr.ogdpNm}</td>
                                <td>{item.tblCnslttMbr.jbpsNm}</td>
                                <td>{item.tblCnslttMbr.crrPrd} 년</td>
                                <td>{item.tblUser.mbrStts === 'Y' ? '공개' :
                                     item.tblUser.mbrStts === 'W' ? '비공개' :
                                     item.tblUser.mbrStts === 'R' ? '비공개' :
                                     item.tblUser.mbrStts === 'C' ? '비공개' :
                                     item.tblUser.mbrStts === 'S' ? '비공개' : ''}
                                </td>
                                <td>{item.cnsltCount} 건</td>
                                <td>{item.simpleCount} 건</td>
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
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>전문가관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">자문분야</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">컨설팅 활동</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="1">공개</option>
                                        <option value="2">비공개</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
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
                            <li className="searchBox inputBox type1">
                                <label className="input"><input type="text" id="search" name="search"
                                                                placeholder="검색어를 입력해주세요"/></label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray">
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point">
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">전체 : <span className="red">{paginationInfo.totalRecordCount}</span>건 페이지 : <span className="red">{paginationInfo.currentPageNo}/{paginationInfo.totalPageCount}</span> </p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red">
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                        </div>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>전문가목록</caption>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>자문분야</th>
                                <th>성명</th>
                                <th>소속</th>
                                <th>직위</th>
                                <th>경력</th>
                                <th>컨설팅 활동</th>
                                <th>컨설팅의뢰</th>
                                <th>간편상담</th>
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
}

export default ManagerExpert;
