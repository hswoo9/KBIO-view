import React, {useCallback, useEffect, useRef, useState} from "react";
import { useNavigate, NavLink } from "react-router-dom";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import moment from "moment/moment.js";
import * as EgovNet from "@/api/egovFetch";
import EgovPaging from "@/components/EgovPaging";
const TotalSearch = () => {
    const navigate = useNavigate();
    const kwdRef = useRef();
    const [searchCondition, setSearchCondition] = useState(
        location.state?.searchCondition || {
            pageIndex: 1,
            searchType: "",
            searchVal : "",
            searchStartDt : "",
            searchEndDt : "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({});
    useEffect(() => {
        console.log(paginationInfo);
    }, [paginationInfo]);

    const [searchDataList, setSearchDataList] = useState([]);

    const [menuIndex, setMenuIndex] = useState({ menu : 0});
    const tabMenuList = {
        0: 0,
        1: 1,
        2: 2,
    };

    const changeMenu = (menuIndex) => {
        setMenuIndex({
            menu: menuIndex
        });
    }

    const getSearchDataList = useCallback(
        (searchCondition) => {
            const requestURL = "/searchApi/getSearchDataListPage.do";
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
                        <tr key="no_data">
                            <td>
                                검색된 결과가 없습니다.
                            </td>
                        </tr>
                    );

                    resp.result.searchList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화
                        if(item.knd == "pst"){
                            dataList.push(
                                <tr key={item.intgSrchSn}>
                                    <td style={{textAlign: "left", paddingLeft: "15px"}}>
                                        <NavLink to={URL.COMMON_PST_NORMAL_DETAIL}
                                                 mode={CODE.MODE_READ}
                                                 state={{pstSn: item.pstSn}}
                                        >
                                            <p>{item.menuNmPath}</p>
                                            <p>{item.ttl}</p>
                                        </NavLink>
                                    </td>
                                    <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                </tr>
                            );
                        }else{
                            dataList.push(
                                <tr key={item.intgSrchSn}>
                                    <td style={{textAlign: "left", paddingLeft: "15px"}}>
                                        <NavLink to={URL.COMMON_PST_NORMAL_DETAIL}
                                                 mode={CODE.MODE_READ}
                                                 state={{pstSn: item.pstSn}}
                                        >
                                            <p>{item.menuNmPath}</p>
                                            <p>{item.atchFileNm}</p>
                                        </NavLink>
                                    </td>
                                    <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                </tr>
                            );
                        }

                    });
                    setSearchDataList(dataList);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [searchDataList, searchCondition]
    );

    useEffect(() => {
        getSearchDataList(searchCondition);
    }, []);

    return (
        <div className="container">
            <div className="inner">
                <div className="infoWrap customInnerDiv">
                    <ul className="inputWrap customUl">
                        <li className="inputBox type1 width1">
                            <p className="title">검색영역</p>
                            <ul className="checkWrap customCheckWrap">
                                <li className="checkBox">
                                    <label>
                                        <input
                                            type="radio"
                                            name="searchType"
                                            checked={searchCondition.searchType == "" ? true : false}
                                            value=""
                                            onChange={(e) =>
                                                setSearchCondition({...searchCondition, searchType: e.target.value})
                                            }
                                        />
                                        <small>전체</small>
                                    </label>
                                </li>
                                <li className="checkBox">
                                    <label>
                                        <input
                                            type="radio"
                                            name="searchType"
                                            value="1"
                                            checked={searchCondition.searchType == "1" ? true : false}
                                            onChange={(e) =>
                                                setSearchCondition({...searchCondition, searchType: e.target.value})
                                            }
                                        />
                                        <small>제목</small>
                                    </label>
                                </li>
                                <li className="checkBox">
                                    <label>
                                        <input
                                            type="radio"
                                            name="searchType"
                                            value="2"
                                            checked={searchCondition.searchType == "2" ? true : false}
                                            onChange={(e) =>
                                                setSearchCondition({...searchCondition, searchType: e.target.value})
                                            }
                                        />
                                        <small>내용</small>
                                    </label>
                                </li>
                                <li className="checkBox">
                                    <label>
                                        <input
                                            type="radio"
                                            name="searchType"
                                            value="3"
                                            checked={searchCondition.searchType == "3" ? true : false}
                                            onChange={(e) =>
                                                setSearchCondition({...searchCondition, searchType: e.target.value})
                                            }
                                        />
                                        <small>첨부파일</small>
                                    </label>
                                </li>
                            </ul>
                        </li>
                        <li className="inputBox type1 width2">
                            <p className="title">시작일</p>
                            <div className="input">
                                <input type="date"
                                       value={moment(searchCondition.searchStartDt).format('YYYY-MM-DD')}
                                       onChange={(e) => {
                                           setSearchCondition({
                                               ...searchCondition,
                                               searchStartDt: e.target.value + "T00:00:00"
                                           });
                                       }}
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width2">
                            <p className="title">종료일</p>
                            <div className="input">
                                <input type="date"
                                       value={moment(searchCondition.searchEndDt).format('YYYY-MM-DD')}
                                       onChange={(e) => {
                                           setSearchCondition({
                                               ...searchCondition,
                                               searchEndDt: e.target.value + "T00:00:00"
                                           });
                                       }}
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <p className="title">키워드</p>
                            <div className="input">
                                <input type="text"
                                       ref={kwdRef}
                                       onChange={(e) => {
                                           kwdRef.current.value = e.target.value;
                                           setSearchCondition({
                                               ...searchCondition,
                                               searchVal: e.target.value
                                           })
                                       }}
                                />
                            </div>
                            <span className="blueText">#의료 #바이오 #약품</span>
                        </li>
                    </ul>
                    <div className="buttonBox">
                        <button type="button" className="clickBtn point" onClick={() => getSearchDataList(searchCondition)} ><span>검색</span></button>
                    </div>
                    <div className="topBox">
                        <p className="resultText">
                            {searchCondition.searchVal || ""}에 대한 검색결과 총
                            <span className="red">{paginationInfo.totalRecordCount || 0}</span>
                            건이 검색되었습니다.
                        </p>
                        <div className="rightBox">

                        </div>
                    </div>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <ul className="tabs">
                            <li className={`${menuIndex.menu === 0 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(0)}>전체
                            </li>{/*
                            <li className={`${menuIndex.menu === 1 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(1)}>예약신청
                            </li>
                            <li className={`${menuIndex.menu === 2 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(2)}>컨설팅
                            </li>
                            <li className={`${menuIndex.menu === 3 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(3)}>커뮤니티
                            </li>*/}
                        </ul>
                    </div>
                    <div>
                    </div>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>검색목록</caption>
                            <colgroup>
                            </colgroup>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {searchDataList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getSearchDataList({
                                    ...searchCondition,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalSearch;
