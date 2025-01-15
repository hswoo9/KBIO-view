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

function ManagerMenuAuthority(props) {
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
                            <tr key={item.authrtGroupSn}>
                                <td>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerMenuAuthority;
