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
import {getSessionItem} from "../../../../utils/storage.js";

function commonPstList(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            pstClsf : 10,
            bbsSn : location.state?.bbsSn,
            searchType: "",
            searchVal : "",
            userSn : sessionUser ? sessionUser.userSn : ""
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
    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getPstList(searchDto);
        }
    };

    const toggleLi = (e) => {
        if(e.currentTarget.closest("li").classList.contains("open")){
            e.currentTarget.closest("li").classList.remove("open");
        }else{
            e.currentTarget.closest("li").classList.add("open");
        }
    }

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
                    if(document.querySelectorAll(".listBox li")){
                        document.querySelectorAll(".listBox li").forEach((el) => {
                            el.classList.remove("open");
                        });
                    }

                    setAuthrt(resp.result.authrt)
                    setBbs(resp.result.bbs);
                    let dataList = [];
                    dataList.push(
                        <li key="no_data">
                            <a>
                                <div className="questionBox">
                                    <i className="point">Q</i>
                                    <p className="text">
                                        검색된 결과가 없습니다.
                                    </p>
                                </div>
                            </a>
                        </li>
                    );

                    resp.result.pstList.forEach(function (item, index) {
                        if (index === 0) dataList = []; // 목록 초기화
                        dataList.push(
                            <li key={item.pstSn}
                                onClick={toggleLi}
                                className="toggleLi"
                            >
                                <a style={{cursor: "pointer"}}>
                                    <div className="questionBox">
                                        <i className="point">Q</i>
                                        <p className="text">{item.pstTtl}</p>
                                    </div>
                                    <div className="answerBox" dangerouslySetInnerHTML={{__html: item.pstCn}}>
                                    </div>
                                </a>
                            </li>
                        );
                    });
                    setPstList(dataList);
                    setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {

                }
            )
        },
        [pstList, searchDto]
    );

    useEffect(() => {
        getPstList(searchDto);
        AOS.init();
    }, [searchDto]);

    const moveToPstDetail = (pstSn) => {
        navigate(
            { pathname: URL.COMMON_PST_FAQ_DETAIL },
            { state: {
                    pstSn:  pstSn,
                    menuSn : location.state?.menuSn,
                    menuNmPath : location.state?.menuNmPath,
                    thisMenuSn : location.state?.thisMenuSn,
                } },
            { mode:  CODE.MODE_READ}
        );
    }

    return (
        <div id="container" className="container faq board">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="searchFormWrap type2" data-aos="fade-up" data-aos-duration="1500">
                        <form>
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
                                        <option value="pstTtl">제목</option>
                                        <option value="pstCn">내용</option>
                                    </select>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input">
                                        <input
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
                                            placeholder="검색어를 입력해주세요."
                                        />
                                    </label>
                                </div>
                                <button type="button" className="searchBtn"
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
                            <div className="tabBox type1">
                                <div className="bg hover"></div>
                                <ul className="list">
                                    <li className={searchDto.pstClsf == "10" ? "active" : ""}>
                                        <a className="cursorTag" onClick={() => {
                                            setSearchDto({...searchDto, pageIndex: 1, pstClsf : "10"})
                                        }}>
                                            <span>사이트</span>
                                        </a>
                                    </li>
                                    <li className={searchDto.pstClsf == "11" ? "active" : ""}>
                                        <a className="cursorTag" onClick={() => {
                                            setSearchDto({...searchDto, pageIndex: 1, pstClsf : "11"})
                                        }}>
                                            <span>기관</span>
                                        </a>
                                    </li>
                                    <li className={searchDto.pstClsf == "12" ? "active" : ""}>
                                        <a className="cursorTag" onClick={() => {
                                            setSearchDto({...searchDto, pageIndex: 1, pstClsf : "12"})
                                        }}>
                                            <span>컨설팅</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </div>
                    <ul className="listBox" data-aos="fade-up" data-aos-duration="1500">
                        {pstList}
                    </ul>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default commonPstList;
