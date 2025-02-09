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
import Eval  from "../../../../common/pst/eval.jsx";
import { getSessionItem, setSessionItem } from "@/utils/storage";
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
      setBbsDetail(resp.result.bbs);
      setPstDetail(resp.result.pst);
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
              { pathname : URL.MANAGER_PST_FAQ_LIST},
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

  useEffect(() => {
    getPst(searchDto);
  }, [searchDto.pstSn]);

  return (
      <div id="container" className="container layout cms">
        <ManagerLeftNew/>
        <div className="inner">
          <h2 className="pageTitle"><p>게시글 상세보기</p></h2>
          <div className="contBox">
            <div className="box infoBox">
              <ul className="listBox">
                {bbsDetail.pstCtgryYn == "Y" && (
                    <li className="inputBox type1 width1">
                      <label className="title"><small>분류</small></label>
                      <div className="input">{pstDetail.pstClsfNm}</div>
                    </li>
                )}
                <li className="inputBox type1 width1">
                  <label className="title"><small>제목</small></label>
                  <div className="input">{pstDetail.pstTtl}</div>
                </li>
                <li className="inputBox type1 width1">
                  <label className="title"><small>작성일</small></label>
                  <div className="input">{moment(pstDetail.frstCrtDt).format('YYYY-MM-DD')}</div>
                </li>
                {bbsDetail.atchFileYn == "Y" && (
                    <li className="inputBox type1 width1">
                      <label className="title"><small>첨부파일</small></label>
                      <div className="input">
                        {pstDetail.pstFiles.length > 0 && (
                            <ul>
                              {pstDetail.pstFiles.map((file, index) => (
                                  <li key={index}>
                                    <span
                                        onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}>{file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB</span>
                                  </li>
                              ))}
                            </ul>
                        )}
                      </div>
                    </li>
                )}
                <li className="inputBox type1 width1">
                  <label className="title"><small>외부링크</small></label>
                  <div className="input">{pstDetail.linkUrlAddr}</div>
                </li>
                <li className="inputBox type1 width1">
                  <label className="title"><small>내용</small></label>
                  <div className="input" dangerouslySetInnerHTML={{__html: pstDetail.pstCn}}></div>
                </li>
              </ul>
              <div className="buttonBox">
                <div className="left">
                  <Link
                      to={URL.MANAGER_PST_FAQ_MODIFY}
                      mode={CODE.MODE_MODIFY}
                      state={{
                        pstSn: pstDetail.pstSn,
                      }}
                  >
                    <button type="button" className="clickBtn"><span>수정</span></button>
                  </Link>
                  <button type="button" className="clickBtn red"
                          onClick={() => {
                            setPstDel(pstDetail.pstSn);
                          }}
                  >
                    <span>삭제</span>
                  </button>
                </div>
                <div className="right">
                  <Link
                      to={URL.MANAGER_PST_FAQ_LIST}
                      state={{
                        bbsSn: bbsDetail.bbsSn,
                        atchFileYn: bbsDetail.atchFileYn
                      }}
                  >
                  <button type="button" className="clickBtn white"><span>목록</span></button>
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
      </div>
  );
}

export default setPst;
