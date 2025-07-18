import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftConsulting";
import EgovPaging from "@/components/EgovPaging";
import * as ComScript from "@/components/CommonScript";
import Swal from 'sweetalert2';

/* bootstrip */
import { getSessionItem } from "@/utils/storage";
import {getComCdList, excelExport} from "@/components/CommonComponents";
import moment from "moment/moment.js";
import {sendMessageFn, useWebSocket} from "@/utils/WebSocketProvider";

function ManagerMatching(props) {
    const sessionUser = getSessionItem("loginUser");
    const { socket, isConnected } = useWebSocket();
    const location = useLocation();

    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            cnsltSe : 26,
            startDt : "",
            endDt : "",
            cnsltFld: "",
            searchType: "",
            searchVal : "",
        }
    );

    const searchReset = () => {
        setSearchDto({
            pageIndex: 1,
            startDt: "",
            endDt: "",
            answerYn: "",
            dfclMttrFld: "",
            searchType: "",
            searchVal: ""
        });
    };


    const [cnsltantList, setCnsltantList] = useState([]);

    const [consultingList, setConsultingList] = useState([]);
    /** 컨설팅 분야 코드 */
    const [cnsltFldList, setCnsltFldList] = useState([]);
    /** 컨설팅 상태 코드 */
    const [cnsltSttsCdList, setCnsltSttsCd] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});

    useEffect(() => {
        if (isConnected) {
            console.log("WebSocket 연결됨 (ManagerSimpleCnslt.jsx)");
        } else {
            console.log("WebSocket 연결 안됨 (ManagerSimpleCnslt.jsx)");
        }
    }, [isConnected]);

    const setAlarmConfirm = async (userSn, type) => {
        if(isConnected) {
            if(type === "cancle"){
                sendMessageFn(
                    socket,
                    "private",
                    sessionUser.userSn,
                    userSn.toString(),
                    "컨설팅의뢰 취소",
                    "컨설팅의뢰가 취소되었습니다. 자세한 사유는 관리자에 문의 바랍니다."
                );
            }else if (type === "match"){
                sendMessageFn(
                    socket,
                    "private",
                    sessionUser.userSn,
                    userSn.toString(),
                    "컨설팅의뢰 요청",
                    "컨설팅의뢰 요청이 들어왔습니다."
                );
            } else {
                console.error("잘못된 type 값입니다.", type);
            }
        } else {
            console.log("WebSocket 연결이 열려 있지 않습니다.");
            Swal.fire("알림", "WebSocket 연결이 열려 있지 않습니다. 나중에 다시 시도해주세요.", "error");
        }
    };


    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getConsultingList(searchDto);
        }
    };

    //최초신청버튼
    const updateCnsltSttsCd = (cnsltAplySn) => {
        const url = "/consultingApi/setCnsltDtlSttsCd";

        Swal.fire({
            title:"승인하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        cnsltAplySn: cnsltAplySn
                    }),
                };

                EgovNet.requestFetch(url, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("승인되었습니다.");
                        if(resp.result.resultType === "matchComplete"){
                            console.log(resp.result.resultUserSn);
                            setAlarmConfirm(resp.result.resultUserSn,"match");
                        }
                        getConsultingList(searchDto);
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });

            }else{
                //취소
            }
        });
    };

    const cancleCnsltSttsCd = (cnsltAplySn, userSn) => {
        const url = "/consultingApi/cancleCnsltDtlSttsCd";

        Swal.fire({
            title:"취소하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        cnsltAplySn: cnsltAplySn
                    }),
                };

                EgovNet.requestFetch(url, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("취소되었습니다.");
                        getConsultingList(searchDto);
                        setAlarmConfirm(userSn,"cancle");
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });

            }else{
                //취소
            }
        });
    };

    //모달창
    const [searchCnsltantCondition, setSearchCnsltantCondition] = useState({
        pageIndex: 1,
        pageUnit:9999,
        searchType: "",
        searchVal: "",
    });
    const [cnsltantPaginationInfo, setCnsltantPaginationInfo] = useState({});
    const [selCnsltantList, setSelCnsltantList] = useState({});
    const searchCnsltTypeRef = useRef();
    const searchCnsltValRef = useRef();

    const modelOpenEvent = (e, cnsltAplySn) => {
        setSelCnsltantList({ cnsltAplySn: cnsltAplySn });
        getConsultantList(searchCnsltantCondition);
        document.getElementsByName("userCheck").forEach(function (item, index) {
            item.checked = false;
        });

        document.getElementById('modalDiv').classList.add("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'hidden';
        document.getElementsByTagName('body')[0].style.overFlow = 'hidden';
    }

    const modelCloseEvent = (e) => {
        setSearchCnsltantCondition({
            pageIndex: 1,
            pageUnit:9999,
            searchType: "",
            searchVal: "",
        })
        document.getElementById('modalDiv').classList.remove("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'visible';
        document.getElementsByTagName('body')[0].style.overFlow = 'visible';
    }

    const checkUserAllCheck = (e) => {
        let checkBoolean = e.target.checked;
        document.getElementsByName("userCheck").forEach(function (item, index) {
            item.checked = checkBoolean;
        });
    }

    const handleCheckboxChange = (e) => {
        const userSn = parseInt(e.target.value);

        if (e.target.checked) {
            setSelCnsltantList(prevState => ({
                ...prevState,
                cnslttUserSn : userSn
            }));
        } else {
            setSelCnsltantList(prevState => ({
                ...prevState,
                cnslttUserSn: null
            }));
        }
    };


    const activeUserEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getConsultantList(searchCnsltantCondition);
        }
    };

    const getConsultantList = useCallback(
        (searchCnsltantCondition) => {
          const consultantListUrl = "/consultingApi/getConsultantAdminList.do"
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchCnsltantCondition),
            };

            EgovNet.requestFetch(
                consultantListUrl,
                requestOptions,
                (resp) => {
                    setCnsltantPaginationInfo(resp.paginationInfo);
                    resp.result.consultantList.forEach(function (item, index) {
                        setCnsltantList(resp.result.consultantList);
                    });
                },
                function (resp) {

                }
            );


        },
        [cnsltantList, searchCnsltantCondition]
    );

    const cnslttSelectSubmit = () => {

        const updateCnslttToDtlUrl = "/consultingApi/updateCnsltt";

        Swal.fire({
            title: "컨설턴트를 등록하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if(result.isConfirmed){
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(selCnsltantList),
                };

                EgovNet.requestFetch(updateCnslttToDtlUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("승인되었습니다.");
                        getConsultingList(searchDto);
                        modelCloseEvent();
                        setAlarmConfirm(selCnsltantList.cnslttUserSn,"match");
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });

            }else{
                //취소
            }
        });
    }

    const dataExcelDownload = useCallback(() => {
        //let excelParams = searchDto;
        let excelParams = { ...searchDto };
        excelParams.pageIndex = 1;
        excelParams.pageUnit = paginationInfo?.totalRecordCount || 9999999999

        const requestURL = "/consultingApi/getConsultingList.do";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(excelParams)
        };
        EgovNet.requestFetch(
            requestURL,
            requestOptions,
            (resp) => {
                let rowDatas = [];
                if(resp.result.consultantList != null){
                    resp.result.consultantList.forEach(function (item, index) {
                        rowDatas.push(
                            {
                                number : resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index,
                                cnsltFldNm : item.cnsltFldNm || " ",
                                cnslttKornFlnm : item.cnslttKornFlnm || " ",
                                ogdpNm : item.ogdpNm || " ",
                                ttl : item.ttl || " ",
                                kornFlnm : item.kornFlnm || " ",
                                frstCrtDt : moment(item.frstCrtDt).format('YYYY-MM-DD'),
                                cnsltCount : "상태", // TODO : 상태 관련 코드 수정되면 여기도 수정
                                dgstfnCnt : item.dgstfnCnt > 0 ? "등록" : "미등록",
                            }
                        )
                    });
                }

                let sheetDatas = [{
                    sheetName : "컨설팅의뢰 관리",
                    header : ['번호', '자문분야', '컨설턴트', '소속', '제목', '신청자', '신청일', '상태', '만족도'],
                    row : rowDatas
                }];
                excelExport("컨설팅의뢰 관리", sheetDatas);
            }
        )
    });

    const getConsultingList = useCallback(
        (searchDto) => {
            const cnlstListURL = "/consultingApi/getConsultingList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                cnlstListURL,
                requestOptions,
                (resp) => {
                     let dataList = [];
                     dataList.push(
                         <tr>
                            <td colSpan={9}>검색된 결과가 없습니다.</td>
                         </tr>
                     );

                    resp.result.consultantList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화

                        dataList.push(
                            <tr key={item.cnsltAplySn}>
                                <td>{resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}</td>
                                <td>{item.cnsltFldNm}</td>
                                <td>{item.cnslttKornFlnm}</td>

                                <td>{item.ogdpNm}</td>
                                <td>
                                    <NavLink to={URL.MANAGER_CONSULTING_DETAIL}
                                             state = {{
                                                 cnsltAplySn : item.cnsltAplySn,
                                                 cnslttUserSn : item.cnslttUserSn,
                                                 userSn : item.userSn
                                             }}
                                    >
                                        {item.ttl}
                                    </NavLink>
                                </td>
                                <td>{item.kornFlnm || ""}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>
                                    {(() => {
                                        const containerStyle = { display: "inline-flex", gap: "8px", alignItems: "center" };


                                        switch (item.cnsltSttsCd) {
                                            case "10":
                                                return (
                                                    <div style={containerStyle}>
                                                        <span>최초신청</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                updateCnsltSttsCd(item.cnsltAplySn);
                                                            }}
                                                        >
                                                            승인
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                cancleCnsltSttsCd(item.cnsltAplySn, item.userSn);
                                                            }}
                                                        >
                                                            취소
                                                        </button>
                                                    </div>
                                                );
                                            case "12":
                                                return (
                                                    <div style={containerStyle}>
                                                        <span>컨설턴트지정</span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => modelOpenEvent(e, item.cnsltAplySn)}
                                                        >
                                                            등록
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                cancleCnsltSttsCd(item.cnsltAplySn, item.userSn);
                                                            }}
                                                        >
                                                            취소
                                                        </button>
                                                    </div>
                                                );
                                            case "200":
                                            case "201":
                                            case "999":
                                                return <span>{item.cnsltSttsCdNm}</span>;
                                            default:
                                                return (
                                                    <div style={containerStyle}>
                                                        <span>{item.cnsltSttsCdNm}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                cancleCnsltSttsCd(item.cnsltAplySn, item.userSn);
                                                            }}
                                                        >
                                                            취소
                                                        </button>
                                                    </div>
                                                );
                                        }
                                    })()}
                                </td>

                                <td>{item.dgstfnCnt > 0 ? "등록" : "미등록"}</td>
                            </tr>
                        );
                    });
                    setConsultingList(dataList);
                    setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {

                }
            )
        },
        [consultingList, searchDto]
    );



    useEffect(() => {
        getComCdList(14).then((data) => {
            setCnsltSttsCd(data);
        })
    }, []);

    useEffect(() => {
        getComCdList(10).then((data) => {
            setCnsltFldList(data);
        });
    }, []);

    useEffect(() => {
        getConsultingList(searchDto);
    }, []);


    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>컨설팅의뢰 관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="searchBox inputBox type1" style={{width:"55%"}}>
                                <p className="title">신청일</p>
                                <div className="input">
                                    <input type="date"
                                           id="startDt"
                                           name="startDt"
                                           style={{width:"47%"}}
                                           value={searchDto.startDt || ""}
                                           onChange={(e) =>
                                               setSearchDto({
                                                   ...searchDto,
                                                   startDt: moment(e.target.value).format('YYYY-MM-DD')
                                               })
                                           }
                                    /> ~&nbsp;
                                    <input type="date"
                                           id="endDt"
                                           name="endDt"
                                           style={{width:"47%"}}
                                           value={searchDto.endDt || ""}
                                           onChange={(e) =>
                                               setSearchDto({
                                                   ...searchDto,
                                                   endDt: moment(e.target.value).format('YYYY-MM-DD')
                                               })
                                           }
                                    />
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width:"25%"}}>
                                <p className="title">자문분야</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        name="cnsltFld"
                                        value={searchDto.cnsltFld || ""}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, cnsltFld: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        {cnsltFldList.map((item, index) => (
                                            <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width:"25%"}}>
                                <p className="title">상태</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        name="cnsltSttsCd"
                                        value={searchDto.cnsltSttsCd || ""}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, cnsltSttsCd: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        {cnsltSttsCdList.map((item, index) => (
                                            <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className="inputBox type1" style={{width:"25%"}}>
                                <p className="title">키워드</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        id="searchType"
                                        name="searchType"
                                        title="검색유형"
                                        ref={searchTypeRef}
                                        value={searchDto.searchType || ""}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchType: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="cnslttKornFlnm">컨설턴트</option>
                                        <option value="ogdpNm">소속</option>
                                        <option value="ttl">제목</option>
                                        <option value="kornFlnm">신청자</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1" style={{width:"30%"}}>
                                <label className="input">
                                    <input
                                        type="text"
                                        name="searchVal"
                                        defaultValue={searchDto.searchVal || ""}
                                        placeholder="검색어를 입력해주세요"
                                        ref={searchValRef}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchVal: e.target.value})
                                        }}
                                        onKeyDown={activeEnter}
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button type="button" className="refreshBtn btn btn1 gray"
                                    onClick={searchReset}
                            >
                                <div className="icon"></div>
                            </button>
                            <button type="button" className="searchBtn btn btn1 point"
                                    onClick={() => {
                                        getConsultingList({
                                            ...searchDto,
                                            pageIndex: 1,
                                            cnsltSe : 26,
                                        });
                                    }}
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">전체 : <span className="red">{paginationInfo.totalRecordCount}</span>건 페이지 : <span
                            className="red">{paginationInfo.currentPageNo}/{paginationInfo.totalPageCount}</span></p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn red" onClick={dataExcelDownload}>
                                <div className="icon"></div>
                                <span>엑셀 다운로드</span></button>
                        </div>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>전문가목록</caption>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>자문분야</th>
                                <th>컨설턴트</th>
                                <th>소속</th>
                                <th>제목</th>
                                <th>신청자</th>
                                <th>신청일</th>
                                <th>상태</th>
                                <th>만족도</th>
                            </tr>
                            </thead>
                            <tbody>
                            {consultingList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getConsultingList({
                                    ...searchDto,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                    </div>
                </div>
            </div>

            {/*모달창*/}
            <div className="programModal modalCon" id="modalDiv">
                <div className="bg"></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="top">
                            <h2 className="title">컨설턴트목록</h2>
                            <div className="close" onClick={modelCloseEvent}>
                                <div className="icon"></div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="cateWrap">
                                <form action="">
                                    <ul className="cateList">
                                        <li className="inputBox type1">
                                            <p className="title">자문 분야</p>
                                            <div className="itemBox">
                                                <select
                                                    className="selectGroup"
                                                    onChange={(e)=>{
                                                        setSearchCnsltantCondition({
                                                            ...searchCnsltantCondition,
                                                            cnsltFld: e.target.value
                                                        })
                                                    }}
                                                >
                                                    <option value="">전체</option>
                                                    {cnsltFldList.map((item, index) => (
                                                        <option value={item.comCd} key={item.comCdSn}>{item.comCdNm}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </li>
                                        <li className="inputBox type1">
                                            <p className="title">검색 구분</p>
                                            <div className="itemBox">
                                                <select
                                                    className="selectGroup"
                                                    ref={searchCnsltTypeRef}
                                                    onChange={(e) => {
                                                        setSearchCnsltantCondition({...searchCnsltantCondition, searchType: e.target.value})
                                                    }}
                                                >
                                                    <option value="kornFlnm">성명</option>
                                                    <option value="userId">아이디</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li className="searchBox inputBox type1">
                                            <label className="title" htmlFor="program_search">
                                                <small>검색어</small>
                                            </label>
                                            <div className="input">
                                                <input type="text"
                                                       name="program_search"
                                                       id="program_search" title="검색어"
                                                       defaultValue={searchCnsltantCondition.searchVal}
                                                       ref={searchCnsltValRef}
                                                       onChange={(e)=> {
                                                           setSearchCnsltantCondition({...searchCnsltantCondition, searchVal: e.target.value})
                                                       }}
                                                       onKeyDown={activeUserEnter}
                                                />
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="rightBtn">
                                        <button type="button" className="refreshBtn btn btn1 gray"
                                                onClick={() => {
                                                    setSearchCnsltantCondition({...searchCnsltantCondition, searchVal: ""})
                                                    document.getElementById('program_search').value = "";
                                                    getConsultantList({
                                                        pageIndex: 1,
                                                        pageUnit:9999,
                                                        searchType: "",
                                                        searchVal: "",
                                                        cnsltFld:""
                                                    });
                                                }}

                                        >
                                            <div className="icon"></div>
                                        </button>
                                        <button type="button" className="searchBtn btn btn1 point"
                                                onClick={() => {
                                                    getConsultantList({
                                                        ...searchCnsltantCondition,
                                                        pageIndex: 1,
                                                    });
                                                }}
                                        >
                                            <div className="icon"></div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="tableBox type1">
                                <table>
                                    <caption>컨설턴트목록</caption>
                                    <colgroup>
                                        <col width="50"/>
                                    </colgroup>
                                    <thead className="fixed-thead">
                                    <tr>
                                        <th style={{width:"50px"}}>
                                            {/*<label className="checkBox type2">
                                                <input type="checkbox"
                                                       name="userCheck"
                                                       className="customCheckBox"
                                                       onClick={checkUserAllCheck}
                                                />
                                            </label>*/}
                                            <p>선택</p>
                                        </th>
                                        <th><p>아이디</p></th>
                                        <th><p>자문분야</p></th>
                                        <th><p>성명</p></th>
                                    </tr>
                                    </thead>
                                    <tbody className="scrollable-tbody">
                                    {cnsltantList.length>0 && (
                                        <>
                                            {cnsltantList.map((item,index) => (
                                                <tr key={item.tblUser.userSn}>
                                                    <td style={{width:"50px"}}>
                                                        <label className="checkBox type2">
                                                            <input type="checkbox" name="userCheck"
                                                                   className="customCheckBox"
                                                                   checked={selCnsltantList.cnslttUserSn === item.tblUser.userSn}
                                                                   onChange={handleCheckboxChange}
                                                                   value={item.tblUser.userSn}
                                                                   />
                                                        </label>
                                                    </td>
                                                    <td>{item.tblUser.userId || ""}</td>
                                                    <td>{item.cnsltFldNm}</td>
                                                    <td>{item.tblUser.kornFlnm || ""}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pageWrap">
                                <EgovPaging
                                    pagination={cnsltantPaginationInfo}
                                    moveToPage={(passedPage) =>{
                                        getConsultantList({
                                            ...searchCnsltantCondition,
                                            pageIndex: passedPage
                                        });
                                    }}
                                />
                                <button type="button" className="writeBtn clickBtn"
                                        onClick={cnslttSelectSubmit}
                                ><span>등록</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*모달끝*/}

        </div>
    );
}

export default ManagerMatching;
