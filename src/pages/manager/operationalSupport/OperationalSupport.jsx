import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

import moment from "moment/moment.js";

function OperationalSupport(props) {

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            brno: "",
            mvnEntNm : "",
            rpsvNm : "",
        }
    );

    const [selectedOption, setSelectedOption] = useState("");
    const [paginationInfo, setPaginationInfo] = useState({});
    const [rcList, setAuthorityList] = useState([]);
    const [activeTab, setActiveTab] = useState(1);

    const handleSearch = () => {
        setSearchDto({ ...searchDto, pageIndex: 1 });
        getRcList(searchDto);
    };

    const getRcList = useCallback(
        (searchDto)=>{


            const rcListUrl = "/mvnEntApi/getMvnEntList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                rcListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    rcList.push(
                        <tr>
                            <td colSpan="5">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.rcList.forEach(function (item,index){
                        if(index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.mvnEntSn}>
                                <td>{index + 1}</td>
                                <td>
                                    {item.bzstatNm}
                                </td>
                                <td>
                                <Link to={{pathname: URL.RESIDENT_COMPANY_MODIFY}}
                                      state={{
                                          mvnEntSn: item.mvnEntSn,
                                          mode:CODE.MODE_MODIFY
                                      }}
                                >
                                {item.mvnEntNm}
                                </Link>
                                </td>
                                <td>{item.rpsvNm}</td>
                                <td>{formatTelNo(item.entTelno)}</td>
                                <td>{item.clsNm}</td>
                                <td>{item.actvtnYn === "Y" ? "공개" : "비공개"}</td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <Link to={URL.MANAGER_RESIDENT_MEMBER}>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                    </Link>
                                </td>
                            </tr>
                        );
                    });
                    setAuthorityList(dataList);

                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [rcList, searchDto]
    );

    useEffect(()=>{
        getRcList(searchDto);
    }, []);

    function formatTelNo(telNo) {
        if (!telNo || telNo.length < 12) {
            console.error("Invalid brno length or undefined value.");
            return telNo;
        }

        return `${telNo.slice(0, 2)}-${telNo.slice(3, 7)}-${telNo.slice(7)}`;
    }

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getRcList(searchDto);
        }
    };

    const handleKeywordSearch = () => {

        setSearchDto((prev) => {
            const updatedSearchDto = { ...prev, [selectedOption]: prev[selectedOption] || "" , pageIndex: 1  };
            getRcList(updatedSearchDto); // 여기서 검색 실행
            return updatedSearchDto;
        });
    };

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>입주기업 관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">분류</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="0">전체</option>
                                        <option value="1">예시1</option>
                                        <option value="2">예시2</option>
                                        <option value="3">예시3</option>
                                        <option value="4">예시4</option>
                                        <option value="5">예시5</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">공개 여부</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="0">전체</option>
                                        <option value="1">공개</option>
                                        <option value="2">비공개</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select className="selectGroup" onChange={(e) => {
                                        const value = e.target.value;
                                        const optionMap = {
                                            "0":"",
                                            "1": "mvnEntNm",
                                            "2": "rpsvNm",
                                            //추가되면 아래로 더 추가
                                        };

                                        setSelectedOption(optionMap[value] || "");
                                        setSearchDto(prev => ({ ...prev, [optionMap[value] || ""]: "" }));
                                    }}>
                                        <option value="0">전체</option>
                                        <option value="1">기업명</option>
                                        <option value="2">대표자</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input
                                        type="text"
                                        value={searchDto[selectedOption] || ""}
                                        name="search"
                                        onChange={(e) => {
                                            setSearchDto({ ...searchDto, [selectedOption]: e.target.value });
                                        }}
                                        placeholder="검색어를 입력해주세요"
                                        onKeyDown={activeEnter}
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button
                                type="button"
                                className="refreshBtn btn btn1 gray"
                                onClick={(e)=>{
                                    e.preventDefault();
                                    getRcList({
                                        ...searchDto,
                                        pageIndex: 1,
                                        mvnEntNm : "",
                                        rpsvNm : "",
                                    });
                                }}
                            >
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point" onClick= {handleKeywordSearch}>
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText"><span className="red">{paginationInfo.totalRecordCount}</span>건의 입주기업 정보가 조회되었습니다.</p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red">
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                            <button type="button" className="btn btn2 uploadBtn black">
                                <div className="icon"></div>
                                <span>엑셀 업로드</span>
                            </button>
                        </div>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>게시판</caption>
                            <thead>
                            <tr>
                                <th className="th1"><p>번호</p></th>
                                <th className="th2"><p>분류</p></th>
                                <th className="th3"><p>기업명</p></th>
                                <th className="th4"><p>대표자</p></th>
                                <th className="th2"><p>대표전화</p></th>
                                <th className="th3"><p>업종</p></th>
                                <th className="th5"><p>공개여부</p></th>
                                <th className="th5"><p>설정 보기</p></th>
                                <th className="th5"><p>목록 보기</p></th>
                            </tr>
                            </thead>
                            <tbody>
                            {rcList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) =>{
                                getRcList({
                                   ...searchDto,
                                   pageIndex: passedPage
                                });
                            }
                        }
                        />
                        <NavLink
                            to={URL.RESIDENT_COMPANY_CREATE}
                            state={{
                                mode:CODE.MODE_CREATE
                            }}
                        >
                        <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="uploadModal modalCon">
                <div className="bg"></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="top">
                            <h2 className="title">기업정보 일괄 등록</h2>
                            <div className="close">
                                <div className="icon"></div>
                            </div>
                        </div>
                        <div className="box">
                            <form>
                                <div className="inputBox type1 file">
                                    <p className="title">기업정보 파일</p>
                                    <div className="input">
                                        <p className="file_name"></p>
                                        <label>
                                            <small className="text btn">파일 선택</small>
                                            <input type="file" name="file" id="file"
                                                   accept=".xlsx, .xlsm, .xlsb, .xltx"/>
                                        </label>
                                    </div>
                                </div>
                                <p className="botText"><span className="point">양식파일</span>을 다운로드 받은 후 작성해서 업로드 해주세요.</p>
                                <div className="buttonBox">
                                    <button type="button" className="clickBtn gray"><span>취소</span></button>
                                    <button type="submit" className="clickBtn"><span>등록</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OperationalSupport;
