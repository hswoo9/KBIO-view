import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftCode";

import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

function ManagerCodeGroup(props) {
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const [searchCondition, setSearchCondition] = useState(
        location.state?.searchCondition || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({});

    const cndRef = useRef();
    const wrdRef = useRef();

    const [codeGroupList, setCodeGroupList] = useState([]);

    const [saveEvent, setSaveEvent] = useState({});
    useEffect(() => {
        if(saveEvent.save){
            if(saveEvent.mode == "delete"){
                delCdGroupData(saveEvent);
            }
        }
    }, [saveEvent]);

    const delBtnEvent = (cdGroupSn) => {
        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                setSaveEvent({
                    ...saveEvent,
                    save: true,
                    mode: "delete",
                    cdGroupSn: cdGroupSn
                });
            } else {
                //취소
            }
        });
        console.log(cdGroupSn);
    }

    const delCdGroupData = useCallback(
        (cdGroupDetail) => {
            const menuListURL = "/codeApi/setComCdGroupDel";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(saveEvent)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {

                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        getCodeGroupList(searchCondition);
                    } else {
                        navigate(
                            { pathname: URL.ERROR },
                            { state: { msg: resp.resultMessage } }
                        );
                    }

                }
            )
        }
    );

    const getCodeGroupList = useCallback(
        (searchCondition) => {
            const menuListURL = "/codeApi/getComCdGroupListOnPageing.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchCondition)
            };
            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    codeGroupList.push(
                        <tr>
                            <td colSpan="6" key="noData">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    const resultCnt = parseInt(resp.paginationInfo.totalRecordCount);
                    const currentPageNo = resp.paginationInfo.currentPageNo;
                    const pageSize = resp.paginationInfo.pageSize;

                    resp.result.authGroup.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.cdGroupSn}>
                                <td onClick={(e) => {e.stopPropagation()}}>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td>{item.cdGroup}</td>
                                <td>{item.cdGroupNm}</td>
                                <td>{item.rmrkCn}</td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "사용안함"}</td>
                                <td className="btnGroupTd">
                                    <Link
                                          to={{ pathname: URL.MANAGER_CODE }}
                                          state={{
                                              cdGroupSn : item.cdGroupSn
                                          }}
                                          key={item.cdGroupSn}
                                    >
                                        <BTButton variant="secondary" size="sm"

                                        >
                                            코드목록
                                        </BTButton>
                                    </Link>
                                    <Link 
                                        to={{ pathname: URL.MANAGER_CODE_GROUP_MODIFY }}
                                        state={{
                                            cdGroupSn : item.cdGroupSn
                                        }}
                                        key={item.cdGroupSn}
                                    >
                                        <BTButton variant="primary" size="sm"
                                        >
                                            수정
                                        </BTButton>
                                    </Link>
                                    <BTButton variant="danger" size="sm"
                                        onClick={() => {
                                            delBtnEvent(item.cdGroupSn);
                                        }}
                                    >
                                        삭제
                                    </BTButton>
                                </td>
                            </tr>
                        );
                    });
                    setCodeGroupList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [codeGroupList, searchCondition]
    );

    useEffect(() => {
        getCodeGroupList(searchCondition);
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
                        <Link to={URL.MANAGER_CODE_GROUP}>코드관리</Link>
                    </li>
                    <li>코드관리</li>
                </ul>
            </div>
        );
    });


    return (
        <div className="container">
            <div className="c_wrap">
                <Location/>

                <div className="layout">
                    <EgovLeftNav/>
                    <div className="contents BOARD_CREATE_LIST" id="contents">
                        <div className="condition">
                            <ul>
                                <li className="third_1 L">
                                    <span className="lb">검색유형선택</span>
                                    <label className="f_select" htmlFor="searchCnd">
                                        <select
                                            id="searchCnd"
                                            name="searchCnd"
                                            title="검색유형선택"
                                        >
                                            <option value="0">코드그룹명</option>
                                        </select>
                                    </label>
                                </li>
                                <li className="third_2 R">
                                    <span className="lb">검색어</span>
                                    <span className="f_search w_400">
                                    <input
                                        type="text"
                                        name=""
                                        defaultValue={
                                            searchCondition && searchCondition.searchWrd
                                        }
                                        placeholder=""
                                        ref={wrdRef}
                                        onChange={(e) => {
                                            wrdRef.current.value = e.target.value;
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            retrieveList({
                                                ...searchCondition,
                                                pageIndex: 1,
                                                searchCnd: cndRef.current.value,
                                                searchWrd: wrdRef.current.value,
                                            });
                                        }}
                                    >
                                      조회
                                    </button>
                                  </span>
                                </li>
                                <li>
                                    <Link
                                        to={URL.MANAGER_CODE_GROUP_CREATE}
                                        className="btn btn_blue_h46 pd35"
                                    >
                                        등록
                                    </Link>
                                </li>
                            </ul>
                        </div>
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
                                <th>번호</th>
                                <th>코드그룹</th>
                                <th>코드그룹명</th>
                                <th>비고</th>
                                <th>활성여부</th>
                                <th>관리</th>
                            </tr>
                            </thead>
                            <tbody>
                            {codeGroupList}
                            </tbody>
                        </BtTable>
                        <div className="board_bot">
                            <EgovPaging
                                pagination={paginationInfo}
                                moveToPage={(passedPage) => {
                                    getCodeGroupList({
                                        ...searchCondition,
                                        pageIndex: passedPage
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerCodeGroup;
