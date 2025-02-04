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

function ManagerMenuAuthority(props) {
    const sessionUser = getSessionItem("loginUser");
    console.group("ManagerMenuAuthority");
    console.log("[Start] ManagerMenuAuthority ------------------------------");
    console.log("ManagerMenuAuthority [props] : ", props);

    const location = useLocation();


    const [saveMode, setSaveMode] = useState({
        mode : "insert"
    });

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
            menuSn: ""
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({});
    const cndRef = useRef();
    const wrdRef = useRef();

    useEffect(() => {
    }, [searchDto]);

    const [authrtGroupSns, setAuthrtGroupSns] = useState({});
    useEffect(() => {
        setMenuAuthGroupDel(authrtGroupSns);
    }, [authrtGroupSns]);

    const [selectAuthority, setSelectAuthority] = useState({});
    useEffect(() => {
        console.log(selectAuthority);
        getMenuAuthGroup(selectAuthority);
    }, [selectAuthority]);

    const [selectAuthorityCheckGroup, setSelectAuthorityCheckGroup] = useState([]);
    useEffect(() => {
        console.log(selectAuthorityCheckGroup);
        setAuthrtGroupSns({
            ...authrtGroupSns,
            authrtGroupSns : selectAuthorityCheckGroup
        });
    }, [selectAuthorityCheckGroup]);

    const [menuDetail, setMenuDetail] = useState({});
    useEffect(() => {

    }, [menuDetail]);

    const [authorityGroup, setAuthorityGroup] = useState({});
    useEffect(() => {
        console.log(authorityGroup);
        if(authorityGroup.btnType != null){
            saveAuthorityGroup(authorityGroup);
        }
    }, [authorityGroup]);

    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState(['Documents']);

    const onCheck = (value) => {
        setChecked(value);
    };

    const onExpand = (value) => {
        setExpanded(value);
    };

    const menuOnClick = (e) => {
        setSearchDto({menuSn : e.value, menuNm : e.label});
    };

    const checkGroupAllCheck = (e) => {
        let checkBoolean = e.target.checked;
        document.getElementsByName("authorityCheck").forEach(function (item, index){
            item.checked = checkBoolean;
        });
    }


    const [menuList, setMenuList] = useState([]);
    const [authorityList, setAuthorityList] = useState([]);

    const saveMenu = () => {
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                if(authorityGroup.authrtGroupNm == null){
                    Swal.fire("권한그룹명이 없습니다.");
                    return;
                }
                if(authorityGroup.authrtType == null || authorityGroup.authrtType == ""){
                    authorityGroup.authrtType = document.getElementById("authrtType").value;
                }
                if(authorityGroup.actvtnYn == null || authorityGroup.actvtnYn == ""){
                    authorityGroup.actvtnYn = document.getElementById("actvtnYn").checked ? "Y" : "N";
                }/*
                if(
                    authorityGroup.inqAuthrt == null
                    && authorityGroup.wrtAuthrt == null
                    && authorityGroup.mdfcnAuthrt == null
                    && authorityGroup.delAuthrt == null
                ){
                    Swal.fire("선택된 게시판 권한이 없습니다.");
                    return;
                }*/
                if(authorityGroup.authrtGroupSn == null){
                    authorityGroup.creatrSn = sessionUser.userSn;
                }
                //메뉴 체크 리스트
                const treeEl = document.getElementById("checkBoxTree");
                const checkedGroup = treeEl.querySelectorAll("input[type='checkbox']:checked");

                if(checkedGroup.length > 0){
                    let allowAccessMenu = [];

                    checkedGroup.forEach(function(item, index){
                        let pushData = {
                            menuSn : String(item.id.split('-')[1])
                        };
                        allowAccessMenu.push(pushData);
                    });

                    setAuthorityGroup({
                        ...authorityGroup,
                        allowAccessMenu : allowAccessMenu,
                        btnType: "save"
                    });
                }else{
                    setAuthorityGroup({
                        ...authorityGroup,
                        btnType: "save"
                    });
                }
            } else {
                //취소
            }
        });
    }

    const resetData = () => {
        Swal.fire({
            title: "초기화하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                fieldReset();
            } else {
            }
        });
    }

    const fieldReset = () => {
        setSaveMode({mode:"insert"});
        document.getElementById("inqAuthrt").checked = true;
        document.getElementById("wrtAuthrt").checked = true;
        document.getElementById("mdfcnAuthrt").checked = true;
        document.getElementById("delAuthrt").checked = true;
        document.getElementById("frstCrtDt").value = "";
        document.getElementById("mdfcnDt").value = "";

        $(".dtLi").css("display", "none");

        setAuthorityGroup({});
        setChecked([]);

    }

    const selectAuthorityDelete = () => {
        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                let authrtGroupSns = [];
                document.getElementsByName("authorityCheck").forEach(function (item, index){
                   if(index > 0){
                       if(item.checked){
                           authrtGroupSns.push(String(item.value));
                       }
                   }
                });
                setSelectAuthorityCheckGroup(authrtGroupSns.join(","));
            } else {
                //취소
            }
        });
    }

    const getMenuList = useCallback(
        (searchDto) => {
            const menuListURL = "/menuApi/getMenuTreeList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    let dataList = [];
                    menuList.push(
                        { value: "", label: "데이터가 없습니다."}
                    );
                    let expandedArr = [];

                    resp.result.menus.forEach(function (item, index) {
                        item.value = item.menuSn;
                        item.label = item.menuNm;
                        expandedArr.push(item.menuSn);
                        if(item.childTblMenu != null){
                            item.childTblMenu.forEach(function (subItem, subIndex) {
                                subItem.value = subItem.menuSn;
                                subItem.label = subItem.menuNm;
                                if(subItem.childTblMenu != null){
                                    subItem.childTblMenu.forEach(function (subSubItem, subIndex) {
                                        subSubItem.value = subSubItem.menuSn;
                                        subSubItem.label = subSubItem.menuNm;
                                        expandedArr.push(subSubItem.menuSn);
                                        if(subSubItem.childTblMenu != null){
                                            subSubItem.childTblMenu.forEach(function (subSubSubItem, subSubSubIndex){
                                                subSubSubItem.value = subSubSubItem.menuSn;
                                                subSubSubItem.label = subSubSubItem.menuNm;
                                                expandedArr.push(subSubSubItem.menuSn);
                                            });
                                            if(subSubItem.childTblMenu.length > 0){
                                                subSubItem.children = subSubItem.childTblMenu;
                                            }
                                        }
                                    });
                                    if(subItem.childTblMenu.length > 0){
                                        subItem.children = subItem.childTblMenu;
                                    }
                                }
                                expandedArr.push(subItem.menuSn);
                            });
                            item.children = item.childTblMenu;
                        }
                    });
                    setMenuList(resp.result.menus);
                    setExpanded(expandedArr);
                }
            )
        }
    );

    const authorityClick = (authrtGroupSn) => {
        setSelectAuthority({
            ...selectAuthority,
            authrtGroupSn : authrtGroupSn
        });
    };

    const getAuthorityList = useCallback(
        (searchDto) => {
            const menuListURL = "/menuApi/getMenuAuthGroupListOnPage.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    authorityList.push(
                        <tr>
                            <td colSpan="5">검색된 결과가 없습니다.</td>
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
                                <td onClick={(e) => {e.stopPropagation()}}>
                                    <label className="checkBox type2">
                                        <input type="checkbox" name="authorityCheck" className="customCheckBox" value={item.authrtGroupSn}/>
                                    </label>
                                </td>
                                <td>{item.authrtGroupNm}</td>
                                <td>{item.authrtType}</td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "사용안함"}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                            </tr>
                        );
                    });
                    console.log("---------------------------");
                    console.log(dataList);
                    console.log("---------------------------");
                    setAuthorityList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [authorityList, searchDto]
    );

    const getMenuAuthGroup = useCallback(
        (selectAuthority) => {
            const menuListURL = "/menuApi/getMenuAuthGroup";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(selectAuthority)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    console.log(resp.result);
                    if(resp.result.menuAuthGroup != null){
                        setAuthorityGroup(resp.result.menuAuthGroup);
                        if(resp.result.menuAuthGroup.inqAuthrt == "Y"){
                            document.getElementById("inqAuthrt").checked = true;
                        }else{
                            document.getElementById("inqAuthrt").checked = false;
                        }
                        if(resp.result.menuAuthGroup.wrtAuthrt == "Y"){
                            document.getElementById("wrtAuthrt").checked = true;
                        }else{
                            document.getElementById("wrtAuthrt").checked = false;
                        }
                        if(resp.result.menuAuthGroup.mdfcnAuthrt == "Y"){
                            document.getElementById("mdfcnAuthrt").checked = true;
                        }else{
                            document.getElementById("mdfcnAuthrt").checked = false;
                        }
                        if(resp.result.menuAuthGroup.delAuthrt == "Y"){
                            document.getElementById("delAuthrt").checked = true;
                        }else{
                            document.getElementById("delAuthrt").checked = false;
                        }

                        if(resp.result.menuAuthGroup.actvtnYn != null){
                            if(resp.result.menuAuthGroup.actvtnYn == "Y"){
                                document.getElementById("actvtnYn").checked = true;
                            }else{
                                document.getElementById("actvtnYn").checked = false;
                            }
                        }

                        $(".dtLi").css("display", "flex");
                        //메뉴리스트
                        if(resp.result.menuAuthGroup.allowAccessMenu){
                            let menuSnArr = [];
                            resp.result.menuAuthGroup.allowAccessMenu.forEach(function (item, index){
                                menuSnArr.push(item.menuSn);
                            });
                            setChecked(menuSnArr);
                        }
                    }
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        }/*,
        [authorityList, selectAuthority]*/
    );

    const setMenu = useCallback(
        (menuDetail) => {
            const menuListURL = "/menuApi/setMenu";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(menuDetail)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    console.log(resp);
                    setSaveMode({mode:"insert"});
                    setMenuDetail({});
                    setSearchDto({
                        searchData : ""
                    });
                    /*getMenuList({
                        searchData : ""
                    });*/
                }
            )
        }
    );

    const saveAuthorityGroup = useCallback(
        (authorityGroup) => {
            const menuListURL = "/menuApi/setMenuAuthGroup";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(authorityGroup)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    fieldReset();
                    getAuthorityList(searchDto);
                }
            )
        }
    );

    const setMenuAuthGroupDel = useCallback(
        (authrtGroupSns) => {
            const menuListURL = "/menuApi/setMenuAuthGroupDel.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(authrtGroupSns)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    fieldReset();
                    getAuthorityList(searchDto);
                }
            )
        }
    );

    const getMenu = useCallback(
        (searchDto) => {
            const menuListURL = "/menuApi/getMenu";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    console.log(resp);
                    if(resp.result.menu != null){
                        setSaveMode({mode: "update"});
                        resp.result.menu.mdfrSn = sessionUser.userSn;
                        setMenuDetail(resp.result.menu);
                    }
                }
            )
        }
    );

    useEffect(() => {
        getMenuList(searchDto);
        getAuthorityList(searchDto);
    }, []);


    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>메뉴권한관리</p></h2>
                <div className="contBox">
                    <div className="box listBox maxW400">
                        <div className="topTitle">메뉴목록</div>
                        <CheckboxTree
                            id="checkBoxTree"
                            nodes={menuList}
                            checked={checked}
                            onCheck={onCheck}
                            expanded={expanded}
                            onExpand={onExpand}
                        >
                        </CheckboxTree>
                    </div>
                    <div className="box infoBox">
                        <div className="topTitle">권한목록</div>
                        <div className="tableBox type1">
                            <table>
                                <caption>코드목록</caption>
                                <colgroup>
                                    <col width="50px"/>
                                    <col width="200px"/>
                                    <col width="100px"/>
                                    <col width="100px"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>
                                        <label className="checkBox type2">
                                            <input type="checkbox"
                                                   name="authorityCheck"
                                                   className="customCheckBox"
                                                   onClick={checkGroupAllCheck}
                                            />
                                        </label>
                                    </th>
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
                                pagination={paginationInfo}
                                moveToPage={(passedPage) => {
                                    getAuthorityList({
                                        ...searchDto,
                                        pageIndex: passedPage
                                    });
                                }}
                            />
                            <button type="button" className="clickBtn red" onClick={selectAuthorityDelete}>
                                <span>선택삭제</span></button>
                        </div>
                        <div className="customDiv">
                            <ul className="inputWrap">
                                <li className="inputBox type1 width2">
                                    <label className="title essential" htmlFor="authrtGroupSn"><small>권한그룹 일련번호</small></label>
                                    <div className="input">
                                        <input type="text"
                                               id="authrtGroupSn"
                                               placeholder=""
                                               disabled="disabled"
                                               value={authorityGroup.authrtGroupSn || ""}
                                        />
                                    </div>
                                </li>
                                <li className="inputBox type1 width2">
                                    <label className="title essential"
                                           htmlFor="authrtGroupNm"><small>권한그룹명</small></label>
                                    <div className="input">
                                        <input type="text"
                                               id="authrtGroupNm"
                                               placeholder=""
                                               required="required"
                                               onChange={(e) =>
                                                   setAuthorityGroup({
                                                       ...authorityGroup,
                                                       authrtGroupNm: e.target.value,
                                                       mdfrSn: sessionUser.userSn
                                                   })
                                               }
                                               value={authorityGroup.authrtGroupNm || ""}
                                        />
                                    </div>
                                </li>
                                <li className="inputBox type1 width2">
                                    <label className="title" htmlFor="authrtType"><small>권한구분</small></label>
                                    <div className="itemBox">
                                        <select
                                            id="authrtType"
                                            className="selectGroup"
                                            onChange={(e) =>
                                                setAuthorityGroup({
                                                    ...authorityGroup,
                                                    authrtType: e.target.value,
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                            value={authorityGroup.authrtType || "USER"}

                                        >
                                            <option value="USER">일반사용자</option>
                                            <option value="ADMIN">관리자</option>
                                        </select>
                                    </div>
                                </li>
                                <li className="toggleBox type1 width2 customToggleBox">
                                    <div className="box">
                                        <p className="title essential">활성여부</p>
                                        <div className="toggleSwithWrap">
                                            <input type="checkbox"
                                                   id="actvtnYn"
                                                   onChange={(e) =>
                                                       setAuthorityGroup({
                                                           ...authorityGroup,
                                                           actvtnYn: e.target.checked ? "Y" : "N",
                                                           mdfrSn: sessionUser.userSn
                                                       })
                                                   }
                                            />
                                            <label htmlFor="actvtnYn" className="toggleSwitch">
                                                <span className="toggleButton"></span>
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li className="inputBox type1 width1">
                                    <p className="title">게시판 권한</p>
                                    <ul className="checkWrap">
                                        <li className="checkBox">
                                            <label>
                                                <input
                                                    type="checkBox"
                                                    id="inqAuthrt"
                                                    onChange={(e) =>
                                                        setAuthorityGroup({
                                                            ...authorityGroup,
                                                            inqAuthrt: e.target.checked ? "Y" : "N",
                                                            mdfrSn: sessionUser.userSn
                                                        })
                                                    }
                                                />
                                                <small>읽기</small>
                                            </label>
                                        </li>
                                        <li className="checkBox">
                                            <label>
                                                <input
                                                    type="checkBox"
                                                    id="wrtAuthrt"
                                                    onChange={(e) =>
                                                        setAuthorityGroup({
                                                            ...authorityGroup,
                                                            wrtAuthrt: e.target.checked ? "Y" : "N",
                                                            mdfrSn: sessionUser.userSn
                                                        })
                                                    }
                                                />
                                                <small>작성</small>
                                            </label>
                                        </li>
                                        <li className="checkBox">
                                            <label>
                                                <input
                                                    type="checkBox"
                                                    id="mdfcnAuthrt"
                                                    onChange={(e) =>
                                                        setAuthorityGroup({
                                                            ...authorityGroup,
                                                            mdfcnAuthrt: e.target.checked ? "Y" : "N",
                                                            mdfrSn: sessionUser.userSn
                                                        })
                                                    }
                                                />
                                                <small>수정</small>
                                            </label>
                                        </li>
                                        <li className="checkBox">
                                            <label>
                                                <input
                                                    type="checkBox"
                                                    id="delAuthrt"
                                                    onChange={(e) =>
                                                        setAuthorityGroup({
                                                            ...authorityGroup,
                                                            delAuthrt: e.target.checked ? "Y" : "N",
                                                            mdfrSn: sessionUser.userSn
                                                        })
                                                    }
                                                />
                                                <small>삭제</small>
                                            </label>
                                        </li>
                                    </ul>
                                </li>
                                <li className="inputBox type1 width2 dtLi">
                                    <p className="title">최초 등록일</p>
                                    <div className="input">
                                        <input type="text"
                                               id="frstCrtDt"
                                               placeholder=""
                                               disabled="disabled"
                                               value={
                                                   authorityGroup.frstCrtDt ? moment(authorityGroup.frstCrtDt).format('YYYY-MM-DD') : ""
                                               }
                                        />
                                    </div>
                                </li>
                                <li className="inputBox type1 width2 dtLi">
                                    <p className="title">최초 수정일</p>
                                    <div className="input">
                                        <input type="text"
                                               id="mdfcnDt"
                                               placeholder=""
                                               disabled="disabled"
                                               value={
                                                    authorityGroup.mdfcnDt ? moment(authorityGroup.mdfcnDt).format('YYYY-MM-DD') : ""
                                               }
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="buttonBox">
                            <div className="leftBox">
                                <button type="button" className="clickBtn point" onClick={saveMenu}><span>저장</span>
                                </button>
                            </div>
                            <button type="button" className="clickBtn black" onClick={resetData}><span>초기화</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerMenuAuthority;
