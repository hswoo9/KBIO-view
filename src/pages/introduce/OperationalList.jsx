import React, {useState, useEffect, useCallback, useRef} from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import URL from "@/constants/url";
import CommonSubMenu from "@/components/CommonSubMenu";
import AOS from "aos";
import EgovUserPaging from "@/components/EgovUserPaging";
import * as ComScript from "@/components/CommonScript";

function OperationalList() {
    const userStatusRef = useRef();
    const searchTypeRef = useRef();
    const searchValRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();
    const userSn = getSessionItem("userSn");
    const [paginationInfo, setPaginationInfo] = useState({});
    const [operationalList, setAuthorityList] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [searchDto, setSearchDto] = useState({
        category: "",
        keywordType: "",
        keyword: "",
        pageIndex: 1,
        searchType: "",
        searchVal : "",
    });

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getOperationalList(searchDto);
        }
    };

    const getOperationalList = useCallback(
        (searchDto) => {
            const operationalListUrl = "/introduceApi/getOperationalList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                operationalListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];

                    resp.result.getOperationalList.forEach(function (item, index) {
                        dataList.push(
                            <tr key={item.tblMvnEnt.mvnEntSn}
                                onClick={ () => {
                                    navigate(
                                        { pathname: URL.INTRODUCE_OPERATIONAL_DETAIL },
                                        { state: {
                                                mvnEntSn: item.tblMvnEnt.mvnEntSn,
                                                menuSn : location.state?.menuSn,
                                                menuNmPath : location.state?.menuNmPath,
                                                thisMenuSn : location.state?.thisMenuSn,
                                            } },
                                    );
                                }}
                            >
                                <td className="cate">
                                    <p>{item.entClsfNm}</p>
                                </td>
                                <td>
                                    <figure>
                                        {item.tblComFile != null ? (
                                            <img
                                                src={`http://133.186.250.158${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`} width="44" height="44"
                                                alt={`${item.tblMvnEnt.mvnEntNm}_로고`}
                                            />
                                        ) : (
                                            <img
                                                src="/src/assets/images/user_business_overview_box04_icon01.png" width="44" height="44" alt={`${item.tblMvnEnt.mvnEntNm}_로고 없음`}
                                            />
                                        )}

                                    </figure>
                                </td>
                                <td className="title">
                                <div className="text">
                                        <p>{item.tblMvnEnt.mvnEntNm}</p>
                                    </div>
                                    <ul className="bot">
                                        <li>
                                            <p className="left">대표성함</p>
                                            <strong>{item.tblMvnEnt.rpsvNm}</strong>
                                        </li>
                                        <li>
                                            <p className="left">대표전화</p>
                                            <strong>{ComScript.formatTelNumber(item.tblMvnEnt.entTelno)}</strong>
                                        </li>
                                        <li>
                                            <p className="left">홈페이지</p>
                                            <strong>
                                                <a href={item.tblMvnEnt.hmpgAddr} target="_blank" rel="noopener noreferrer"
                                                   style={{
                                                       color: '#007bff',
                                                       textDecoration: 'none',
                                                   }}>
                                                    {item.tblMvnEnt.hmpgAddr}
                                                </a>
                                            </strong>
                                        </li>
                                    </ul>
                                </td>
                                <td className="satisfaction"></td>
                            </tr>

                        );
                    });
                    setAuthorityList(dataList);
                },
                (resp) => {

                }
            );
        },
        [operationalList,searchDto]
    );



    useEffect(() => {
        getOperationalList(searchDto);
    }, []);


    return (
        <div id="container" className="container resident">
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
                                {/*<div className="itemBox type2">
                                    <select
                                        className="niceSelectCustom"
                                        onChange={(e) => setSearchDto({...searchDto, category: e.target.value})}
                                    >
                                        <option value="">전체</option>
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>*/}
                                <div className="itemBox type2">
                                    <select className="niceSelectCustom"
                                            id="searchType"
                                            name="searchType"
                                            title="검색유형"
                                            ref={searchTypeRef}
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, searchType: e.target.value})
                                            }}
                                    >
                                        <option value="">전체</option>
                                        <option value="mvnEntNm">기업명</option>
                                        <option value="rpsvNm">대표자</option>
                                    </select>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input" htmlFor="searchVal">
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
                                </div>
                                <div className="rightBtn">
                                    <button type="button" className="searchBtn btn btn1 point"
                                            onClick={() => {
                                                getOperationalList({
                                                    ...searchDto,
                                                    pageIndex: 1
                                                });
                                            }}
                                    >
                                        <div className="icon"></div>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="board_list" data-aos="fade-up" data-aos-duration="1500">
                        <table>
                            <caption>입주기관리스트</caption>
                            <thead>
                            <tr></tr>
                            </thead>
                            <tbody>
                            {operationalList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovUserPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getOperationalList({
                                    ...searchDto,
                                    pageIndex: passedPage,
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OperationalList;
