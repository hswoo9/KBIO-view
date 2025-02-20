import React, {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate, useLocation, Link, NavLink} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';

import EgovPaging from "@/components/EgovPaging";

import BtTable from 'react-bootstrap/Table';
import moment from "moment/moment.js";

function ResidentCompanyList(){

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            brno: "",
            mvnEntNm : "",
            rpsvNm : "",
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({});
    const [rcList, setAuthorityList] = useState([]);
    const [activeTab, setActiveTab] = useState(1);

    const handleSearch = () => {
        setSearchDto({ ...searchDto, pageIndex: 1 });
        getRcList(searchDto);
    };

    const getRcList = useCallback(
        (searchDto)=>{


            const rcListUrl = "/mvnEntApi/getMvnEntList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                rcListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    rcList.push(
                        <tr>
                            <td colSpan="5">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.rcList.forEach(function (item,index){
                        if(index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.mvnEntSn}>
                                <td>{index + 1}</td>
                                <td>
                                    <Link to={URL.RESIDENT_COMPANY_MODIFY}
                                          state={{ mode: CODE.MODE_MODIFY, mvnEntSn: item.mvnEntSn }}>
                                        {item.mvnEntNm}
                                    </Link>

                                </td>
                                <td>{item.rpsvNm}</td>
                                <td>{formatBrno(item.brno)}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                            </tr>
                        );
                    });
                    setAuthorityList(dataList);

                },
                function (resp) {

                }
            )
        },
        [rcList, searchDto]
    );

    useEffect(()=>{
       getRcList(searchDto);
    }, []);

    function formatBrno(brno) {
        if (!brno || brno.length < 10) {
            return brno;
        }

        return `${brno.slice(0, 3)}-${brno.slice(3, 5)}-${brno.slice(5)}`;
    }

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getRcList(searchDto);
        }
    };


    return(
        <div className="contents BOARD_CREATE_LIST" id="contents">

            <div className="condition">
                <ul>
                    <li className="third_2 R">
                        <span className="lb">기업이름</span>
                        <span className="f_search w_400" style={{ width: "20%" }}>
                                        <input
                                            type="text"
                                            name="mvnEntName"
                                            placeholder=""
                                            value={searchDto.mvnEntNm} // 입력 값 바인딩
                                            onChange={(e) =>
                                                setSearchDto({
                                                    ...searchDto,
                                                    mvnEntNm: e.target.value,
                                                })
                                            }
                                            onKeyDown={activeEnter}
                                        />
                                    </span>
                        <span className="lb" style={{ marginLeft: "10px" }}>
                                        대표자
                                    </span>
                        <span className="f_search w_400" style={{ width: "20%" }}>
                                        <input
                                            type="text"
                                            name="rpsvNm"
                                            placeholder=""
                                            value={searchDto.rpsvNm} // 입력 값 바인딩
                                            onChange={(e) =>
                                                setSearchDto({
                                                    ...searchDto,
                                                    rpsvNm: e.target.value,
                                                })
                                            }
                                            onKeyDown={activeEnter}
                                        />
                                    </span>
                        <span className="lb" style={{ marginLeft: "10px" }}>
                                        사업자번호
                                    </span>
                        <span className="f_search w_400" style={{ width: "20%" }}>
                                        <input
                                            type="text"
                                            name="brno"
                                            placeholder=" - 제외하고 입력"
                                            value={searchDto.brno} // 입력 값 바인딩
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSearchDto({
                                                    ...searchDto,
                                                    brno: value.replace(/-/g, ''),
                                                })
                                            }}
                                            onKeyDown={activeEnter}
                                        />
                                    </span>
                        <button className="btn"
                                type="button"
                                style={{marginLeft:"15px", backgroundColor:"#169bd5", color:"white", width:"8%", marginTop:"3px"}}
                                onClick={handleSearch}>
                            조회
                        </button>
                    </li>
                </ul>
            </div>
            <div style={{
                overflow: "hidden",
            }}>
                <NavLink
                    to={URL.RESIDENT_COMPANY_CREATE}
                    className="btn  btn_blue_h46 pd35"
                    style={{float: "right", marginRight: "20px", marginTop: "15px", marginBottom: "15px"}}
                >
                    입주기업 등록
                </NavLink>
            </div>

            <div className="board_list_container">
                <div className="tab_menu">
                    {/*탭 영역*/}
                    <button
                        className={activeTab === 1 ? "active" : ""}
                        onClick={() => setActiveTab(1)}
                    >
                        입주기업
                    </button>
                    <button
                        className={activeTab === 2 ? "active" : ""}
                        onClick={() => setActiveTab(2)}
                    >
                        유관기관
                    </button>
                    <button
                        className={activeTab === 3 ? "active" : ""}
                        onClick={() => setActiveTab(3)}
                    >
                        비입주기업
                    </button>
                </div>
            <div className="tab_content">
            {/*테이블 영역*/}
            {activeTab === 1 && (
            <div className="board_list BRD006">
                <BtTable
                    striped bordered hover size="sm"
                    className="btTable"
                >
                    <colgroup>
                        <col width="20"/>
                        <col width="100"/>
                        <col width="50"/>
                        <col width="80"/>
                        <col width="50"/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>기업이름</th>
                        <th>대표자</th>
                        <th>사업자등록번호</th>
                        <th>등록일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rcList}
                    </tbody>
                </BtTable>

                <div className="board_bot">
                    <EgovPaging
                        pagination={paginationInfo}
                        moveToPage={(passedPage) => {
                            getRcList({
                                ...searchDto,
                                pageIndex: passedPage
                            });
                        }}
                    />
                </div>
            </div>
            )}

                {activeTab === 2 && (
                    <div className="board_list BRD006">
                        <BtTable
                            striped bordered hover size="sm"
                            className="btTable"
                        >
                            <colgroup>
                                <col width="20"/>
                                <col width="100"/>
                                <col width="50"/>
                                <col width="80"/>
                                <col width="50"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>기업이름</th>
                                <th>대표자</th>
                                <th>사업자등록번호</th>
                                <th>등록일</th>
                            </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </BtTable>

                        <div className="board_bot">
                            <EgovPaging
                                pagination={paginationInfo}
                                moveToPage={(passedPage) => {
                                    getRcList({
                                        ...searchDto,
                                        pageIndex: passedPage
                                    });
                                }}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 3 && (
                    <div className="board_list BRD006">
                        <BtTable
                            striped bordered hover size="sm"
                            className="btTable"
                        >
                            <colgroup>
                                <col width="20"/>
                                <col width="100"/>
                                <col width="50"/>
                                <col width="80"/>
                                <col width="50"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>기업이름</th>
                                <th>대표자</th>
                                <th>사업자등록번호</th>
                                <th>등록일</th>
                            </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </BtTable>

                        <div className="board_bot">
                            <EgovPaging
                                pagination={paginationInfo}
                                moveToPage={(passedPage) => {
                                    getRcList({
                                        ...searchDto,
                                        pageIndex: passedPage
                                    });
                                }}
                            />
                        </div>
                    </div>
                )}

            </div>
            </div>

        </div>




    );
}

export default ResidentCompanyList;