import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as ComScript from "@/components/CommonScript";
import EgovPaging from "@/components/EgovPaging";
import base64 from 'base64-js';
import {getComCdList} from "@/components/CommonComponents";

function CompanyMemberList (props) {
    const { mvnEntSn, relInstSn } = props;
    const location = useLocation();
    const [companyMemberList, setAuthorityList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex : 1,
            mbrStts:"",
            searchType: "",
            searchVal : "",
            mvnEntSn: mvnEntSn,
            relInstSn: relInstSn,
        }
    );


    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getCompanyMemberList(searchDto);
        }
    };
    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };

    const getCompanyMemberList = useCallback(
        (searchDto) =>{
            const getUrl = "/memberApi/getCompanyMemberList.do";
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

                    if (resp.result.getCompanyMemberList.length === 0) {
                        dataList.push(
                            <tr key="noData">
                                <td colSpan="6">검색된 결과가 없습니다.</td>
                            </tr>
                        );
                    } else {
                        resp.result.getCompanyMemberList.forEach((item, index) => {
                            const decodedPhoneNumber = decodePhoneNumber(item.mblTelno);

                            dataList.push(
                                <tr key={item.userSn}>
                                    <td>{item.userId}</td>
                                    <td>{item.kornFlnm}</td>
                                    <td>{ComScript.formatTelNumber(decodedPhoneNumber)}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        {item.mbrStts === "W"
                                            ? "승인대기"
                                            : item.mbrStts === "Y"
                                                ? "승인" : item.mbrStts === "R"
                                                    ? "승인반려" : "이용정지"}
                                    </td>
                                    <td>{new Date(item.frstCrtDt).toISOString().split("T")[0]}</td>
                                    <td>
                                        {item.aprvYn === "N" ? (
                                            <button onClick={() => ""}>승인</button>
                                        ) : item.aprvYn === "Y" ? ("-") : ("승인불가")}
                                    </td>
                                </tr>
                            );
                        });
                    }

                    setAuthorityList(dataList);
                },
                function (resp) {

                }
            )

        },
        [companyMemberList, searchDto]
    );



    useEffect(() => {
        getCompanyMemberList(searchDto);
    },[]);



    return (
        <div className="contBox board type 1 customContBox">
            <div className="topBox">
                <p className="resultText"><span className="red">{paginationInfo?.totalRecordCount}</span>건의 회원 정보가
                    조회되었습니다.</p>
            </div>
            <div className="tableBox type1">
                <table>
                    <caption>게시판</caption>
                    <thead>
                    <tr>
                        <th className="th2"><p>아이디</p></th>
                        <th className="th2"><p>성명</p></th>
                        <th className="th3"><p>휴대전화번호</p></th>
                        <th className="th4"><p>이메일</p></th>
                        <th className="th4"><p>회원상태</p></th>
                        <th className="th4"><p>승인</p></th>
                        <th className="th5"><p>등록일</p></th>
                    </tr>
                    </thead>
                    <tbody>
                    {companyMemberList}
                    </tbody>
                </table>
            </div>
            {/*페이징, 버튼 영역*/}
            <div className="pageWrap">
                <EgovPaging
                    pagination={paginationInfo}
                    moveToPage={(passedPage) => {
                        getCompanyMemberList({
                            ...searchDto,
                            pageIndex: passedPage,
                        });
                    }}
                />
            </div>
        </div>
    );
}

export default CompanyMemberList;