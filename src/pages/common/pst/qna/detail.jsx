import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import {Link, useNavigate, useLocation, NavLink} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import Swal from "sweetalert2";
import moment from "moment";
import AOS from "aos";
import '@/css/quillSnow.css';
import '@/css/manager/managerPstDetail.css';
import { getSessionItem, setSessionItem } from "@/utils/storage";
import {fileDownLoad, fileZipDownLoad, getComCdList} from "@/components/CommonComponents";
import CommonPstEval from "../eval.jsx";
import CommonSubMenu from "@/components/CommonSubMenu";

function commonPstDetail(props) {
  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();

  const [searchDto, setSearchDto] = useState({
    bbsSn : location.state?.bbsSn,
    pstSn : location.state?.pstSn,
    userSn : sessionUser ? sessionUser.userSn : ""
  });

  const [authrt, setAuthrt] = useState({
    inqAuthrt : "N",
    wrtAuthrt : "N",
    mdfcnAuthrt : "N",
    delAuthrt : "N",
  })
  const [pst, setPst] = useState({});
  const [answer, setAnswer] = useState({});
  const [pstPrevNext, setPstPrevNext] = useState([]);
  const [bbs, setBbs] = useState({});

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
      if(resp.result.pst.answer != null){
        setAnswer(resp.result.pst.answer);
      }else{
        setAnswer({});
      }

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
              { pathname : URL.COMMON_PST_QNA_LIST},
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
    AOS.init();
  }, []);

  return (
      <div id="container" className="container q&a board">
        <div className="inner">
          <CommonSubMenu />
          <div className="inner2">
            <div className="board_view" data-aos="fade-up" data-aos-duration="1500">
              <table>
                <caption>Q&A상세내용</caption>
                <thead>
                  <tr>
                    <th>
                      <div className="titleBox">
                        <div className={pst.answer === "Y" ? "state complete" : "state waiting"}>
                          <p>{pst.answer === "Y" ? "답변완료" : "답변대기"}</p>
                        </div>
                        <strong className="title">
                          {pst.pstTtl}
                        </strong>
                        <ul className="bot">
                          <li className="date"><p>{pst.pstClsfNm}</p></li>
                          <li className="date"><p>{moment(pst.frstCrtDt).format('YYYY-MM-DD')}</p></li>
                          <li className="name"><p>{pst.tblUser?.kornFlnm}</p></li>
                        </ul>
                      </div>
                      {pst.pstFiles != null && pst.pstFiles.length > 0 && (
                          <ul className="fileBox">
                            {pst.pstFiles.map((file, index) => (
                                <li key={index}>
                                  <a
                                      onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm, 'tbl_bbs', pst.bbsSn)}
                                      style={{cursor: "pointer"}}>
                                    <div className="icon"></div>
                                    <p className="name">{file.atchFileNm}</p>
                                    <span className="size">{(file.atchFileSz / 1024).toFixed(2)} KB</span>
                                  </a>
                                </li>
                            ))}
                          </ul>
                      )}
                      {/*{pst.pstFiles != null && pst.pstFiles.length > 0 && (
                          <button
                              type="button"
                              className="clickBtn"
                              onClick={() => fileZipDownLoad("pst_" + pst.pstSn, pst.pstTtl, 'tbl_bbs', pst.bbsSn)}>
                            압축
                          </button>
                      )}*/}

                      {pst.linkUrlAddr && (
                          <div className="titleBox">
                            <ul className="bot" style={{width:"95%"}}>
                              <li className="date">
                                <p>관련링크</p>
                              </li>
                              <li className="name"><NavLink to={pst.linkUrlAddr} target={"_blank"}>
                                {pst.linkUrlAddr ? pst.linkUrlAddr : ""}
                              </NavLink></li>
                            </ul>
                          </div>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="textBox" dangerouslySetInnerHTML={{__html: pst.pstCn}}>
                      </div>
                      {pst.answer == "Y" && (
                          <div className="answerBox">
                            <div className="titleBox">
                              <div className="state">
                                <p>답변</p>
                              </div>
                              <p className="title">답변 : {answer.pstTtl}</p>
                              <ul className="bot">
                                <li>
                                  <p>{answer != null && answer.frstCrtDt != null ? moment(answer.frstCrtDt).format('YYYY-MM-DD') : ""}</p>
                                </li>
                                <li><p>{answer.tblUser?.kornFlnm}</p></li>
                              </ul>
                            </div>
                            <div className="textBox" dangerouslySetInnerHTML={{__html: answer.pstCn}}>
                            </div>
                          </div>
                      )}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td>
                    <ul className="navigationBox">
                      <li className="prevBtn">
                        {pstPrevNext.find(i => i.position === "PREV") ? (
                            <a
                                style={{cursor: "pointer"}}
                                onClick={() =>
                                    pstPrevNextSearch(pstPrevNext.find(i => i.position === "PREV").pstSn)
                                }
                                key="prev"
                            >
                                  <div className="left">
                                    <span>이전글</span>
                                    <i className="icon"></i>
                                  </div>
                                  <p className="name">
                                    {pstPrevNext.find(i => i.position === "PREV").pstTtl}
                                  </p>
                                </a>
                            ) : (
                                <a key="prevNo">
                                  <div className="left">
                                    <span>이전글</span>
                                    <i className="icon"></i>
                                  </div>
                                  <p className="name">이전글이 존재하지 않습니다.</p>
                                </a>
                            )
                            }
                        </li>
                        <li className="nextBtn">
                          {pstPrevNext.find(i => i.position === "NEXT") ? (
                              <a
                                  style={{cursor: "pointer"}}
                                  onClick={() =>
                                      pstPrevNextSearch(pstPrevNext.find(i => i.position === "NEXT").pstSn)
                                  }
                                  key="next"
                              >
                                <div className="left">
                                  <span>다음글</span>
                                  <i className="icon"></i>
                                </div>
                                <p className="name">
                                  {pstPrevNext.find(i => i.position === "NEXT").pstTtl}
                                </p>
                              </a>
                          ) : (
                              <a key="nextNo">
                                <div className="left">
                                  <span>다음글</span>
                                  <i className="icon"></i>
                                </div>
                                <p className="name">다음글이 존재하지 않습니다.</p>
                              </a>
                          )
                          }
                        </li>
                      </ul>
                      <div className="buttonBox">
                        {bbs.ansPsbltyYn == "Y" && authrt.wrtAuthrt == "Y" && sessionUser.userSe == "ADM" && (
                            <Link
                                to={URL.COMMON_PST_QNA_CREATE}
                                state={{
                                  bbsSn: pst.bbsSn,
                                  pstGroup: pst.pstGroup,
                                  upPstSn: pst.pstSn,
                                  upPstClsf: pst.pstClsf,
                                  upPstTtl: pst.pstTtl,
                                  upRlsYn: pst.rlsYn,
                                  upPrvtPswd: pst.prvtPswd,
                                  menuSn: location.state?.menuSn,
                                  menuNmPath: location.state?.menuNmPath,
                                  thisMenuSn : location.state?.thisMenuSn,
                                }}
                                className="clickBtn editBtn"
                            >
                              <div className="icon"></div>
                              <span>답변</span>
                            </Link>
                        )}
                        {(authrt.mdfcnAuthrt == "Y" || pst.creatrSn == sessionUser?.userSn) && (
                            <Link
                                to={URL.COMMON_PST_QNA_MODIFY}
                                mode={CODE.MODE_MODIFY}
                                state={{
                                  pstSn: pst.pstSn,
                                  menuSn: location.state?.menuSn,
                                  menuNmPath: location.state?.menuNmPath,
                                  thisMenuSn : location.state?.thisMenuSn,
                                }}
                                className="clickBtn editBtn"
                            >
                              <div className="icon"></div>
                              <span>수정</span>
                            </Link>
                        )}
                        {(authrt.delAuthrt == "Y" || pst.creatrSn == sessionUser?.userSn) && (
                            <button type="button" className="clickBtn red"
                                    onClick={() => {
                                      setPstDel(pst.pstSn);
                                    }}
                            >
                              <span>삭제</span>
                            </button>
                        )}
                        <Link
                            to={URL.COMMON_PST_QNA_LIST}
                            state={{
                              bbsSn: bbs.bbsSn,
                              menuSn: location.state?.menuSn,
                              menuNmPath: location.state?.menuNmPath,
                              thisMenuSn : location.state?.thisMenuSn,
                            }}
                            className="clickBtn listBtn"
                        >
                          <div className="icon"></div>
                          <span>목록</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <CommonPstEval pstSn={pst.pstSn}/>
            </div>
          </div>
        </div>
      </div>
  );
}

export default commonPstDetail;
