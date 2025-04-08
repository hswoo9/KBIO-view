import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import { getSessionItem } from "@/utils/storage";
import URL from "@/constants/url";
import CommonSubMenu from "@/components/CommonSubMenu";
import EgovUserPaging from "@/components/EgovUserPaging";
import 'moment/locale/ko';
import * as ComScript from "@/components/CommonScript";

function MouList() {
    const hostName = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "133.186.250.158" : "133.186.146.192";
    const userSn = getSessionItem("userSn");
    const location = useLocation();
    const navigate = useNavigate();
    const userStatusRef = useRef();
    const searchTypeRef = useRef();
    const searchValRef = useRef();
    const [paginationInfo, setPaginationInfo] = useState({});
    const [mouList, setMouList] = useState([]);
    const [searchDto, setSearchDto] = useState({
        pageIndex: 1,
        searchType: "",
        searchVal: "",
    });

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getMouList(searchDto);
        }
    };

    const getMouList = useCallback((searchDto) => {
        const mouListUrl = "/introduceApi/getMouList.do";
        const requestOptions = {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(
            mouListUrl,
            requestOptions,
            (resp) => {
                setPaginationInfo(resp.paginationInfo);
                const dataList = resp.result.getMouList.map((item) => (
                    <tr
                        key={item.mouSn}
                        onClick={() => {
                            navigate(
                                { pathname: URL.INTRODUCE_MOU_DETAIL },
                                {
                                    state: {
                                        mouSn: item.mouSn,
                                        menuSn: location.state?.menuSn,
                                        menuNmPath: location.state?.menuNmPath,
                                        thisMenuSn: location.state?.thisMenuSn,
                                    },
                                }
                            );
                        }}
                    >
                        <td className="cate" style={{width:"20%"}}>
                            <p>{item.mouClsfNm}</p>
                        </td>
                        <td style={{width:"20%"}}>
                            <figure>
                                    <img
                                        src="/src/assets/images/user_business_overview_box04_icon01.png"
                                        width="44"
                                        height="44"
                                    />
                            </figure>
                        </td>
                        <td className="title" style={{width:"60%"}}>
                            <div className="text">
                                <p>{item.mouNm}</p>
                            </div>
                            <ul className="bot">
                                <li>
                                    <p className="left">가입년도</p>
                                    <strong>{item.mouJoinYmd ? new Date(item.mouJoinYmd).toLocaleDateString() : '-'}</strong>
                                </li>
                            </ul>
                        </td>
                        <td className="satisfaction"></td>
                    </tr>
                ));
                setMouList(dataList);
            },
            (error) => {
                console.error(error);
            }
        );
    }, [mouList, searchDto]);

    useEffect(() => {
        getMouList(searchDto);
    }, []);

    return (
        <div id="container" className="container resident">
            <div className="inner">
                <CommonSubMenu />
                <div className="inner2">
                    <div className="searchFormWrap type1" data-aos="fade-up" data-aos-duration="1500">
                        <form>
                            <div className="totalBox">
                                <div className="total">
                                    <p>총 <strong>{paginationInfo.totalRecordCount}</strong>건</p>
                                </div>
                            </div>
                            <div className="searchBox">
                                <div className="itemBox type2">
                                    <select
                                        className="niceSelectCustom"
                                        id="searchType"
                                        name="searchType"
                                        title="검색유형"
                                        ref={searchTypeRef}
                                        onChange={(e) => setSearchDto({ ...searchDto, searchType: e.target.value })}
                                    >
                                        <option value="">전체</option>
                                        <option value="mouNm">기업명</option>
                                    </select>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input" htmlFor="searchVal">
                                        <input
                                            type="text"
                                            name="searchVal"
                                            defaultValue={searchDto.searchVal}
                                            ref={searchValRef}
                                            onChange={(e) => setSearchDto({ ...searchDto, searchVal: e.target.value })}
                                            onKeyDown={activeEnter}
                                        />
                                    </label>
                                </div>
                                <div className="rightBtn">
                                    <button
                                        type="button"
                                        className="searchBtn btn btn1 point"
                                        onClick={() => getMouList({ ...searchDto, pageIndex: 1 })}
                                    >
                                        <div className="icon"></div>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="board_list" data-aos="fade-up" data-aos-duration="1500">
                        <table>
                            <caption>MOU</caption>
                            <thead>
                            <tr>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {mouList.length > 0 ? mouList : (
                                <tr>
                                    <td colSpan="4">데이터가 없습니다.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovUserPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getMouList({ ...searchDto, pageIndex: passedPage });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MouList;
