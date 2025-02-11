import React, {useState, useEffect, useCallback, useRef} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';

import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";

import moment from "moment/moment.js";
import {getSessionItem} from "../../utils/storage.js";
import {getComCdList} from "../../components/CommonComponents.jsx";

function ConsultantList(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            cnsltFld : "",
            searchType: "",
            searchVal : "",
            userSn : sessionUser ? sessionUser.userSn : ""
        }
    );
    const [comCdList, setComCdList] = useState([]);

    const [consultantList, setConsultantList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});

    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getConsultantList(searchDto);
        }
    };

    const getConsultantList = useCallback(
        (searchDto) => {
            const pstListURL = "/consultingApi/getConsultantList.do";
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
                    // setAuthrt(resp.result.authrt)
                    // let dataList = [];
                    // dataList.push(
                    //     <tr>
                    //         <td colSpan={resp.result.bbs.atchFileYn == "Y" ? "5" : "4"}>검색된 결과가 없습니다.</td>
                    //     </tr>
                    // );
                    //
                    // resp.result.pstList.forEach(function (item, index) {
                    //     if (index === 0) dataList = []; // 목록 초기화
                    //     let reTag = "";
                    //     let rlsYnFlag = false;
                    //     let pstSn = "";
                    //
                    //     if(item.rlsYn == "N"){
                    //         rlsYnFlag = true;
                    //     }
                    //
                    //     if(sessionUser){
                    //         if(sessionUser.userSe == "ADM"){
                    //             rlsYnFlag = true;
                    //         }
                    //
                    //         if(sessionUser.userSn == item.creatrSn){
                    //             rlsYnFlag = true;
                    //             pstSn = item.pstSn;
                    //         }
                    //     }
                    //
                    //
                    //     if(pstSn == item.upPstSn){
                    //         rlsYnFlag = true;
                    //     }
                    //
                    //     if(item.upPstSn != null) {  // 답글
                    //         reTag = "<span style='color:#5b72ff ' class='reply_row'>[RE]</span>"
                    //         if (resp.result.pstList.find(v => v.pstSn == item.upPstSn).rlsYn == "N") {
                    //             rlsYnFlag = true;
                    //         }
                    //     }
                    //
                    //     dataList.push(
                    //         <tr key={item.pstSn}>
                    //             <td>
                    //                 {item.upendNtcYn == "Y" ?
                    //                     "공지" :
                    //                     resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                    //             </td>
                    //             <td style={{textAlign: "left", paddingLeft: "15px"}}>
                    //                 <a onClick={() => {
                    //                     resp.result.authrt.inqAuthrt == "Y" ? pstDetailHandler(item, rlsYnFlag) : Swal.fire("읽기 권한이 없습니다.")
                    //                 }}
                    //                 style={{cursor:"pointer"}}>
                    //                     {reTag ? <span dangerouslySetInnerHTML={{__html: reTag}} style={{marginRight: "5px"}}></span> : ""}
                    //                     {item.rlsYn == "Y" ? (rlsYnFlag ? item.pstTtl : item.pstTtl.replaceAll(/./g, '*')) : item.pstTtl}
                    //                 </a>
                    //             </td>
                    //             {resp.result.bbs.atchFileYn == "Y" && (
                    //                 <td>{item.fileCnt != 0 ? "있음" : "없음"}</td>
                    //             )}
                    //             <td>{item.pstInqCnt}</td>
                    //             <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                    //             <td>{item.rlsYn == "Y" ? (rlsYnFlag ? item.kornFlnm : item.kornFlnm.replaceAll(/./g, '*')) : item.kornFlnm}</td>
                    //         </tr>
                    //     );
                    // });
                    // setPstList(dataList);
                    // setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [consultantList, searchDto]
    );

    const getComCdListToHtml = (dataList) => {
        let htmlData = [];
        if(dataList != null && dataList.length > 0) {
            htmlData.push(
                <label className="checkBox type2" key="all">
                    <input
                        type="radio"
                        name="cnsltFld"
                        key="all"
                        value=""
                        checked
                        onChange={(e) =>
                            setSearchDto({...searchDto, cnsltFld: e.target.value})
                        }
                    />전체</label>
            )
            dataList.forEach(function (item, index) {
                htmlData.push(
                    <label className="checkBox type2" key={item.comCd}>
                        <input
                            type="radio"
                            name="cnsltFld"
                            key={item.comCd}
                            value={item.comCd}
                            onChange={(e) =>
                                setSearchDto({...searchDto, cnsltFld: e.target.value})
                            }
                        />{item.comCdNm}</label>
                )
            });
        }
        return htmlData;
    }

    useEffect(() => {
        getComCdList(10).then((data) => {
            setComCdList(data);
        })
    }, []);


    useEffect(() => {
        getConsultantList(searchDto);
    }, [comCdList]);

    return (
        <div id="container" className="container layout cms">
            <div className="inner">
                <h2 className="pageTitle">컨설턴트 리스트</h2>
                <div className="cateWrap inputBox type1" style={{flexDirection: "row"}}>
                    <div className="rating-options">
                        {getComCdListToHtml(comCdList)}
                    </div>
                </div>
                <div className="cateWrap inputBox type1" style={{flexDirection: "row"}}>

                    <div className="itemBox" style={{width: "7%"}}>
                        <select
                            id="searchType"
                            name="searchType"
                            title="검색유형"
                            ref={searchTypeRef}
                            style={{width: "50%"}}
                            onChange={(e) => {
                                setSearchDto({...searchDto, searchType: e.target.value})
                            }}
                        >
                            <option value="">전체</option>
                            <option value="kornFlnm">성명</option>
                            <option value="ogdpNm">소속</option>
                        </select>
                    </div>
                    <div className="itemBox">
                        <label className="input">
                            <input type="text"
                                   name="searchVal"
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
                                    getConsultantList({
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
                        {consultantList}
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getConsultantList({
                                    ...searchDto,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConsultantList;
