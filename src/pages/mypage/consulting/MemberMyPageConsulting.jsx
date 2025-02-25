import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import EgovUserPaging from "@/components/EgovUserPaging";
import CommonSubMenu from "@/components/CommonSubMenu";
import fileImages from "@/assets/images/ico_file_blue.svg";

import Swal from 'sweetalert2';
import {getComCdList} from "@/components/CommonComponents";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";

function MemberMyPageConsulting(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();

    const searchTypeRef = useRef();
    const searchValRef = useRef();
    const statusMap = sessionUser.mbrType === 2
        ? {
            102: "답변대기",
            101: "답변완료",
            201: "처리완료",
            200: "처리완료",
            999: "취소",
        }
        : {
            102: "답변완료",
            101: "답변대기",
            201: "처리완료",
            200: "처리완료",
            999: "취소",
        };


    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            cnsltSe : 26,
            startDt : "",
            endDt : "",
            searchType: "",
            searchVal : "",
            userSn: sessionUser?.userSn || "",
        }
    );
    const [paginationInfo, setPaginationInfo] = useState({});
    const [simpleList, setSimpleListList] = useState([]);
    const [dfclMttrFldList, setDfclMttrFldList] = useState([]);

    useEffect(() => {
        getComCdList(15).then((data) => {
            setDfclMttrFldList(data);
        })
    }, []);

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getSimpleList(searchDto);
        }
    };

    const getSimpleList = useCallback(
        (searchDto) => {
            const simpleListUrl = "/memberApi/getMyPageSimpleList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                simpleListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    dataList.push(
                        <tr key="noData">
                            <td colSpan="6">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.consultantList.forEach(function (item, index) {
                        if (index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.cnsltAplySn}>
                                <td className={`state ${["101", "999"].includes(String(item.cnsltSttsCd)) ? "waiting" : "complete"}`}>
                                    <p>
                                        {statusMap[item.cnsltSttsCd] || item.cnsltSttsCd}
                                    </p>
                                </td>
                                <td>{item.cnsltAplyFldNm}</td>
                                <td>
                                    <div style={{textAlign: 'left'}}>
                                        <Link to={{pathname: URL.MEMBER_MYPAGE_CONSULTING_DETAIL}}
                                              state={{
                                                  cnsltAplySn: item.cnsltAplySn,
                                                  cnsltSttsCd: item.cnsltSttsCd,
                                                  cnslttUserSn : item.cnslttUserSn,
                                                  menuSn: location.state?.menuSn,
                                                  menuNmPath: location.state?.menuNmPath,

                                              }}
                                              style={{cursor: 'pointer'}}
                                        >
                                            {item.ttl}
                                            {item.fileCnt !== 0 && <img src={fileImages} alt="pass images"/>}
                                        </Link>
                                    </div>
                                </td>
                                <td className={`${item.dgstfnCnt > 0 ? "satisfaction" : ""}`}>
                                    <p>
                                        <span>{item.dgstfnCnt > 0 ? "만족도확인" : ""}</span>
                                    </p>
                                </td>
                            </tr>
                        );
                    });
                    setSimpleListList(dataList);
                    setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {

                }
            );

        },
        [simpleList, searchDto]
    );

    useEffect(() => {
        getSimpleList(searchDto);
    }, []);

    return (
        <div id="container" className="container mypage_consultant">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="searchFormWrap type1" data-aos="fade-up" data-aos-duration="1500">
                        <form>
                            <div className="totalBox">
                                <div className="total"><p>총 <strong>{paginationInfo.totalRecordCount}</strong>건</p>
                                </div>
                            </div>
                            <div className="searchBox">
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
                                    <select id="simpleNm"
                                            name="simpleNm"
                                            title="검색유형"
                                            className="niceSelectCustom"
                                            ref={searchTypeRef}
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, searchType: e.target.value})
                                            }}
                                    >
                                        <option value="">전체</option>
                                        <option value="ttl">제목</option>
                                        <option value="cn">내용</option>
                                    </select>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input">
                                        <input type="text"
                                               name="searchVal"
                                               defaultValue={searchDto.searchVal}
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            getSimpleList({
                                                ...searchDto,
                                                pageIndex: 1,
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
                            <caption>컨설팅의뢰 내역</caption>
                            <thead>
                            <tr>
                                <th className="th1">상태</th>
                                <th className="th1">분류</th>
                                <th>제목</th>
                                <th className="th1">만족도</th>
                            </tr>
                            </thead>
                            <tbody>
                            {simpleList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovUserPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getSimpleList({
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

export default MemberMyPageConsulting;
