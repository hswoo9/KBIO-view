import React, {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate, NavLink, useLocation, Link} from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";
import Swal from "sweetalert2";
import CommonEditor from "@/components/CommonEditor";
import moment from "moment";
import {getComCdList} from "../../../components/CommonComponents.jsx";
import EgovPaging from "../../../components/EgovPaging.jsx";
import ManagerCnslttCnsltDtl from "./ManagerCnslttCnsltDtl.jsx";

function ManagerCnslttCnsltList({ cnsltSe, userSn }) {

    const location = useLocation();
    const searchTypeRef = useRef();
    const searchValRef = useRef();


    const [searchDto, setSearchDto] = useState({
        pageIndex: 1,
        cnsltSe: cnsltSe ,
        userSn: userSn,
        searchType: "cnslttSn"
    });
    const [consultingList, setConsultingList] = useState([]);
    /** 컨설팅 분야 코드 */
    const [cnsltFldList, setCnsltFldList] = useState([]);
    /** 컨설팅 상태 코드 */
    const [cnsltSttsCdList, setCnsltSttsCd] = useState([]);

    const [paginationInfo, setPaginationInfo] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const handleBack = () => {
        setSelectedItem(null);
    };

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getConsultingList(searchDto);
        }
    };

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
                                <td>{index + 1}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                                <td>{item.kornFlnm || ""}</td>
                                <td style={{cursor:"pointer"}} onClick={() => handleItemClick(item)}>
                                    {/*<NavLink to={URL.MANAGER_CONSULTING_DETAIL}
                                             state = {{
                                                 cnsltAplySn : item.cnsltAplySn,
                                                 cnslttUserSn : item.cnslttUserSn,
                                                 userSn : item.userSn
                                             }}
                                    >

                                    </NavLink>*/}
                                    {item.ttl}
                                </td>
                                <td>
                                    {(() => {
                                        switch (item.cnsltSttsCd) {
                                            case "101":
                                                return "답변대기";
                                            case "102":
                                                return "답변완료";
                                            case "200":
                                                return "처리완료";
                                            case "999":
                                                return "취소";
                                            default:
                                                return item.cnsltSttsCd;
                                        }
                                    })()}
                                </td>
                                <td>{item.dgstfnArtcl || "미등록"}</td>
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


    return(
        <div>
            {selectedItem ? (
               /* <div>{/!*상세 컴퍼넌트가 들어갈 곳*!/}</div>*/
                <ManagerCnslttCnsltDtl item={selectedItem} onBack={handleBack}/>
            ) : (
        <div>
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
                        <p className="title">상태</p>
                        <div className="itemBox">
                            <select
                                className="selectGroup"
                                name="cnsltSttsCd"
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
                                defaultValue={searchDto.searchVal}
                                placeholder=""
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
                    <button type="button" className="refreshBtn btn btn1 gray">
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
                <div className="topBox"
                    style={{marginTop:"20px"}}
                >
                    <p className="resultText">전체 : <span className="red">{paginationInfo.totalRecordCount}</span>건 페이지 : <span
                        className="red">{paginationInfo.currentPageNo}/{paginationInfo.totalPageCount}</span></p>
                    <div className="rightBox">
                        <button type="button" className="btn btn2 downBtn red">
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
                            <th>신청일</th>
                            <th>신청자</th>
                            <th>제목</th>
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

                    <Link
                        to={URL.MANAGER_CONSULTING_EXPERT}
                    >
                        <button type="button" className="clickBtn black"><span>목록</span></button>
                    </Link>
                </div>
            </div>
            </div>
                )}
        </div>

    );



}
export default ManagerCnslttCnsltList;