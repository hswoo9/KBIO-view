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
    userSn : sessionUser ? sessionUser.userSn : ""
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

  /** 댓글 */
  const initialCommentState = {
    cmntSeq: 0,
    cmntStp: 0,
    creatrSn: sessionUser ? sessionUser.userSn : "",
    mode : "load"
  };

  /** 대댓글, 수정 */
  const [pstSubCmnt, setPstSubCmnt] = useState(initialCommentState); // 현재 활성화된 답글 입력창 ID
  /** 댓글 */
  const [pstCmnt, setPstCmnt] = useState(initialCommentState)

  const [pstCmntInput, setPstCmntInput] = useState(null);
  const [pstCmntList, setPstCmntList] = useState([]);
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

      const cmntList = resp.result.pst.pstCmnt || [];
      const updatedCmnts = cmntList.map((cmnt) => ({
        ...cmnt,
        replyRow: cmnt.cmntStp > 0,
      }));
      setPstCmntList(updatedCmnts);
      setPstCmnt({...pstCmnt, pstSn: resp.result.pst.pstSn});
      setPstSubCmnt({...pstSubCmnt, pstSn: resp.result.pst.pstSn});
    });
  };

  const getPstCmnt = useCallback(
      () => {
        const getPstCmntUrl = "/pstApi/getPstCmntList";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({pstSn: pst.pstSn}),
        };

        EgovNet.requestFetch(
            getPstCmntUrl,
            requestOptions,
            (resp) => {
              const cmntList = resp.result.pstCmntList || [];
              const updatedCmnts = cmntList.map((cmnt) => ({
                ...cmnt,
                replyRow: cmnt.cmntStp > 0,
              }));
              setPstCmntList(updatedCmnts);
              setPstCmnt({...pstCmnt, pstSn: pst.pstSn});
              setPstSubCmnt({...initialCommentState, pstSn: pst.pstSn});

              const actionBtns = document.querySelectorAll(".comment_action_btn");
              actionBtns.forEach((btn) => {
                btn.style.display = "block";
              });

            },
            function (resp) {
              console.log("err response : ", resp);
            }
        )
      }, [pstCmntList]
  )

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
              { pathname : URL.COMMON_PST_NORMAL_LIST},
              { state: {
                  bbsSn: bbs.bbsSn,
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

  const handleSubmit = (type) => {
    let pstCmntSubmit = type === "sub" ? pstSubCmnt : pstCmnt;

    if (!pstCmntSubmit.cmntCn) {
      alert("댓글을 입력해주세요.");
      return;
    }

    const setPstCmntUrl = "/pstApi/setPstCmnt";
    Swal.fire({
      title: "등록하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소"
    }).then((result) => {
      if (result.isConfirmed) {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(pstCmntSubmit),
        };

        EgovNet.requestFetch(setPstCmntUrl, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("댓글이 등록되었습니다");
            document.getElementById("cmntCn").value = "";
            setPstCmntInput(null);
            getPstCmnt();
          } else {
            alert("ERR : " + resp.resultMessage);
          }
        });
      } else {
        //취소
      }
    });
  };

  const handleCmnt = (pstCmntSn, cmntGrp, pstSn) => {
    setPstSubCmnt({
      ...initialCommentState,
      upPstCmntSn : pstCmntSn,
      cmntGrp : cmntGrp,
      pstSn: pstSn,
    })
    setPstCmntInput((prev) => (prev === pstCmntSn ? null : pstCmntSn));
  };

  const handleEdit = (pstCmntSn) => {
    setPstCmntInput(null);
    setPstSubCmnt(pstCmntList.find((comment) => comment.pstCmntSn === pstCmntSn));
    const commentActions = document.getElementById(pstCmntSn).querySelector(".comment_actions");
    const actionBtns = commentActions.querySelectorAll(".comment_action_btn");
    actionBtns.forEach((btn) => {
      btn.style.display = "none";
    });
  };

  const handleEditCancel = () => {
    setPstSubCmnt({...initialCommentState, pstSn: pst.pstSn});
    const actionBtns = document.querySelectorAll(".comment_action_btn");
    actionBtns.forEach((btn) => {
      btn.style.display = "block";
    });
  };

  const handleDelete = (pstCmntSn) => {
    const setPstCmntDelUrl = "/pstApi/setPstCmntDel";
    Swal.fire({
      title: "댓글을 삭제하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소"
    }).then((result) => {
      if (result.isConfirmed) {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({pstCmntSn : pstCmntSn}),
        };

        EgovNet.requestFetch(setPstCmntDelUrl, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("댓글이 삭제되었습니다");
            getPstCmnt();
          } else {
            alert("ERR : " + resp.resultMessage);
          }
        });
      } else {
        //취소
      }
    });
  };

  function activeEnter (e, type) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(type)
    }
  }

  useEffect(() => {
    getPst(searchDto);
  }, [searchDto.pstSn]);

  useEffect(() => {
    if(bbs.pstCtgryYn == "Y"){
      const cdGroupSn =
          bbs.bbsTypeNm == "0" ? 7 :
              bbs.bbsTypeNm == "1" ? 9 : 8

      getComCdList(cdGroupSn).then((data) => {
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
                                        onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm, 'tbl_bbs', pst.bbsSn)}
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
                  <label className="title"><small>외부링크</small></label>
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

                {bbs.cmntPsbltyYn == "Y" && (
                    <li>
                      <div className="comment_section">
                        <h3 className="comment_title">댓글</h3>
                        <div className="comments_list">
                          {pstCmntList ? (
                              <ul>
                                {pstCmntList.map((v, i) => (
                                    <li key={i} id={v.pstCmntSn} className="comment_item"
                                        style={v.cmntStp > 0 ? {marginLeft: `${v.cmntStp * 20}px`} : {}}>
                                      <div className="comment_content">
                                        {/* 댓글 내용 */}
                                        {pstSubCmnt.pstCmntSn === v.pstCmntSn ? (
                                            <input
                                                type="text"
                                                placeholder="댓글을 작성하세요"
                                                className="comment_input"
                                                id={"cmntCn" + v.pstCmntSn}
                                                value={pstSubCmnt.cmntCn} // 상태에서 값 가져오기
                                                onChange={(e) => setPstSubCmnt({
                                                  ...pstSubCmnt,
                                                  cmntCn: e.target.value
                                                })}
                                                onKeyDown={(e) =>
                                                    activeEnter(e, "sub")
                                                }
                                            />
                                        ) : (
                                            <p className={v.cmntStp > 0 ? 'reply_row' : ''} id={'cmntCn' + v.pstCmntSn}>
                                              {v.cmntCn}
                                            </p>
                                        )}
                                      </div>
                                      <div className="comment_footer">
                                  <span className="comment_date">
                                    {moment(v.frstCrtDt).format('YYYY-MM-DD HH:mm')}
                                  </span>
                                        <div className="comment_actions">
                                          {/* Reply button */}
                                          <button
                                              className="comment_action_btn reply_btn"
                                              onClick={() => handleCmnt(v.pstCmntSn, v.cmntGrp, v.pstSn)}
                                          >
                                            답글
                                          </button>

                                          {v.creatrSn === sessionUser.userSn && (
                                              <>
                                                {/* 저장 및 취소 버튼 */}
                                                {pstSubCmnt.pstCmntSn === v.pstCmntSn ? (
                                                    <>
                                                      <button
                                                          id={`save_btn_${v.pstCmntSn}`}
                                                          className="comment_action_btn reply_btn"
                                                          onClick={() => handleSubmit("sub")}
                                                      >
                                                        저장
                                                      </button>
                                                      <button
                                                          id={`editCancel_btn_${v.pstCmntSn}`}
                                                          className="comment_action_btn delete_btn"
                                                          onClick={() => handleEditCancel()}
                                                      >
                                                        취소
                                                      </button>
                                                    </>
                                                ) : null}

                                                {/* 댓글 수정 및 삭제 버튼 */}
                                                <button
                                                    className="comment_action_btn edit_btn"
                                                    onClick={() => handleEdit(v.pstCmntSn)}
                                                >
                                                  수정
                                                </button>
                                                <button
                                                    className="comment_action_btn delete_btn"
                                                    onClick={() => handleDelete(v.pstCmntSn)}
                                                >
                                                  삭제
                                                </button>
                                              </>
                                          )}
                                        </div>
                                      </div>
                                      {pstCmntInput === v.pstCmntSn && (
                                          <div className="comment_form" style={{marginTop: "10px"}}>
                                            <input
                                                type="text"
                                                placeholder="댓글을 작성하세요"
                                                className="comment_input"
                                                id={"subCmntCn" + v.pstCmntSn}
                                                onChange={(e) =>
                                                    setPstSubCmnt({...pstSubCmnt, cmntCn: e.target.value})
                                                }
                                                onKeyDown={(e) =>
                                                    activeEnter(e, "sub")
                                                }
                                            ></input>
                                            <button
                                                className="comment_submit"
                                                onClick={() => handleSubmit('sub')}>
                                              댓글 작성
                                            </button>
                                          </div>
                                      )}

                                    </li>


                                ))}
                              </ul>
                          ) : (
                              <p className="no_comments">댓글이 없습니다.</p>
                          )}

                        </div>
                        <div className="comment_form">
                          <input
                              type="text"
                              placeholder="댓글을 작성하세요"
                              className="comment_input"
                              id="cmntCn"
                              onChange={(e) =>
                                  setPstCmnt({...pstCmnt, cmntCn: e.target.value})
                              }
                              onKeyDown={(e) =>
                                  activeEnter(e, "new")
                              }
                          ></input>
                          <button
                              className="comment_submit"
                              onClick={() => handleSubmit("new")}>
                            댓글 작성
                          </button>
                        </div>
                      </div>
                    </li>
                )}

              </ul>
              <div className="buttonBox">
                <div className="left">
                  {bbs.ansPsbltyYn == "Y" && (
                      <Link
                          to={URL.COMMON_PST_NORMAL_CREATE}
                          state={{
                            bbsSn: pst.bbsSn,
                            pstGroup: pst.pstGroup,
                            upPstSn: pst.pstSn,
                          }}
                      >
                        <button type="button" className="clickBtn">
                          답변
                        </button>
                      </Link>
                  )}
                  {authrt.mdfcnAuthrt == "Y" && (
                      <Link
                          to={URL.COMMON_PST_NORMAL_MODIFY}
                          mode={CODE.MODE_MODIFY}
                          state={{
                            pstSn: pst.pstSn,
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
                      to={URL.COMMON_PST_NORMAL_LIST}
                      state={{
                        bbsSn: bbs.bbsSn,
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
