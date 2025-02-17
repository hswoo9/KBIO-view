import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import EgovUserPaging from "@/components/EgovUserPaging";
import CommonSubMenu from "@/components/CommonSubMenu";
import Swal from 'sweetalert2';
import {getComCdList} from "@/components/CommonComponents";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";

function MemberMyPageDifficulties(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();

    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            startDt : "",
            endDt : "",
            answerYn: "",
            dfclMttrFld : "",
            searchType: "",
            searchVal : "",
            userSn: sessionUser?.userSn || "",
        }
    );

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getDfclMttrList(searchDto);
        }
    };
    const [dfclMttrFldList, setDfclMttrFldList] = useState([]);
    const [dfclMttrList, setDfclMttrList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});

    useEffect(() => {
        getComCdList(15).then((data) => {
            setDfclMttrFldList(data);
        })
    }, []);



    const getDfclMttrList = useCallback(
        (searchDto) => {
            const dfclMttrListUrl = "/memeberApi/getMyPageDfclMttrList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                dfclMttrListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan="5">애로사항 내역이 없습니다.</td>
                        </tr>
                    );

                    resp.result.diffList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.pstSn}>
                                <td>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td>{item.dfclMttrFldNm}</td>
                                <td>
                                    {item.answer === "Y" ? (
                                        <Link to={{pathname: URL.MEMBER_MYPAGE_DIFFICULTIES_DETAIL}}
                                              state={{
                                                  dfclMttrSn: item.dfclMttrSn,
                                                  menuSn : location.state?.menuSn,
                                                  menuNmPath : location.state?.menuNmPath

                                              }}
                                              style={{cursor: 'pointer', textDecoration: 'underline'}}
                                        >
                                            {item.ttl}
                                        </Link>
                                    ) : (
                                        <Link to={{pathname: URL.MEMBER_MYPAGE_DIFFICULTIES_MODIFY}}
                                              state={{
                                                  dfclMttrSn: item.dfclMttrSn,
                                                  menuSn : location.state?.menuSn,
                                                  menuNmPath : location.state?.menuNmPath
                                              }}
                                              style={{cursor: 'pointer', textDecoration: 'underline'}}
                                        >
                                            {item.ttl}
                                        </Link>
                                    )}
                                </td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>{item.answer == "Y" ? "답변완료" : "답변대기"}</td>
                            </tr>
                        );
                    });
                    setDfclMttrList(dataList);
                    setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            );

        },
        [dfclMttrList, searchDto]
    );

    useEffect(() => {
        getDfclMttrList(searchDto);
    }, []);


    return (
        <div id="container" className="container notice board">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="searchFormWrap type1" data-aos="fade-up" data-aos-duration="1500">
                        <form>
                            <div className="totalBox">
                                <div className="total"><p>총 <strong>{paginationInfo.totalRecordCount}</strong>건</p></div>
                            </div>
                            <div className="searchBox" >
                                {/*<div className="itemBox type2">
                                    <select
                                        id="activeYn"
                                        name="activeYn"
                                        title="사용여부"
                                        className="niceSelectCustom">
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                                <div className="itemBox type2">
                                    <select className="niceSelectCustom">
                                        <option value="">전체</option>
                                        <option value="1">공개</option>
                                        <option value="2">비공개</option>
                                    </select>
                                </div>*/}
                                <div className="itemBox type2">
                                    <select className="niceSelectCustom">
                                        <option value="">전체</option>
                                        <option value="ttl">제목</option>
                                        <option value="dfclMttrCn">내용</option>
                                    </select>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input">
                                        <input type="text"
                                               name=""
                                               defaultValue={
                                                   searchDto && searchDto.searchVal
                                               }
                                               placeholder=""
                                               ref={searchValRef}
                                               onChange={(e) => {
                                                   setSearchDto({...searchDto, searchVal: e.target.value})
                                               }}
                                               onKeyDown={activeEnter}
                                        />
                                    </label>
                                </div>
                                <button type="button"
                                        className="searchBtn"
                                        onClick={() => {
                                            getDfclMttrList({
                                                ...searchDto,
                                                pageIndex: 1,
                                                searchType: searchTypeRef.current.value,
                                                searchVal: searchValRef.current.value,
                                            });
                                        }}
                                >
                                    <div className="icon"></div>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="board_list" data-aos="fade-up" data-aos-duration="1500">
                        <table>
                            <caption>간편상담 목록</caption>
                            <colgroup>
                                <col width="80"/>
                                <col width="170"/>
                                <col width="450"/>
                                <col width="250"/>
                                <col width="250"/>
                                <col width="150"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>분류</th>
                                <th>제목</th>
                                <th>신청일</th>
                                <th>상태</th>
                                <th>만족도</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dfclMttrList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovUserPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getDfclMttrList({
                                    ...searchDto,
                                    pageIndex: passedPage,
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MemberMyPageDifficulties;
