import React, {useState, useEffect, useCallback, useRef} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import CommonSubMenu from "@/components/CommonSubMenu";
import Swal from 'sweetalert2';
import AOS from "aos";
import EgovPaging from "@/components/EgovPaging";
import EgovUserPaging from "@/components/EgovUserPaging";
import moment from "moment/moment.js";
import {getSessionItem} from "../../utils/storage.js";

function MemberMyPageMsgList(props) {
    const sessionUser = getSessionItem("loginUser");
    const sessionUserSn = sessionUser?.userSn || null;

    const location = useLocation();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            searchType: "",
            searchVal : "",
            userSn : sessionUser ? sessionUser.userSn : ""
        }
    );

    const [userMsgList, setUserMsgList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getMsgList(searchDto);
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

        if(e.currentTarget.querySelector(".state .waiting")){
            setMsgConfirm(msgSn, e.currentTarget)
        }
    }

    const setMsgConfirm = (msgSn, e) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({msgSn : msgSn, mdfrSn : sessionUserSn})
        };
        EgovNet.requestFetch(
            "/userMsgApi/setMsgConfirm",
            requestOptions,
            (resp) => {
                if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                    e.querySelector(".state").innerHTML = `<p class="complete">확인</p>`
                    e.querySelector(".readDt").innerHTML = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                } else {
                    Swal.fire({
                        title: "오류가 발생했습니다.",
                        text: "관리자에게 문의해주세요.",
                    });
                }
            },
            function (resp) {

            }
        )
    }

    const getMsgList = useCallback(
        (searchDto) => {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                "/userMsgApi/getUserMsgList.do",
                requestOptions,
                (resp) => {
                    if(document.querySelectorAll(".contentRow ")){
                        document.querySelectorAll(".contentRow").forEach((el) => {
                            el.classList.remove("open");
                            el.style.display = "none"
                        });
                    }

                    let dataList = [];
                    dataList.push(
                        <tr>
                            <td colSpan="6">알림내역이 없습니다.</td>
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
                            >
                                <td>
                                    {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                </td>
                                <td className="title">{item.tblUserMsg.msgTtl}</td>
                                <td>{item.tblUser.kornFlnm}</td>
                                <td>{moment(item.tblUserMsg.frstCrtDt).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td className="state">
                                    {item.tblUserMsg.rcptnIdntyYn === "Y" ? (<p className="complete">확인</p>) : (
                                        <p className="waiting">미확인</p>)}
                                </td>
                                <td className="readDt">{item.tblUserMsg.mdfcnDt != null ? moment(item.tblUserMsg.mdfcnDt).format('YYYY-MM-DD HH:mm:ss') : ""}</td>
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
                    setUserMsgList(dataList);
                    setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {

                }
            )
        },
        []
    );

    useEffect(() => {
        getMsgList(searchDto);
        AOS.init();
    }, []);

    return (
        <div id="container" className="container faq board">
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
                                <div className="itemBox type2">
                                    <select
                                        id="bbsTypeNm"
                                        name="bbsTypeNm"
                                        title="검색유형"
                                        className="niceSelectCustom"
                                        ref={searchTypeRef}
                                        style={{backgroundColor: "#fff"}}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchType: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="msgTtl">제목</option>
                                        <option value="msgCn">내용</option>
                                        <option value="kornFlnm">보낸사람</option>
                                    </select>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input">
                                        <input
                                            name=""
                                            defaultValue={
                                                searchDto && searchDto.searchVal
                                            }
                                            ref={searchValRef}
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, searchVal: e.target.value})
                                            }}
                                            onKeyDown={activeEnter}
                                            placeholder="검색어를 입력해주세요."
                                        />
                                    </label>
                                </div>
                                <button type="button" className="searchBtn"
                                        onClick={() => {
                                            getMsgList({
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
                    <div className="board_list userMsgList" data-aos="fade-up" data-aos-duration="1500">
                        <table>
                            <caption>알림 목록</caption>
                            <thead>
                            <tr>
                                <th className="th1">번호</th>
                                <th>제목</th>
                                <th className="th1">보낸사람</th>
                                <th className="th2">수신일시</th>
                                <th className="th1">확인여부</th>
                                <th className="th2">확인일시</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userMsgList}
                            </tbody>
                        </table>
                    </div>

                    <div className="pageWrap">
                        <EgovUserPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getMsgList({
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

export default MemberMyPageMsgList;
