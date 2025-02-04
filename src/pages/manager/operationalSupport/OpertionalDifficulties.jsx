import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import EgovPaging from "@/components/EgovPaging";


function OpertionalDifficulties(props) {

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>애로사항 관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">신청일</p>
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
                                <p className="title">상태</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="0">전체</option>
                                        <option value="1">답변대기</option>
                                        <option value="2">답변완료</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">분류</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="0">전체</option>
                                        <option value="1">예시1</option>
                                        <option value="2">예시2</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select className="selectGroup">
                                        <option value="0">전체</option>
                                        <option value="1">제목</option>
                                        <option value="2">신청자</option>
                                        <option value="2">내용</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <label className="input">
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="검색어를 입력해주세요"
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button
                                type="button"
                                className="refreshBtn btn btn1 gray"
                            >
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point" >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText"><span className="red">5</span>건의 정보가 조회되었습니다.</p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red">
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                        </div>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>게시판</caption>
                            <thead>
                            <tr>
                                <th className="th1"><p>번호</p></th>
                                <th className="th2"><p>분류</p></th>
                                <th className="th3"><p>제목</p></th>
                                <th className="th4"><p>신청자</p></th>
                                <th className="th2"><p>신청일</p></th>
                                <th className="th3"><p>상태</p></th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={""}
                            moveToPage={""}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OpertionalDifficulties;