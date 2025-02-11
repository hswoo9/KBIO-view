import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import EgovPaging from "@/components/EgovPaging";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import URL from "@/constants/url";

function OperationalList() {
    const userSn = getSessionItem("userSn");
    const [paginationInfo, setPaginationInfo] = useState({});
    const [operationalList, setAuthorityList] = useState([]);
    const [searchDto, setSearchDto] = useState({
        category: "",
        keywordType: "",
        keyword: "",
        pageIndex: 1,
    });

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
                            <div key={item.mvnEntSn} style={{
                                display: 'flex',
                                padding: '20px',
                                border: '1px solid #ddd',
                                marginBottom: '15px',
                                borderRadius: '8px',
                            }}>
                                <div style={{display: 'flex', gap: '20px', width: '100%'}}>
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        overflow: 'hidden',
                                    }}>
                                        <img src="/src/assets/images/ico_logo_kakao.svg" alt="" style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}/>
                                    </div>

                                    <div style={{flex: 1}}>
                                        <p style={{
                                            marginTop: '20px',
                                            fontSize: '30px',
                                            fontWeight: 'bold',
                                            marginBottom: '10px',
                                        }}>
                                            <Link to={URL.INTRODUCE_OPERATIONAL_DETAIL}
                                                  state={{mvnEntSn: item.mvnEntSn }}>
                                                {item.mvnEntNm}
                                            </Link>
                                        </p>

                                        <p style={{
                                            marginTop: '10px',
                                            fontSize: '14px',
                                            color: '#555',
                                            lineHeight: '1.6',
                                        }}>
                                            <span style={{fontWeight: 'bold'}}>대표 성함:</span> {item.rpsvNm}
                                            <span style={{margin: '0 5px'}}>|</span>
                                            <span style={{fontWeight: 'bold'}}>대표전화:</span> {item.entTelno}
                                            <span style={{margin: '0 5px'}}>|</span>
                                            <span style={{fontWeight: 'bold'}}>홈페이지:</span>
                                            <a href={item.hmpgAddr} target="_blank" rel="noopener noreferrer" style={{
                                                color: '#007bff',
                                                textDecoration: 'none',
                                            }}>
                                                {item.hmpgAddr}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    });
                    setAuthorityList(dataList);
                },
                (resp) => {
                    console.log("err response : ", resp);
                }
            );
        },
        [searchDto]
    );

    useEffect(() => {
        getOperationalList(searchDto);
    }, []);

    const handleSearch = () => {
        setSearchDto({...searchDto, pageIndex: 1});
        getOperationalList(searchDto);
    };

    return (
        <div id="container" className="container layout">
            <div className="inner">
                <h2 className="pageTitle">
                    <p>입주기업 소개</p>
                </h2>

                <div className="cateWrap">
                    <ul className="cateList" style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
                        <li className="inputBox type1" style={{flex: "1 10%"}}>
                            <p className="title">분류</p>
                            <div className="itemBox">
                                <select
                                    className="selectGroup"
                                    onChange={(e) => setSearchDto({...searchDto, category: e.target.value})}
                                    style={{padding: "5px", width: "100%"}}
                                >
                                    <option value="">전체</option>
                                    <option value="Y">사용</option>
                                    <option value="N">미사용</option>
                                </select>
                            </div>
                        </li>
                        <li className="inputBox type1" style={{flex: "1 10%"}}>
                            <p className="title">키워드</p>
                            <div className="itemBox">
                                <select
                                    className="selectGroup"
                                    onChange={(e) => setSearchDto({...searchDto, keywordType: e.target.value})}
                                    style={{padding: "5px", width: "100%"}}
                                >
                                    <option value="">전체</option>
                                    <option value="1">성명</option>
                                    <option value="2">소속</option>
                                    <option value="3">직위</option>
                                </select>
                            </div>
                        </li>
                        <li className="searchBox inputBox type1" style={{flex: "1 40%", marginTop: "25px"}}>
                            <label className="input">
                                <input
                                    type="text"
                                    placeholder="검색어를 입력해주세요"
                                    onChange={(e) => setSearchDto({...searchDto, keyword: e.target.value})}
                                    style={{width: "100%", padding: "5px"}}
                                />
                            </label>
                        </li>
                        <div className="rightBtn" style={{display: "flex", gap: "10px", marginTop: "25px"}}>
                            <button className="searchBtn btn btn1 point" onClick={handleSearch} style={{
                                padding: '20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                width: "100%",
                            }}>
                                검색
                            </button>
                        </div>
                    </ul>
                </div>

                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">
                            Total <span className="red">{paginationInfo.totalCount}</span>
                        </p>
                    </div>
                    <div className="companyList">
                        {operationalList}
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
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
