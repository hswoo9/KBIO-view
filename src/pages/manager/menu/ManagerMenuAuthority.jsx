import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

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

function ManagerMenuAuthority(props) {

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

    }, [setMenuDetail]);

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
    const [listTag, setListTag] = useState([]);

    const saveMenu = () => {
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                console.log("----- save -----")
                console.log(saveMode);
                console.log(menuDetail);
                console.log(searchDto);
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
                console.log("----- reset -----")
                console.log(saveMode);
                console.log(menuDetail);
                console.log(searchDto);
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
                            <BtTable
                                striped bordered hover size="sm"
                            >
                                <thead>
                                    <tr>
                                        <th>일련번호</th>
                                        <th>권한그룹명</th>
                                    </tr>
                                </thead>
                            </BtTable>
                            <div className="board_bot">
                                {/* <!-- Paging --> */}
                                <EgovPaging
                                    /*pagination={paginationInfo}
                                    moveToPage={(passedPage) => {
                                        retrieveList({
                                            ...searchCondition,
                                            pageIndex: passedPage,
                                            searchCnd: cndRef.current.value,
                                            searchWrd: wrdRef.current.value,
                                        });
                                    }}*/
                                />
                                {/* <!--/ Paging --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerMenuAuthority;
