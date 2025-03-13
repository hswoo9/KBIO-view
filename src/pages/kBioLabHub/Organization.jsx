import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem, setSessionItem, removeSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getBnrPopupList} from "@/components/main/MainComponents";
import AOS from "aos";
import EgovUserPaging from "@/components/EgovUserPaging";
import * as ComScript from "@/components/CommonScript";
import { getComCdList } from "@/components/CommonComponents";


function KBioLabHub(props) {
  const location = useLocation();
  const sessionUser = getSessionItem("loginUser");
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserSe = sessionUser?.userSe;
  const sessionUserSn = sessionUser?.userSn;
  const userSn = getSessionItem("userSn");
  const [deptList, setDeptList] = useState([]);
  const [popUpList, setPopUpList] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [orgchtList, setOrgchtList] = useState([]);
  const [searchCondition, setSearchCondition] = useState(
      location.state?.searchCondition || {
        pageIndex: 1,
        searchCnd: "0",
        searchWrd: "",
        searchType: "all",
        searchVal: "",
      }
  );

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getOrgchtList(searchCondition);
        }
    };

  useEffect(() => {
    popUpList.forEach((e, i) => {
      const popUp = e.tblBnrPopup;
      if(!localStorage.getItem(popUp.bnrPopupSn) || Date.now() > localStorage.getItem(popUp.bnrPopupSn)){
        window.open(
            `/popup?bnrPopupSn=${popUp.bnrPopupSn}`, // 여기에 원하는 URL 입력
            `${popUp.bnrPopupSn}`,
            `width=${popUp.popupWdthSz},
            height=${popUp.popupVrtcSz},
            left=${popUp.popupPstnWdth},
            top=${popUp.popupPstnUpend}`
        );

        localStorage.removeItem(popUp.bnrPopupSn)
      }
    })
  }, [popUpList]);

  const getOrgchtList = useCallback(
      (searchCondition) => {
        const requestURL = "/orgchtApi/getOrgchtList.do";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(searchCondition)
        };
        EgovNet.requestFetch(
            requestURL,
            requestOptions,
            (resp) => {
              setPaginationInfo(resp.paginationInfo);
              let dataList = [];
              dataList.push(
                  <tr>
                    <td colSpan="6" key="noData">검색된 결과가 없습니다.</td>
                  </tr>
              );

              resp.result.orgchtList.forEach(function (item, index) {
                if (index === 0) dataList = []; // 목록 초기화

                dataList.push(
                    <tr key={item.orgchtSn}
                    >
                      <td><p>{item.deptNm}</p></td>
                      <td><p>{item.deptNm}</p></td>
                      <td><p>{item.kornFlnm}</p></td>
                      <td dangerouslySetInnerHTML={{__html: item.tkcgTask}}></td>
                      <td><a href={`tel:${ComScript.formatTelNumber(item.telno)}`}><span>{ComScript.formatTelNumber(item.telno)}</span></a></td>
                      <td><a href={`mailto:${item.email}`}><span>{item.email}</span></a></td>
                    </tr>
                );
              });
              setOrgchtList(dataList);
            },
            function (resp) {

            }
        )
      },
      [orgchtList, searchCondition]
  );

    useEffect(() => {
        getOrgchtList(searchCondition);
    }, [searchCondition.deptSn]);

    const searchHandle = () => {
        getOrgchtList(searchCondition);
    }

  useEffect(() => {
    getBnrPopupList("popup").then((data) => {
      setPopUpList(data.filter(e => e.tblBnrPopup.bnrPopupKnd == "popup"));
    });
      getComCdList(12).then((data) => {
          if(data != null){
              let dataList = [];
              dataList.push(
                  <option value="" key="nodata">부서</option>
              )
              data.forEach(function(item, index){
                  dataList.push(
                      <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                  )
              });
              setDeptList(dataList);
          }
      });

    AOS.init();



  }, []);

  return (
      <div id="container" className="container organization">
        <div className="inner">
          <CommonSubMenu/>
            <div className="inner2">
                <div className="titleWrap type2" data-aos="flip-up" data-aos-duration="1000">
                    <p className="tt1">조직도</p>
                </div>
                <div className="organizationBox" data-aos="fade-up" data-aos-duration="1500">
                    <div className="text1">
                        <div className="text type1 move mouseCursor"
                             onClick={() => {
                                 setSearchCondition({
                                     ...searchCondition,
                                     deptSn: ""
                                 });
                             }
                             }
                        >
                            <strong className="title">사업추진단 협의체</strong>
                            <p className="text">중소벤처기업부 - 인천광역시 - 연세대학교</p>
                        </div>
                    </div>
                    <div className="textWrap">
                        <div className="text type2 text3 mouseCursor"
                             onClick={() => {
                                 setSearchCondition({
                                     ...searchCondition,
                                     deptSn: 30
                                 });
                             }
                             }
                        >
                            <p className="text">건축 TF</p>
                        </div>
                        <div className="textWrap2">
                            <div className="text type1 text2 mouseCursor"
                                 onClick={() => {
                                     setSearchCondition({
                                         ...searchCondition,
                                         deptSn: 29
                                     });
                                 }
                                 }
                            >
                                <strong className="title">사업추진단 협의체</strong>
                                <p className="text">단장</p>
                            </div>
                            <ul className="textWrap3">
                                <li className="text type2 text4 mouseCursor"
                                    onClick={() => {
                                        setSearchCondition({
                                            ...searchCondition,
                                            deptSn: 31
                                        });
                                    }
                                    }
                                >
                                    <p className="text">전략기획팀</p>
                                </li>
                                <li className="text type2 text5 mouseCursor"
                                    onClick={() => {
                                        setSearchCondition({
                                            ...searchCondition,
                                            deptSn: 41
                                        });
                                    }
                                    }
                                >
                                    <p className="text">경영지원팀</p>
                                </li>
                                <li className="text type2 text6 mouseCursor"
                                    onClick={() => {
                                        setSearchCondition({
                                            ...searchCondition,
                                            deptSn: 42
                                        });
                                    }
                                    }
                                >
                                    <p className="text">프로그램관리팀</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="searchFormWrap type1" data-aos="fade-up" data-aos-duration="1500">
                    <form>
                        <div className="itemBox type2">
                            <select
                                className="niceSelectCustom"
                                onChange={(e) =>
                                    setSearchCondition({...searchCondition, deptSn: e.target.value})
                                }
                                value={searchCondition.deptSn || ""}
                            >
                                {deptList}
                            </select>
                        </div>
                        <div className="searchBox">
                            <div className="itemBox type2">
                                <select
                                    className="niceSelectCustom"
                                    onChange={(e) =>
                                        setSearchCondition({...searchCondition, searchType: e.target.value})
                                    }
                                    value={searchCondition.searchType || "all"}
                                >
                                    <option value="all">전체</option>
                                    <option value="kornFlnm">이름</option>
                                    <option value="tkcgTask">업무</option>
                                </select>
                            </div>
                            <div className="inputBox type1">
                                <label className="input">
                                    <input type="text"
                                           id="board_search"
                                           name="board_search"
                                           placeholder="검색어를 입력해주세요."
                                           value={searchCondition.searchVal || ""}
                                           onChange={(e) =>
                                               setSearchCondition({
                                                   ...searchCondition,
                                                   searchVal: e.target.value
                                               })
                                           }
                                           onKeyDown={activeEnter}
                                    />
                                </label>
                            </div>
                            <button type="button" className="searchBtn"
                                    onClick={searchHandle}
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="tableCont type1" data-aos="fade-up" data-aos-duration="1500">
                    <table>
                        <caption>게시판</caption>
                        <thead>
                        <tr>
                            <th className="th1"><p>소속</p></th>
                            <th className="th1"><p>직책</p></th>
                            <th className="th1"><p>이름</p></th>
                            <th className="th3"><p>담당업무</p></th>
                            <th className="th2"><p>전화번호</p></th>
                            <th className="th2"><p>이메일</p></th>
                        </tr>
                        </thead>
                        <tbody>
                        {orgchtList}
                        </tbody>
                    </table>
                </div>
                <div className="pageWrap">
                    <EgovUserPaging
                        pagination={paginationInfo}
                        moveToPage={(passedPage) => {
                            getOrgchtList({
                                ...searchCondition,
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

export default KBioLabHub;
