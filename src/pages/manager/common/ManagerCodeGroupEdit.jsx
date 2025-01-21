import React, {useState, useEffect, useRef, useCallback} from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerTop from "@/components/manager/ManagerTop";

import Swal from "sweetalert2";
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { getSessionItem } from "@/utils/storage";

function ManagerCodeGroupEdit(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);
  const sessionUser = getSessionItem("loginUser");

  const [searchDto, setSearchDto] = useState({bbsSn : location.state?.bbsSn});

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });

  const [cdGroupDetail, setCdGroupDetail] = useState({});
  useEffect(() => {
    console.log(cdGroupDetail);
  }, [cdGroupDetail]);

  const [saveEvent, setSaveEvent] = useState({});
  useEffect(() => {
    if(saveEvent.save){
      if(saveEvent.mode == "save"){
        saveCdGroupData(cdGroupDetail);
      }
      if(saveEvent.mode == "delete"){
        delCdGroupData(cdGroupDetail);
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
        if(cdGroupDetail.cdGroup == null){
          Swal.fire("코드그룹이 없습니다.");
          return;
        }
        if(cdGroupDetail.cdGroupNm == null){
          Swal.fire("코드그룹명이 없습니다.");
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

  const saveCdGroupData = useCallback(
      (cdGroupDetail) => {
        const menuListURL = "/codeApi/setComCdGroup";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(cdGroupDetail)
        };
        EgovNet.requestFetch(
            menuListURL,
            requestOptions,
            (resp) => {

              if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                navigate({ pathname: URL.MANAGER_CODE_GROUP });
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

  const delCdGroupData = useCallback(
      (cdGroupDetail) => {
        const menuListURL = "/codeApi/setComCdGroupDel";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(cdGroupDetail)
        };
        EgovNet.requestFetch(
            menuListURL,
            requestOptions,
            (resp) => {

              if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                navigate({ pathname: URL.MANAGER_CODE_GROUP });
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
    getCdGroupDetail();
  };

  const getCdGroupDetail = () => {
    if(modeInfo.mode === CODE.MODE_CREATE){
      setCdGroupDetail({
        creatrSn: sessionUser.userSn,
        actvtnYn: "Y"
      });
      return;
    }

    const getCdGroupDetailURL = `/codeApi/getComCdGroup`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({cdGroupSn : location.state?.cdGroupSn})
    };

    EgovNet.requestFetch(getCdGroupDetailURL, requestOptions, function (resp) {
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          if(resp.result.comCdGroup.actvtnYn != null){
            if(resp.result.comCdGroup.actvtnYn == "Y"){
              document.getElementById("actvtnYn").checked = true;
            }else{
              document.getElementById("actvtnYn").checked = false;
            }
          }
          setCdGroupDetail(resp.result.comCdGroup);
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


  return (
      <div id="container" className="container layout cms">
        <ManagerTop/>
        <div className="inner">
          {modeInfo.mode === CODE.MODE_CREATE && (
            <h2 className="pageTitle"><p>코드그룹 등록</p></h2>
          )}
          {modeInfo.mode === CODE.MODE_MODIFY && (
            <h2 className="pageTitle"><p>코드그룹 수정</p></h2>
          )}
          <div className="contBox infoWrap customContBox">
            <ul className="inputWrap">
              <li className="inputBox type1 width2">
                <label className="title essential" htmlFor="cdGroup"><small>코드그룹</small></label>
                <div className="input">
                  <input type="text"
                         id="cdGroup"
                         placeholder=""
                         required="required"
                         value={cdGroupDetail.cdGroup || ""}
                         onChange={(e) =>
                             setCdGroupDetail({...cdGroupDetail, cdGroup: e.target.value})
                         }
                         disabled={modeInfo.mode === CODE.MODE_MODIFY}
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width2">
                <label className="title essential" htmlFor="cdGroup"><small>코드그룹명</small></label>
                <div className="input">
                  <input type="text"
                         id="cdGroupNm"
                         placeholder=""
                         required="required"
                         value={cdGroupDetail.cdGroupNm || ""}
                         onChange={(e) =>
                             setCdGroupDetail({...cdGroupDetail, cdGroupNm: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width3">
                <label className="title" htmlFor="etcMttr1"><small>기타1</small></label>
                <div className="input">
                  <input type="text"
                         id="etcMttr1"
                         placeholder=""
                         defaultValue={cdGroupDetail.etcMttr1 || ""}
                         onChange={(e) =>
                             setCdGroupDetail({...cdGroupDetail, etcMttr1: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width3">
                <label className="title" htmlFor="etcMttr2"><small>기타2</small></label>
                <div className="input">
                  <input type="text"
                         id="etcMttr2"
                         placeholder=""
                         defaultValue={cdGroupDetail.etcMttr2 || ""}
                         onChange={(e) =>
                             setCdGroupDetail({...cdGroupDetail, etcMttr2: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width3">
                <label className="title" htmlFor="etcMttr3"><small>기타3</small></label>
                <div className="input">
                  <input type="text"
                         id="etcMttr3"
                         placeholder=""
                         defaultValue={cdGroupDetail.etcMttr3 || ""}
                         onChange={(e) =>
                             setCdGroupDetail({...cdGroupDetail, etcMttr3: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width3">
                <label className="title" htmlFor="etcMttr4"><small>기타4</small></label>
                <div className="input">
                  <input type="text"
                         id="etcMttr4"
                         placeholder=""
                         defaultValue={cdGroupDetail.etcMttr4 || ""}
                         onChange={(e) =>
                             setCdGroupDetail({...cdGroupDetail, etcMttr4: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width3">
                <label className="title" htmlFor="etcMttr5"><small>기타5</small></label>
                <div className="input">
                  <input type="text"
                         id="etcMttr5"
                         placeholder=""
                         defaultValue={cdGroupDetail.etcMttr5 || ""}
                         onChange={(e) =>
                             setCdGroupDetail({...cdGroupDetail, etcMttr5: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="toggleBox width3">
                <div className="box">
                  <p className="title essential">활성여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="actvtnYn"
                           onChange={(e) =>
                               setCdGroupDetail({...cdGroupDetail, actvtnYn: e.target.checked ? "Y" : "N"})
                           }
                    />
                    <label htmlFor="actvtnYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>

              <li className="inputBox type1">
                <label className="title" htmlFor="rmrkCn"><small>비고</small></label>
                <div className="input">
                  <textarea type="text"
                            id="rmrkCn"
                            title="비고"
                            value={cdGroupDetail.rmrkCn || ""}
                            onChange={(e) =>
                                setCdGroupDetail({...cdGroupDetail, rmrkCn: e.target.value})
                            }
                            ref={(el) => (checkRef.current[0] = el)}
                  >
                  </textarea>
                </div>
              </li>
            </ul>
            <div className="buttonBox">
              <div className="leftBox">
                <button type="button" className="clickBtn point" onClick={saveBtnEvent}><span>저장</span></button>
                <button type="button" className="clickBtn gray" onClick={delBtnEvent}><span>삭제</span></button>
              </div>
              <NavLink
                  to={URL.MANAGER_CODE_GROUP}
              >
                <button type="button" className="clickBtn black"><span>목록</span></button>
              </NavLink>

            </div>
          </div>
        </div>
      </div>
  );
}

export default ManagerCodeGroupEdit;
