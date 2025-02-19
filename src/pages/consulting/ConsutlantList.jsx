import React, {useState, useEffect, useCallback, useRef} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import 'moment/locale/ko';
import EgovPaging from "@/components/EgovPaging";
import URL from "@/constants/url";
import CommonSubMenu from "@/components/CommonSubMenu";

import {getSessionItem} from "../../utils/storage.js";
import {getComCdList} from "../../components/CommonComponents.jsx";
import moment from "moment";
import Swal from "sweetalert2";

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
            userSn : sessionUser ? sessionUser.userSn : "",
            usedByGeneral : "Y"  //사용자페이지의 경우 비공개인 컨설턴트는 내보내지 않음
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

    const editClick = (cnsltSe, userSn) => {
        if(sessionUser){
            navigate(
                { pathname : URL.CONSULTING_CREATE },
                {
                    state : {
                        cnsltSe : cnsltSe,
                        cnslttUserSn : userSn,
                        callBackUrl : URL.CONSULTANT_LIST,
                        menuSn : location.state?.menuSn,
                        menuNmPath : location.state?.menuNmPath,
                    }
                });
        }else{
            Swal.fire("로그인이 필요한 서비스 입니다.");
            document.getElementsByClassName("loginModal").item(0).classList.add("open")
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        }
    }

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

                     resp.result.consultantList.forEach(function (item, index) {
                         dataList.push(
                             <div key={item.tblUser.userSn} style={{
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
                                         <img
                                             src={
                                                 item.tblComFile
                                                     ? `http://133.186.250.158${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`
                                                     : "" // 기본 이미지 (필요한 경우)
                                             }
                                             alt=""
                                             style={{
                                                 width: '100%',
                                                 height: '100%',
                                                 objectFit: 'cover',
                                             }}
                                         />

                                     </div>

                                     <div style={{flex: 1}}>
                                         <p style={{
                                             marginTop: '20px',
                                             fontSize: '30px',
                                             fontWeight: 'bold',
                                             marginBottom: '10px',
                                         }}>
                                             <NavLink to={URL.CONSULTANT_DETAIL}
                                                      state={{
                                                          userSn: item.tblUser.userSn,
                                                          menuSn : location.state?.menuSn,
                                                          menuNmPath : location.state?.menuNmPath,
                                                      }}>
                                                 {item.tblUser.kornFlnm}
                                             </NavLink>
                                         </p>

                                         <p style={{
                                             marginTop: '10px',
                                             fontSize: '14px',
                                             color: '#555',
                                             lineHeight: '1.6',
                                         }}>
                                             {item.tblCnslttMbr.ogdpNm}
                                         </p>
                                         <div>
                                             <button
                                                 type="button"
                                                 className="writeBtn clickBtn"
                                                 onClick={() => editClick(26, item.tblUser.userSn)}
                                             >
                                                 <span>컨설팅 의뢰</span>
                                             </button>
                                             <button
                                                 type="button"
                                                 className="writeBtn clickBtn"
                                                 onClick={() => editClick(27, item.tblUser.userSn)}
                                             >
                                                 <span>간편상담</span>
                                             </button>
                                         </div>
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
                            setSearchDto({...searchDto, cnsltFld: ""})
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
