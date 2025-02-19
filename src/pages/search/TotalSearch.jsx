import React, {useCallback, useEffect, useRef, useState} from "react";
import { useNavigate, NavLink } from "react-router-dom";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import AOS from "aos";
import moment from "moment/moment.js";
import * as EgovNet from "@/api/egovFetch";

const TotalSearch = () => {
    const navigate = useNavigate();
    const kwdRef = useRef();
    const [searchCondition, setSearchCondition] = useState(
        location.state?.searchCondition || {
            pageIndex: 1,
            pageUnit : 10,
            searchType: "",
            searchVal : "",
            searchStartDt : moment(new Date()).format("YYYY-MM-DD") + "T00:00:00",
            searchEndDt : moment(new Date()).format("YYYY-MM-DD") + "T00:00:00",
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
    const [selectedEndDate, setSelectedEndDate] = useState(moment(searchCondition.searchEndDt).format("YYYY년 MM월 DD일"));

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

    const handleStartDtChange = (e) => {
        const formattedDate = moment(e.target.value).format("YYYY년 MM월 DD일");
        setSelectedStartDate(formattedDate);
        setSearchCondition({
            ...searchCondition,
            searchStartDt: moment(e.target.value).format("YYYY-MM-DD") + "T00:00:00"
        });
    }

    const handleEndDtChange = (e) => {
        const formattedDate = moment(e.target.value).format("YYYY년 MM월 DD일");
        setSelectedEndDate(formattedDate);
        setSearchCondition({
            ...searchCondition,
            searchEndDt: moment(e.target.value).format("YYYY-MM-DD") + "T00:00:00"
        });
    }

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
                                    <td className="cate">
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
                                    <td className="cate">
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
        AOS.init();
    }, []);

    return (
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
                                            ref={kwdRef}
                                            onChange={(e) => {
                                                kwdRef.current.value = e.target.value;
                                                setSearchCondition({
                                                    ...searchCondition,
                                                    searchVal: e.target.value
                                                })
                                            }}
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
                                    <li><a href="#"><span>#의료</span></a></li>
                                    <li><a href="#"><span>#바이오</span></a></li>
                                    <li><a href="#"><span>#약품</span></a></li>
                                </ul>
                            </div>
                        </form>
                    </div>
                    <div className="resultBox" data-aos="fade-up" data-aos-duration="1500">
                        <p>
                            <strong>“{searchCondition.searchVal || ""}”</strong> 에 대한 검색결과
                            총 <strong>{paginationInfo.totalRecordCount || 0}건</strong>이 검색되었습니다.
                        </p>
                    </div>
                    <div className="tabBox type1" data-aos="fade-up" data-aos-duration="1500">
                        <div className="bg hover"></div>
                        <ul className="list">
                            <li className="active"><a href="#"><span>전체</span><span
                                className="small">({paginationInfo.totalRecordCount || 0}건)</span></a></li>
                            {/*<li><a href="#"><span>예약신청</span><span className="small">(16건)</span></a></li>
                            <li><a href="#"><span>컨설팅</span><span className="small">(20건)</span></a></li>*/}
                            <li><a href="#"><span>커뮤니티</span><span className="small">({paginationInfo.totalRecordCount || 0}건)</span></a></li>
                        </ul>
                    </div>
                    <div className="tableCont type1" data-aos="fade-up" data-aos-duration="1500">
                        <table>
                            <caption>통합검색</caption>
                            <colgroup>
                                <col className="th1"/>
                                <col className="th2"/>
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
                    <a href="#" className="clickBtn black"
                        onClick={pageUnitAddEvent}
                    ><span>더보기</span></a>
                </div>
            </div>
        </div>
    );
};

export default TotalSearch;
