import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import moment from 'moment';
import 'moment/locale/ko';

import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftMenu";

import CheckboxTree from 'react-checkbox-tree';
import '@/css/ReactCheckBoxTree.css';

import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';

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
                    authorityGroup.actvtnYn = document.getElementById("actvtnYn").value;
                }
                if(
                    authorityGroup.inqAuthrt == null
                    && authorityGroup.wrtAuthrt == null
                    && authorityGroup.mdfcnAuthrt == null
                    && authorityGroup.delAuthrt == null
                ){
                    Swal.fire("선택된 게시판 권한이 없습니다.");
                    return;
                }
                if(authorityGroup.authrtGroupSn == null){
                    authorityGroup.creatrSn = sessionUser.userSn;
                }
                //메뉴 체크 리스트
                if(checked.length > 0){
                    let allowAccessMenu = [];
                    checked.forEach(function(item, index){
                        let pushData = {
                            menuSn : item
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
        document.getElementById("inqAuthrt").checked = false;
        document.getElementById("wrtAuthrt").checked = false;
        document.getElementById("mdfcnAuthrt").checked = false;
        document.getElementById("delAuthrt").checked = false;


        document.getElementById("saveViewDl").style.display = "none";
        setAuthorityGroup({});
        setChecked([]);
    }

    const deleteMenu = () => {
        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                //확인시
                Swal.fire("삭제되었습니다.");
            } else {
                //취소
            }
        });
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
                                    <input type="checkbox" name="authorityCheck" value={item.authrtGroupSn}/>
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
                        document.getElementById("saveViewDl").style.display = "table-cell";
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


  const Location = React.memo(function Location() {
    return (
        <div className="location">
            <ul>
                <li>
                    <Link to={URL.MANAGER} className="home">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to={URL.MANAGER_MENU_MANAGEMENT}>메뉴관리</Link>
                </li>
                <li>메뉴권한관리</li>
            </ul>
        </div>
    );
  });


    return (
        <div className="container">
            <div className="c_wrap">
        {/* <!-- Location --> */}
        <Location/>
        {/* <!--// Location --> */}
                <div className="layout">
                    {/* <!-- Navigation --> */}
                    {/* <!--// Navigation --> */}
                    <EgovLeftNav/>
                    <div className="contents BOARD_CREATE_LIST" id="contents">
                        <div className="leftDiv">
                            <CheckboxTree
                                nodes={menuList}
                                checked={checked}
                                onCheck={onCheck}
                                expanded={expanded}
                                onExpand={onExpand}
                            >
                            </CheckboxTree>
                        </div>
                        <div className="rightDiv">
                            <dl>
                                <dd className="btnRightGroup">
                                    <BTButton variant="secondary" size="sm"
                                              onClick={selectAuthorityDelete}
                                    >선택삭제</BTButton>
                                </dd>
                            </dl>
                            <BtTable
                                striped bordered hover size="sm"
                                className="btTable"
                            >
                                <colgroup>
                                    <col width="50px"/>
                                    <col width="200px"/>
                                    <col/>
                                    <col width="80px"/>
                                    <col/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox" name="authorityCheck"
                                               onClick={checkGroupAllCheck}
                                        />
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
                            </BtTable>
                            <div className="board_bot">
                                <EgovPaging
                                    pagination={paginationInfo}
                                    moveToPage={(passedPage) => {
                                        getAuthorityList({
                                            ...searchDto,
                                            pageIndex: passedPage
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="rightDiv">
                            <div className="write_div">
                                <dl>
                                    <dd className="btnRightGroup">
                                        <BTButton variant="secondary" size="sm"
                                                  onClick={resetData}
                                        >신규등록</BTButton>
                                        <BTButton variant="primary" size="sm"
                                                  onClick={saveMenu}
                                        >저장</BTButton>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <label htmlFor="bbsNm">권한그룹<br/>일련번호</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            id="authrtGroupSn"
                                            placeholder=""
                                            disabled="disabled"
                                            value={authorityGroup.authrtGroupSn || ""}
                                        />
                                    </dd>
                                    <dt>
                                        <label htmlFor="bbsNm">권한그룹명</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Control
                                            size="sm"
                                            type="text"
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
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <label htmlFor="bbsNm">권한 구분</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Select
                                            id="authrtType"
                                            size="sm"
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
                                        </Form.Select>
                                    </dd>
                                    <dt>
                                        <label htmlFor="bbsNm">활성여부</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Select
                                            size="sm"
                                            id="actvtnYn"
                                            onChange={(e) =>
                                                setAuthorityGroup({
                                                    ...authorityGroup,
                                                    actvtnYn: e.target.value,
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                            value={authorityGroup.actvtnYn || "Y"}
                                        >
                                            <option value="Y">사용</option>
                                            <option value="N">미사용</option>
                                        </Form.Select>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <label htmlFor="bbsNm">게시판 권한</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd className="checkGroupDd">
                                        <Form.Check
                                            type="checkbox"
                                            id="inqAuthrt"
                                            label="읽기"
                                            onChange={(e) =>
                                                setAuthorityGroup({
                                                    ...authorityGroup,
                                                    inqAuthrt: e.target.checked ? "Y" : "N",
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                        ></Form.Check>
                                        <Form.Check
                                            type="checkbox"
                                            id="wrtAuthrt"
                                            label="작성"
                                            onChange={(e) =>
                                                setAuthorityGroup({
                                                    ...authorityGroup,
                                                    wrtAuthrt: e.target.checked ? "Y" : "N",
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                        ></Form.Check>
                                        <Form.Check
                                            type="checkbox"
                                            id="mdfcnAuthrt"
                                            label="수정"
                                            onChange={(e) =>
                                                setAuthorityGroup({
                                                    ...authorityGroup,
                                                    mdfcnAuthrt: e.target.checked ? "Y" : "N",
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                        ></Form.Check>
                                        <Form.Check
                                            type="checkbox"
                                            id="delAuthrt"
                                            label="삭제"
                                            onChange={(e) =>
                                                setAuthorityGroup({
                                                    ...authorityGroup,
                                                    delAuthrt: e.target.checked ? "Y" : "N",
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                        ></Form.Check>
                                    </dd>
                                </dl>
                                <dl id="saveViewDl">
                                    <dt>
                                        <label htmlFor="bbsNm">최초 등록일</label>
                                    </dt>
                                    <dd>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            id=""
                                            placeholder=""
                                            disabled="disabled"
                                            value={moment(authorityGroup.frstCrtDt).format('YYYY-MM-DD') || ""}
                                        />
                                    </dd>
                                    <dt>
                                        <label htmlFor="bbsNm">최종 수정일</label>
                                    </dt>
                                    <dd>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            id=""
                                            placeholder=""
                                            disabled="disabled"
                                            value={moment(authorityGroup.mdfcnDt).format('YYYY-MM-DD') || ""}
                                        />
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerMenuAuthority;
