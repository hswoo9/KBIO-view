import React, {useState, useEffect, useCallback, useRef} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";

import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";

import moment from "moment/moment.js";
import {getSessionItem} from "../../../utils/storage.js";

function commonPstList(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            bbsSn : location.state?.bbsSn,
            searchType: "",
            searchVal : "",
            actvtnYn : "",
        }
    );

    const [bbs, setBbs] = useState({});
    const [pstList, setPstList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [pst, setPst] = useState({})
    const [prvtPswd, setPrvtPswd] = useState("")


    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getPstList(searchDto);
        }
    };

    const getPstList = useCallback(
        (searchDto) => {
            const pstListURL = "/pstApi/getPstList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                pstListURL,
                requestOptions,
                (resp) => {
                    setBbs(resp.result.bbs);
                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan={resp.result.bbs.atchFileYn == "Y" ? "5" : "4"}>검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.pstList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화
                        let reTag = "";
                        let rlsYnFlag = false;
                        let pstSn = "";

                        if(item.rlsYn == "N"){
                            rlsYnFlag = true;
                        }
                        if(sessionUser.userSe == "ADM"){
                            rlsYnFlag = true;
                        }

                        if(sessionUser.userSn == item.creatrSn){
                            rlsYnFlag = true;
                            pstSn = item.pstSn;
                        }

                        if(pstSn == item.upPstSn){
                            rlsYnFlag = true;
                        }

                        if(item.upPstSn != null) {  // 답글
                            reTag = "<span style='color:#5b72ff ' class='reply_row'>[RE]</span>"
                            if (resp.result.pstList.find(v => v.pstSn == item.upPstSn).rlsYn == "N") {
                                rlsYnFlag = true;
                            }
                        }

                        dataList.push(
                            <tr key={item.pstSn}>
                                <td>
                                    {item.upendNtcYn == "Y" ?
                                        "공지" :
                                        resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td style={{textAlign: "left", paddingLeft: "15px"}}>
                                    <a onClick={(e) => {
                                        pstDetailHandler(item)
                                    }}
                                    style={{cursor:"pointer"}}>
                                        {reTag ? <span dangerouslySetInnerHTML={{__html: reTag}} style={{marginRight: "5px"}}></span> : ""}
                                        {item.rlsYn == "Y" ? (rlsYnFlag ? item.pstTtl : item.pstTtl.replaceAll(/./g, '*')) : item.pstTtl}
                                    </a>
                                </td>
                                {resp.result.bbs.atchFileYn == "Y" && (
                                    <td>{item.fileCnt != 0 ? "있음" : "없음"}</td>
                                )}
                                <td>{item.pstInqCnt}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>{item.rlsYn == "Y" ? (rlsYnFlag ? item.kornFlnm : item.kornFlnm.replaceAll(/./g, '*')) : item.kornFlnm}</td>
                            </tr>
                        );
                    });
                    setPstList(dataList);
                    setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [pstList, searchDto]
    );

    useEffect(() => {
        getPstList(searchDto);
    }, []);

    const pstDetailHandler = (pst, rlsYnFlag) => {
        let modalOpen = false;
        if(pst.rlsYn == "Y"){
            if(!rlsYnFlag){
                modalOpen = true;
            }
        }

        if(modalOpen){
            modalOpenEvent()
            setPst(pst)
        }else{
            moveToPstDetail(pst.pstSn)
        }
    };

    const modalOpenEvent = (e) => {
        document.getElementById('modalDiv').classList.add("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'hidden';
        document.getElementsByTagName('body')[0].style.overFlow = 'hidden';
    }

    const modalCloseEvent = (e) => {
        document.getElementById('modalDiv').classList.remove("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'visible';
        document.getElementsByTagName('body')[0].style.overFlow = 'visible';
    }

    const pstPassWorkChk = () => {
        if(!prvtPswd){
            Swal.fire("비밀번호를 입력해주세요.");
            return;
        }

        if(prvtPswd !== pst.prvtPswd){
            Swal.fire("비밀번호가 일치하지 않습니다.");
            return;
        }

        moveToPstDetail(pst.pstSn);
    }

    const moveToPstDetail = (pstSn) => {
        navigate(
            { pathname: URL.COMMON_PST_DETAIL },
            { state: { pstSn:  pstSn} },
            { mode:  CODE.MODE_READ}
        );
    }

    return (
        <div id="container" className="container layout cms">
            <div className="inner">
                <h2 className="pageTitle">{bbs.bbsNm}</h2>

                <div className="cateWrap inputBox type1" style={{flexDirection: "row"}}>
                    <div className="itemBox" style={{width: "7%"}}>
                        <select
                            id="bbsTypeNm"
                            name="bbsTypeNm"
                            title="검색유형"
                            ref={searchTypeRef}
                            style={{width: "50%"}}
                            onChange={(e) => {
                                setSearchDto({...searchDto, searchType: e.target.value})
                            }}
                        >
                            <option value="">전체</option>
                            <option value="pstTtl">제목</option>
                            <option value="pstCn">내용</option>
                        </select>
                    </div>
                    <div className="itemBox">
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
                    <div className="rightBtn">
                        <button type="button"
                                className="searchBtn btn btn1 point"
                                onClick={() => {
                                    getPstList({
                                        ...searchDto,
                                        pageIndex: 1,
                                        searchType: searchTypeRef.current.value,
                                        searchVal: searchValRef.current.value,
                                    });
                                }}
                                style={{color: "#fff", width: "100px"}}
                        >
                            조회
                        </button>
                    </div>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>게시글목록</caption>
                            <colgroup>
                                <col width="80"/>
                                <col/>
                                {bbs.atchFileYn == "Y" && (
                                    <col width="80"/>
                                )}
                                <col width="80"/>
                                <col width="120"/>
                                <col width="80"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                {bbs.atchFileYn == "Y" && (
                                    <th>첨부파일</th>
                                )}
                                <th>조회수</th>
                                <th>등록일</th>
                                <th>작성자</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pstList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getPstList({
                                    ...searchDto,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                        <NavLink
                            to={URL.COMMON_PST_CREATE}
                            state={{bbsSn: bbs.bbsSn}}
                            mode={CODE.MODE_CREATE}
                        >
                            <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>

            <div className="programModal modalCon" id="modalDiv">
                <div className="bg"></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="top">
                            <h2 className="title">비밀글</h2>
                            <div className="close" onClick={modalCloseEvent}>
                                <div className="icon"></div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="tableBox type1">
                                <table>
                                    <caption>게시글 비밀번호 입력</caption>
                                    <thead>
                                    <tr>
                                        <th className="th1">
                                            <p>비밀번호</p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <input
                                                type="password"
                                                name="prvtPswd"
                                                placeholder="비밀번호를 입력해주세요"
                                                autoComplete="off"
                                                onChange={(e) =>
                                                    setPrvtPswd(e.target.value)
                                                }
                                            />
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th>
                                            <button
                                                type="button"
                                                className="writeBtn clickBtn"
                                                onClick={pstPassWorkChk}>
                                                <span>확인</span>
                                            </button>
                                        </th>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="pageWrap">

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default commonPstList;
