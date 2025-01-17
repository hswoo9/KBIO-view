import React, {useState, useEffect, useRef, useCallback} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftCode";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";

import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import { getSessionItem } from "@/utils/storage";

function ManagerCodeEdit(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);
  const sessionUser = getSessionItem("loginUser");

  const [searchDto, setSearchDto] = useState({bbsSn : location.state?.bbsSn});

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });

  const [cdDetail, setCdDetail] = useState({});
  useEffect(() => {
    console.log(cdDetail);
  }, [cdDetail]);

  const [saveEvent, setSaveEvent] = useState({});
  useEffect(() => {
    if(saveEvent.save){
      if(saveEvent.mode == "save"){
        saveCdData(cdDetail);
      }
      if(saveEvent.mode == "delete"){
        delCdData(cdDetail);
      }

    }
  }, [saveEvent]);

  const saveBtnEvent = () => {
    Swal.fire({
      title: "저장하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        if(cdDetail.cd == null){
          Swal.fire("코드가 없습니다.");
          return;
        }
        if(cdDetail.cdNm == null){
          Swal.fire("코드명이 없습니다.");
          return;
        }
        setSaveEvent({
          ...saveEvent,
          save: true,
          mode: "save"
        });
      } else {
      }
    });
  }

  const delBtnEvent = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        setSaveEvent({
          ...saveEvent,
          save: true,
          mode: "delete"
        });
      } else {
        //취소
      }
    });
  }

  const saveCdData = useCallback(
      (cdDetail) => {
        const menuListURL = "/codeApi/setComCd";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(cdDetail)
        };
        EgovNet.requestFetch(
            menuListURL,
            requestOptions,
            (resp) => {

              if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                navigate(
                    { pathname: URL.MANAGER_CODE },
                    { state:
                          { cdGroupSn: location.state?.cdGroupSn }
                    }
                );
              } else {
                navigate(
                    { pathname: URL.ERROR },
                    { state: { msg: resp.resultMessage } }
                );
              }

            }
        )
      }
  );

  const delCdData = useCallback(
      (cdDetail) => {
        const menuListURL = "/codeApi/setComCdDel";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(cdDetail)
        };
        EgovNet.requestFetch(
            menuListURL,
            requestOptions,
            (resp) => {

              if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                navigate({ pathname: URL.MANAGER_CODE }, { state: { cdGroupSn : location.state?.cdGroupSn }});
              } else {
                navigate(
                    { pathname: URL.ERROR },
                    { state: { msg: resp.resultMessage } }
                );
              }

            }
        )
      }
  );


  const initMode = () => {
    switch (props.mode){
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: "등록",
        });
        break;
      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: "수정",
        });
        break;
      default:
        navigate({ pathname: URL.ERROR }, { state: { msg: "" } });
    }
    getCdDetail();
  };

  const getCdDetail = () => {
    if(modeInfo.mode === CODE.MODE_CREATE){
      setCdDetail({
        creatrSn: sessionUser.userSn,
        actvtnYn: "Y",
        cdGroupSn: location.state?.cdGroupSn
      });
      return;
    }

    const getCdDetailURL = `/codeApi/getComCd`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({comCdSn : location.state?.comCdSn})
    };

    EgovNet.requestFetch(getCdDetailURL, requestOptions, function (resp) {
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          setCdDetail(resp.result.comCd);
        } else {
          navigate(
              { pathname: URL.ERROR },
              { state: { msg: resp.resultMessage } }
          );
        }

      }
    });

  };

  useEffect(() => {
    initMode();
  }, []);

  const Location = React.memo(function Location() {
    return (
        <div className="location">
          <ul>
            <li>
              <Link to={URL.MANAGER} className="home">
                Home
              </Link>
            </li>
            <li>
              <Link to={URL.MANAGER_CODE_GROUP}>코드관리</Link>
            </li>
            <li>코드등록</li>
          </ul>
        </div>
    );
  });

  return (
      <div className="container">

        <div className="c_wrap">
          <Location/>
          <div className="layout">
            <EgovLeftNav></EgovLeftNav>

            <div className="contents BOARD_CREATE_REG" id="contents">
              {modeInfo.mode === CODE.MODE_CREATE && (
                  <h2 className="tit_2">코드 등록</h2>
              )}

              {modeInfo.mode === CODE.MODE_MODIFY && (
                  <h2 className="tit_2">코드 수정</h2>
              )}

              <div className="board_view2">
                <dl>
                  <dt>
                    <label htmlFor="cd">코드</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="cd"
                        placeholder=""
                        required="required"
                        defaultValue={cdDetail.cd}
                        onChange={(e) =>
                            setCdDetail({...cdDetail, cd: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="cdNm">코드명</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="cdNm"
                        placeholder=""
                        required="required"
                        defaultValue={cdDetail.cdNm}
                        onChange={(e) =>
                            setCdDetail({...cdDetail, cdNm: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="rmrkCn">비고</label>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="rmrkCn"
                        placeholder=""
                        required="required"
                        defaultValue={cdDetail.rmrkCn}
                        onChange={(e) =>
                            setCdDetail({...cdDetail, rmrkCn: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="etcMttr1">기타1</label>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="etcMttr1"
                        placeholder=""
                        defaultValue={cdDetail.etcMttr1}
                        onChange={(e) =>
                            setCdDetail({...cdDetail, etcMttr1: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="etcMttr2">기타2</label>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="etcMttr2"
                        placeholder=""
                        defaultValue={cdDetail.etcMttr2}
                        onChange={(e) =>
                            setCdDetail({...cdDetail, etcMttr2: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="etcMttr3">기타3</label>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="etcMttr3"
                        placeholder=""
                        defaultValue={cdDetail.etcMttr3}
                        onChange={(e) =>
                            setCdDetail({...cdDetail, etcMttr3: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="etcMttr4">기타4</label>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="etcMttr4"
                        placeholder=""
                        defaultValue={cdDetail.etcMttr4}
                        onChange={(e) =>
                            setCdDetail({...cdDetail, etcMttr4: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="etcMttr5">기타5</label>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="etcMttr5"
                        placeholder=""
                        defaultValue={cdDetail.etcMttr5}
                        onChange={(e) =>
                            setCdDetail({...cdDetail, etcMttr5: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="sortSeq">정렬순서</label>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="sortSeq"
                        placeholder=""
                        defaultValue={cdDetail.sortSeq}
                        onChange={(e) =>
                            setCdDetail({...cdDetail, sortSeq: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="actvtnYn">활성여부</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <Form.Select
                        size="sm"
                        id="actvtnYn"
                        onChange={(e) =>
                            setCdDetail({...cdDetail, actvtnYn: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    >
                      <option value="Y">사용</option>
                      <option value="N">미사용</option>
                    </Form.Select>
                  </dd>
                </dl>
                {/* <!-- 버튼영역 --> */}
                <div className="board_btn_area">
                  <div className="left_col btn1">
                    <BTButton variant="primary"
                              onClick={saveBtnEvent}
                    >
                      저장
                    </BTButton>
                    {modeInfo.mode === CODE.MODE_MODIFY && (
                        <BTButton variant="danger"
                                  onClick={delBtnEvent}
                        >
                          삭제
                        </BTButton>
                    )}
                  </div>

                  <div className="right_col btn1">
                    <Link to={URL.MANAGER_CODE}
                      state={{
                        cdGroupSn: location.state?.cdGroupSn
                      }}
                    >
                      <BTButton variant="secondary">목록</BTButton>
                    </Link>
                  </div>
                </div>
                {/* <!--// 버튼영역 --> */}
              </div>

              {/* <!--// 본문 --> */}
            </div>
          </div>
        </div>
      </div>
  );
}

export default ManagerCodeEdit;
