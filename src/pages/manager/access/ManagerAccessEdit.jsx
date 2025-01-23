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

function ManagerCodeEdit(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);
  const sessionUser = getSessionItem("loginUser");

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });

  const saveBtnEvent = () => {
    Swal.fire({
      title: "저장하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        navigate({ pathname: URL.MANAGER_ACCESS_LIST });
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
        navigate({ pathname: URL.MANAGER_ACCESS_LIST });
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
                <label className="title essential" htmlFor="ip"><small>IP</small></label>
                <div className="input">
                  <input type="text"
                         id="ip"
                         placeholder=""
                         required="required"
                  />
                </div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="whereToUse"><small>사용처</small></label>
                <div className="input">
                  <input type="text"
                         id="whereToUse"
                         placeholder=""
                         required="required"
                  />
                </div>
              </li>
              <li className="toggleBox width3">
              <div className="box">
                  <p className="title">활성여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="actvtnYn"
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

export default ManagerCodeEdit;
