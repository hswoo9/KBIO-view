import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftMenu";

import CheckboxTree from 'react-checkbox-tree';
import '@/css/ReactCheckBoxTree.css';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import BTButton from 'react-bootstrap/Button';
import Swal from 'sweetalert2';

import { getSessionItem } from "@/utils/storage";

function Index(props) {
    const sessionUser = getSessionItem("loginUser");
    const [saveMode, setSaveMode] = useState({
        mode : "insert"
    });

    const [searchDto, setSearchDto] = useState(
        {
            searchData : ""
        }
    );

    useEffect(() => {
        getMenu(searchDto);
    }, [searchDto]);


    const [menuDetail, setMenuDetail] = useState({});
    useEffect(() => {
        console.log(menuDetail);
    }, [menuDetail]);

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

    const [menuList, setMenuList] = useState([]);

    const saveMenu = () => {
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                /*if(saveMode.mode === "insert"){
                    if(menuDetail.creatrSn == null){
                        setMenuDetail({
                            ...menuDetail,
                            creatrSn: sessionUser.userSn,
                            mdfrSn: null
                        })
                    }
                    if(menuDetail.upperMenuSn == null){
                        setMenuDetail({
                            ...menuDetail,
                            upperMenuSn: document.getElementById("upperMenuSn").value == null ? "0" : document.getElementById("upperMenuSn").value
                        })
                    }
                    if(menuDetail.menuNm == null){
                        setMenuDetail({
                            ...menuDetail,
                            menuNm: document.getElementById("menuNm").value == null ? "메뉴명없음" : document.getElementById("menuNm").value
                        })
                    }
                    if(menuDetail.menuType == null){
                        setMenuDetail({
                            ...menuDetail,
                            menuType: document.getElementById("menuType").value == null ? "n" : document.getElementById("menuType").value
                        })
                    }
                    if(menuDetail.menuPathNm == null){
                        setMenuDetail({
                            ...menuDetail,
                            menuPathNm: document.getElementById("menuPathNm").value == null ? "-" : document.getElementById("menuPathNm").value
                        })
                    }
                    if(menuDetail.menuSeq == null){
                        setMenuDetail({
                            ...menuDetail,
                            menuSeq: "0"
                        })
                    }
                    if(menuDetail.menuSortSeq == null){
                        setMenuDetail({
                            ...menuDetail,
                            menuSortSeq: document.getElementById("menuSortSeq").value == null ? "100" : document.getElementById("menuSortSeq").value
                        })
                    }
                    if(menuDetail.actvtnYn == null){
                        setMenuDetail({
                            ...menuDetail,
                            actvtnYn: document.getElementById("actvtnYn").value == null ? "Y" : document.getElementById("actvtnYn").value
                        })
                    }
                }*/
                setMenu(menuDetail);
            } else {
                //취소
            }
        });
    }

    const resetMenu = () => {
        Swal.fire({
            title: "초기화하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                setSaveMode({mode:"insert"});
                setMenuDetail({});
                setSearchDto({
                    searchData : ""
                });
            } else {
            }
        });
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

                    resp.result.menus.forEach(function (item, index) {
                        item.value = item.menuSn;
                        item.label = item.menuNm;
                        if(item.childTblMenu != null){
                            item.childTblMenu.forEach(function (subItem, subIndex) {
                                subItem.value = subItem.menuSn;
                                subItem.label = subItem.menuNm;
                            });
                            item.children = item.childTblMenu;
                        }
                    });

                    setMenuList(resp.result.menus);
                }
            )
        }
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
    }, []);



  const location = useLocation();
    
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
                <li>메뉴관리</li>
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
                                /*checked={checked}
                                onCheck={onCheck}*/
                                expanded={expanded}
                                onExpand={onExpand}

                                onClick={menuOnClick}
                            >
                            </CheckboxTree>
                        </div>
                        <div className="rightDiv">
                            <div className="write_div">
                                <dl>
                                    <dd className="btnRightGroup">
                                        <BTButton variant="secondary" size="sm"
                                            onClick={resetMenu}
                                        >초기화</BTButton>
                                        <BTButton variant="primary" size="sm"
                                            onClick={saveMenu}
                                        >저장</BTButton>
                                        <BTButton variant="danger" size="sm"
                                            onClick={deleteMenu}
                                        >삭제</BTButton>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <label htmlFor="bbsNm">상위메뉴</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd className="customDd">
                                        <Form.Select size="sm"
                                             id="upperMenuSn"
                                             onChange={(e) =>
                                                 setMenuDetail({
                                                     ...menuDetail,
                                                     upperMenuSn: e.target.value,
                                                     mdfrSn: sessionUser.userSn
                                                 })
                                             }
                                        >
                                            <option value="">선택하세요</option>
                                            <option value="0">최상위</option>
                                        </Form.Select>
                                        <Form.Select size="sm">
                                            <option value="">선택</option>
                                        </Form.Select>
                                        <Form.Select size="sm">
                                            <option value="">선택</option>
                                        </Form.Select>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <label htmlFor="bbsNm">메뉴번호</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            id="menuSn"
                                            placeholder=""
                                            disabled="disabled"
                                            value={menuDetail.menuSn || ""}
                                        />
                                    </dd>
                                    <dt>
                                        <label htmlFor="bbsNm">메뉴유형</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Select size="sm" onChange={(e) =>
                                                setMenuDetail({
                                                    ...menuDetail,
                                                    menuType: e.target.value,
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                            value={menuDetail.menuType || "n"}
                                            id="menuType"
                                        >
                                            <option value="">선택하세요</option>
                                            <option value="n">일반</option>
                                            <option value="c">컨텐츠</option>
                                            <option value="b">게시판</option>
                                        </Form.Select>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <label htmlFor="bbsNm">메뉴명</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            id="menuNm"
                                            placeholder=""
                                            onChange={(e) =>
                                                setMenuDetail({
                                                    ...menuDetail,
                                                    menuNm: e.target.value,
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                            value={menuDetail.menuNm || ""}
                                        />
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <label htmlFor="bbsNm">메뉴경로</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            id="menuPathNm"
                                            placeholder=""
                                            onChange={(e) =>
                                                setMenuDetail({
                                                    ...menuDetail,
                                                    menuPathNm: e.target.value,
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                            value={menuDetail.menuPathNm || ""}
                                        />
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>
                                        <label htmlFor="bbsNm">메뉴순서</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            id="menuSortSeq"
                                            placeholder=""
                                            onChange={(e) =>
                                                setMenuDetail({
                                                    ...menuDetail,
                                                    menuSortSeq: e.target.value,
                                                    mdfrSn: sessionUser.userSn
                                                })
                                            }
                                            value={menuDetail.menuSortSeq || ""}
                                        />
                                    </dd>
                                    <dt>
                                        <label htmlFor="bbsNm">활성여부</label>
                                        <span className="req">필수</span>
                                    </dt>
                                    <dd>
                                        <Form.Select size="sm"
                                             id="actvtnYn"
                                             onChange={(e) =>
                                                 setMenuDetail({
                                                     ...menuDetail,
                                                     actvtnYn: e.target.value,
                                                     mdfrSn: sessionUser.userSn
                                                 })
                                             }
                                             value={menuDetail.actvtnYn || "Y"}
                                        >
                                            <option value="Y">사용</option>
                                            <option value="N">미사용</option>
                                        </Form.Select>
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


export default Index;
