import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as ComScript from "@/components/CommonScript";
import ManagerLeftNew from "@/components/manager/ManagerLeftHomepage";
import EgovPaging from "@/components/EgovPaging";
import moment from "moment/moment.js";
import Swal from 'sweetalert2';
import { getComCdList, excelExport } from "@/components/CommonComponents";
import { getSessionItem } from "@/utils/storage";

function ManagerOrganizationChartList(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const sessionUser = getSessionItem("loginUser");
    const [searchCondition, setSearchCondition] = useState(
        location.state?.searchCondition || {
            pageIndex: 1,
            searchCnd: "0",
            searchWrd: "",
            searchType: "kornFlnm",
            searchVal: "",
        }
    );
    const [deptList, setDeptList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [orgchtList, setOrgchtList] = useState([]);
    const cndRef = useRef();
    const wrdRef = useRef();

    const searchHandle = () => {
        getOrgchtList(searchCondition);
    }

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getOrgchtList(searchCondition);
        }
    };

    const searchReset = () => {
        setSearchCondition({
            ...searchCondition,
            searchVal : "",
            deptSn : ""
        })
    }

    const dataExcelDownload = useCallback(() => {
        //let excelParams = searchCondition;
        let excelParams = { ...searchCondition };
        excelParams.pageIndex = 1;
        excelParams.pageUnit = paginationInfo?.totalRecordCount || 9999999999

        const requestURL = "/orgchtApi/getOrgchtList.do";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(excelParams)
        };
        EgovNet.requestFetch(
            requestURL,
            requestOptions,
            (resp) => {

                let rowDatas = [];
                if(resp.result.orgchtList != null){
                    resp.result.orgchtList.forEach(function (item, index) {
                        rowDatas.push(
                            {
                                number : resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index,
                                deptNm : item.deptNm,
                                kornFlnm : item.kornFlnm,
                                jbttlNm : item.jbttlNm,
                                telno : ComScript.formatTelNumber(item.telno),
                                email : item.email,
                                frstCrtDt : moment(item.frstCrtDt).format('YYYY-MM-DD'),
                            }
                        )
                    });
                }

                let sheetDatas = [{
                    sheetName : "조직도관리",
                    header : ['번호', '부서', '이름', '직책', '전화번호', '이메일', '등록일'],
                    row : rowDatas
                }];
                excelExport("조직도관리", sheetDatas);
            }
        )
    });

    const getOrgchtList = useCallback(
        (searchCondition) => {
            const requestURL = "/orgchtApi/getOrgchtList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchCondition)
            };
            EgovNet.requestFetch(
                requestURL,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="noData">
                            <td colSpan="6" key="noData">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.orgchtList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.orgchtSn}
                                onClick={() => {
                                    navigate({pathname: URL.MANAGER_HOMEPAGE_ORGANIZATION_CHART_MODIFY}, {state: {orgchtSn: item.orgchtSn}});
                                }}
                                style={{cursor: "pointer"}}
                            >
                                <td>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td>{item.deptNm}</td>
                                <td>{item.kornFlnm}</td>
                                <td>{item.jbttlNm}</td>
                                <td>{ComScript.formatTelNumber(item.telno)}</td>
                                <td>{item.email}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                            </tr>
                        );
                    });
                    setOrgchtList(dataList);
                },
                function (resp) {

                }
            )
        },
        [orgchtList, searchCondition]
    );

    useEffect(() => {
        getComCdList(12).then((data) => {
            if(data != null){
                let dataList = [];
                dataList.push(
                    <option value="" key="nodata">전체</option>
                )
                data.forEach(function(item, index){
                    dataList.push(
                        <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                    )
                });
                setDeptList(dataList);
            }
        });
        
        getOrgchtList(searchCondition);
    }, []);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>조직도관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">부서</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            onChange={(e) =>
                                                setSearchCondition({ ...searchCondition, deptSn: e.target.value })
                                            }
                                            value={searchCondition.deptSn || ""}
                                    >
                                        {deptList}
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <p className="title">이름</p>
                                <label className="input">
                                    <input
                                        type="text"
                                        id="search"
                                        name="search"
                                        placeholder="검색어를 입력해주세요"
                                        value={searchCondition.searchVal || ""}
                                        onChange={ (e) =>
                                            setSearchCondition({
                                                ...searchCondition,
                                                searchVal: e.target.value
                                            })
                                        }
                                        onKeyDown={activeEnter}
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray"
                                onClick={searchReset}
                            >
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point"
                                    onClick={searchHandle}
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">전체 : <span className="red">{paginationInfo.totalRecordCount}</span>건 페이지 : <span
                            className="red">{paginationInfo.currentPageNo}/{paginationInfo.totalPageCount}</span></p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red"
                                onClick={dataExcelDownload}
                            >
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span>
                            </button>
                        </div>
                    </div>
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>조직도목록</caption>
                            <colgroup>
                                <col width="50px"/>
                                <col width="200px"/>
                                <col/>
                                <col width="80px"/>
                                <col/>
                                <col/>
                                <col/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>부서</th>
                                <th>이름</th>
                                <th>직책</th>
                                <th>전화번호</th>
                                <th>이메일</th>
                                <th>등록일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orgchtList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getOrgchtList({
                                    ...searchCondition,
                                    pageIndex: passedPage
                                })
                            }}
                        />
                        <NavLink
                            to={URL.MANAGER_HOMEPAGE_ORGANIZATION_CHART_CREATE}
                        >
                            <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerOrganizationChartList;
