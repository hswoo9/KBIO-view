import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as ComScript from "@/components/CommonScript";
import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import EgovPaging from "@/components/EgovPaging";
import OperationalSupport from "./OperationalSupport.jsx";
import base64 from 'base64-js';

function OperationalResidentMember(props) {
    const location = useLocation();
    const [residentMemberList, setAuthorityList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [searchDto, setSearchDto] = useState(
        {
            pageIndex : 1,
            mvnEntSn : location.state?.mvnEntSn,
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

    //모달관련
    const [searchRcUserCondition, setSearchRcUserCondition] = useState({
        pageIndex: 1,
        pageUnit:9999,
        mvnEntSn : location.state?.mvnEntSn,
        searchType: "",
        searchVal: "",
    });
    const [rcUserPaginationInfo, setRcUserPaginationInfo] = useState({
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
    const [rcUserList, setRcUserList] = useState([]);
    const [selRcUserList, setSelRcUserList] = useState([]);
    const searchRcUserTypeRef = useRef();
    const searchRcUserValRef = useRef();

    const modelOpenEvent = (e) => {
        getRcUserList(searchRcUserCondition);
        document.getElementsByName("userCheck").forEach(function (item, index) {
            item.checked = false;
        });

        document.getElementById('modalDiv').classList.add("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'hidden';
        document.getElementsByTagName('body')[0].style.overFlow = 'hidden';
    }

    const modelCloseEvent = (e) => {
        setSearchRcUserCondition({
            pageIndex: 1,
            pageUnit:9999,
            mvnEntSn : location.state?.mvnEntSn,
            searchType: "",
            searchVal: "",
        })
        document.getElementById('modalDiv').classList.remove("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'visible';
        document.getElementsByTagName('body')[0].style.overFlow = 'visible';
    }
    const checkUserAllCheck = (e) => {
        let checkBoolean = e.target.checked;
        document.getElementsByName("userCheck").forEach(function (item, index) {
            item.checked = checkBoolean;
        });
    };

    const activeUserEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getRcUserList(searchRcUserCondition);
        }
    };

    const handleCheckboxChange = (e) => {
        const userSn = parseInt(e.target.value);

        if (e.target.checked) {
            setSelRcUserList(prevState => [
                ...prevState,
                { userSn }
            ]);
        } else {
            setSelRcUserList(prevState => prevState.filter(user => user.userSn !== userSn));
        }
    };

    const getRcUserList = useCallback(
        (searchRcUserCondition) =>{
            const rcUserListUrl = "/mvnEntApi/getresidentMemberList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchRcUserCondition),
            };

            EgovNet.requestFetch(
                rcUserListUrl,
                requestOptions,
                (resp) => {
                    console.log("resp.result : ",resp.result.getResidentMemberList);
                    setRcUserPaginationInfo(resp.paginationInfo);
                    resp.result.getResidentMemberList.forEach(function (item, index) {
                        setRcUserList(resp.result.getResidentMemberList);
                    });
                },
                function (resp) {

                }
            );

        },[rcUserList, searchRcUserCondition]
    );

    const rcUserSelectSubmit = () => {
        console.log("selRcUserList :",selRcUserList);

    };

    //모달관련끝

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

                    if(resp.result.logoFile){
                        setSelectedFiles(resp.result.logoFile);
                    }

                    let dataList = [];
                    dataList.push(
                        <tr key="noData">
                            <td colSpan="6">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getResidentMemberList.forEach(function (item,index){
                        if(index === 0) dataList = [];
                        const decodedPhoneNumber = decodePhoneNumber(item.tblUser.mblTelno);

                        dataList.push(
                            <tr key={item.tblUser.userSn}>
                                <td>{index + 1}</td>
                                <td>{item.tblUser.userId}</td>
                                <td>
                                    <Link to={URL.MANAGER_RESIDENT_MEMBER_EDIT}
                                          state={{
                                              mvnEntSn: searchDto.mvnEntSn,
                                              mode:CODE.MODE_MODIFY,
                                              userSn: item.tblUser.userSn
                                          }}
                                    >
                                        {item.tblUser.kornFlnm}
                                    </Link>
                                </td>
                                <td>{decodedPhoneNumber}</td>
                                <td>{item.tblUser.email}</td>
                                <td>{new Date(item.tblUser.frstCrtDt).toISOString().split("T")[0]}</td>
                                <td>
                                    <button type="button" className="settingBtn"><span>삭제</span></button>
                                </td>
                            </tr>
                        );
                    });
                    setAuthorityList(dataList);

                },
                function (resp) {

                }
            )

        },
        [residentMemberList, searchDto]
    );

    useEffect(() => {
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
                            {selectedFiles && selectedFiles.atchFileSn ? (
                                <img
                                    src={`http://133.186.250.158${selectedFiles.atchFilePathNm}/${selectedFiles.strgFileNm}.${selectedFiles.atchFileExtnNm}`}
                                    alt="image"
                                />
                            ) : (
                                <img src="" alt="defaultImage" />
                            )}
                        </figure>
                        <p className="name" id="mvnEntNm"></p>
                    </div>
                    <ul className="right">
                        <li>
                            <p className="tt1">대표자</p>
                            <p className="tt2">{location.state?.rpsvNm}</p>
                        </li>
                        <li>
                            <p className="tt1">대표전화</p>
                            <p className="tt2">{ComScript.formatTelNumber(location.state?.entTelno)}</p>
                        </li>
                        <li>
                            <p className="tt1">업종</p>
                            <p className="tt2">{location.state?.clsNm}</p>
                        </li>
                    </ul>
                </div>

                {/*<div className="cateWrap">
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
                </div>*/}

                {/*본문리스트영역*/}
                <div className="contBox board type2 customContBox">
                    <div className="topBox">
                        <p className="resultText"><span className="red">{paginationInfo.totalRecordCount}</span>건의 입주기업 정보가 조회되었습니다.</p>
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
                                getResidentMemberList({
                                    ...searchDto,
                                    pageIndex: passedPage,
                                });
                            }}
                        />
                            <button type="button" className="writeBtn clickBtn"
                                    onClick={(e) => modelOpenEvent(e)}
                            >
                                <span>등록</span>
                            </button>
                        <Link
                            to={URL.MANAGER_OPERATIONAL_SUPPORT}
                        >
                            <button type="button" className="clickBtn black"><span>목록</span></button>
                        </Link>

                    </div>
                </div>


            </div>

            {/*모달창*/}
            <div className="programModal modalCon" id="modalDiv">
                <div className="bg"></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="top">
                            <h2 className="title">컨설턴트목록</h2>
                            <div className="close" onClick={modelCloseEvent}>
                                <div className="icon"></div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="cateWrap">
                                <form action="">
                                    <ul className="cateList">
                                        <li className="inputBox type1">
                                            <p className="title">검색 구분</p>
                                            <div className="itemBox">
                                                <select
                                                    className="selectGroup"
                                                    ref={searchRcUserTypeRef}
                                                    onChange={(e) => {
                                                        setSearchRcUserCondition({...searchRcUserCondition, searchType: e.target.value})
                                                    }}
                                                >
                                                    <option value="kornFlnm">성명</option>
                                                    <option value="userId">아이디</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li className="searchBox inputBox type1">
                                            <label className="title" htmlFor="program_search">
                                                <small>검색어</small>
                                            </label>
                                            <div className="input">
                                                <input type="text"
                                                       name="program_search"
                                                       id="program_search" title="검색어"
                                                       defaultValue={searchRcUserCondition.searchVal}
                                                       ref={searchRcUserValRef}
                                                       onChange={(e)=> {
                                                           setSearchRcUserCondition({...searchRcUserCondition, searchVal: e.target.value})
                                                       }}
                                                       onKeyDown={activeUserEnter}
                                                />
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="rightBtn">
                                        <button type="button" className="refreshBtn btn btn1 gray"
                                                onClick={() => {
                                                    setSearchRcUserCondition({...searchRcUserCondition, searchVal: ""})
                                                    document.getElementById('program_search').value = "";
                                                    getRcUserList({
                                                        pageIndex: 1,
                                                        pageUnit:9999,
                                                        mvnEntSn : location.state?.mvnEntSn,
                                                        searchType: "",
                                                        searchVal: "",
                                                    });
                                                }}

                                        >
                                            <div className="icon"></div>
                                        </button>
                                        <button type="button" className="searchBtn btn btn1 point"
                                                onClick={() => {
                                                    getRcUserList({
                                                        ...searchRcUserCondition,
                                                        pageIndex: 1,
                                                    });
                                                }}
                                        >
                                            <div className="icon"></div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="tableBox type1">
                                <table>
                                    <caption>컨설턴트목록</caption>
                                    <colgroup>
                                        <col width="50"/>
                                    </colgroup>
                                    <thead className="fixed-thead">
                                    <tr>
                                        <th style={{width:"50px"}}>
                                            <label className="checkBox type2">
                                                <input type="checkbox"
                                                       name="userCheck"
                                                       className="customCheckBox"
                                                       onClick={checkUserAllCheck}
                                                />
                                            </label>
                                        </th>
                                        <th><p>아이디</p></th>
                                        <th><p>성명</p></th>
                                    </tr>
                                    </thead>
                                    <tbody className="scrollable-tbody">
                                    {rcUserList.length>0 && (
                                        <>
                                            {rcUserList.map((item,index) => (
                                                <tr key={item.userSn}>
                                                    <td style={{width:"50px"}}>
                                                        <label className="checkBox type2">
                                                            <input type="checkbox" name="userCheck"
                                                                   className="customCheckBox"
                                                                   checked={selRcUserList.some(user => user.userSn === item.userSn)}
                                                                   onChange={handleCheckboxChange}
                                                                   value={item.userSn}
                                                            />
                                                        </label>
                                                    </td>
                                                    <td>{item.userId || ""}</td>
                                                    <td>{item.kornFlnm || ""}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pageWrap">
                                <EgovPaging
                                    pagination={rcUserPaginationInfo}
                                    moveToPage={(passedPage) =>{
                                        getRcUserList({
                                            ...searchRcUserCondition,
                                            pageIndex: passedPage
                                        });
                                    }}
                                />
                                <button type="button" className="writeBtn clickBtn"
                                        onClick={rcUserSelectSubmit}
                                ><span>등록</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*모달끝*/}

        </div>
    );
}

export default OperationalResidentMember;