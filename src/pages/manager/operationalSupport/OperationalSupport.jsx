import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

function OperationalSupport(props) {

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
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
                                        <option value="1">예시1</option>
                                        <option value="2">예시2</option>
                                        <option value="3">예시3</option>
                                        <option value="4">예시4</option>
                                        <option value="5">예시5</option>
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1">
                                <p className="title">키워드</p>
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
                            <li className="searchBox inputBox type1">
                                <label className="input"><input type="text" id="search" name="search"
                                                                placeholder="검색어를 입력해주세요"/></label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray">
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point">
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText"><span className="red">12,345</span>건의 입주기업 정보가 조회되었습니다.</p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red">
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                            <button type="button" className="btn btn2 uploadBtn black">
                                <div className="icon"></div>
                                <span>엑셀 업로드</span></button>
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
                            <tr>
                                <td><p>10</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            <tr>
                                <td><p>9</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            <tr>
                                <td><p>8</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            <tr>
                                <td><p>7</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            <tr>
                                <td><p>6</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            <tr>
                                <td><p>5</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            <tr>
                                <td><p>4</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            <tr>
                                <td><p>3</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            <tr>
                                <td><p>2</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            <tr>
                                <td><p>1</p></td>
                                <td><p>분류1</p></td>
                                <td><p>서울바이오</p></td>
                                <td><p>김철수</p></td>
                                <td><p>032-123-1235</p></td>
                                <td><p>바이오</p></td>
                                <td><p>공개</p></td>
                                <td>
                                    <button type="button" className="settingBtn"><span>관리자 설정</span></button>
                                </td>
                                <td>
                                    <button type="button" className="listBtn"><span>직원 목록</span></button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <ul className="pageList">
                            <li className="first arrow"><a href="#"></a></li>
                            <li className="prev arrow"><a href="#"></a></li>
                            <li className="now"><a href="#"><span>1</span></a></li>
                            <li><a href="#"><span>2</span></a></li>
                            <li><a href="#"><span>3</span></a></li>
                            <li><a href="#"><span>4</span></a></li>
                            <li><a href="#"><span>5</span></a></li>
                            <li><a href="#"><span>6</span></a></li>
                            <li><a href="#"><span>7</span></a></li>
                            <li><a href="#"><span>8</span></a></li>
                            <li><a href="#"><span>9</span></a></li>
                            <li><a href="#"><span>10</span></a></li>
                            <li className="next arrow active"><a href="#"></a></li>
                            <li className="last arrow active"><a href="#"></a></li>
                        </ul>
                        <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
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
