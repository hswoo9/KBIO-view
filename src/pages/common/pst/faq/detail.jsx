import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import {Link, useNavigate, useLocation, NavLink} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import Swal from "sweetalert2";
import moment from "moment";
import '@/css/quillSnow.css';
import '@/css/manager/managerPstDetail.css';
import { getSessionItem, setSessionItem } from "@/utils/storage";
import {fileDownLoad, fileZipDownLoad} from "@/components/CommonComponents.jsx";
import CommonPstEval from "../eval.jsx";
import {getComCdList} from "../../../../components/CommonComponents.jsx";

function commonPstDetail(props) {
  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();

  const [searchDto, setSearchDto] = useState({
    bbsSn : location.state?.bbsSn,
    pstSn : location.state?.pstSn,
    userSn : sessionUser.userSn
  });

  const [authrt, setAuthrt] = useState({
    inqAuthrt : "N",
    wrtAuthrt : "N",
    mdfcnAuthrt : "N",
    delAuthrt : "N",
  })
  const [pst, setPst] = useState({});
  const [pstPrevNext, setPstPrevNext] = useState([]);
  const [bbs, setBbs] = useState({});
  const [comCdList, setComCdList] = useState([]);

  const getPst = (searchDto) => {
    const getPstURL = `/pstApi/getPst.do`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(searchDto)
    };

    EgovNet.requestFetch(getPstURL, requestOptions, function (resp) {
      setAuthrt(resp.result.authrt)
      setBbs(resp.result.bbs);
      setPst(resp.result.pst);
      setPstPrevNext(resp.result.pstPrevNext);
    });
  };

  const setPstDel = (pstSn) => {
    const setPstDelUrl = "/pstApi/setPstDel";

    Swal.fire({
      title: "삭제하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({pstSn : pstSn}),
        };

        EgovNet.requestFetch(setPstDelUrl, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("삭제되었습니다.");
            navigate(
              { pathname : URL.COMMON_PST_FAQ_LIST},
              { state: {
                  bbsSn: bbs.bbsSn,
                  menuSn: location.state?.menuSn,
                  menuNmPath: location.state?.menuNmPath,
                  thisMenuSn : location.state?.thisMenuSn,
                }
              }
            );
          } else {
            alert("ERR : " + resp.resultMessage);
          }
        });
      } else {
        //취소
      }
    });
  };

  function pstPrevNextSearch(pstSn) {
    setSearchDto({
      ...searchDto,
      pstSn: pstSn
    })
  }

  useEffect(() => {
    getPst(searchDto);
  }, [searchDto.pstSn]);

  useEffect(() => {
    if(bbs.pstCtgryYn == "Y"){
      getComCdList(9).then((data) => {
        setComCdList(data);
      })
    }
  }, [bbs.bbsSn]);

  return (
      <div id="container" className="container layout cms">
        <div className="inner">
          <h2 className="pageTitle">{bbs.bbsNm}</h2>
          <div className="contBox">
            <div className="box infoBox">
              <ul className="listBox">
                {bbs.pstCtgryYn == "Y" && comCdList.length > 0 && (
                    <li className="inputBox type1 width1">
                      <label className="title"><small>분류</small></label>
                      <div className="input">{comCdList.find(e => e.comCdSn == pst.pstClsf).comCdNm}</div>
                    </li>
                )}
                <li className="inputBox type1 width1">
                  <label className="title"><small>제목</small></label>
                  <div className="input">{pst.pstTtl}</div>
                </li>
                <li className="inputBox type1 width1">
                  <label className="title"><small>작성일</small></label>
                  <div className="input">{moment(pst.frstCrtDt).format('YYYY-MM-DD')}</div>
                </li>
                {bbs.atchFileYn == "Y" && (
                    <li className="inputBox type1 width1">
                      <label className="title"><small>첨부파일</small></label>
                      <div className="input">
                        {pst.pstFiles.length > 0 && (
                            <ul>
                              {pst.pstFiles.map((file, index) => (
                                  <li key={index}>
                                    <span
                                        onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}
                                        style={{cursor: "pointer"}}>
                                      {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                                    </span>
                                  </li>
                              ))}
                            </ul>
                        )}
                      </div>
                      {pst.pstFiles.length > 0 && (
                        <button
                            type="button"
                            className="clickBtn"
                            onClick={() => fileZipDownLoad("pst_" + pst.pstSn, pst.pstTtl)}>
                          압축
                        </button>
                      )}
                    </li>
                )}
                <li className="inputBox type1 width1">
                  <label className="title"><small>관련링크</small></label>
                  <div className="input">
                    <NavLink to={pst.linkUrlAddr} target={"_blank"}>
                      {pst.linkUrlAddr}
                    </NavLink>
                  </div>
                </li>
                <li className="inputBox type1 width1">
                  <label className="title"><small>내용</small></label>
                  <div className="input" dangerouslySetInnerHTML={{__html: pst.pstCn}}></div>
                </li>

              </ul>
              <div className="buttonBox">
                <div className="left">
                  {authrt.mdfcnAuthrt == "Y" && (
                      <Link
                          to={URL.COMMON_PST_FAQ_MODIFY}
                          mode={CODE.MODE_MODIFY}
                          state={{
                            pstSn: pst.pstSn,
                            menuSn: location.state?.menuSn,
                            menuNmPath: location.state?.menuNmPath,
                            thisMenuSn : location.state?.thisMenuSn,
                          }}
                      >
                        <button type="button" className="clickBtn">
                          수정
                        </button>
                      </Link>
                  )}
                  {authrt.delAuthrt == "Y" && (
                      <button type="button" className="clickBtn red"
                              onClick={() => {
                                setPstDel(pst.pstSn);
                              }}
                      >
                        <span>삭제</span>
                      </button>
                  )}
                </div>
                <div className="right">
                  <Link
                      to={URL.COMMON_PST_FAQ_LIST}
                      state={{
                        bbsSn: bbs.bbsSn,
                        menuSn: location.state?.menuSn,
                        menuNmPath: location.state?.menuNmPath,
                        thisMenuSn : location.state?.thisMenuSn,
                      }}
                  >
                    <button type="button" className="clickBtn white">
                      목록
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
          <div className="contBox">
            <div className="box infoBox">
              <ul className="listBox">
                <li className="inputBox type1 width1">
                  <label className="title"><small>이전글</small></label>
                  <div className="input">
                    {pstPrevNext.find(i => i.position === "PREV") ? (
                        <span style={{cursor: "pointer"}}
                              onClick={() =>
                                  pstPrevNextSearch(pstPrevNext.find(i => i.position === "PREV").pstSn)
                              }
                        >
                          {pstPrevNext.find(i => i.position === "PREV").pstTtl}
                      </span>
                    ) : "이전글이 존재하지 않습니다."
                    }
                  </div>
                </li>
                <li className="inputBox type1 width1">
                  <label className="title"><small>다음글</small></label>
                  <div className="input">
                    {pstPrevNext.find(i => i.position === "NEXT") ? (
                        <span style={{cursor: "pointer"}}
                              onClick={() =>
                                  pstPrevNextSearch(pstPrevNext.find(i => i.position === "NEXT").pstSn)
                              }
                        >
                          {pstPrevNext.find(i => i.position === "NEXT").pstTtl}
                        </span>
                    ) : "다음글이 존재하지 않습니다."
                    }
                  </div>
                </li>
              </ul>

            </div>
          </div>
        </div>
        <CommonPstEval pstSn={pst.pstSn}/>
      </div>
  );
}

export default commonPstDetail;
