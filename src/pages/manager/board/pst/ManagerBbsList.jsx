import React, {useState, useEffect, useCallback, useRef} from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";

import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";

import moment from "moment/moment.js";


function ManagerBbs(props) {
    const location = useLocation();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            bbsTypeNm: "",
            searchWrd: "",
            bbsNm : "",
            actvtnYn : "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({});
    const bbsTypeNmRef = useRef();
    const bbsNmRef = useRef();
    const [bbsList, setBbsList] = useState([]);

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getBbsList(searchDto);
        }
    };

    const getBbsList = useCallback(
        (searchDto) => {
            const bbsListURL = "/bbsApi/getBbsList.do";
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
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan="4">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.bbsList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.bbsSn}>
                                <td>
                                    {item.bbsNm}
                                    {/*<Link to={URL.MANAGER_BBS_MODIFY}*/}
                                    {/*      mode={CODE.MODE_MODIFY}*/}
                                    {/*      state={{ bbsSn: item.bbsSn }}*/}
                                    {/*      >*/}
                                    {/*    {item.bbsNm}*/}
                                    {/*</Link>*/}
                                </td>
                                <td>{item.bbsTypeNm == "0" ? "일반" : item.bbsTypeNm == "1" ? "faQ" : "QnA"}</td>
                                <td>{item.actvtnYn === "Y" ? "사용" : "미사용"}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>
                                    <Link to={URL.MANAGER_PST_LIST}
                                        state={{
                                            bbsSn: item.bbsSn,
                                            atchFileYn : item.atchFileYn
                                        }}
                                    >
                                        <button>게시글 관리</button>
                                    </Link>
                                </td>
                            </tr>
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
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>게시글관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">게시판유형</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="bbsTypeNm"
                                            name="bbsTypeNm"
                                            title="게시판유형선택"
                                            ref={bbsTypeNmRef}
                                            onChange={(e) => {
                                                getBbsList({
                                                    ...searchDto,
                                                    pageIndex: 1,
                                                    bbsTypeNm: bbsTypeNmRef.current.value,
                                                    bbsNm: bbsNmRef.current.value,
                                                });
                                            }}
                                    >
                                        <option value="">선택</option>
                                        <option value="0">일반</option>
                                        <option value="1">FAQ</option>
                                        <option value="2">QNA</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input type="text"
                                           name=""
                                           value={
                                               searchDto && searchDto.bbsNm
                                           }
                                           placeholder=""
                                           ref={bbsNmRef}
                                           onChange={(e) => {
                                               setSearchDto({ ...searchDto, bbsNm: e.target.value })
                                           }}
                                           onKeyDown={activeEnter}
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray">
                                <div className="icon"></div>
                            </button>
                            <button type="button"
                                    className="searchBtn btn btn1 point"
                                    onClick={() => {
                                        getBbsList({
                                            ...searchDto,
                                            pageIndex: 1,
                                            bbsTypeNm: bbsTypeNmRef.current.value,
                                            bbsNm: bbsNmRef.current.value,
                                        });
                                    }}
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>게시글목록</caption>
                            <colgroup>
                                <col/>
                                <col width="100"/>
                                <col width="100"/>
                                <col width="150"/>
                                <col width="100"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>게시판명</th>
                                <th>게시판유형</th>
                                <th>사용여부</th>
                                <th>생성일</th>
                                <th>관리</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bbsList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getBbsList({
                                    ...searchDto,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerBbs;
