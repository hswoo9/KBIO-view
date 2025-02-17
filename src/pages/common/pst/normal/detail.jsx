import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import {Link, useNavigate, useLocation, NavLink} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import Swal from "sweetalert2";
import AOS from "aos";
import moment from "moment";
import '@/css/quillSnow.css';
import '@/css/manager/managerPstDetail.css';
import { getSessionItem, setSessionItem } from "@/utils/storage";
import {fileDownLoad, fileZipDownLoad} from "@/components/CommonComponents.jsx";
import CommonPstEval from "../eval.jsx";
import {getComCdList} from "../../../../components/CommonComponents.jsx";
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

  useEffect(() => {
    AOS.init();
  }, []);

  return (
      <div id="container" className="container notice board">
        <div className="inner">
          <CommonSubMenu/>
          <div className="inner2">
            <div className="board_view" data-aos="fade-up" data-aos-duration="1500">
              <table>
                <caption>게시판 상세</caption>
                <thead>
                  <tr>
                    <th>
                      <div className="titleBox">
                        <div className="title">
                          <p>
                            {bbs.pstCtgryYn == "Y" && comCdList.length > 0 && (
                                <>
                                  {comCdList.find(e => e.comCdSn == pst.pstClsf).comCdNm}
                                </>
                            )}
                          </p>
                        </div>
                        <strong className="title">{pst.pstTtl}</strong>
                        <ul className="bot">
                          <li className="date"><p>{moment(pst.frstCrtDt).format('YYYY-MM-DD')}</p></li>
                          <li className="name"><p>{pst.kornFlnm}</p></li>
                        </ul>
                      </div>
                      <ul className="fileBox">
                        {pst.pstFiles != null && pst.pstFiles.length > 0 && (
                            <>
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
                            </>
                        )}
                        {/*{pst.pstFiles != null && pst.pstFiles.length > 0 && (
                            <button
                                type="button"
                                className="clickBtn"
                                onClick={() => fileZipDownLoad("pst_" + pst.pstSn, pst.pstTtl, 'tbl_bbs', pst.bbsSn)}>
                              압축
                            </button>
                        )}*/}
                      </ul>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <NavLink to={pst.linkUrlAddr} target={"_blank"}>
                        {pst.linkUrlAddr ? "외부링크 " + pst.linkUrlAddr : ""}
                      </NavLink>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="textBox" dangerouslySetInnerHTML={{__html: pst.pstCn}}>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td>
                    <ul className="navigationBox">
                      <li className="prevBtn">
                        <a href="#">
                          <div className="left">
                            <span>이전글</span>
                            <i className="icon"></i>
                          </div>
                          {pstPrevNext.find(i => i.position === "PREV") ? (
                              <p className="name" style={{cursor: "pointer"}}
                                 onClick={() =>
                                     pstPrevNextSearch(pstPrevNext.find(i => i.position === "PREV").pstSn)
                                 }
                              >
                                {pstPrevNext.find(i => i.position === "PREV").pstTtl}
                              </p>
                          ) : (<p className="name">이전글이 존재하지 않습니다.</p>)
                          }
                        </a>
                      </li>
                      <li className="nextBtn">
                        <a href="#">
                          <div className="left">
                            <span>다음글</span>
                            <i className="icon"></i>
                          </div>
                          {pstPrevNext.find(i => i.position === "NEXT") ? (
                              <p className="name" style={{cursor: "pointer"}}
                                 onClick={() =>
                                     pstPrevNextSearch(pstPrevNext.find(i => i.position === "NEXT").pstSn)
                                 }
                              >
                                {pstPrevNext.find(i => i.position === "NEXT").pstTtl}
                              </p>
                          ) : (<p className="name">다음글이 존재하지 않습니다.</p>)
                          }
                        </a>
                      </li>
                    </ul>
                    <div className="buttonBox">
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
                              className="clickBtn"
                          >
                            <span>수정</span>
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
                      <Link
                          to={URL.COMMON_PST_NORMAL_LIST}
                          state={{
                            bbsSn: bbs.bbsSn,
                            menuSn : location.state?.menuSn,
                            menuNmPath : location.state?.menuNmPath,
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
