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

function RelatedList() {
    let hostName = window.location.hostname;

    if(hostName == "localhost" || hostName == "127.0.0.1"){
        hostName = "133.186.250.158"
    }else{
        hostName = "133.186.146.192"
    }

    const location = useLocation();
    const navigate = useNavigate();
    const userSn = getSessionItem("userSn");
    const [paginationInfo, setPaginationInfo] = useState({});
    const [selectedOption, setSelectedOption] = useState("");
    const [relatedList, setAuthorityList] = useState([]);


    const searchTypeRef = useRef();
    const searchValRef = useRef();

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
            getRelatedList(searchDto);
        }
    };

    const getRelatedList = useCallback(
        (searchDto) => {
            const realtedListUrl = "/introduceApi/getRelatedList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto),
            };

            EgovNet.requestFetch(
                realtedListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];

                    resp.result.getRelatedList.forEach(function (item, index) {
                        dataList.push(
                            <tr key={item.tblRelInst.relInstSn}
                                onClick={() => {
                                    navigate(
                                        {pathname: URL.INTRODUCE_RELATED_DETAIL},
                                        {
                                            state: {
                                                relInstSn: item.tblRelInst.relInstSn,
                                                menuSn : location.state?.menuSn,
                                                menuNmPath : location.state?.menuNmPath,
                                                thisMenuSn : location.state?.thisMenuSn,
                                            }
                                        },
                                    );
                                }}
                            >
                                <td className="cate">
                                    <p>{item.clsfNm}</p>
                                </td>
                                <td>
                                    <figure>
                                        {item.tblComFile != null ? (
                                            <img
                                                src={`http://${hostName}${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`} width="44" height="44"
                                                alt={`${item.tblRelInst.relInstNm}_로고`}
                                            />
                                        ) : (
                                            <img
                                                src="/src/assets/images/user_business_overview_box04_icon01.png" width="44" height="44" alt={`${item.tblRelInst.relInstNm}_로고 없음`}
                                            />
                                        )}
                                    </figure>
                                </td>
                                <td className="title">
                                    <div className="text">
                                        <p>{item.tblRelInst.relInstNm}</p>
                                    </div>
                                    <ul className="bot">
                                        <li>
                                            <p className="left">대표성함</p>
                                            <strong>{item.tblRelInst.rpsvNm}</strong>
                                        </li>
                                        <li>
                                            <p className="left">대표전화</p>
                                            <strong>{ComScript.formatTelNumber(item.tblRelInst.entTelno)}</strong>
                                        </li>
                                        <li>
                                            <p className="left">홈페이지</p>
                                            <strong>
                                                <a href={item.tblRelInst.hmpgAddr} target="_blank" rel="noopener noreferrer"
                                                   style={{
                                                       color: '#007bff',
                                                       textDecoration: 'none',
                                                   }}>
                                                    {item.tblRelInst.hmpgAddr}
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
        [relatedList,searchDto]
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        getRelatedList(searchDto);
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
                                {/* <div className="itemBox type2">
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
                                        <option value="relInstNm">기업명</option>
                                        <option value="rpsvNm">대표자</option>
                                    </select>
                                </div>
                                <div className="inputBox type1">
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
                                </div>
                                <div className="rightBtn">
                                    <button type="button" className="searchBtn btn btn1 point"
                                            onClick={() => {
                                                getRelatedList({
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
                            <caption>유관기관리스트</caption>
                            <thead>
                            <tr>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {relatedList}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovUserPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getRelatedList({
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

export default RelatedList;
