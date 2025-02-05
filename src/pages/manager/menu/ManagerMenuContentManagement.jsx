import React, {useState, useEffect, useCallback, useRef} from "react";
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";

import CheckboxTree from 'react-checkbox-tree';
import '@/css/ReactCheckBoxTree.css';
import Swal from 'sweetalert2';

import { getSessionItem } from "@/utils/storage";
import ReactQuill from "react-quill-new";
import CommonEditor from "@/components/CommonEditor";

function Index(props) {
    const sessionUser = getSessionItem("loginUser");
    const [contsCn, setContsCn] = useState("");
    const [expandedArr, setExpandedArr] = useState([]);
    const [expanded, setExpanded] = useState(['Documents']);
    const [menuList, setMenuList] = useState([]);
    const [menuContent, setMenuContent] = useState({});
    const [selMenuName, setSelMenuName] = useState("");
    const [searchDto, setSearchDto] = useState({});

    const onExpand = (value) => {setExpanded(value);};
    const allOpenEvent = () => {
        setExpanded(expandedArr);
    }
    const allCloseEvent = () => {
        setExpanded(['Documents']);
    }
    const menuOnClick = (e) => {
        setSearchDto({menuSn : e.value});
        setMenuContent({menuSn: e.value});
    };

    const handleChange = (value) => {
        setContsCn(value);
    };

    const setMenuContentDel = (contsSn) => {
        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({contsSn : contsSn}),
                };

                EgovNet.requestFetch("/menuApi/setMenuContentDel", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("삭제되었습니다.");
                        setSelMenuName("")
                        setMenuContent({});
                        setSearchDto({});
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });

            } else {

            }
        });
    }

    const saveMenuContent = () => {
        if (!menuContent.menuSn) {
            Swal.fire("메뉴를 선택해주세요.");
            return;
        }

        if (!contsCn) {
            Swal.fire("내용을 입력해주세요.");
            return;
        }

        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                if(menuContent.creatrSn == null){
                    setMenuContent({
                        ...menuContent,
                        creatrSn: sessionUser.userSn,
                    })
                }

                if(menuContent.contsSn != null){
                    setMenuContent({
                        ...menuContent,
                        mdfrSn: sessionUser.userSn,
                    })
                }

                const formData = new FormData();
                for (let key in menuContent) {
                    if(menuContent[key] != null){
                        formData.append(key, menuContent[key]);
                    }
                }

                formData.append("contsCn", contsCn);


                const requestOptions = {
                    method: "POST",
                    body: formData
                };

                EgovNet.requestFetch("/menuApi/setMenuContent", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("등록되었습니다.");
                        getMenu(searchDto);
                    } else {

                    }
                });

            } else {

            }
        });
    }

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
                    setSelMenuName(" - " + resp.result.menu.menuNm)
                    setMenuContent({
                        ...menuContent,
                        ...resp.result.menu.content,
                    });
                    console.log(resp.result.menu.content)
                }
            )
        }
    );

    useEffect(() => {
        if(searchDto.menuSn != null){
            getMenu(searchDto);
        }
    }, [searchDto]);

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
                    setMenuList(resp.result.menus);
                    setExpanded(expandedArr);
                    setExpandedArr(expandedArr);
                }
            )
        }
    );

    useEffect(() => {
        getMenuList(searchDto);
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>메뉴 컨텐츠 관리</p></h2>
                <div className="contBox">
                    <div className="box listBox maxW400">
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
                        <div className="topTitle">컨텐츠정보 {selMenuName}</div>
                        <div>
                            <CommonEditor
                                value={menuContent.contsCn || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="buttonBox">
                            <div className="left">
                                {menuContent.contsSn && (
                                    <button type="button" className="clickBtn red" onClick={() => setMenuContentDel(menuContent.contsSn)}>
                                        <span>삭제</span>
                                    </button>
                                )}
                            </div>

                            <div className="left">
                                <button type="button" className="clickBtn" onClick={saveMenuContent}><span>저장</span>
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
