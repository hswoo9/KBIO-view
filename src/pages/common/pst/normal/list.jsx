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
import EgovUserPaging from "@/components/EgovUserPaging";
import AOS from "aos";
import moment from "moment/moment.js";
import { getSessionItem } from "@/utils/storage";

function commonPstList(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();
    const bbsSn = location.state?.bbsSn || null;
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            bbsSn : bbsSn,
            searchType: "",
            searchVal : "",
            userSn : sessionUser ? sessionUser.userSn : "",
            pageUnit : 10
        }
    );

    const [authrt, setAuthrt] = useState({
        inqAuthrt : "N",
        wrtAuthrt : "N",
        mdfcnAuthrt : "N",
        delAuthrt : "N",
    })
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
                    console.log(resp.result.authrt)
                    setAuthrt(resp.result.authrt)
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

                        if(sessionUser){
                            if(sessionUser.userSe == "ADM"){
                                rlsYnFlag = true;
                            }

                            if(sessionUser.userSn == item.creatrSn){
                                rlsYnFlag = true;
                                pstSn = item.pstSn;
                            }
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
                            <tr key={item.pstSn}
                                className={item.upendNtcYn == "Y" ? "notice" : ""}
                            >
                                <td
                                    className={item.upendNtcYn == "Y" ? "notice" : ""}
                                >
                                    {item.upendNtcYn == "Y" ?
                                        (<p>공지</p>) :
                                        (<p>
                                            {resp.paginationInfo.totalRecordCount - (resp.paginationInfo.currentPageNo - 1) * resp.paginationInfo.pageSize - index}
                                        </p>)}
                                </td>
                                {resp.result.bbs.pstCtgryYn == "Y" && (
                                    <td className="cate">
                                        {item.pstClsfNm}
                                    </td>
                                )}
                                <td className="title">
                                    <div className="text"
                                         onClick={() => {
                                             resp.result.authrt.inqAuthrt == "Y" ? pstDetailHandler(item, rlsYnFlag) : Swal.fire("읽기 권한이 없습니다.")
                                         }}
                                    >
                                        <p>{item.pstTtl}</p>
                                        {item.fileCnt != 0 ? (<i className="file"></i>) : ""}
                                    </div>
                                    <div className="bot">
                                        <p className="date">
                                            {moment(item.frstCrtDt).format('YYYY-MM-DD')}
                                        </p>
                                        <p className="name">
                                            {item.rlsYn == "Y" ? (rlsYnFlag ? item.kornFlnm : item.kornFlnm.replaceAll(/./g, '*')) : item.kornFlnm}
                                        </p>
                                    </div>
                                </td>
                                <td>{item.pstInqCnt}</td>
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
        setSearchDto({
            ...searchDto,
            bbsSn: bbsSn
        });
    }, [bbsSn]);
    useEffect(() => {
        getPstList(searchDto);
    }, [searchDto.bbsSn]);

    useEffect(() => {
        getPstList(searchDto);
        AOS.init();
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

    const modalOpenEvent = () => {
        document.getElementById('modalDiv').classList.add("open");
        document.getElementsByTagName('html')[0].style.overFlow = 'hidden';
        document.getElementsByTagName('body')[0].style.overFlow = 'hidden';
    }

    const modalCloseEvent = () => {
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
            { pathname: URL.COMMON_PST_NORMAL_DETAIL },
            { state: {
                pstSn:  pstSn,
                menuSn : location.state?.menuSn,
                menuNmPath : location.state?.menuNmPath,
            } },
            { mode:  CODE.MODE_READ}
        );
    }

    return (
        <div id="container" className="container notice board">
            <div className="inner" key={bbsSn}>
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="searchFormWrap type1" data-aos="fade-up" data-aos-duration="1500">
                        <form>
                            <div className="totalBox">
                                <div className="total"><p>총 <strong>{paginationInfo.totalRecordCount}</strong>건</p></div>
                            </div>
                            <div className="searchBox">
                                <div className="itemBox type2">
                                    <select
                                        className="niceSelectCustom"
                                        onChange={(e) =>
                                            setSearchDto({
                                                ...searchDto,
                                                pageUnit: e.target.value
                                            })
                                        }
                                    >
                                        <option value="10" selected>10건</option>
                                        <option value="20">20건</option>
                                        <option value="50">50건</option>
                                        <option value="100">100건</option>
                                    </select>
                                </div>
                                <div className="itemBox type2">
                                    <select
                                        id="bbsTypeNm"
                                        name="bbsTypeNm"
                                        title="검색유형"
                                        className="niceSelectCustom"
                                        ref={searchTypeRef}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchType: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="pstTtl">제목</option>
                                        <option value="pstCn">내용</option>
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
                                            getPstList({
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
                            <caption>게시글목록</caption>
                            <thead>
                            <tr>
                                <th className="th1">번호</th>
                                {bbs.pstCtgryYn == "Y" && (
                                    <th className="th1">분류</th>
                                )}
                                <th></th>
                                <th className="th1">조회수</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pstList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovUserPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getPstList({
                                    ...searchDto,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                        {/*{authrt.wrtAuthrt == "Y" && (
                            <NavLink
                                to={URL.COMMON_PST_NORMAL_CREATE}
                                state={{bbsSn: bbs.bbsSn}}
                                mode={CODE.MODE_CREATE}
                                style={{float:'right'}}
                            >
                                <button type="button" className="clickBtn writeBtn"><span>등록</span></button>
                            </NavLink>
                        )}*/}
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
