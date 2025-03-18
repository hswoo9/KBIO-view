import React, { useState, useEffect, useCallback, useRef } from "react";
import ManagerLeftNew from "@/components/manager/ManagerLeftStatistics";
import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";
import * as ComScript from "@/components/CommonScript";
import * as EgovNet from "@/api/egovFetch";

import ApexCharts from 'react-apexcharts';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isToday,
    setMonth,
    setYear,
    isLeapYear,
    subMonths,
    addMonths,
} from "date-fns";


const PopularSearch = ({ pageName, onCallback }) => <div>{pageName} 내용</div>;
const RecentSearch = ({ pageName, onCallback }) => <div>{pageName} 내용</div>;
const RecommendedSearch = ({ pageName, onCallback }) => <div>{pageName} 내용</div>;

function ManagerStatisticsSearch(props) {
    const [isLoading, setIsLoading] = useState(false);  // 로딩 상태
    const [serachList, setSerachList] = useState([]);
    const [recommenList, setRecommenList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [serachTermList, setSerachTremList] = useState([]);
    const nowDate = new Date();
    const [normalMemberList, setAuthorityList] = useState([]);
    const [menuIndex, setMenuIndex] = useState(0);
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            mbrStts: "",
            kornFlnm: "",
            userId: "",
            searchType: "",
            searchVal : "",
            mbrType: "",
        }
    );



    const currentYear = format(nowDate, "yyyy");

    const handleCallback = (e) => {
        if(e == "isLoading"){
            setIsLoading(true);
        }else{
            setIsLoading(false);
        }
    };

    const menuList = useCallback((callback) => ({
        0: <PopularSearch pageName="인기검색어" onCallback={callback} />,
        1: <RecentSearch pageName="최근검색어" onCallback={callback} />,
        2: <RecommendedSearch pageName="추천검색어" onCallback={callback} />,
    }), []);

    useEffect(() => {
        setPaginationInfo({
            currentPageNo: 1,
            firstPageNo: 1,
            firstPageNoOnPageList: 1,
            firstRecordIndex: 0,
            lastPageNo: 1,
            pageSize: 10,
            recordCountPerPage: 10,
            totalPageCount: 1,
            totalRecordCount: 10
        });
    }, [serachList]);

    useEffect(() => {
        const serachData = [
            { userSn: 1, title: 'K-바이오', previousWeekCount: 315, currentWeekCount: 320, fluctuation: 5 },
            { userSn: 2, title: '컨설팅', previousWeekCount: 305, currentWeekCount: 298, fluctuation: -7 },
            { userSn: 3, title: '의약바이오', previousWeekCount: 278, currentWeekCount: 290, fluctuation: 12 },
            { userSn: 4, title: '간편상담', previousWeekCount: 196, currentWeekCount: 185, fluctuation: -11 },
            { userSn: 5, title: '오시는길', previousWeekCount: 124, currentWeekCount: 140, fluctuation: 16 },
            { userSn: 6, title: '유관기관', previousWeekCount: 88, currentWeekCount: 100, fluctuation: 12 },
            { userSn: 7, title: '입주신청', previousWeekCount: 74, currentWeekCount: 80, fluctuation: 6 },
            { userSn: 8, title: '바이오랩허브', previousWeekCount: 65, currentWeekCount: 60, fluctuation: -5 },
            { userSn: 9, title: '연구시설', previousWeekCount: 54, currentWeekCount: 70, fluctuation: 16 },
            { userSn: 10, title: '연구자료', previousWeekCount: 32, currentWeekCount: 45, fluctuation: 13 }
        ];

        setSerachList(serachData);
    }, []);

    useEffect(() => {
        const recommenData = [
            {Sn: 1, title:'K-바이오', date: '2025-03-18'},
            {Sn: 2, title:'컨설팅의뢰', date: '2025-03-17'},
            {Sn: 3, title:'간편상담의뢰', date: '2025-03-08'},
            {Sn: 4, title:'애로사항', date: '2025-02-21'},
            {Sn: 5, title:'회원가입', date: '2025-02-18'}
        ];
        setRecommenList(recommenData);
    }, []);

    useEffect(() => {
        const serachTerm = [
            {Sn: 1, title:'비밀번호변경', date: '2025-03-18'},
            {Sn: 2, title:'K-바이오', date: '2025-03-18'},
            {Sn: 3, title:'컨설팅의뢰', date: '2025-03-17'},
            {Sn: 4, title:'계정수정', date: '2025-03-17'},
            {Sn: 5, title:'오시는길', date: '2025-03-17'},
            {Sn: 6, title:'간편상담의뢰', date: '2025-03-08'},
            {Sn: 7, title:'입주기업', date: '2025-03-08'},
            {Sn: 8, title:'유관기관', date: '2025-02-21'},
            {Sn: 9, title:'애로사항', date: '2025-02-21'},
        ];
        setSerachTremList(serachTerm);
    }, []);

    const changeMenu = (menuIndex) => {
        setMenuIndex(menuIndex);
    }

    const save = () => {
        Swal.fire("등록이 완료 되었습니다.");
        ComScript.closeModal("requestModal");
    }

    const getnormalMemberList = useCallback(
        (searchDto) => {
            const normalMemberListURL = "/memberApi/getNormalMemberList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                normalMemberListURL,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="no-data">
                            <td colSpan="8">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.getNormalMemberList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.userSn}>
                                <td>{resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}</td>
                                <td>
                                    {item.mbrType === 9 ? '관리자' :
                                        item.mbrType === 1 ? '입주기업' :
                                            item.mbrType === 2 ? '컨설턴트' :
                                                item.mbrType === 3 ? '유관기관' :
                                                    item.mbrType === 4 ? '비입주기업' :
                                                        '테스트'}
                                </td>
                                <td>
                                  <span
                                      onClick={() => ComScript.openModal("dataModal")}
                                      style={{ cursor: 'pointer' }}
                                  >
                                    {item.userId}
                                  </span>
                                </td>
                                <td>{item.kornFlnm}</td>
                                <td>{item.companyNm}</td>
                                <td>{item.snsClsf ? item.snsClsf : ""}</td>
                                <td>{new Date(item.frstCrtDt).toISOString().split("T")[0]}</td>
                                <td>
                                    {item.lastLoginDate ? new Date(item.lastLoginDate).toISOString().split("T")[0] : "-"}
                                </td>
                                <td>
                                    {item.mbrStts === 'Y' ? '정상회원' :
                                        item.mbrStts === 'W' ? '대기회원' :
                                            item.mbrStts === 'R' ? '반려회원' :
                                                item.mbrStts === 'C' ? '정지회원' :
                                                    item.mbrStts === 'S' ? '탈퇴회원' : ''}
                                </td>
                            </tr>
                        );
                    });
                    setAuthorityList(dataList);
                },
                function (resp) {

                }
            );
        },
        [normalMemberList, searchDto]
    );

    useEffect(() => {
        getnormalMemberList(searchDto);
    }, [searchDto]);


    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>검색어 통계</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">기간</p>
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="searchYear"
                                    >
                                        {Array.from({length: Math.max(0, currentYear - 2025) + 1}, (_, i) => (
                                            <option key={i} value={currentYear - i}>
                                                {currentYear - i}년
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="searchMonth"
                                    >
                                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((month, index) => (
                                            <option key={index} value={String(month).padStart(2, '0')}>
                                                {String(month).padStart(2, '0')}월
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <div className="itemBox">
                                    <select className="selectGroup"
                                            id="serachweek"
                                    >
                                        {["1", "2", "3", "4", "5"].map((month, index) => (
                                            <option key={index} value={String(month).padStart(2, '0')}>
                                                {String(month).padStart(2, '0')}주
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                        </ul>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <ul className="tabs">
                            {["인기검색어", "최근검색어", "추천검색어"].map((name, index) => (
                                <li key={index} className={menuIndex === index ? "tabActive" : ""}
                                    onClick={() => setMenuIndex(index)}
                                    style={{cursor: "pointer"}}>
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {menuList(setIsLoading)[menuIndex]}
                {menuIndex === 0 && (
                <div className="contBox board type1 customContBox">
                    <div className="tableBox type1">
                        <table>
                            <caption>회원목록</caption>
                            <thead>
                            <tr>
                                <th className="th2">순위</th>
                                <th className="th4">키워드</th>
                                <th className="th2">금주</th>
                                <th className="th2">전주</th>
                                <th className="th1">증감</th>
                                <th className="th1">삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {serachList.slice(0, paginationInfo.pageSize).map((item, index) => (
                                <tr key={item.userSn}>
                                    <td>{index + 1}</td>
                                    <td>{item.title}</td>
                                    <td>{item.previousWeekCount}</td>
                                    <td>{item.currentWeekCount}</td>
                                    <td style={{ color: item.fluctuation < 0 ? 'blue' : 'red' }}>
                                        {item.fluctuation}
                                    </td>
                                    <td>
                                        <button type="button"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                setPaginationInfo((prev) => ({
                                    ...prev,
                                    currentPageNo: passedPage
                                }));
                            }}
                        />
                    </div>
                </div>
                    )}
                {menuIndex === 1 && (
                    <div className="contBox board type1 customContBox">
                        <div className="tableBox type1">
                            <table>
                                <caption>회원목록</caption>
                                <thead>
                                <tr>
                                    <th className="th1">번호</th>
                                    <th className="th1">회원분류</th>
                                    <th className="th2">아이디</th>
                                    <th className="th2">성명</th>
                                    <th className="th2">기업명</th>
                                    <th className="th1">소셜구분</th>
                                    <th className="th2">가입일</th>
                                    <th className="th2">최근 접속일시</th>
                                    <th className="th1">최근 회원상태</th>
                                </tr>
                                </thead>
                                <tbody>
                                {normalMemberList}
                                </tbody>
                            </table>
                        </div>
                        <div className="pageWrap">
                            <EgovPaging
                                pagination={paginationInfo}
                                moveToPage={(passedPage) => {
                                    getnormalMemberList({
                                        ...searchDto,
                                        pageIndex: passedPage,
                                    });
                                }}
                            />
                        </div>
                    </div>

                )}
                {menuIndex === 2 && (
                    <div className="contBox board type1 customContBox">
                        <div className="tableBox type1">
                            <table>
                                <caption>추천검색어</caption>
                                <thead>
                                <tr>
                                    <th className="th1">번호</th>
                                    <th className="th4">키워드</th>
                                    <th className="th3">등록일</th>
                                    <th className="th1">삭제</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recommenList.slice(0, paginationInfo.pageSize).map((item, index) => (
                                    <tr key={item.userSn}>
                                        <td>{index + 1}</td>
                                        <td>{item.title}</td>
                                        <td>{item.date}</td>
                                        <td>
                                            <button type="button"
                                            >
                                                삭제
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pageWrap">
                            <EgovPaging
                                pagination={paginationInfo}
                                moveToPage={(passedPage) => {
                                    setPaginationInfo((prev) => ({
                                        ...prev,
                                        currentPageNo: passedPage
                                    }));
                                }}
                            />
                            <button type="button" className="writeBtn clickBtn" onClick={() => {
                                ComScript.openModal("requestModal")
                            }}>
                                <span>키워드등록</span>
                            </button>
                        </div>
                    </div>
                )}
                <div className="requestModal modalCon">
                    <div className="bg" onClick={() => ComScript.closeModal("requestModal")}></div>
                    <div className="m-inner">
                        <div className="boxWrap">
                            <div className="close" onClick={() => ComScript.closeModal("requestModal")}>
                                <div className="icon"></div>
                            </div>
                            <div className="titleWrap type2">
                                <p className="tt1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', fontSize: '20px' }}>키워드 등록</p>
                            </div>
                            <form className="diffiBox">
                                <div className="cont">
                                    <ul className="listBox">
                                        <li className="inputBox type2" style={{marginBottom:"10px"}}>
                                            <label htmlFor="request_title" className="tt1 essential">키워드</label>
                                            <div className="input">
                                                <input
                                                    type="text"
                                                    title="제목"
                                                    id="ttl"
                                                    name="ttl"
                                                />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    type="button"
                                    className="clickBtn black writeBtn"
                                    onClick={save}
                                    style={{ width: '200px', display: 'block', margin: '0 auto' }}
                                >
                                    <span>등록</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="dataModal modalCon">
                    <div className="bg" onClick={() => ComScript.closeModal("dataModal")}></div>
                    <div className="m-inner">
                        <div className="boxWrap" style={{width:"30%"}}>
                            <div className="close" onClick={() => ComScript.closeModal("dataModal")}>
                                <div className="icon"></div>
                            </div>
                            <div className="titleWrap type2">
                                <p className="tt1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', fontSize: '20px' }}>최근 검색어</p>
                            </div>
                            <div className="tableBox type1">
                                <table>
                                    <caption>회원목록</caption>
                                    <colgroup>
                                        <col width="50"/>
                                    </colgroup>
                                    <thead className="fixed-thead">
                                    <tr>
                                        <th>검색어</th>
                                        <th>검색날짜</th>
                                    </tr>
                                    </thead>
                                    <tbody className="scrollable-tbody">
                                    {serachTermList.map((item) => (
                                                <tr key={item.Sn}>
                                                    <td>{item.title}</td>
                                                    <td>{item.date}</td>
                                                </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerStatisticsSearch;
