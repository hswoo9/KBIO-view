import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftBoard";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import Form from "react-bootstrap/Form";
import ReactDatePicker from 'react-datepicker';
import moment from "moment";
import ReactQuill from 'react-quill-new';
import '@/css/quillSnow.css';
import '@/css/manager/managerPstDetail.css';
import PstEvl  from "./PstEvl.jsx";
import {getSessionItem} from "../../../../utils/storage.js";
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import {fileDownLoad} from "@/components/CommonComponents.jsx";

function setPst(props) {
  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();

  const [searchDto, setSearchDto] = useState({
    bbsSn : location.state?.bbsSn,
    pstSn : location.state?.pstSn
  });

  const [pstDetail, setPstDetail] = useState({});
  const [pstPrevNext, setPstPrevNext] = useState([]);
  const [bbsDetail, setBbsDetail] = useState({});


  /** 댓글 */
  const initialCommentState = {
    cmntSeq: 0,
    cmntStp: 0,
    creatrSn: sessionUser.userSn,
    mode : "load"
  };

  /** 대댓글, 수정 */
  const [pstSubCmnt, setPstSubCmnt] = useState(initialCommentState); // 현재 활성화된 답글 입력창 ID
  /** 댓글 */
  const [pstCmnt, setPstCmnt] = useState(initialCommentState)


  const [pstCmntInput, setPstCmntInput] = useState(null);
  const [pstCmntList, setPstCmntList] = useState([]);
  const getPst = (searchDto) => {
    const getPstURL = `/pstApi/getPst`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(searchDto)
    };

    EgovNet.requestFetch(getPstURL, requestOptions, function (resp) {
      setBbsDetail(resp.result.bbs);
      setPstDetail(resp.result.pst);
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
          body: JSON.stringify({pstSn: pstDetail.pstSn}),
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
              setPstCmnt({...pstCmnt, pstSn: pstDetail.pstSn});
              setPstSubCmnt({...initialCommentState, pstSn: pstDetail.pstSn});

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
              { pathname : URL.MANAGER_PST_LIST},
              { state: {
                  bbsSn: bbsDetail.bbsSn,
                  atchFileYn: bbsDetail.atchFileYn,
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

  const handleCmnt = (pstCmntSn, cmntGrp) => {
    setPstSubCmnt({
      ...initialCommentState,
      upPstCmntSn : pstCmntSn,
      cmntGrp : cmntGrp,
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
    setPstSubCmnt({...initialCommentState, pstSn: pstDetail.pstSn});
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

  return (
      <div className="container">
        <ManagerLeftNew/>
        <div className="c_wrap">
          <div className="location">
            <ul>
              <li>
                <Link to={URL.MANAGER} className="home">
                  Home
                </Link>
              </li>
              <li>
                <Link
                    to={URL.MANAGER_PST_LIST}
                    state={{
                      bbsSn : bbsDetail.bbsSn,
                      atchFileYn : bbsDetail.atchFileYn
                    }}
                >
                  게시글관리
                </Link>
              </li>
              <li>게시글상세보기</li>
            </ul>
          </div>

          <div className="layout">
            <EgovLeftNav></EgovLeftNav>

            <div className="contents BOARD_CREATE_REG" id="contents">
              <h2 className="tit_2">게시글 상세보기</h2>
              <div className="board_view2">
                <dl>
                  <dt>
                    <label htmlFor="pstTtl">제목</label>
                  </dt>
                  <dd>
                    {pstDetail.pstTtl}
                  </dd>
                </dl>

                <dl>
                  <dt>
                    <label htmlFor="pstTtl">작성일</label>
                  </dt>
                  <dd>
                    {moment(pstDetail.frstCrtDt).format('YYYY-MM-DD')}
                  </dd>
                </dl>
                {bbsDetail.atchFileYn == "Y" && (
                    <dl>
                      <dt>
                        <label htmlFor="pstTtl">첨부파일</label>
                      </dt>
                      <dd>
                        {pstDetail.pstFiles.length > 0 && (
                            <ul>
                              {pstDetail.pstFiles.map((file, index) => (
                                  <li key={index}>
                                    <span onClick={() =>  fileDownLoad(file.atchFileSn, file.atchFileNm)}>{file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB</span>
                                  </li>
                              ))}
                            </ul>
                        )}
                      </dd>
                    </dl>
                )}
                <dl>
                  <dt>
                    <label htmlFor="pstTtl">외부링크</label>
                  </dt>
                  <dd>
                    {pstDetail.linkUrlAddr}
                  </dd>
                </dl>

                <dl>
                  <dt>
                    <label htmlFor="pstCn">
                      내용
                    </label>
                  </dt>
                  <dd dangerouslySetInnerHTML={{__html: pstDetail.pstCn}}/>
                </dl>
              </div>
              {bbsDetail.cmntPsbltyYn == "Y" && (
                  <div className="comment_section">
                    <h3 className="comment_title">댓글</h3>
                    <div className="comments_list">
                      {pstCmntList ? (
                          <ul>
                            {pstCmntList.map((v, i) => (
                                <li key={i} id={v.pstCmntSn} className="comment_item"
                                    style={v.cmntStp > 0 ? { marginLeft: `${v.cmntStp * 20}px` } : {}}>
                                  <div className="comment_content" >
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
                                          onClick={() => handleCmnt(v.pstCmntSn, v.cmntGrp)}
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
              )}

            <div className="bottom_navi">
              <dl>
                <dt>이전글</dt>
                <dd>
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
                </dd>
              </dl>
              <dl>
                <dt>다음글</dt>
                <dd>
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
                  </dd>
                </dl>
              </div>


              {/* <!-- 버튼영역 --> */}
              <div className="board_btn_area">
                <div className="left_col btn1">
                  {bbsDetail.ansPsbltyYn == "Y" && (
                      <Link
                          to={URL.MANAGER_PST_CREATE}
                          className="btn btn_blue_h46 pd35"
                          state={{
                            bbsSn: pstDetail.bbsSn,
                            pstGroup: pstDetail.pstGroup,
                            upPstSn: pstDetail.pstSn,
                          }}
                      >
                        답변
                      </Link>
                  )}
                  <Link
                      to={URL.MANAGER_PST_MODIFY}
                      mode={CODE.MODE_MODIFY}
                      className="btn btn_skyblue_h46 w_100"
                      state={{
                        pstSn: pstDetail.pstSn,
                      }}
                  >
                    수정
                  </Link>
                  <button
                      className="btn btn_skyblue_h46 w_100"
                      onClick={() => {
                        setPstDel(pstDetail.pstSn);
                      }}
                  >
                    삭제
                  </button>
                </div>

                <div className="right_col btn1">
                  <Link
                      to={URL.MANAGER_PST_LIST}
                      className="btn btn_blue_h46 w_100"
                      state={{
                        bbsSn: bbsDetail.bbsSn,
                        atchFileYn: bbsDetail.atchFileYn
                      }}
                  >
                    목록
                  </Link>
                </div>
              </div>
              <PstEvl pstSn={pstDetail.pstSn}/>
            </div>

          </div>
        </div>
      </div>
  );
}

export default setPst;
