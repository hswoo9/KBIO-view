import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import EgovPaging from "@/components/EgovPaging";
import OperationalSupport from "./OperationalSupport.jsx";

function OperationalResidentMember(props) {
    const location = useLocation();
    const [residentMemberList, setAuthorityList] = useState([]);
    const [searchDto, setSearchDto] = useState(
        {mvnEntSn : location.state?.mvnEntSn});
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

    const getResidentMemberList = useCallback(
        (searchDto) =>{
            const getUrl = "/mvnEntApi/getresidentMemberList.do";
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
                            <td colSpan="7">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getResidentMemberList.forEach(function (item,index){
                        if(index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.userSn}>
                                <td>{index + 1}</td>
                                <td>{item.userId}</td>
                                <td>{item.kornFlnm}</td>
                                <td>{item.mblTelno}</td>
                                <td>{item.email}</td>
                                <td>{new Date(item.frstCrtDt).toISOString().split("T")[0]}</td>
                                <td>
                                    <button type="button">
                                        삭제
                                    </button>
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
        console.log("state : ",searchDto);
        getResidentMemberList(searchDto);
    },[]);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>입주기업 관리</p></h2>
                {/*회사 로고*/}
                <div className="company_info">
                    <div className="left">
                        <figure className="logo">
                            {/*기업 로고 이미지 추가할 것*/}
                        </figure>
                        <p className="name" id="mvnEntNm"></p>
                    </div>
                    <ul className="right">
                        <li>
                            <p className="tt1">대표자</p>
                            <p className="tt2"></p>
                        </li>
                        <li>
                            <p className="tt1">대표전화</p>
                            <p className="tt2"></p>
                        </li>
                        <li>
                            <p className="tt1">업종</p>
                            <p className="tt2"></p>
                        </li>
                    </ul>
                </div>
                {/*본문리스트영역*/}
                <div className="contBox board type2 customContBox">
                    <div className="topBox">
                        <p className="resultText"><span className="red">12,345</span>건의 입주기업 정보가 조회되었습니다.</p>
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
                        />
                        <Link
                            to={URL.MANAGER_OPERATIONAL_SUPPORT}
                        >
                            <button type="button" className="clickBtn black"><span>목록</span></button>
                        </Link>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default OperationalResidentMember;