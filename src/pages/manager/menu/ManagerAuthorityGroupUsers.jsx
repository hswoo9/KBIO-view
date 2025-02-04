import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import moment from 'moment';
import 'moment/locale/ko';

import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import CheckboxTree from 'react-checkbox-tree';
import '@/css/ReactCheckBoxTree.css';

import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";

import { getSessionItem } from "@/utils/storage";

function ManagerAuthorityGroupUsers(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const cndRef = useRef();
    const wrdRef = useRef();

    const [saveMode, setSaveMode] = useState({
        mode : "insert"
    });

    const [authorityList, setAuthorityList] = useState([]);
    const [authorityGroupUserList, setAuthorityGroupUserList] = useState([]);

    //저장용 [ {userSn : '?' }, {userSn : '?' }]
    const [menuAuthGroupUser, setMenuAuthGroupUser] = useState([]);
    useEffect(() => {
    }, [menuAuthGroupUser]);

    const [userList, setUserList] = useState([]);
    const [userDataList, setUserDataList] = useState([]);

    const [paginationInfo, setPaginationInfo] = useState({});
    const [userPaginationInfo, setUserPaginationInfo] = useState({});
    const [authorityPaginationInfo, setAuthorityPaginationInfo] = useState({});

    const [searchCondition, setSearchCondition] = useState(
        location.state?.searchCondition || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
        }
    );

    const [searchUserCondition, setSearchUserCondition] = useState(
        location.state?.searchUserCondition || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
        }
    );

    const [selectAuthoritySn, setSelectAuthoritySn] = useState({});
    useEffect(() => {
        console.log(selectAuthoritySn);
        if(selectAuthoritySn.authrtGroupSn != null){
            getAuthorityGroupUserList(selectAuthoritySn);
        }
    }, [selectAuthoritySn]);

    const [authoritySearchCondition, setAuthoritySearchCondition] = useState(
        location.state?.authoritySearchCondition || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
        }
    );

    const modelOpenEvent = (e) => {
        getUserList(searchUserCondition);
        document.getElementsByName("userCheck").forEach(function (item, index) {
            item.checked = false;
        });

        document.getElementById('modalDiv').classList.add("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'hidden';
        document.getElementsByTagName('body')[0].style.overFlow = 'hidden';
    }

    const modelCloseEvent = (e) => {
        document.getElementById('modalDiv').classList.remove("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'visible';
        document.getElementsByTagName('body')[0].style.overFlow = 'visible';
    }

    const [authrtGroupUserSns, setAuthrtGroupUserSns] = useState({});
    useEffect(() => {
        setMenuAuthGroupUserDel(authrtGroupUserSns);
    }, [authrtGroupUserSns]);

    const [groupUserCheckGroup, setGroupUserCheckGroup] = useState([]);
    useEffect(() => {
        setAuthrtGroupUserSns({
            ...authrtGroupUserSns,
            authrtGroupUserSns : groupUserCheckGroup
        });
    }, [groupUserCheckGroup]);

    const setMenuAuthGroupUserDel = useCallback(
        (authrtGroupUserSns) => {
            const requestURL = "/menuApi/setMenuAuthGroupUserDel.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(authrtGroupUserSns)
            };
            EgovNet.requestFetch(
                requestURL,
                requestOptions,
                (resp) => {
                    getAuthorityGroupUserList(selectAuthoritySn);
                }
            )
        }
    );

    const selectAuthorityGroupUserDelete = () => {
        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                let authrtGroupUserSns = [];
                document.getElementsByName("authorityGroupUserCheck").forEach(function (item, index){
                    if(index > 0){
                        if(item.checked){
                            authrtGroupUserSns.push(String(item.value));
                        }
                    }
                });
                setGroupUserCheckGroup(authrtGroupUserSns.join(","));
            } else {
                //취소
            }
        });
    }

    const userSelectSubmit = () => {
        Swal.fire({
            title: "추가하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                let selectUserArr = [];
                document.getElementsByName("userCheck").forEach(function (item, index){
                    if(index > 0){
                        if(item.checked){
                            if(!menuAuthGroupUser.some( itemA => String(itemA.userSn) === String(item.value) )){
                                menuAuthGroupUser.push({ userSn : item.value });
                                selectUserArr.push(
                                    {
                                        userSn : parseInt(item.value),
                                        authrtGroupSn : selectAuthoritySn.authrtGroupSn,
                                        //authrtGrntDt : moment(new Date()).format('YYYY-MM-DD'),
                                        creatrSn : sessionUser.userSn
                                    }
                                );
                                const userData = userDataList.find( i => String(i.userSn) === String(item.value));
                                console.log(userDataList);
                                console.log(userData);
                            }
                        }
                    }
                });
                if(selectUserArr.length > 0){
                    console.log("-----------------------------");
                    console.log(selectUserArr);
                    console.log("-----------------------------");
                    const params = {
                        authrtGroupUsers : selectUserArr
                    }
                    const menuListURL = "/menuApi/setMenuAuthGroupUser.do";
                    const requestOptions = {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify(params)
                    };
                    EgovNet.requestFetch(
                        menuListURL,
                        requestOptions,
                        (resp) => {
                            if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                                getAuthorityGroupUserList(selectAuthoritySn);
                            } else {
                                navigate(
                                    { pathname: URL.ERROR },
                                    { state: { msg: resp.resultMessage } }
                                );
                            }

                        }
                    )

                }
                console.log(selectAuthoritySn);
            } else {
                //취소
                modelCloseEvent();
            }
        });

    }

    const authorityClick = (authrtGroupSn) => {
        setSelectAuthoritySn({
            ...selectAuthoritySn,
            authrtGroupSn: authrtGroupSn
        })
    };

    const checkGroupAllCheck = (e) => {
        let checkBoolean = e.target.checked;
        document.getElementsByName("authorityGroupUserCheck").forEach(function (item, index) {
            item.checked = checkBoolean;
        });
    }

    const checkUserAllCheck = (e) => {
        let checkBoolean = e.target.checked;
        document.getElementsByName("userCheck").forEach(function (item, index) {
            item.checked = checkBoolean;
        });
    }

    const getUserList = useCallback(
        (searchUserCondition) => {
            const normalMemberListURL = "/memberApi/getNormalMemberList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchUserCondition),
            };

            EgovNet.requestFetch(
                normalMemberListURL,
                requestOptions,
                (resp) => {
                    setUserPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="no-data">
                            <td colSpan="3">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getNormalMemberList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        const totalItems = resp.result.getNormalMemberList.length;
                        const itemNumber = totalItems - index;

                        dataList.push(
                            <tr key={item.userSn}>
                                <td>
                                    <label className="checkBox type2">
                                        <input type="checkbox" name="userCheck" className="customCheckBox"
                                               value={item.userSn}/>
                                    </label>
                                </td>
                                <td>{item.userId}</td>
                                <td>{item.kornFlnm}</td>
                            </tr>
                        );
                    });
                    setUserDataList(resp.result.getNormalMemberList);
                    setUserList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            );
        },
        [userList, searchUserCondition]
    );

    const getAuthorityGroupUserList = useCallback(
        (selectAuthoritySn) => {
            const requestURL = "/menuApi/getMenuAuthGroupUserList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(selectAuthoritySn)
            };
            EgovNet.requestFetch(
                requestURL,
                requestOptions,
                (resp) => {
                    console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=");
                    console.log(resp.result.menuAuthGroupUser);
                    let simpleDatas = [];
                    let dataList = [];
                    dataList.push(
                        <tr key="no_data">
                            <td colSpan="4">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    if(resp.result.menuAuthGroupUser != null && resp.result.menuAuthGroupUser.length > 0){

                        resp.result.menuAuthGroupUser.forEach(function (item, index) {
                            if(item.tblUser != null){
                                const simpleData = {
                                    userSn : String(item.userSn),
                                    authrtGrntDt : moment(item.authrtGrntDt).format('YYYY-MM-DD')
                                }
                                simpleDatas.push(simpleData);

                                if (index === 0) dataList = []; // 목록 초기화

                                dataList.push(
                                    <tr key={item.authrtGroupUserSn}
                                    >
                                        <td>
                                            <label className="checkBox type2">
                                                <input type="checkbox" name="authorityGroupUserCheck" className="customCheckBox"
                                                       defaultValue={item.authrtGroupUserSn}/>
                                            </label>
                                        </td>
                                        <td>{item.tblUser.userId}</td>
                                        <td>{item.tblUser.kornFlnm}</td>
                                        <td>
                                            <div className="customInput">
                                                <input type="date"
                                                       defaultValue={moment(item.authrtGrntDt).format('YYYY-MM-DD')}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        });
                    }
                    setMenuAuthGroupUser(simpleDatas);
                    setAuthorityGroupUserList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [authorityGroupUserList, selectAuthoritySn]
    )

    const getAuthorityList = useCallback(
        (authoritySearchCondition) => {
            const menuListURL = "/menuApi/getMenuAuthGroupListOnPage.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(authoritySearchCondition)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    setAuthorityPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    authorityList.push(
                        <tr key="no_data">
                            <td colSpan="4">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    const resultCnt = parseInt(resp.paginationInfo.totalRecordCount);
                    const currentPageNo = resp.paginationInfo.currentPageNo;
                    const pageSize = resp.paginationInfo.pageSize;

                    resp.result.authGroup.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.authrtGroupSn}
                                onClick={(e) => {authorityClick(item.authrtGroupSn)}}
                            >
                                <td>{item.authrtGroupNm}</td>
                                <td>{item.authrtType}</td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "사용안함"}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
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
        [authorityList, authoritySearchCondition]
    );

    useEffect(() => {
        getAuthorityList(authoritySearchCondition);
    }, []);
    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>권한사용자관리</p></h2>
                <div className="contBox">
                    <div className="box listBox">
                        <div className="topTitle">권한목록</div>
                        <div className="tableBox type1">
                            <table>
                                <caption>권한목록</caption>
                                <thead>
                                <tr>
                                    <th>권한그룹명</th>
                                    <th>권한구분</th>
                                    <th>활성여부</th>
                                    <th>등록일</th>
                                </tr>
                                </thead>
                                <tbody>
                                {authorityList}
                                </tbody>
                            </table>
                        </div>
                        <div className="pageWrap">
                            <EgovPaging
                                pagination={authorityPaginationInfo}
                                moveToPage={(passedPage) => {
                                    getAuthorityList({
                                        ...authoritySearchCondition,
                                        pageIndex: passedPage
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="box infoBox">
                        <div className="topTitle">사용자목록</div>
                        <div className="tableBox type1">
                            <table>
                                <caption>사용자목록</caption>
                                <thead>
                                <tr>
                                    <th>
                                        <label className="checkBox type2">
                                            <input type="checkbox"
                                                   name="authorityGroupUserCheck"
                                                   className="customCheckBox"
                                                   onClick={checkGroupAllCheck}
                                            />
                                        </label>
                                    </th>
                                    <th>아이디</th>
                                    <th>이름</th>
                                    <th>권한 부여일</th>
                                </tr>
                                </thead>
                                <tbody>
                                {authorityGroupUserList}
                                </tbody>
                            </table>
                        </div>{/*
                        <div className="pageWrap">
                            <button type="button" className="clickBtn black" onClick={modelOpenEvent}><span>사용자조회</span>
                            </button>
                        </div>*/}
                        <div className="buttonBox">
                            <div className="leftBox">
                                <button type="button" className="clickBtn point" onClick={modelOpenEvent}>
                                    <span>사용자추가</span>
                                </button>
                            </div>
                            <button type="button" className="clickBtn red"  onClick={selectAuthorityGroupUserDelete}>
                                <span>선택삭제</span></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="programModal modalCon" id="modalDiv">
                <div className="bg"></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="top">
                            <h2 className="title">사용자목록</h2>
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
                                                <select className="selectGroup">
                                                    <option value="0">이름</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li className="searchBox inputBox type1">
                                            <label className="title" htmlFor="program_search"><small>검색어</small></label>
                                            <div className="input">
                                                <input type="text"
                                                       name="program_search"
                                                       id="program_search" title="검색어"
                                                       onChange={(e) => {
                                                           setSearchUserCondition({...searchUserCondition, kornFlnm: e.target.value})
                                                       }}
                                                />
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="rightBtn">
                                        <button type="button" className="refreshBtn btn btn1 gray"
                                                onClick={() => {
                                                    setSearchUserCondition({...searchUserCondition, kornFlnm: ""})
                                                    document.getElementById('program_search').value = "";
                                                    getUserList({
                                                        pageIndex: 1,
                                                    });
                                                }}
                                        >
                                            <div className="icon"></div>
                                        </button>
                                        <button type="button" className="searchBtn btn btn1 point"
                                                onClick={() => {
                                                    getUserList({
                                                        ...searchUserCondition,
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
                                    <caption>사용자목록</caption>
                                    <thead>
                                    <tr>
                                        <th className="th1">
                                            <label className="checkBox type2">
                                                <input type="checkbox"
                                                       name="userCheck"
                                                       className="customCheckBox"
                                                       onClick={checkUserAllCheck}
                                                />
                                            </label>
                                        </th>
                                        <th className="th1"><p>아이디</p></th>
                                        <th className="th2"><p>성명</p></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userList}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pageWrap">
                                <EgovPaging
                                    pagination={userPaginationInfo}
                                    moveToPage={(passedPage) => {
                                        getUserList({
                                            ...searchUserCondition,
                                            pageIndex: passedPage
                                        });
                                    }}
                                />
                                <button type="button" className="writeBtn clickBtn"
                                    onClick={userSelectSubmit}
                                ><span>추가</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerAuthorityGroupUsers;
