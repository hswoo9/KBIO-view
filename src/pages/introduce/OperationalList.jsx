import React, {useState, useEffect, useCallback, useRef} from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import URL from "@/constants/url";
import CommonSubMenu from "@/components/CommonSubMenu";
import AOS from "aos";
import EgovUserPaging from "@/components/EgovUserPaging";

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
                            <tr key={item.mvnEntSn}
                                onClick={ () => {
                                    navigate(
                                        { pathname: URL.INTRODUCE_OPERATIONAL_DETAIL },
                                        { state: {
                                                mvnEntSn: item.mvnEntSn,
                                                menuSn : location.state?.menuSn,
                                                menuNmPath : location.state?.menuNmPath,
                                            } },
                                    );
                                }}
                            >
                                <td className="cate">
                                    <p>의약품</p>
                                </td>
                                <td>
                                    <figure>
                                        <img src="/src/assets/images/ico_logo_kakao.svg" alt="" />
                                    </figure>
                                </td>
                                <td className="title">
                                    <div className="text">
                                        <p>{item.mvnEntNm}</p>
                                    </div>
                                    <ul className="bot">
                                        <li>
                                            <p className="left">대표성함</p>
                                            <strong>{item.rpsvNm}</strong>
                                        </li>
                                        <li>
                                            <p className="left">대표전화</p>
                                            <strong>{item.entTelno}</strong>
                                        </li>
                                        <li>
                                            <p className="left">홈페이지</p>
                                            <strong>
                                                <a href={item.hmpgAddr} target="_blank" rel="noopener noreferrer"
                                                   style={{
                                                       color: '#007bff',
                                                       textDecoration: 'none',
                                                   }}>
                                                    {item.hmpgAddr}
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
        [searchDto]
    );

    useEffect(() => {
        getOperationalList(searchDto);
        AOS.init();
    }, []);

    const handleSearch = () => {

        setSearchDto((prev) => {
            const updatedSearchDto = { ...prev, [selectedOption]: prev[selectedOption] || "" , pageIndex: 1  };
            getOperationalList(updatedSearchDto); // 여기서 검색 실행
            return updatedSearchDto;
        });
    };

    return (
        <div id="container" className="container resident">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="searchFormWrap type1" data-aos="fade-up" data-aos-duration="1500">
                        <form>
                            <div className="totalBox">
                                <div className="total"><p>총 <strong>{paginationInfo.totalRecordCount}</strong>건</p></div>
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
                                    <select className="niceSelectCustom" onChange={(e) => {
                                        const value = e.target.value;
                                        const optionMap = {
                                            "0": "",
                                            "1": "mvnEntNm",
                                            "2": "rpsvNm",
                                            //추가되면 아래로 더 추가
                                        };

                                        setSelectedOption(optionMap[value] || "");
                                        setSearchDto(prev => ({...prev, [optionMap[value] || ""]: ""}));
                                    }}>
                                        <option value="0">전체</option>
                                        <option value="1">기업명</option>
                                        <option value="2">대표자</option>
                                    </select>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input">
                                        <input
                                            type="text"
                                            id="board_search"
                                            name="board_search"
                                            placeholder="검색어를 입력해주세요."
                                            value={searchDto[selectedOption] || ""}
                                            onChange={(e) => {
                                                setSearchDto({...searchDto, [selectedOption]: e.target.value});
                                            }}
                                            onKeyDown={activeEnter}
                                        />
                                    </label>
                                </div>
                                <div className="rightBtn">
                                    <button type="button" className="searchBtn btn btn1 point"
                                            onClick={handleSearch}>
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
