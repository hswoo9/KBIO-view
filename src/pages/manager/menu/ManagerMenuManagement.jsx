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

    const [searchMenu, setSearchMenu] = useState({});
    useEffect(() => {
    }, [searchMenu]);

    const [menuDetail, setMenuDetail] = useState({});
    useEffect(() => {
        console.log(menuDetail);
    }, [menuDetail]);

    const [saveMenuData, setSaveMenuData] = useState({});
    useEffect(() => {
        setMenu(saveMenuData);
    }, [saveMenuData]);

    const [checked, setChecked] = useState([]);

    const [upperMenuList, setUpperMenuList] = useState([]);
    const [upperMenuList2, setUpperMenuList2] = useState([]);
    const [upperMenuList3, setUpperMenuList3] = useState([]);

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

    const upperMenuChange = (e, menuSeq) => {
        console.log(e.target.value);
        const filterMenuList = [];
        if(e.target.value != 0 && e.target.value != "" && menuSeq == 1){
            setMenuDetail({
                ...menuDetail,
                upperMenuSn : e.target.value,
                menuSeq : menuSeq
            })

            setSearchMenu({
                ...searchMenu,
                upperMenuSn : e.target.value,
                menuSeq : menuSeq
            });

            menuList.map((menu) => {
               if(menu.menuSn == e.target.value){
                   if(menu.childTblMenu != null && menu.childTblMenu.length > 0){
                       menu.childTblMenu.map((subMenu) => {
                           filterMenuList.push(subMenu);
                       });
                   }
               }
            });
            setUpperMenuList2(makerMenuOption(filterMenuList));
        }else if(e.target.value != 0 && e.target.value != "" && menuSeq == 2){
            setMenuDetail({
                ...menuDetail,
                upperMenuSn : e.target.value,
                menuSeq : menuSeq
            })
            setSearchMenu({
                ...searchMenu,
                upperMenuSn : e.target.value,
                menuSeq : menuSeq
            });

            menuList.map((menu) => {
                if(menu.menuSn == e.target.value){
                    if(menu.childTblMenu != null && menu.childTblMenu.length > 0){
                        menu.childTblMenu.map((subMenu) => {
                            filterMenuList.push(subMenu);
                        });
                    }
                }
            });
            setUpperMenuList3(makerMenuOption(filterMenuList));
        }else if(e.target.value != 0 && e.target.value != "" && menuSeq == 3){
            setMenuDetail({
                ...menuDetail,
                upperMenuSn : e.target.value,
                menuSeq : menuSeq
            })
        }else{
            let finalUperMenuSn = 0;
            let finalMenuSeq = 0;
            if(menuSeq == 1){
                finalUperMenuSn = 0;
                finalMenuSeq = 0;
                setUpperMenuList2(makerMenuOption([]));
            }else if(menuSeq == 2){
                finalUperMenuSn = document.getElementById("upperMenuList").value;
                finalMenuSeq = 1;
                setUpperMenuList3(makerMenuOption([]));
            }else if(menuSeq == 3){
                finalUperMenuSn = document.getElementById("upperMenuList2").value;
                finalMenuSeq = 2;
            }
            setMenuDetail({
                ...menuDetail,
                upperMenuSn : finalUperMenuSn,
                menuSeq : finalMenuSeq
            })
        }
    }

    const saveMenu = () => {
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                if(saveMode.mode === "insert"){
                    if(menuDetail.creatrSn == null){
                        setMenuDetail({
                            ...menuDetail,
                            creatrSn: sessionUser.userSn,
                        })
                    }

                    if(menuDetail.menuNm == null || menuDetail.menuNm == ""){
                        Swal.fire("메뉴명이 없습니다.");
                        return;
                    }
                    if(menuDetail.menuType == null || menuDetail.menuType == ""){
                        menuDetail.menuType = "n";
                    }
                    if(menuDetail.menuPathNm == null || menuDetail.menuPathNm == ""){
                        Swal.fire("메뉴경로가 없습니다.");
                        return;
                    }

                    if(menuDetail.menuSortSeq == null || menuDetail.menuSortSeq == ""){
                        Swal.fire("메뉴순서가 없습니다.");
                        return;
                    }
                    if(menuDetail.actvtnYn == null || menuDetail.actvtnYn == ""){
                        setMenuDetail({
                            ...menuDetail,
                            actvtnYn: "Y"
                        })
                    }
                    setSaveMenuData(menuDetail);
                }else{
                    setMenu(menuDetail);
                }
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
                document.getElementById("upperMenuList").value = "";
                setUpperMenuList2(makerMenuOption([]));
                setUpperMenuList3(makerMenuOption([]));
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

    const makerMenuOption = (data) => {
        let resultMenuList = [];
        data.forEach(function (item, index){
            resultMenuList.push(
                <option value={item.menuSn} key={item.menuSn}>{item.menuNm}</option>
            )
        });
        return resultMenuList;
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
                    let upperMenus = [];
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
                    setUpperMenuList(makerMenuOption(resp.result.menus));
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
                    getMenuList({
                        searchData : ""
                    });
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
                        resp.result.menu.menuSnPath;
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
                                             id="upperMenuList"
                                             onChange={(e) => upperMenuChange(e, 1)}
                                        >
                                            <option value="">선택</option>
                                            <option value="0">최상위</option>
                                            {upperMenuList}
                                        </Form.Select>
                                        <Form.Select size="sm"
                                            id="upperMenuList2"
                                            onChange={(e) => upperMenuChange(e, 2)}
                                        >
                                            <option value="">선택</option>
                                            {upperMenuList2}
                                        </Form.Select>
                                        <Form.Select size="sm"
                                            id="upperMenuList3"
                                            onChange={(e) => upperMenuChange(e, 3)}
                                        >
                                            <option value="">선택</option>
                                            {upperMenuList3}
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
