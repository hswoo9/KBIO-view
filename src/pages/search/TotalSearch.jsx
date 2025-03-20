import React, {useCallback, useEffect, useRef, useState} from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import AOS from "aos";
import moment from "moment/moment.js";
import * as EgovNet from "@/api/egovFetch";

const TotalSearch = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const kwdRef = useRef();


    const [searchCondition, setSearchCondition] = useState(
        location.state?.searchCondition || {
            pageIndex: 1,
            pageUnit : 10,
            searchType: "",
            searchVal: location.state?.searchText || "",
            searchStartDt: location.state?.searchText ? moment(new Date()).subtract(3, "months").format("YYYY-MM-DD") + "T00:00:00" : moment(new Date()).format("YYYY-MM-DD") + "T00:00:00",
            searchEndDt: moment(new Date()).format("YYYY-MM-DD") + "T00:00:00",
        }
    );

    const pageUnitAddEvent = () => {
        const addPageUnit = searchCondition.pageUnit + 10;
        getSearchDataList({
            ...searchCondition,
            pageUnit : addPageUnit
        })
    }

    const startDtRef = useRef(null);
    const endDtRef = useRef(null);
    const [selectedStartDate, setSelectedStartDate] = useState(moment(searchCondition.searchStartDt).format("YYYY년 MM월 DD일"));
    useEffect(() => {
    }, [selectedStartDate]);
    const [selectedEndDate, setSelectedEndDate] = useState(moment(searchCondition.searchEndDt).format("YYYY년 MM월 DD일"));
    useEffect(() => {
    }, [selectedEndDate]);
    const handleOpenStartDatePicker = () => {
        if (startDtRef.current) {
            startDtRef.current.showPicker();
        }
    };

    const handleOpenEndDatePicker = () => {
        if (endDtRef.current) {
            endDtRef.current.showPicker();
        }
    };

    useEffect(() => {
    }, [searchCondition.searchStartDt]);
    useEffect(() => {
    }, [searchCondition.searchEndDt]);

    useEffect(() => {
        if(searchCondition.nowSearch){
            getSearchDataList(searchCondition);
        }
    }, [searchCondition.nowSearch]);

    const handleStartDtChange = (e) => {
        const selectedDate = moment(e.target.value);
        const formattedDate = selectedDate.format("YYYY년 MM월 DD일");

        setSearchCondition(prev => {
            const prevEndDt = moment(prev.searchEndDt);
            const newEndDt = selectedDate.isAfter(prevEndDt)
                ? selectedDate.format("YYYY-MM-DD") + "T00:00:00"
                : prev.searchEndDt;

            return {
                ...prev,
                searchStartDt: selectedDate.format("YYYY-MM-DD") + "T00:00:00",
                searchEndDt: newEndDt
            };
        });

        setSelectedStartDate(formattedDate);
        if (selectedDate.isAfter(moment(searchCondition.searchEndDt))) {
            setSelectedEndDate(formattedDate);
        }
    }

    const handleEndDtChange = (e) => {
        const selectedDate = moment(e.target.value);
        const formattedDate = selectedDate.format("YYYY년 MM월 DD일");

        setSearchCondition(prev => {
            const prevStartDt = moment(prev.searchStartDt);
            const newStartDt = selectedDate.isBefore(prevStartDt)
                ? selectedDate.format("YYYY-MM-DD") + "T00:00:00"
                : prev.searchStartDt;

            return {
                ...prev,
                searchStartDt: newStartDt,
                searchEndDt: selectedDate.format("YYYY-MM-DD") + "T00:00:00"
            };
        });

        setSelectedEndDate(formattedDate);
        if (selectedDate.isBefore(moment(searchCondition.searchStartDt))) {
            setSelectedStartDate(formattedDate);
        }
    }

    const [paginationInfo, setPaginationInfo] = useState({});
    useEffect(() => {
    }, [paginationInfo]);

    const [searchDataList, setSearchDataList] = useState([]);
    const [suggestionKeyWord, setSuggestionKeyWord] = useState([]);

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

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getSearchDataList(searchCondition);
        }
    };

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
                    if(resp.result.returnSrchKywd != null){
                        let kywdList = [];
                        resp.result.returnSrchKywd.forEach(function(item, index){
                            kywdList.push(
                                <li key={item.srchKywdSn}>
                                    <a
                                        onClick={() => {
                                            setSearchCondition({
                                                ...searchCondition,
                                                searchVal: item.kywd,
                                                nowSearch: true
                                            });
                                        }}
                                        style={{cursor: "pointer"}}
                                    >
                                        <span>#{item.kywd}</span>
                                    </a>
                                </li>
                            )
                        });
                        setSuggestionKeyWord(kywdList);
                    }
                    let dataList = [];
                    dataList.push(
                        <tr key="no_data">
                            <td className="cate"></td>
                            <td className="title">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.searchList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화
                        if(item.knd == "pst"){
                            dataList.push(
                                <tr key={item.intgSrchSn}
                                    onClick={() => {
                                        navigate({ pathname : URL.COMMON_PST_NORMAL_DETAIL },
                                            {
                                                state: {
                                                    pstSn: item.pstSn,
                                                    menuSn: item.upperMenuSn,
                                                    thisMenuSn: item.menuSn,
                                                    menuNmPath: item.menuNmPath
                                                },
                                                mode : CODE.MODE_READ
                                            }
                                        );
                                    }}
                                >
                                    <td className="cate th1">
                                        <p>{item.menuNmPath}</p>
                                    </td>
                                    <td className="title">
                                        <div className="text">
                                            <p>{item.ttl}</p>
                                        </div>
                                        <div className="bot">
                                            <p className="date">{moment(item.frstCrtDt).format('YYYY-MM-DD')}</p>
                                            <p className="name">{item.kornFlnm}</p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }else{
                            dataList.push(
                                <tr key={item.intgSrchSn}
                                    onClick={() => {
                                        navigate({ pathname : URL.COMMON_PST_NORMAL_DETAIL },
                                            {
                                                state: {
                                                    pstSn: item.pstSn,
                                                    menuSn: item.upperMenuSn,
                                                    thisMenuSn: item.menuSn,
                                                    menuNmPath: item.menuNmPath
                                                },
                                                mode : CODE.MODE_READ
                                            }
                                        );
                                    }}
                                >
                                    <td className="cate th1">
                                        <p>{item.menuNmPath}</p>
                                    </td>
                                    <td className="title">
                                        <div className="text">
                                            <p>{item.atchFileNm}</p>
                                            <i className="file"></i>
                                        </div>
                                        <div className="bot">
                                            <p className="date">{moment(item.frstCrtDt).format('YYYY-MM-DD')}</p>
                                            <p className="name">{item.kornFlnm}</p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }

                    });
                    setSearchCondition({
                        ...searchCondition,
                        nowSearch: false
                    })
                    setSearchDataList(dataList);
                },
                function (resp) {

                }
            )
        },
        [searchDataList, searchCondition]
    );

    useEffect(() => {
        getSearchDataList(searchCondition);
        AOS.init();
    }, []);

    return (
        /*<div className="container search">
            <div className="inner">
                <div className="inner2">
                    <div className="searchFormWrap type2" data-aos="fade-up" data-aos-duration="1500">
                        <form>
                            <div className="searchBox">
                                <div className="itemBox type2">
                                    <select
                                        className="selectGroup customUserSelect"
                                        value={searchCondition.searchType || ""}
                                        onChange={(e) =>
                                            setSearchCondition({...searchCondition, searchType: e.target.value})
                                        }
                                    >
                                        <option value="">전체</option>
                                        <option value="1">제목</option>
                                        <option value="2">내용</option>
                                        <option value="3">첨부파일</option>
                                    </select>
                                </div>
                                <div className="inputBox type1 date">
                                    <label className="input">
                                        <input
                                            type="text"
                                            id="data_write1"
                                            name="data_write1"
                                            className="datepicker"
                                            readOnly
                                            onClick={handleOpenStartDatePicker}
                                            value={selectedStartDate || ""}
                                        />
                                    </label>
                                    <input type="date"
                                           className="noneTag"
                                           id="startDt"
                                           ref={startDtRef}
                                           value={moment(searchCondition.searchStartDt).format('YYYY-MM-DD')}
                                           onChange={handleStartDtChange}
                                    />
                                    <button type="button" className="calenBtn" onClick={handleOpenStartDatePicker}>
                                        <div className="icon"></div>
                                    </button>
                                </div>
                                <div className="inputBox type1 date">
                                    <label className="input">
                                        <input
                                            type="text"
                                            id="data_write2"
                                            name="data_write2"
                                            className="datepicker"
                                            readOnly
                                            onClick={handleOpenEndDatePicker}
                                            value={selectedEndDate || ""}
                                        />
                                    </label>
                                    <input type="date"
                                           className="noneTag"
                                           id="endDt"
                                           ref={endDtRef}
                                           value={moment(searchCondition.searchEndDt).format('YYYY-MM-DD')}
                                           onChange={handleEndDtChange}
                                    />
                                    <button type="button" className="calenBtn" onClick={handleOpenEndDatePicker}>
                                        <div className="icon"></div>
                                    </button>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input">
                                        <input
                                            type="text"
                                            id="board_search"
                                            name="board_search"
                                            placeholder="검색어를 입력해주세요."
                                            value={searchCondition.searchVal || ""}
                                            ref={kwdRef}
                                            onChange={(e) => {
                                                kwdRef.current.value = e.target.value;
                                                setSearchCondition({
                                                    ...searchCondition,
                                                    searchVal: e.target.value
                                                })
                                            }}
                                            onKeyDown={activeEnter}
                                        />
                                    </label>
                                </div>
                                <button type="button" className="searchBtn"
                                        onClick={() => getSearchDataList(searchCondition)}
                                >
                                    <div className="icon"></div>
                                </button>
                            </div>
                            <div className="keywrodBox">
                                <strong className="title">추천키워드</strong>
                                <ul className="list">
                                    {suggestionKeyWord}
                                </ul>
                            </div>
                        </form>
                    </div>
                    <div className="resultBox" data-aos="fade-up" data-aos-duration="1500">
                        <p>
                            {searchCondition.searchVal ? (
                                <>
                                    <strong>“{searchCondition.searchVal}”</strong> 에 대한 검색결과
                                </>
                            ) : (
                                <>전체 검색결과는</>
                            )}{" "}
                            총 <strong>{paginationInfo.totalRecordCount || 0}건</strong>이 검색되었습니다.
                        </p>
                    </div>
                    <div className="tabBox type1" data-aos="fade-up" data-aos-duration="1500">
                        <div className="bg hover"></div>
                        <ul className="list">
                            <li className="active"><a href="#"><span>전체</span><span
                                className="small">({paginationInfo.totalRecordCount || 0}건)</span></a></li>
                            {/!*<li><a href="#"><span>예약신청</span><span className="small">(16건)</span></a></li>
                            <li><a href="#"><span>컨설팅</span><span className="small">(20건)</span></a></li>*!/}
                            {/!*<li><a href="#"><span>커뮤니티</span><span className="small">({paginationInfo.totalRecordCount || 0}건)</span></a></li>*!/}
                        </ul>
                    </div>
                    <div className="tableCont type1" data-aos="fade-up" data-aos-duration="1500">
                        <table>
                            <caption>통합검색</caption>
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
                    {searchDataList.length > 10 && (
                        <a className="clickBtn black" style={{ cursor: "pointer" }} onClick={pageUnitAddEvent}>
                            <span>더보기</span>
                        </a>
                    )}
                </div>
            </div>
        </div>*/

        <div className="container search">
            <div className="inner">
                <div className="inner2">
                    <div className="searchFormWrap type2" data-aos="fade-up" data-aos-duration="1500">
                        <form>
                            <div className="searchBox">
                                <div className="itemBox type2">
                                    <select
                                        className="selectGroup customUserSelect"
                                        value={searchCondition.searchType || ""}
                                        onChange={(e) =>
                                            setSearchCondition({...searchCondition, searchType: e.target.value})
                                        }
                                    >
                                        <option value="">전체</option>
                                        <option value="1">제목</option>
                                        <option value="2">내용</option>
                                        <option value="3">첨부파일</option>
                                    </select>
                                </div>
                                <div className="inputBox type1 date">
                                    <label className="input">
                                        <input
                                            type="text"
                                            id="data_write1"
                                            name="data_write1"
                                            className="datepicker"
                                            readOnly
                                            onClick={handleOpenStartDatePicker}
                                            value={selectedStartDate || ""}
                                        />
                                    </label>
                                    <input type="date"
                                           className="noneTag"
                                           id="startDt"
                                           ref={startDtRef}
                                           value={moment(searchCondition.searchStartDt).format('YYYY-MM-DD')}
                                           onChange={handleStartDtChange}
                                    />
                                    <button type="button" className="calenBtn" onClick={handleOpenStartDatePicker}>
                                        <div className="icon"></div>
                                    </button>
                                </div>
                                <div className="inputBox type1 date">
                                    <label className="input">
                                        <input
                                            type="text"
                                            id="data_write2"
                                            name="data_write2"
                                            className="datepicker"
                                            readOnly
                                            onClick={handleOpenEndDatePicker}
                                            value={selectedEndDate || ""}
                                        />
                                    </label>
                                    <input type="date"
                                           className="noneTag"
                                           id="endDt"
                                           ref={endDtRef}
                                           value={moment(searchCondition.searchEndDt).format('YYYY-MM-DD')}
                                           onChange={handleEndDtChange}
                                    />
                                    <button type="button" className="calenBtn" onClick={handleOpenEndDatePicker}>
                                        <div className="icon"></div>
                                    </button>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input">
                                        <input
                                            type="text"
                                            id="board_search"
                                            name="board_search"
                                            placeholder="검색어를 입력해주세요."
                                            value={searchCondition.searchVal || ""}
                                            ref={kwdRef}
                                            onChange={(e) => {
                                                kwdRef.current.value = e.target.value;
                                                setSearchCondition({
                                                    ...searchCondition,
                                                    searchVal: e.target.value
                                                })
                                            }}
                                            onKeyDown={activeEnter}
                                        />
                                    </label>
                                </div>
                                <button type="button" className="searchBtn"
                                        onClick={() => getSearchDataList(searchCondition)}
                                >
                                    <div className="icon"></div>
                                </button>
                            </div>
                            <div className="keywrodBox">
                                <strong className="title">추천키워드</strong>
                                <ul className="list">
                                    {suggestionKeyWord}
                                </ul>
                            </div>
                        </form>
                    </div>

                    <div className="resultWrap" style={{ display: "flex", gap: "16px" }}>
                        {/* 레프트 박스 (검색 필터) */}
                        <div
                            className="filterBox"
                            style={{
                                flex: 1,
                                padding: "16px",
                                backgroundColor: "#f4f4f4",
                                borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <h3 style={{marginBottom: "12px", fontSize: "18px"}}>검색 필터</h3>
                            <label className="checkBox type1" style={{marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px"}}>
                                {/*<div style={{
                                    width: "16px",
                                    height: "16px",
                                    border: "1px solid #ccc",
                                    backgroundColor: "#fff",
                                    marginRight: "4px"
                                }}></div>*/}
                                <input type="checkbox"
                                />
                                공지사항
                            </label>
                            <label className="checkBox type1" style={{marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px"}}>
                                <input type="checkbox"

                                />
                                보도자료
                            </label>
                            <label className="checkBox type1" style={{marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px"}}>
                                <input type="checkbox"
                                />
                                Q&A
                            </label>
                            <label className="checkBox type1" style={{marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px"}}>
                                <input type="checkbox"
                                />FAQ
                            </label>
                            <label className="checkBox type1" style={{marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px"}}>
                                <input type="checkbox"
                                /> 자료실
                            </label>
                            <label className="checkBox type1" style={{marginBottom: "30px", display: "flex", alignItems: "center", gap: "8px"}}>
                                <input type="checkbox"
                                /> 연구자료실
                            </label>

                            <hr style={{border: "1px solid #ddd", margin: "16px 0"}}/>

                            <h3 style={{marginBottom: "12px", fontSize: "18px"}}>검색 기간</h3>
                            <div style={{marginBottom: "12px", display: "flex", gap: "8px"}}>
                                <button style={{
                                    padding: "6px 12px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    backgroundColor: "#f4f4f4",
                                    cursor: "pointer"
                                }}>1개월
                                </button>
                                <button style={{
                                    padding: "6px 12px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    backgroundColor: "#f4f4f4",
                                    cursor: "pointer"
                                }}>3개월
                                </button>
                                <button style={{
                                    padding: "6px 12px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    backgroundColor: "#f4f4f4",
                                    cursor: "pointer"
                                }}>6개월
                                </button>
                            </div>

                            <div style={{marginBottom: "30px", display: "flex", gap: "8px"}}>
                                <input type="date" style={{
                                    padding: "6px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px"
                                }}/>
                                <input type="date" style={{
                                    padding: "6px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px"
                                }}/>
                            </div>

                            <hr style={{border: "1px solid #ddd", margin: "16px 0"}}/>

                            <h3 style={{marginBottom: "12px", fontSize: "18px"}}>자료 유형</h3>
                            <label className="checkBox type1" style={{marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px"}}>
                                <input type="checkbox"
                                />
                                PDF(3)
                            </label>
                            <label className="checkBox type1" style={{marginBottom: "30px", display: "flex", alignItems: "center", gap: "8px"}}>
                                <input type="checkbox"
                                />
                                HWP(1)
                            </label>
                        </div>

                        {/* 검색 결과 박스 */}
                        <div className="resultBox" data-aos="fade-up" data-aos-duration="1500" style={{flex: 3}}>
                            <p style={{fontSize: "20px", marginBottom: "20px"}}>
                                <span style={{color: "#04359b"}}>"#생명#생물학#생명과학"</span>으로도 검색해보세요.
                            </p>
                            <p>
                                {searchCondition.searchVal ? (
                                    <>
                                        <strong>“{searchCondition.searchVal}”</strong> 에 대한 검색결과
                                    </>
                                ) : (
                                    <>전체 검색결과는</>
                                )}{" "}
                                총 <strong>{paginationInfo.totalRecordCount || 0}건</strong>이 검색되었습니다.
                            </p>
                            <p style={{ fontSize: "18px" }}>
                                <span style={{ color: "#04359b" }}>"#생명#생물학#생명과학"</span>에 대한 검색결과 총 <span style={{ color: "red" }}>1</span>건이 추가 검색되었습니다.
                            </p>


                            {/* 탭 박스 */}
                            <div className="tabBox type1" data-aos="fade-up" data-aos-duration="1500">
                                <div className="bg hover"></div>
                                <ul className="list" style={{display: "flex", gap: "8px", padding: "4px 0"}}>
                                    <li className="active" style={{flex: "none", fontSize: "14px", padding: "4px 8px"}}>
                                        <a href="#" style={{textDecoration: "none"}}>
                                            <span>전체</span>
                                            <span className="small" style={{marginLeft: "4px", fontSize: "12px"}}>
                                                ({paginationInfo.totalRecordCount || 0}건)
                                                </span>
                                        </a>
                                    </li>
                                    <li style={{flex: "none", fontSize: "14px", padding: "4px 8px"}}>
                                        <a href="#" style={{textDecoration: "none"}}>
                                            <span>공지사항</span>
                                            <span className="small"
                                                  style={{
                                                      marginLeft: "4px",
                                                      fontSize: "12px"
                                                  }}>({paginationInfo.totalRecordCount || 0}건)</span>
                                        </a>
                                    </li>
                                    <li style={{flex: "none", fontSize: "14px", padding: "4px 8px"}}>
                                        <a href="#" style={{textDecoration: "none"}}>
                                            <span>보도자료</span>
                                            <span className="small"
                                                  style={{
                                                      marginLeft: "4px",
                                                      fontSize: "12px"
                                                  }}>(0건)</span>
                                        </a>
                                    </li>
                                    <li style={{flex: "none", fontSize: "14px", padding: "4px 8px"}}>
                                        <a href="#" style={{textDecoration: "none"}}>
                                            <span>Q&A</span>
                                            <span className="small" style={{marginLeft: "4px", fontSize: "12px"}}>
                                            (0건)
                                            </span>
                                        </a>
                                    </li>
                                    <li style={{flex: "none", fontSize: "14px", padding: "4px 8px"}}>
                                        <a href="#" style={{textDecoration: "none"}}>
                                            <span>FAQ</span>
                                            <span className="small" style={{marginLeft: "4px", fontSize: "12px"}}>
                                            (0건)
                                            </span>
                                        </a>
                                    </li>
                                    <li style={{flex: "none", fontSize: "14px", padding: "4px 8px"}}>
                                        <a href="#" style={{textDecoration: "none"}}>
                                            <span>자료실</span>
                                            <span className="small" style={{marginLeft: "4px", fontSize: "12px"}}>
                                            (0건)
                                            </span>
                                        </a>
                                    </li>
                                    <li style={{flex: "none", fontSize: "14px", padding: "4px 8px"}}>
                                        <a href="#" style={{textDecoration: "none"}}>
                                            <span>연구자료실</span>
                                            <span className="small" style={{marginLeft: "4px", fontSize: "12px"}}>
                                            (0건)
                                            </span>
                                        </a>
                                    </li>
                                    {/* 추가 탭 필요 시 주석 해제 */}
                                    {/* <li><a href="#"><span>예약신청</span><span className="small">(16건)</span></a></li>
                                    <li><a href="#"><span>컨설팅</span><span className="small">(20건)</span></a></li>
                                    <li><a href="#"><span>커뮤니티</span><span className="small">({paginationInfo.totalRecordCount || 0}건)</span></a></li> */}
                                </ul>
                            </div>

                            {/* 테이블 컨테이너 */}
                            <div className="tableCont type1" data-aos="fade-up" data-aos-duration="1500">
                                <table>
                                    <caption>통합검색</caption>
                                    <thead>
                                    <tr>
                                        <th>제목</th>
                                        <th>내용</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {searchDataList}
                                    </tbody>
                                </table>
                            </div>

                            {/* 더보기 버튼 */}
                            {searchDataList.length > 10 && (
                                <a className="clickBtn black" style={{cursor: "pointer"}} onClick={pageUnitAddEvent}>
                                    <span>더보기</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalSearch;
