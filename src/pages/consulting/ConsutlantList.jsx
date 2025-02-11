import React, {useState, useEffect, useCallback, useRef} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import 'moment/locale/ko';
import EgovPaging from "@/components/EgovPaging";
import CommonSubMenu from "@/components/CommonSubMenu";

import {getSessionItem} from "../../utils/storage.js";
import {getComCdList} from "../../components/CommonComponents.jsx";
import moment from "moment";

function ConsultantList(props) {
    const sessionUser = getSessionItem("loginUser");
    const userSn = getSessionItem("userSn");
    const location = useLocation();
    const navigate = useNavigate();
    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            cnsltFld : "",
            searchType: "",
            searchVal : "",
            userSn : sessionUser ? sessionUser.userSn : ""
        }
    );
    const [comCdList, setComCdList] = useState([]);
    const [menuList, setMenuList] = useState([]);
    const [consultantList, setConsultantList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});

    const searchTypeRef = useRef();
    const searchValRef = useRef();

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getConsultantList(searchDto);
        }
    };

    const getConsultantList = useCallback(
        (searchDto) => {
            const pstListURL = "/consultingApi/getConsultantList.do";
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
                    setPaginationInfo(resp.paginationInfo);
                     let dataList = [];
                     dataList.push(
                         <tr>
                             <td>검색된 결과가 없습니다.</td>
                         </tr>
                     );

                     resp.result.consultantList.forEach(function (item, index) {
                         dataList.push(
                             <div key={item.userSn} style={{
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
                                         <img src="" alt="" style={{
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
                                             <NavLink to={""}
                                                      state={{
                                                          userSn: item.userSn,
                                                          menuSn : location.state?.menuSn,
                                                          menuNmPath : location.state?.menuNmPath,
                                                      }}>
                                                 {item.kornFlnm}
                                             </NavLink>
                                         </p>

                                         <p style={{
                                             marginTop: '10px',
                                             fontSize: '14px',
                                             color: '#555',
                                             lineHeight: '1.6',
                                         }}>
                                             {item.ogdpNm}
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         );
                     });
                     setConsultantList(dataList);
                     setPaginationInfo(resp.paginationInfo);
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [consultantList, searchDto]
    );

    const getComCdListToHtml = (dataList) => {
        let htmlData = [];
        if(dataList != null && dataList.length > 0) {
            htmlData.push(
                <label className="checkBox type2" key="all">
                    <input
                        type="radio"
                        name="cnsltFld"
                        key="all"
                        value=""
                        checked
                        onChange={(e) =>
                            setSearchDto({...searchDto, cnsltFld: e.target.value})
                        }
                    />전체</label>
            )
            dataList.forEach(function (item, index) {
                htmlData.push(
                    <label className="checkBox type2" key={item.comCd}>
                        <input
                            type="radio"
                            name="cnsltFld"
                            key={item.comCd}
                            value={item.comCd}
                            onChange={(e) =>
                                setSearchDto({...searchDto, cnsltFld: e.target.value})
                            }
                        />{item.comCdNm}</label>
                )
            });
        }
        return htmlData;
    }

    useEffect(() => {
        getComCdList(10).then((data) => {
            setComCdList(data);
        })
    }, []);


    useEffect(() => {
        getConsultantList(searchDto);
    }, [comCdList]);

    return (
        <div id="container" className="container layout">
            <div className="inner">
                <CommonSubMenu/>
                <div className="cateWrap inputBox type1" style={{flexDirection: "row"}}>
                    <div className="rating-options">
                        {getComCdListToHtml(comCdList)}
                    </div>
                </div>
                <div className="cateWrap inputBox type1" style={{flexDirection: "row"}}>

                    <div className="itemBox" style={{width: "7%"}}>
                        <select
                            id="searchType"
                            name="searchType"
                            title="검색유형"
                            ref={searchTypeRef}
                            style={{width: "50%"}}
                            onChange={(e) => {
                                setSearchDto({...searchDto, searchType: e.target.value})
                            }}
                        >
                            <option value="">전체</option>
                            <option value="kornFlnm">성명</option>
                            <option value="ogdpNm">소속</option>
                        </select>
                    </div>
                    <div className="itemBox">
                        <label className="input">
                            <input type="text"
                                   name="searchVal"
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
                    <div className="rightBtn">
                        <button type="button"
                                className="searchBtn btn btn1 point"
                                onClick={() => {
                                    getConsultantList({
                                        ...searchDto,
                                        pageIndex: 1,
                                        searchType: searchTypeRef.current.value,
                                        searchVal: searchValRef.current.value,
                                    });
                                }}
                                style={{color: "#fff", width: "100px"}}
                        >
                            조회
                        </button>
                    </div>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        {consultantList}
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getConsultantList({
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

export default ConsultantList;
