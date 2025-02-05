import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";

import CheckboxTree from 'react-checkbox-tree';
import '@/css/ReactCheckBoxTree.css';
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
        if(searchDto.menuSn != null){
            getMenu(searchDto);
        }
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
        if(saveMenuData.btnType != null){
            setMenu(saveMenuData);
        }
    }, [saveMenuData]);

    const [deleteMenu, setDeleteMenu] = useState({});
    useEffect(() => {
        if(deleteMenu.actionYn != null){
            setMenuDel(deleteMenu);
        }
    }, [deleteMenu]);

    const [checked, setChecked] = useState([]);

    const [upperMenuList, setUpperMenuList] = useState([]);
    const [upperMenuList2, setUpperMenuList2] = useState([]);
    const [upperMenuList3, setUpperMenuList3] = useState([]);

    const [expandedArr, setExpandedArr] = useState([]);
    const [expanded, setExpanded] = useState(['Documents']);
    const allOpenEvent = () => {
        setExpanded(expandedArr);
    }
    const allCloseEvent = () => {
        setExpanded(['Documents']);
    }


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
                if(menu.menuSn == document.getElementById("upperMenuList").value){
                    if(menu.childTblMenu != null && menu.childTblMenu.length > 0){
                        menu.childTblMenu.map((subMenu) => {
                           if(subMenu.menuSn == e.target.value){
                               if(subMenu.childTblMenu != null && subMenu.childTblMenu.length > 0){
                                   subMenu.childTblMenu.map((subSubMenu) => {
                                       filterMenuList.push(subSubMenu);
                                   });
                               }
                           }
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

                if(menuDetail.aplcnNtnLtr == null || menuDetail.aplcnNtnLtr == ""){
                    setMenuDetail({
                        ...menuDetail,
                        aplcnNtnLtr: "KR"
                    })
                }
                menuDetail.btnType = "save";
                setSaveMenuData(menuDetail);
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
                document.getElementById("actvtnYn").value = "N";
                setUpperMenuList2(makerMenuOption([]));
                setUpperMenuList3(makerMenuOption([]));
                setSearchDto({
                    searchData : ""
                });
            } else {
            }
        });
    }

    const deleteMenuFn = () => {
        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                let deleteMenu = [];
                deleteMenu.push(menuDetail.menuSn);
                setDeleteMenu({
                    menuSns : deleteMenu.join(","),
                    actionYn : "Y"
                });
            } else {
            }
        });
    }

    const setMenuDel = useCallback(
        (deleteMenu) => {
            const menuListURL = "/menuApi/setMenuDel.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(deleteMenu)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    setSaveMode({mode:"insert"});
                    setMenuDetail({});
                    document.getElementById("upperMenuList").value = "";
                    setUpperMenuList2(makerMenuOption([]));
                    setUpperMenuList3(makerMenuOption([]));
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
                    let menuHtml = [];
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
                                    subItem.childTblMenu.forEach(function (subSubItem, subSubIndex) {
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
                    setUpperMenuList(makerMenuOption(resp.result.menus));
                    setMenuList(resp.result.menus);
                    setExpanded(expandedArr);
                    setExpandedArr(expandedArr);
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
                        if(resp.result.menu.actvtnYn != null){
                            if(resp.result.menu.actvtnYn == "Y"){
                                document.getElementById("actvtnYn").checked = true;
                            }else{
                                document.getElementById("actvtnYn").checked = false;
                            }
                        }

                        setSaveMode({mode: "update"});
                        if(resp.result.menu.menuSnPath.indexOf("|") > -1){
                            if(resp.result.menu.upperMenuSn == 0){
                                document.getElementById("upperMenuList").value = 0;
                            }else{
                                const filterMenuList = [];
                                let menuSnPath = resp.result.menu.menuSnPath.split("|");
                                if(resp.result.menu.menuSeq == 1){
                                    document.getElementById("upperMenuList").value = resp.result.menu.upperMenuSn;
                                    document.getElementById("upperMenuList2").value = "";
                                    document.getElementById("upperMenuList3").value = "";
                                }else if(resp.result.menu.menuSeq == 2){
                                    document.getElementById("upperMenuList").value = menuSnPath[0];

                                    menuList.map((menu) => {
                                        if(menuSnPath[0] == String(menu.menuSn)){
                                            if(menu.childTblMenu != null && menu.childTblMenu.length > 0){
                                                menu.childTblMenu.map((subMenu) => {
                                                    filterMenuList.push(subMenu);
                                                });
                                            }
                                        }
                                    });
                                    setUpperMenuList2(makerMenuOption(filterMenuList));
                                    document.getElementById("upperMenuList2").value = menuSnPath[1];

                                    const filterMenuList2 = [];
                                    menuList.map((menu) => {
                                        if(menuSnPath[0] == String(menu.menuSn)){
                                            if(menu.childTblMenu != null && menu.childTblMenu.length > 0){
                                                menu.childTblMenu.map((subMenu) => {
                                                    if(menuSnPath[1] == String(subMenu.menuSn)){
                                                        if(subMenu.childTblMenu != null && subMenu.childTblMenu.length > 0){
                                                            subMenu.childTblMenu.map((subSubMenu) => {
                                                                filterMenuList2.push(subSubMenu);
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    setUpperMenuList3(makerMenuOption(filterMenuList2));
                                }
                            }
                        }
                        setMenuDetail(resp.result.menu);
                    }
                }
            )
        }
    );
    
    const [bbsList, setBbsList] = useState([]);
    const getBbsList = useCallback(
        (searchDto) => {
            const bbsListURL = "/bbsApi/getBbsAllList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                bbsListURL,
                requestOptions,
                (resp) => {
                    let dataList = [];
                    resp.result.bbsList.forEach(function (item, index) {
                        if (index === 0) dataList = [];
                        dataList.push(
                            <option key={item.bbsSn} value={item.bbsSn}>{item.bbsNm}</option>
                        );
                    });
                    setBbsList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [bbsList, searchDto]
    );

    useEffect(() => {
        getBbsList(searchDto);
        getMenuList(searchDto);
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>메뉴 관리</p></h2>
                <div className="contBox">
                    <div className="box listBox">
                        <div className="topTitle">메뉴목록</div>
                        <CheckboxTree
                            nodes={menuList}
                            expanded={expanded}
                            onExpand={onExpand}
                            onClick={menuOnClick}
                        >
                        </CheckboxTree>
                        <div className="buttonBox">
                            <div className="left">
                            </div>
                            <div className="right">
                                <button type="button" className="btn btn2 black openBtn" onClick={allOpenEvent}><span>모두 열기</span></button>
                                <button type="button" className="btn btn2 black closeBtn" onClick={allCloseEvent}><span>모두 닫기</span></button>
                            </div>
                        </div>
                    </div>
                    <div className="box infoBox">
                        <div className="topTitle">메뉴정보</div>
                        <ul className="listBox">
                            <li className="inputBox type1">
                                <label className="title" htmlFor="upperMenuList"><small>상위메뉴</small></label>
                            </li>
                            <li className="inputBox type11">
                                <select
                                    id="upperMenuList"
                                    className="selectGroup width30 inlineBlock"
                                    onChange={(e) => upperMenuChange(e, 1)}
                                >
                                    <option value="">선택</option>
                                    <option value="0">최상위</option>
                                    {upperMenuList}
                                </select>
                                <select
                                    id="upperMenuList2"
                                    onChange={(e) => upperMenuChange(e, 2)}
                                    className="selectGroup width30 inlineBlock"
                                >
                                    <option value="">선택</option>
                                    {upperMenuList2}
                                </select>
                                <select
                                    id="upperMenuList3"
                                    onChange={(e) => upperMenuChange(e, 3)}
                                    className="selectGroup width30 inlineBlock"
                                >
                                    <option value="">선택</option>
                                    {upperMenuList3}
                                </select>
                            </li>
                            <li className="inputBox type1">
                                <label className="title" htmlFor="menuSn"><small>메뉴번호</small></label>
                                <div className="input">
                                    <input type="text"
                                           id="menuSn"
                                           disabled="disabled"
                                           value={menuDetail.menuSn || ""}
                                    />
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <label className="title" htmlFor="menuType"><small>메뉴유형</small></label>
                                <div className="input">
                                    <select
                                        id="menuType"
                                        className="selectGroup"
                                        onChange={(e) =>
                                            setMenuDetail({
                                                ...menuDetail,
                                                menuType: e.target.value,
                                            })
                                        }
                                        value={menuDetail.menuType || ""}
                                    >
                                        <option value="">선택</option>
                                        <option value="n">일반</option>
                                        <option value="c">컨텐츠</option>
                                        <option value="b">게시판</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" id="boardListLi">
                                <label className="title" htmlFor="bbsSn"><small>게시판목록</small></label>
                                <div className="input">
                                    <select
                                        id="bbsSn"
                                        className="selectGroup"
                                        onChange={(e) =>
                                            setMenuDetail({
                                                ...menuDetail,
                                                bbsSn: e.target.value,
                                            })
                                        }
                                        value={menuDetail.bbsSn || ""}
                                    >
                                        <option value="">선택</option>
                                        {bbsList}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <label className="title" htmlFor="bbsNm"><small>메뉴명</small></label>
                                <div className="input">
                                    <input
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
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <label className="title" htmlFor="menuPathNm"><small>메뉴경로</small></label>
                                <div className="input">
                                    <input
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
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <label className="title" htmlFor="menuSortSeq"><small>메뉴순서</small></label>
                                <div className="input">
                                    <input
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
                                </div>
                            </li>
                            <li className="toggleBox width3">
                                <div className="box">
                                    <p className="title">활성여부</p>
                                    <div className="toggleSwithWrap">
                                        <input type="checkbox"
                                               id="actvtnYn"
                                               onChange={(e) =>
                                                   setMenuDetail({
                                                       ...menuDetail,
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
                        </ul>
                        <div className="buttonBox">
                            <div className="left">
                                <button type="button" className="clickBtn" onClick={saveMenu}><span>저장</span></button>
                                {menuDetail.menuSn && (
                                    <button type="button" className="clickBtn red" onClick={deleteMenuFn}>
                                        <span>삭제</span>
                                    </button>
                                )}
                            </div>
                            <div className="right">
                                <button type="button" className="clickBtn white" onClick={resetMenu}><span>초기화</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Index;
