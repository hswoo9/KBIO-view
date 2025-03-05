import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as ComScript from "@/components/CommonScript";
import { getSessionItem } from "@/utils/storage";
import EgovUserPaging from "@/components/EgovUserPaging";
import Swal from 'sweetalert2';
import base64 from 'base64-js';
import {getComCdList} from "@/components/CommonComponents";
import CompanyModifyMember from "@/components/CompanyModifyMember";


function CompanyMemberList (props) {
    const sessionUser = getSessionItem("loginUser");
    const [modalData, setModalData] = useState({});
    const { mvnEntSn, relInstSn } = props;
    const [userSn, setUserSn] = useState([]);
    const location = useLocation();
    const [companyMemberList, setAuthorityList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex : 1,
            aprvYn:"",
            searchType: "",
            searchVal : "",
            mvnEntSn: mvnEntSn,
            relInstSn: relInstSn,
            kornFlnm: "",
            userId: "",
        }
    );


    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getCompanyMemberList(searchDto);
        }
    };

    const getCompanyMemberList = useCallback(
        (searchDto) => {
            const getUrl = "/memberApi/getCompanyMemberList.do";
            const requestOptions = {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(searchDto),
            };
            EgovNet.requestFetch(
                getUrl,
                requestOptions,
                (resp) => {

                    setPaginationInfo(resp.paginationInfo);

                    if (!resp.result?.getCompanyMemberList?.length) {
                        setAuthorityList([
                            <tr key="noData">
                                <td colSpan="6">검색된 결과가 없습니다.</td>
                            </tr>,
                        ]);
                        return;
                    }

                    setAuthorityList(
                        resp.result.getCompanyMemberList.map((item) => {
                            const decodedPhoneNumber = decodePhoneNumber(item.mblTelno);
                            return (
                                <tr key={item.userSn}>
                                    <td onClick={() => modifyClick(item.userSn)} style={{ cursor: "pointer" }}>
                                        {item.userId}
                                    </td>
                                    <td>{item.kornFlnm}</td>
                                    <td>{ComScript.formatTelNumber(decodedPhoneNumber)}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        {item.mbrStts === "W"
                                            ? "승인대기"
                                            : item.mbrStts === "Y"
                                                ? "승인"
                                                : item.mbrStts === "R"
                                                    ? "승인반려"
                                                    : "이용정지"}
                                    </td>
                                    <td>{new Date(item.frstCrtDt).toISOString().split("T")[0]}</td>
                                    <td>
                                        {item.aprvYn === "N" && item.mbrStts === "Y" ? (
                                            <button type="button" onClick={() => setApprovalMember(item.userSn)}>
                                                승인
                                            </button>
                                        ) : item.aprvYn === "Y" && item.mbrStts === "Y" ? (
                                            <button type="button" onClick={() => setApprovalMemberDel(item.userSn)}>
                                                취소
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    );
                },
                (error) => console.error("API 요청 실패:", error)
            );
        },
        [searchDto]
    );

    useEffect(() => {
        getCompanyMemberList(searchDto);
    }, []);

    const setApprovalMember = (userSn) => {
        const setApprovalUrl = '/memberApi/setCompanyMember';

        Swal.fire({
            title: `해당 회원을 기업회원으로 승인하시겠습니까?`,
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

                EgovNet.requestFetch(setApprovalUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("승인되었습니다.");
                        getCompanyMemberList(searchDto);
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                //취소
            }
        });
    };

    const setApprovalMemberDel = (userSn) => {
        const setApprovalDelUrl = '/memberApi/setCompanyMemberDel';

        Swal.fire({
            title: `해당 회원을 취소하시겠습니까?`,
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

                EgovNet.requestFetch(setApprovalDelUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("취소되었습니다.");
                        getCompanyMemberList(searchDto);
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                //취소
            }
        });
    };



    useEffect(() => {
        getCompanyMemberList(searchDto);
    },[]);


    const modifyClick = (userSn) => {
        const getNormalMemberUrl = "/memberApi/getNormalMember";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userSn: userSn
            })
        };

        EgovNet.requestFetch(
            getNormalMemberUrl,
            requestOptions,
            (resp) => {
                const decodedPhoneNumber = decodePhoneNumber(resp.result.member.mblTelno);
                setModalData({
                    ...resp.result.member,
                    mblTelno: decodedPhoneNumber,
                });
                ComScript.openModal("modifyModal");
            },
            (error) => {
            }
        );

    }

    useEffect(() => {
        if (modalData && Object.keys(modalData).length > 0) {
            ComScript.openModal("modifyModal");
        }
    }, [modalData]);



    return (
        <div className="contBox board type 1 customContBox">
            <div className="titleWrap type5 left">
                <p className="tt1">산하 직원 정보</p>
            </div>
            <div className="cateWrap5">
                    <ul className="cateList">
                        <li className="inputBox type1">
                            <p className="title">키워드</p>
                            <div className="itemBox5">
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
                            className="searchBtn btn btn1 point"
                            onClick={(e) => {
                                e.preventDefault();
                                getCompanyMemberList({
                                    ...searchDto,
                                    pageIndex: 1
                                });
                            }}
                        >
                            <div className="icon"></div>
                        </button>
                    </div>
            </div>
            <div className="topBox">
                <p className="resultText"><span className="red">{paginationInfo?.totalRecordCount}</span>건의 회원 정보가
                    조회되었습니다.</p>
            </div>
            <div className="tableBox type1">
                <table>
                    <caption>관리자회원</caption>
                    <thead>
                    <tr>
                        <th className="th2"><p>아이디</p></th>
                        <th className="th2"><p>성명</p></th>
                        <th className="th3"><p>휴대전화번호</p></th>
                        <th className="th4"><p>이메일</p></th>
                        <th className="th4"><p>회원상태</p></th>
                        <th className="th4"><p>등록일</p></th>
                        <th className="th5"><p>승인</p></th>
                    </tr>
                    </thead>
                    <tbody>
                    {companyMemberList}
                    </tbody>
                </table>
            </div>
            {/*페이징, 버튼 영역*/}
            <div className="pageWrap1">
                <EgovUserPaging
                    pagination={paginationInfo}
                    moveToPage={(passedPage) => {
                        getCompanyMemberList({
                            ...searchDto,
                            pageIndex: passedPage,
                        });
                    }}
                />
            </div>
            <CompanyModifyMember
                data={modalData}/>
        </div>
    );
}

export default CompanyMemberList;