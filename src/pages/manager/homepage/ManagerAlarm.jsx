import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as ComScript from "@/components/CommonScript";
import ManagerLeftNew from "@/components/manager/ManagerLeftHomepage";
import EgovPaging from "@/components/EgovPaging";
import moment from "moment/moment.js";
import Swal from 'sweetalert2';
import { getComCdList } from "@/components/CommonComponents";
import { getSessionItem } from "@/utils/storage";
import {sendMessageFn, useWebSocket} from "@/utils/WebSocketProvider";

function ManagerOrganizationChartList(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const sessionUser = getSessionItem("loginUser");
    const { socket, isConnected } = useWebSocket();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            searchType: "",
            searchVal: "",
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({});
    const [msgList, setMsgList] = useState([]);

    const searchReset = () => {
        setSearchDto({
            ...searchDto,
            searchType: "",
            searchVal: ""
        })
    }

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getUserMsgList(searchDto);
        }
    };

    const toggleLi = (e) => {
        const msgSn = e.currentTarget.getAttribute("msgsn");
        const msgContentRow = document.querySelector(".msg_" + msgSn);

        document.querySelectorAll(".contentRow").forEach((el) => {
            if (el !== msgContentRow) {
                el.classList.remove("open");
                el.style.display = "none";
            }
        });

        if(msgContentRow.classList.contains("open")){
            msgContentRow.style.display = "none"
            msgContentRow.classList.remove("open");
        }else{
            msgContentRow.style.display = ""
            msgContentRow.classList.add("open");
        }
    }

    const getUserMsgList = useCallback(
        (searchDto) => {
            const requestURL = "/userMsgAdminApi/getUserMsgList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                requestURL,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);

                    if(document.querySelectorAll(".contentRow ")){
                        document.querySelectorAll(".contentRow").forEach((el) => {
                            el.classList.remove("open");
                            el.style.display = "none"
                        });
                    }

                    let dataList = [];
                    dataList.push(
                        <tr key="noData">
                            <td colSpan="6" key="noData">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.userMsgList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화
                        dataList.push(
                            <tr
                                key={item.tblUserMsg.msgSn}
                                onClick={toggleLi}
                                msgsn={item.tblUserMsg.msgSn}
                                className={`toggleLi`}
                                style={{cursor: "pointer"}}
                            >
                                <td>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td>{item.tblUserMsg.msgTtl}</td>
                                <td>{item.rcptnUser.kornFlnm}</td>
                                <td>{moment(item.tblUserMsg.frstCrtDt).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td className="state">
                                    {item.tblUserMsg.rcptnIdntyYn === "Y" ? (<p className="complete">확인</p>) : (
                                        <p className="waiting">미확인</p>)}
                                </td>
                                <td className="readDt">{item.tblUserMsg.mdfcnDt != null ? moment(item.tblUserMsg.mdfcnDt).format('YYYY-MM-DD HH:mm:ss') : ""}</td>
                                <td>{item.dsptchUser.kornFlnm}</td>
                            </tr>
                        );

                        dataList.push(
                            <tr className={`msg_${item.tblUserMsg.msgSn} contentRow`} key={`msgCn${item.tblUserMsg.msgSn}`} style={{display:"none", cursor:"text"}}>
                                <td colSpan="6" className="title">
                                    {item.tblUserMsg.msgCn}
                                </td>
                            </tr>
                        )
                    });
                    setMsgList(dataList);
                },
                function (resp) {

                }
            )
        },
        [msgList, searchDto]
    );

    useEffect(() => {
        getUserMsgList(searchDto)
    }, []);

    const openAlarmSend = () => {
        document.querySelectorAll(".alarmSend").forEach((element) => {
            msgReset()
            if (element.style.display === "block") {
                element.style.maxHeight = "0px";
                element.style.opacity = "0";
                setTimeout(() => {
                    element.style.display = "none";
                }, 300); // 애니메이션이 끝난 후 display: none 적용
            } else {
                element.style.display = "block";
                element.style.maxHeight = "0px"; // 초기 높이 설정
                element.style.opacity = "0"; // 초기 투명도 설정

                setTimeout(() => {
                    element.style.maxHeight = element.scrollHeight + "px";
                    element.style.opacity = "1";
                }, 10); // display가 적용된 후 애니메이션 실행
            }
        });
    }

    const [msg, setMsg] = useState({});
    const [isRcptnUserEnabled, setIsRcptnUserEnabled] = useState(false);
    const [userPaginationInfo, setUserPaginationInfo] = useState({});
    const [userList, setUserList] = useState([]);
    const [searchUserCondition, setSearchUserCondition] = useState({
        pageIndex: 1,
        pageUnit:9999,
        searchType: "",
        searchVal: "",
    });
    const [selUserList, setSelUserList] = useState([])

    const modelOpenEvent = (e) => {
        getUserList(searchUserCondition);
        document.getElementsByName("userCheck").forEach(function (item, index) {
            item.checked = false;
        });

        document.getElementById('modalDiv').classList.add("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'hidden';
        document.getElementsByTagName('body')[0].style.overFlow = 'hidden';
    }

    const modelCloseEvent = (e) => {
        setSearchUserCondition({
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

    const activeUserEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getUserList(searchUserCondition);
        }
    };

    const getUserList = useCallback(
        (searchUserCondition) => {
            const normalMemberListURL = "/memberApi/getNormalMemberList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchUserCondition),
            };

            EgovNet.requestFetch(
                normalMemberListURL,
                requestOptions,
                (resp) => {
                    setUserPaginationInfo(resp.paginationInfo);
                    resp.result.getNormalMemberList.forEach(function (item, index) {
                        setUserList(resp.result.getNormalMemberList);
                    });
                },
                function (resp) {

                }
            );
        },
        [userList, searchUserCondition]
    );

    const userSelectSubmit = () => {
        let selUserArr = [];
        document.getElementsByName("userCheck").forEach(function (item, index){
            if(index > 0){
                if(item.checked){
                    const userData = userList.find( i => String(i.userSn) === String(item.value));
                    selUserArr.push({
                        userSn : parseInt(userData.userSn),
                        kornFlnm : userData.kornFlnm,
                    });
                }
            }
        });

        setSelUserList(selUserArr);
        modelCloseEvent();
    }

    const handleCheckboxChange = (e) => {
        const userSn = parseInt(e.target.value);

        if (e.target.checked) {
            setSelUserList(prevState => [
                ...prevState,
                { userSn, kornFlnm: userList.find(user => user.userSn === userSn).kornFlnm }
            ]);
        } else {
            setSelUserList(prevState => prevState.filter(user => user.userSn !== userSn));
        }
    };

    const setAlarmConfirm = async () => {
        if (!msg.sendType) {
            Swal.fire("발송유형을 선택해주세요.");
            return;
        }

        if(msg.sendType != "all"){
            if (selUserList.length == 0) {
                Swal.fire("수신자를 선택해주세요.");
                return;
            }
        }

        if (!msg.msgTtl) {
            Swal.fire("제목을 입력해주세요.");
            return;
        }

        if (!msg.msgCn) {
            Swal.fire("내용을 입력해주세요.");
            return;
        }

        Swal.fire({
            title: "알림을 발송하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "발송",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                if (isConnected) {
                    sendMessageFn(
                        socket,
                        msg.sendType,
                        sessionUser.userSn,
                        selUserList.map(user => user.userSn).join(","),
                        msg.msgTtl,
                        msg.msgCn,
                    );

                    msgReset()
                } else {
                    console.log("WebSocket 연결이 열려 있지 않습니다.");
                }
            } else {

            }
        });
    };

    const msgReset = () => {
        document.getElementById("sendType").selectedIndex = 0;
        setIsRcptnUserEnabled(false);
        document.getElementById("msgTtl").value = ""
        document.getElementById("msgCn").value = ""

        setSelUserList([])
        setMsg({})
    }

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew/>
            <div className="inner">
                <h2 className="pageTitle"><p>알림관리</p></h2>
                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">검색유형</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        onChange={(e) =>
                                            setSearchDto({...searchDto, searchType: e.target.value})
                                        }
                                        value={searchDto.searchType}
                                    >
                                        <option value="">전체</option>
                                        <option value="msgTtl">제목</option>
                                        <option value="msgCn">내용</option>
                                        <option value="dsptchUser">발신자</option>
                                        <option value="rcptnUser">수신자</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1">
                                <p className="title">검색어</p>
                                <label className="input">
                                    <input
                                        type="text"
                                        id="search"
                                        name="search"
                                        placeholder="검색어를 입력해주세요"
                                        value={searchDto.searchVal}
                                        onChange={(e) =>
                                            setSearchDto({
                                                ...searchDto,
                                                searchVal: e.target.value
                                            })
                                        }
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
                                    onClick={(e) => {
                                        getUserMsgList({
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
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">전체 : <span className="red">{paginationInfo.totalRecordCount}</span>건
                            페이지 : <span
                                className="red">{paginationInfo.currentPageNo}/{paginationInfo.totalPageCount}</span>
                        </p>
                        <div className="rightBox">
                            <button type="button" className="btn btn2 downBtn point" onClick={openAlarmSend}>
                                <span>알림 발송</span>
                            </button>
                        </div>
                    </div>

                    <h2 className="pageTitle alarmSend" style={{display:"none"}}>
                        <p>알림발송</p>
                    </h2>
                    <div className="infoWrap alarmSend" style={{display:"none"}}>
                        <ul className="inputWrap">
                            <li className="inputBox type1">
                                <p className="title">발송유형</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        id="sendType"
                                        style={{width: "10%"}}
                                        onChange={(e) => {
                                            setMsg({...msg, sendType: e.target.value})
                                            if (e.target.value == "private") {
                                                setIsRcptnUserEnabled(true);
                                            } else {
                                                setIsRcptnUserEnabled(false);
                                            }
                                        }}
                                    >
                                        <option value="">선택</option>
                                        <option value="all">전체알림</option>
                                        <option value="private">개인알림</option>
                                    </select>

                                    <label className="input">
                                        <input
                                            type="text"
                                            id="search"
                                            name="search"
                                            value={selUserList.map(user => user.kornFlnm).join(", ")}
                                            disabled={!isRcptnUserEnabled}
                                            readOnly
                                            onClick={modelOpenEvent}
                                        />
                                    </label>
                                </div>
                            </li>
                            <li className="inputBox type1 width1">
                                <label className="title essential" htmlFor="msgTtl">
                                    <small>제목</small>
                                </label>
                                <div className="input">
                                    <input
                                        type="text"
                                        name="msgTtl"
                                        title="제목"
                                        placeholder="제목을 입력해주세요."
                                        id="msgTtl"
                                        onChange={(e) => {
                                            setMsg({...msg, msgTtl: e.target.value})
                                        }}
                                    />
                                </div>
                            </li>
                            <li className="inputBox type1 width1">
                                <label className="title essential" htmlFor="msgCn">
                                    <small>내용</small>
                                </label>
                                <div className="input">
                                    <input
                                        type="text"
                                        name="msgCn"
                                        placeholder="내용을 입력해주세요."
                                        title="내용"
                                        id="msgCn"
                                        onChange={(e) => {
                                            setMsg({...msg, msgCn: e.target.value})
                                        }}
                                    />
                                </div>
                            </li>
                        </ul>

                        <button type="button" className="clickBtn point" style={{float: "right", marginTop: "10px"}}
                            onClick={setAlarmConfirm}>
                            <span>발송</span>
                        </button>
                    </div>


                    <div className="tableBox type1">
                        <table>
                            <caption>알림목록</caption>
                            <colgroup>
                                <col width="50"/>
                                <col/>
                                <col width="100"/>
                                <col width="200"/>
                                <col width="80"/>
                                <col width="200"/>
                                <col width="80"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>수신자</th>
                                <th>수신일시</th>
                                <th>확인여부</th>
                                <th>확인일시</th>
                                <th>발신자</th>
                            </tr>
                            </thead>
                            <tbody>
                            {msgList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getUserMsgList({
                                    ...searchDto,
                                    pageIndex: passedPage
                                })
                            }}
                        />
                    </div>
                </div>
            </div>


            <div className="programModal modalCon" id="modalDiv">
                <div className="bg"></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="top">
                            <h2 className="title">사용자목록</h2>
                            <div className="close" onClick={modelCloseEvent}>
                                <div className="icon"></div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="cateWrap">
                                <form action="">
                                    <ul className="cateList">
                                        <li className="inputBox type1">
                                            <p className="title">검색 구분</p>
                                            <div className="itemBox">
                                                <select className="selectGroup">
                                                    <option value="0">이름</option>
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
                                                       value={searchUserCondition.searchVal}
                                                       onChange={(e) => {
                                                           setSearchUserCondition({
                                                               ...searchUserCondition,
                                                               searchVal: e.target.value
                                                           })
                                                       }}
                                                       onKeyDown={activeUserEnter}
                                                />
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="rightBtn">
                                        <button type="button" className="refreshBtn btn btn1 gray"
                                                onClick={() => {
                                                    setSearchUserCondition({...searchUserCondition, searchVal: ""})
                                                    document.getElementById('program_search').value = "";
                                                    getUserList({
                                                        pageIndex: 1,
                                                        pageUnit : 9999
                                                    });
                                                }}
                                        >
                                            <div className="icon"></div>
                                        </button>
                                        <button type="button" className="searchBtn btn btn1 point"
                                                onClick={() => {
                                                    getUserList({
                                                        ...searchUserCondition,
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
                                    <caption>사용자목록</caption>
                                    <colgroup>
                                        <col width="50"/>
                                    </colgroup>
                                    <thead className="fixed-thead">
                                        <tr>
                                            <th style={{width:"50px"}}>
                                                <label className="checkBox type2">
                                                    <input type="checkbox"
                                                           name="userCheck"
                                                           className="customCheckBox"
                                                           onClick={checkUserAllCheck}
                                                    />
                                                </label>
                                            </th>
                                            <th><p>아이디</p></th>
                                            <th><p>성명</p></th>
                                        </tr>
                                    </thead>
                                    <tbody className="scrollable-tbody">
                                    {userList.length > 0 && (
                                        <>
                                            {userList.map((item, index) => (
                                                <tr key={item.userSn}>
                                                    <td style={{width:"50px"}}>
                                                        <label className="checkBox type2">
                                                            <input type="checkbox" name="userCheck"
                                                                   className="customCheckBox"
                                                                   checked={selUserList.some(user => user.userSn === item.userSn)}
                                                                   onChange={handleCheckboxChange}
                                                                   value={item.userSn}/>
                                                        </label>
                                                    </td>
                                                    <td>{item.userId}</td>
                                                    <td>{item.kornFlnm}</td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pageWrap">
                                <EgovPaging
                                    pagination={userPaginationInfo}
                                    moveToPage={(passedPage) => {
                                        getUserList({
                                            ...searchUserCondition,
                                            pageIndex: passedPage
                                        });
                                    }}
                                />
                                <button type="button" className="writeBtn clickBtn"
                                        onClick={userSelectSubmit}
                                ><span>추가</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerOrganizationChartList;
