
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

function setPst(props) {
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

  useEffect(() => {
    getPst(searchDto);
  }, [searchDto.pstSn]);

  return (
      <div className="container">
        <style>{`
          .layout dt {
            width: 200px !important;
          }
        `}</style>
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
                                    {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
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
                    {pstDetail.otsdLink}
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
              <div className="bottom_navi">
                <dl>
                  <dt>이전글</dt>
                  <dd>
                    {pstPrevNext.find(i => i.position === "PREV") ? (
                      <span style={{cursor:"pointer"}}
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
                        <span style={{cursor:"pointer"}}
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
                  {bbsDetail.replyPsbltyYn == "Y" && (
                      <Link
                          to={URL.MANAGER_PST_CREATE}
                          className="btn btn_blue_h46 pd35"
                          state={{
                            bbsSn : pstDetail.bbsSn,
                            pstGroup : pstDetail.pstGroup,
                            orgnlPstSn: pstDetail.pstSn,
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
            </div>
          </div>
        </div>
      </div>
  );
}

export default setPst;
