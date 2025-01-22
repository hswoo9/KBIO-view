import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

function ManagerCodeGroup(props) {
    const location = useLocation();
    console.log(location);
    const sessionUser = getSessionItem("loginUser");
    const [searchCondition, setSearchCondition] = useState(
        location.state?.searchCondition || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
            bnrPopupKnd: "bnr"
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({});

    const cndRef = useRef();
    const wrdRef = useRef();

    const [bnrPopupList, setBnrPopupList] = useState([]);

    const [saveEvent, setSaveEvent] = useState({});
    useEffect(() => {
        if(saveEvent.save){
            if(saveEvent.mode == "delete"){
                delBnrPopupData(saveEvent);
            }
        }
    }, [saveEvent]);

    const delBtnEvent = (bnrPopupSn) => {
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
                    bnrPopupSn: bnrPopupSn
                });
            } else {
                //취소
            }
        });
        console.log(comCdSn);
    }

    const delBnrPopupData = useCallback(
        (saveEvent) => {
            const menuListURL = "/bannerPopupApi/setBnrPopupDel";
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
                        getBnrPopupList(searchCondition);
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

    const getBnrPopupList = useCallback(
        (searchCondition) => {
            const menuListURL = "/bannerPopupApi/getBnrPopupListOnPage.do";
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
                    bnrPopupList.push(
                        <tr>
                            <td colSpan="6" key="noData">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.bannerPopupList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.bnrPopupSn}>
                                <td onClick={(e) => {
                                    e.stopPropagation()
                                }}>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td>{item.bnrPopupKnd}</td>
                                <td>{item.bnrPopupTtl}</td>
                                <td>{item.bnrPopupFrm}</td>
                                <td>{item.useYn === "Y" ? "출력" : "출력안함"}</td>
                                <td>
                                    <Link
                                        to={{pathname: URL.MANAGER_BANNER_MODIFY}}
                                        state={{
                                            bnrPopupSn: item.bnrPopupSn
                                        }}
                                        key={item.bnrPopupSn}
                                    >
                                        <button type="button">
                                            수정
                                        </button>
                                    </Link>
                                </td>
                                <td>
                                    <button type="button"
                                      onClick={() => {
                                          delBtnEvent(item.bnrPopupSn);
                                      }}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        );
                    });
                    setBnrPopupList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [bnrPopupList, searchCondition]
    );

    useEffect(() => {
        getBnrPopupList(searchCondition);
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>배너관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                        <li className="inputBox type1">
                                <p className="title">상태</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="Y">출력</option>
                                        <option value="N">출력안함</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="">전체</option>
                                        <option value="cdGroup">제목</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input"><input type="text" id="search" name="search"
                                                                placeholder="검색어를 입력해주세요"/></label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray">
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point">
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="contBox board type1 customContBox">
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>코드목록</caption>
                            <colgroup>
                                <col width="50px"/>
                                <col width="150px"/>
                                <col/>
                                <col width="150px"/>
                                <col width="100px"/>
                                <col width="100px"/>
                                <col width="100px"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>그룹명</th>
                                <th>배너제목</th>
                                <th>배너형식</th>
                                <th>상태</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bnrPopupList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getBnrPopupList({
                                    ...searchCondition,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                        <NavLink
                            to={{ pathname: URL.MANAGER_BANNER_CREATE }}
                        >
                            <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerCodeGroup;
