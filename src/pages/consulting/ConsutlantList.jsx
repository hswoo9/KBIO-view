import React, {useState, useEffect, useCallback, useRef} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import 'moment/locale/ko';
import EgovUserPaging from "@/components/EgovUserPaging";
import URL from "@/constants/url";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getSessionItem} from "../../utils/storage.js";
import {getComCdList} from "../../components/CommonComponents.jsx";
import moment from "moment";
import Swal from "sweetalert2";
import AOS from "aos";
import * as ComScript from "@/components/CommonScript";
import notProfile from "@/assets/images/no_profile.png";
import ConsultingModal from "@/components/ConsultingModal";


function ConsultantList(props) {
    const sessionUser = getSessionItem("loginUser");
    const userSn = getSessionItem("userSn");
    const location = useLocation();
    const navigate = useNavigate();

    const [modalData, setModalData] = useState({});
    useEffect(() => {
    }, [modalData]);

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

    const editClick = (cnsltSe, userSn, name) => {
        if(sessionUser){
            
            setModalData({
                ...modalData,
                cnsltSe : cnsltSe,
                cnslttUserSn : userSn,
                userSn : sessionUser?.userSn,
                kornFlnm: name
            });
            ComScript.openModal("requestModal");
            /*navigate(
                { pathname : URL.CONSULTING_CREATE },
                {
                    state : {
                        cnsltSe : cnsltSe,
                        cnslttUserSn : userSn,
                        callBackUrl : URL.CONSULTANT_LIST,
                        menuSn : location.state?.menuSn,
                        menuNmPath : location.state?.menuNmPath,
                    }
                });*/
        }else{
            Swal.fire("로그인이 필요한 서비스 입니다.").then((result) => {
                if(result.isConfirmed) {
                    navigate("/");
                    ComScript.openModal("loginModal");
                }
            });
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
                    console.log("consiltantList",resp.result.consultantList);
                     let dataList = [];

                     resp.result.consultantList.forEach(function (item, index) {
                         dataList.push(
                             <li key={item.tblUser.userSn}>
                                 <div className="profileBox">
                                     <div className="textBox">
                                         <div className={`departBox cate${parseInt(item.tblCnslttMbr.cnsltFld, 10) - 100}`}>
                                             <div className="icon"></div>
                                             <p className="text">{item.cnsltFldNm}</p>
                                         </div>
                                         <div className="nameBox">
                                             <strong className="name">{item.tblUser.kornFlnm}</strong>
                                             <p className="company">{item.tblCnslttMbr.ogdpNm} ({item.tblCnslttMbr.jbpsNm})</p>
                                         </div>
                                         <p
                                             className="intro"
                                             style={{height:"70px"}}
                                             dangerouslySetInnerHTML={{
                                                 __html: (item.tblCnslttMbr.rmrkCn || "").replace(/\n/g, "<br>")
                                             }}
                                         ></p>

                                     </div>
                                     <figure className="imgBox customFigure">
                                         <img
                                             src={
                                                 item.tblComFile
                                                     ? `http://133.186.250.158${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`
                                                     : notProfile
                                             }
                                             onError={(e) => {
                                                 e.target.src = notProfile;
                                             }}
                                             alt=""
                                         />
                                     </figure>
                                 </div>
                                 <div className="botBox">
                                     <div className="buttonBox">
                                         <button type="button" className="clickBtn requestBtn" onClick={() => editClick(26, item.tblUser.userSn, item.tblUser.kornFlnm)}>
                                             <div className="icon"></div>
                                             <span>컨설팅 의뢰</span>
                                         </button>
                                         <button type="button" className="clickBtn contactBtn" onClick={() => editClick(27, item.tblUser.userSn, item.tblUser.kornFlnm)}>
                                             <div className="icon"></div>
                                             <span>간편 상담</span>
                                         </button>
                                     </div>
                                     <NavLink to={URL.CONSULTANT_DETAIL}
                                              state={{
                                                  userSn: item.tblUser.userSn,
                                                  menuSn : location.state?.menuSn,
                                                  menuNmPath : location.state?.menuNmPath,
                                              }}
                                              className="moreBtn"
                                     >
                                         <span>더 알아보기</span>
                                         <div className="icon"></div>
                                     </NavLink>
                                 </div>
                             </li>


                         /*<div key={item.tblUser.userSn} style={{
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
                             </div>*/
                         );
                     });
                     setConsultantList(dataList);
                     setPaginationInfo(resp.paginationInfo);

                },
                function (resp) {

                }
            )
        },
        [consultantList, searchDto]
    );

    const getComCdListToHtml = (dataList) => {
        let htmlData = [];
        if(dataList != null && dataList.length > 0) {
            htmlData.push(
                <div className="checkBox type5" key="all">
                    <label>
                        <input
                            type="radio"
                            name="cnsltFld"
                            key="all"
                            value=""
                            onChange={(e) =>{
                                setSearchDto({...searchDto, cnsltFld: ""})
                                getConsultantList({
                                    ...searchDto,
                                    cnsltFld : ""
                                });
                            }}
                        />
                        <small>전체</small>
                    </label>
                </div>
            )
            dataList.forEach(function (item, index) {
                htmlData.push(
                    <div className={`checkBox type5 cate${index+1}`} key={item.comCd}>
                        <label>
                            <input
                                type="radio"
                                name="cnsltFld"
                                key={item.comCd}
                                value={item.comCd}
                                onChange={(e) =>{
                                    const newValue = e.target.value;
                                    setSearchDto({...searchDto, cnsltFld: e.target.value})
                                    getConsultantList({
                                       ...searchDto,
                                       cnsltFld : newValue
                                    });
                                }}
                            />
                            <div className="icon"></div>
                            <small>{item.comCdNm}</small>
                        </label>
                    </div>
                )
            });
        }
        return htmlData;
    }

    useEffect(() => {
        getComCdList(10).then((data) => {
            setComCdList(data);
        });
        AOS.init();
    }, []);

    useEffect(() => {
        getConsultantList(searchDto);
    }, [comCdList]);

    return (
        <div id="container" className="container consultant">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="buttonBox rightBox" style={{justifyContent:"right", marginBottom:"20px"}}>
                        <button type="button" className="clickBtn requestBtn" onClick={() => editClick(26, "", "")}>
                            <div className="icon"></div>
                            <span>컨설팅 의뢰</span>
                        </button>
                        <button type="button" className="clickBtn contactBtn" onClick={() => editClick(27, "", "")}>
                            <div className="icon"></div>
                            <span>간편 상담</span>
                        </button>
                    </div>
                    <div className="searchFormWrap type2" data-aos="fade-up" data-aos-duration="1500">
                        <form>
                            <div className="searchBox">
                                <div className="itemBox type2">
                                    <select
                                        id="searchType"
                                        name="searchType"
                                        className="selectGroup customUserSelect"
                                        title="검색유형"
                                        ref={searchTypeRef}
                                        onChange={(e) => {
                                            setSearchDto({...searchDto, searchType: e.target.value})
                                        }}
                                    >
                                        <option value="">전체</option>
                                        <option value="kornFlnm">성명</option>
                                        <option value="ogdpNm">소속</option>
                                    </select>
                                </div>
                                <div className="inputBox type1">
                                    <label className="input">
                                        <input
                                            type="text"
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
                                            placeholder="검색어를 입력해주세요."
                                        />
                                    </label>
                                </div>
                                <button type="button" className="searchBtn"
                                        onClick={() => {
                                            getConsultantList({
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
                            <div className="checkWrap">
                                {getComCdListToHtml(comCdList)}
                            </div>
                        </form>
                    </div>
                    <ul className="listBox" data-aos="fade-up" data-aos-duration="1500">
                        {consultantList}
                    </ul>
                    <div className="pageWrap">
                        <EgovUserPaging
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
            <ConsultingModal data={modalData} />
        </div>
    );
}

export default ConsultantList;
