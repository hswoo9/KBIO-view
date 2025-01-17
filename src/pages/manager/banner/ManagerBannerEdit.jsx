import React, {useState, useEffect, useRef, useCallback} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftBannerPopup";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";

import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import { getSessionItem } from "@/utils/storage";

function ManagerBannerEdit(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);
  const sessionUser = getSessionItem("loginUser");

  const [searchDto, setSearchDto] = useState(
      {
        search: "",
      }
  );

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });

  const [bnrPopupDetail, setBnrPopupDetail] = useState({});
  useEffect(() => {
    console.log(bnrPopupDetail);
  }, [bnrPopupDetail]);

  const [comCdGroupList, setComCdGroupList] = useState([]);
  useEffect(() => {
    console.log(comCdGroupList);
  }, [comCdGroupList]);

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
        const menuListURL = "/commonApi/setComCd";
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
        const menuListURL = "/commonApi/setComCdDel";
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
    //getBannerPopupData();
  };

  const getBannerPopupData = () => {
    if(modeInfo.mode === CODE.MODE_CREATE){
      setBnrPopupDetail({
        creatrSn: sessionUser.userSn,
        actvtnYn: "Y",
        bnrPopupSn: location.state?.bnrPopupSn
      });
      return;
    }

    const getBannerPopupDataURL = `/commonApi/getComCd`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({bnrPopupSn : location.state?.bnrPopupSn})
    };

    EgovNet.requestFetch(getCdDetailURL, requestOptions, function (resp) {
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          setBnrPopupDetail(resp.result.comCd);
        } else {
          navigate(
              { pathname: URL.ERROR },
              { state: { msg: resp.resultMessage } }
          );
        }

      }
    });

  };

  const getComCdList = useCallback(
      (searchDto) => {
        const comCdListURL = "/commonApi/getComCdGroupList.do";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(searchDto)
        };
        EgovNet.requestFetch(
            comCdListURL,
            requestOptions,
            (resp) => {
              setComCdGroupList(resp.result.cdGroupList);
            },
            function (resp) {
              console.log("err response : ", resp);
            }
        )
      },
      [comCdGroupList, searchDto]
  )

  const dataListToOptionHtml = (data, filterField, filterData) => {
    console.log(" CALL dataListToOptionHtml : " + filterField + " , " + filterData);
    if(data != null){
      if(data.length > 0){
        const returnList = [];
        data.map((v) => {
          if(v[filterField] == filterData){
            if(v.comCdList != null){
              v.comCdList.forEach(function (item, index){
                returnList.push(
                    <option key={item.comCdSn} value={item.cd}>{item.cdNm}</option>
                )
              })
            }
          }
        });
        return returnList;
      }else{
        return (
            <></>
        )
      }
    }else{
      return (
          <></>
      )
    }
  }

  useEffect(() => {
    getComCdList(searchDto);
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
              <Link to={URL.MANAGER_BANNER_LIST}>배너팝업관리</Link>
            </li>
            {modeInfo.mode === CODE.MODE_CREATE && (
                <li>배너등록</li>

            )}
            {modeInfo.mode === CODE.MODE_MODIFY && (
                <li>배너수정</li>
            )}
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
                  <h2 className="tit_2">배너 등록</h2>
              )}

              {modeInfo.mode === CODE.MODE_MODIFY && (
                  <h2 className="tit_2">배너 수정</h2>
              )}

              <div className="board_view2">
                <dl>
                  <dt>
                    <label htmlFor="cd">배너종류</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <Form.Select
                        size="sm"
                        id="bnrPopupKnd"
                    >
                      {dataListToOptionHtml(comCdGroupList, "cdGroup", "BANNER_POPUP_GROUP")}
                        defaultValue={bnrPopupDetail.bnrPopupKnd}
                        onChange={(e) =>
                          setBnrPopupDetail({...bnrPopupDetail, bnrPopupKnd: e.target.value})
                      }
                      ref={(el) => (checkRef.current[0] = el)}
                    </Form.Select>
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="cdNm">배너제목</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="bnrPopupTtl"
                        placeholder=""
                        required="required"
                        defaultValue={bnrPopupDetail.bnrPopupTtl}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, bnrPopupTtl: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="rmrkCn">배너형식</label>
                  </dt>
                  <dd>
                    <Form.Check
                      inline
                      type="radio"
                      label="이미지형식"
                      id="1"
                      name="bnrPopupFrm"
                      defaultValue={bnrPopupDetail.bnrPopupFrm}
                      onChange={(e) =>
                          setBnrPopupDetail({...bnrPopupDetail, bnrPopupFrm: e.target.value})
                      }
                      ref={(el) => (checkRef.current[0] = el)}
                    />
                    
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="etcMttr1">파일선택</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <Form.Group controlId="formFile">
                      <Form.Control type="file" />
                    </Form.Group>
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="etcMttr2">배너링크</label>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="bnrPopupUrlAddr"
                        placeholder=""
                        defaultValue={bnrPopupDetail.bnrPopupUrlAddr}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, bnrPopupUrlAddr: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="etcMttr3">사용여부</label>
                  </dt>
                  <dd>
                    <Form.Select
                        size="sm"
                        id="useYn"
                        defaultValue={bnrPopupDetail.useYn}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, useYn: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    >
                      {dataListToOptionHtml(comCdGroupList, "cdGroup", "ACTVTN_YN")}
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

export default ManagerBannerEdit;
