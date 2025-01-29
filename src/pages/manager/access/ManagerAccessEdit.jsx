import React, {useState, useEffect, useRef, useCallback} from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';

import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import Swal from "sweetalert2";

import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

function ManagerAccessEdit(props) {

  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();

  const [mngrAcsIpDetail, setMngrAcsIpDetail] = useState({});
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });

  const saveBtnEvent = () => {
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!mngrAcsIpDetail.ipAddr) {
      Swal.fire("IP는 필수 값입니다.");
      return;
    }

    if (!ipRegex.test(mngrAcsIpDetail.ipAddr)) {
      Swal.fire("IP 형식에 맞지 않습니다.");
      return;
    }

    if (!mngrAcsIpDetail.plcusNm) {
      Swal.fire("사용처는 필수 값입니다.");
      return;
    }

    Swal.fire({
      title: "저장하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        let requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(mngrAcsIpDetail),
        };

        EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("등록되었습니다.");
            navigate(URL.MANAGER_ACCESS_LIST);
          } else {
            navigate(
                { pathname: URL.ERROR },
                { state: { msg: resp.resultMessage } }
            );
          }
        });
      } else {
        //취소
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
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({mngrAcsSn : mngrAcsIpDetail.mngrAcsSn}),
        };

        EgovNet.requestFetch("/mngrAcsIpApi/setMngrAcsIpDel", requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("삭제되었습니다.");
            navigate(URL.MANAGER_ACCESS_LIST);
          } else {
            alert("ERR : " + resp.resultMessage);
          }
        });
      } else {
        //취소
      }
    });
  }

  const initMode = () => {
    switch (props.mode){
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: "등록",
          editURL: `/mngrAcsIpApi/setMngrAcsIp`,
        });
        break;
      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: "수정",
          editURL: `/mngrAcsIpApi/setMngrAcsIp`,
        });
        break;
      default:
        navigate({ pathname: URL.ERROR }, { state: { msg: "" } });
    }
    getMngrAcsIp()
  };

  const getMngrAcsIp = () => {
    if (modeInfo.mode === CODE.MODE_CREATE) {
      // 조회/등록이면 조회 안함
      setMngrAcsIpDetail({
        creatrSn: sessionUser.userSn,
      });
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({mngrAcsSn : location.state?.mngrAcsSn})
    };

    EgovNet.requestFetch("/mngrAcsIpApi/getMngrAcsIp", requestOptions, function (resp) {
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        let bbsData = resp.result.mngrAcsIp;
        bbsData.mdfrSn = sessionUser.userSn
        if(bbsData.actvtnYn == "Y"){
          document.getElementById("actvtnYn").checked = true;
        }

        setMngrAcsIpDetail(bbsData);
      }
    });
  };

  useEffect(() => {
    initMode();
  }, []);


  return (
      <div id="container" className="container layout cms">
        <ManagerLeftNew/>
        <div className="inner">
          {modeInfo.mode === CODE.MODE_CREATE && (
            <h2 className="pageTitle"><p>접근관리 등록</p></h2>
          )}

          {modeInfo.mode === CODE.MODE_MODIFY && (
            <h2 className="pageTitle"><p>접근관리 수정</p></h2>
          )}

          <div className="contBox infoWrap customContBox">
            <ul className="inputWrap">
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="ipAddr">
                  <small>IP</small>
                </label>
                <div className="input">
                  <input type="text"
                         id="ipAddr"
                         value={mngrAcsIpDetail.ipAddr || ""}
                         placeholder=""
                         onChange={(e) =>
                             setMngrAcsIpDetail({
                               ...mngrAcsIpDetail,
                               ipAddr: e.target.value
                             })}
                  />
                </div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="plcusNm">
                  <small>사용처</small>
                </label>
                <div className="input">
                  <input type="text"
                         id="plcusNm"
                         value={mngrAcsIpDetail.plcusNm || ""}
                         placeholder=""
                         required="required"
                         onChange={(e) =>
                             setMngrAcsIpDetail({
                               ...mngrAcsIpDetail,
                               plcusNm: e.target.value
                             })
                         }
                  />
                </div>
              </li>
              <li className="toggleBox width3">
              <div className="box">
                  <p className="title">활성여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="actvtnYn"
                           onChange={(e) =>
                               setMngrAcsIpDetail({
                                 ...mngrAcsIpDetail,
                                 actvtnYn: e.target.checked ? "Y" : "N",
                               })
                           }
                    />
                    <label htmlFor="actvtnYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>
            </ul>
            <div className="buttonBox">
              <div className="leftBox">
                <button type="button" className="clickBtn point" onClick={saveBtnEvent}><span>저장</span></button>
                {modeInfo.mode === CODE.MODE_MODIFY && (
                    <button type="button" className="clickBtn gray" onClick={delBtnEvent}><span>삭제</span></button>
                )}
              </div>
              <NavLink
                  to={URL.MANAGER_ACCESS_LIST}
              >
                <button type="button" className="clickBtn black"><span>목록</span></button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ManagerAccessEdit;
