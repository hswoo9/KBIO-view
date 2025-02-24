import React, {useState, useEffect, useRef, useCallback} from "react";
import $ from 'jquery';
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
import moment from "moment/moment.js";

function ManagerBannerEdit(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);
  const sessionUser = getSessionItem("loginUser");
  const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(true);
  const [searchDto, setSearchDto] = useState(
      {
        search: "",
      }
  );
  const [customDisplay, setCustomDisplay] = useState("none")
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });

  const [bnrPopupDetail, setBnrPopupDetail] = useState({});
  useEffect(() => {
  }, [bnrPopupDetail]);

  const [comCdGroupList, setComCdGroupList] = useState([]);
  useEffect(() => {
  }, [comCdGroupList]);

  const [saveEvent, setSaveEvent] = useState({});
  useEffect(() => {
    if(saveEvent.save){
      if(saveEvent.mode == "save"){
        saveBnrPopupData(bnrPopupDetail);
      }
      if(saveEvent.mode == "delete"){
        delBnrPopupData(bnrPopupDetail);
      }
    }
  }, [saveEvent]);

  const [acceptFileTypes, setAcceptFileTypes] = useState('jpg,jpeg,png,gif,bmp,tiff,tif,webp,svg,ico,heic,avif');
  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
  }, [selectedFiles]);

  const handleFileChange = (e) => {
    document.getElementById("fileNamePTag").textContent = "";
    if(bnrPopupDetail.tblComFile != null){
      Swal.fire("기존 파일 삭제 후 첨부가 가능합니다.");
      e.target.value = null;
      return false;
    }

    const allowedExtensions = acceptFileTypes.split(',');
    if(e.target.files.length > 0){
      const fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();
      if(allowedExtensions.includes(fileExtension)){
        let fileName = e.target.files[0].name;
        if(fileName.length > 30){
          fileName = fileName.slice(0, 30) + "...";
        }
        document.getElementById("fileNamePTag").textContent = fileName;
        setSelectedFiles(Array.from(e.target.files));
      }else{
        Swal.fire({
          title: "허용되지 않은 확장자입니다.",
          text: `허용 확장자: ` + acceptFileTypes
        });
        e.target.value = null;
      }
    }else{
      Swal.fire(
          `선택된 파일이 없습니다.`
      );
    }

  }

  const saveBtnEvent = () => {
    Swal.fire({
      title: "저장하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        if(bnrPopupDetail.bnrPopupTtl == null){
          Swal.fire("배너제목이 없습니다.");
          return;
        }
        if(bnrPopupDetail.bnrPopupFrm != "mainTopSlides"){
          if($("#formFile").val() == null || $("#formFile").val() == ""
          && (bnrPopupDetail.tblComFile == null || bnrPopupDetail.tblComFile == "")
          ){
            Swal.fire("첨부된 파일이 없습니다.");
            return;
          }
        }else{
          if((bnrPopupDetail.bnrPopupTtl.split("^").length - 1) +
              (bnrPopupDetail.bnrCn.split("^").length - 1) > 5){
            Swal.fire("제목과 내용의 줄 바꿈은 5번을 초과할 수 없습니다.");
            return;
          }
        }

        if(bnrPopupDetail.useYn == "Y"){
          if(!bnrPopupDetail.popupBgngDt){
            Swal.fire("공개 시작일을 선택해주세요.");
            return;
          }else if(!bnrPopupDetail.popupEndDt){
            Swal.fire("공개 종료일을 선택해주세요.");
            return;
          }
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

  const saveBnrPopupData = useCallback(
      (bnrPopupDetail) => {
        const formData = new FormData();
        for (let key in bnrPopupDetail) {
          if(bnrPopupDetail[key] != null && key != "tblComFile"){
            formData.append(key, bnrPopupDetail[key]);
          }
        }

        selectedFiles.map((file) => {
          formData.append("files", file);
        });
        const menuListURL = "/bannerPopupApi/setBnrPopup";
        const requestOptions = {
          method: "POST",
          body: formData
        };
        EgovNet.requestFetch(
            menuListURL,
            requestOptions,
            (resp) => {

              if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                navigate(
                    { pathname: URL.MANAGER_BANNER_LIST }
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

  const delBnrPopupData = useCallback(
      (bnrPopupDetail) => {
        const menuListURL = "/bannerPopupApi/setBnrPopupDel";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(bnrPopupDetail)
        };
        EgovNet.requestFetch(
            menuListURL,
            requestOptions,
            (resp) => {

              if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                navigate({ pathname: URL.MANAGER_BANNER_LIST });
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
    getBnrPopupData();
  };

  const getBnrPopupData = () => {
    if(modeInfo.mode === CODE.MODE_CREATE){
      setBnrPopupDetail({
        creatrSn: sessionUser.userSn,
        actvtnYn: "Y",
        useYn: "Y",
        bnrPopupSn: location.state?.bnrPopupSn,
        bnrPopupKnd: "bnr",
        npagYn: "Y"
      });
      document.getElementById("useYn").checked = true;
      return;
    }

    const getBnrPopupDataURL = `/bannerPopupApi/getBnrPopup`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({bnrPopupSn : location.state?.bnrPopupSn})
    };

    EgovNet.requestFetch(getBnrPopupDataURL, requestOptions, function (resp) {
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          resp.result.tblBnrPopup.mdfrSn = sessionUser.userSn;
          setBnrPopupDetail(resp.result.tblBnrPopup);
          if(resp.result.tblBnrPopup.bnrPopupFrm != null){
            $.each($("input[name='bnrPopupFrm']"), function(item, index){
              if(this.value == resp.result.tblBnrPopup.bnrPopupFrm){
                $(this).prop("checked", true);

                const base = document.querySelectorAll(".base")
                if(this.value != "mainTopSlides"){
                  setCustomDisplay("none")
                  document.querySelector("li.mainTopSlides").style.display = "none"
                    base.forEach((item) => {
                      item.style.display = "block";
                    });
                }else{
                  setCustomDisplay("block")
                    document.querySelector("li.mainTopSlides").style.display = "flex"
                    base.forEach((item) => {
                      item.style.display = "none";
                    });
                  }
              }
            });
          }

          if(resp.result.tblBnrPopup.useYn != null){
            if(resp.result.tblBnrPopup.useYn == "Y"){
              document.getElementById("useYn").checked = true;
              setIsDatePickerEnabled(true);
            }else{
              document.getElementById("useYn").checked = false;
              setIsDatePickerEnabled(false);
            }
          }
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
        const comCdListURL = "/codeApi/getComCdGroupList.do";
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

            }
        )
      },
      [comCdGroupList, searchDto]
  )

  const dataListToOptionHtml = (data, filterField, filterData) => {
    if(data != null){
      if(data.length > 0){
        const returnList = [];
        data.map((v) => {
          if(v[filterField] == filterData){
            if(v.comCdList != null){
              v.comCdList.forEach(function (item, index){
                returnList.push(
                    <option key={item.comCdSn} value={item.comCd}>{item.comCdNm}</option>
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

  const setFileDel = (atchFileSn) => {
    Swal.fire({
      title: "삭제한 파일은 복구할 수 없습니다.\n그래도 삭제하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body:  JSON.stringify({
            atchFileSn: atchFileSn,
          }),
        };

        EgovNet.requestFetch("/commonApi/setFileDel", requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("삭제되었습니다.");
            setBnrPopupDetail({ ...bnrPopupDetail, tblComFile: null });  // 상태 업데이트
          } else {
          }
        });
      } else {
        //취소
      }
    });
  }

  const dateCheck = (e) => {
    if(e.target.id == "popupBgngDt"){
      const startDt = moment(e.target.value).format('YYYY-MM-DD HH:mm');
      const endDt = moment(document.getElementById("popupEndDt").value).format('YYYY-MM-DD HH:mm');
      if(startDt > endDt){
        document.getElementById("popupEndDt").value = e.target.value;
      }
    }else{
      const startDt = moment(document.getElementById("popupBgngDt").value).format('YYYY-MM-DD HH:mm');
      const endDt = moment(e.target.value).format('YYYY-MM-DD HH:mm');
      if(startDt > endDt){
        document.getElementById("popupBgngDt").value = e.target.value;
      }
    }
    setBnrPopupDetail({
      ...bnrPopupDetail,
      popupBgngDt: document.getElementById("popupBgngDt").value,
      popupEndDt: document.getElementById("popupEndDt").value
    });
  }

  const bnrPopupFrmChange = (e) => {
    const base = document.querySelectorAll(".base")
    if(e.target.value != "mainTopSlides"){
      setCustomDisplay("none")
      document.querySelector("li.mainTopSlides").style.display = "none"
      base.forEach((item) => {
        item.style.display = "block";
      });
    }else{
      setCustomDisplay("block")
      document.querySelector("li.mainTopSlides").style.display = "flex"
      base.forEach((item) => {
        item.style.display = "none";
      });
    }

    setBnrPopupDetail({...bnrPopupDetail, bnrPopupFrm: e.target.value})
  }

  useEffect(() => {
    getComCdList(searchDto);
    initMode();
  }, []);


  return (
      <div id="container" className="container layout cms">
        <ManagerLeftNew/>
        <div className="inner">
          {modeInfo.mode === CODE.MODE_CREATE && (
              <h2 className="pageTitle"><p>배너 등록</p></h2>
          )}

          {modeInfo.mode === CODE.MODE_MODIFY && (
              <h2 className="pageTitle"><p>배너 수정</p></h2>
          )}
          <div className="contBox infoWrap customContBox">
            <ul className="inputWrap">
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="comCdNm"><small>배너제목</small></label>
                <div className="input">
                  <input type="text"
                         id="bnrPopupTtl"
                         placeholder=""
                         required="required"
                         value={bnrPopupDetail.bnrPopupTtl || ""}
                         onChange={(e) =>
                             setBnrPopupDetail({...bnrPopupDetail, bnrPopupTtl: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                  <span className="warningText mainTopSlides" style={{fontSize: "14px", display: customDisplay}}>줄 바꿈 기호 [^]</span>
                </div>
              </li>
              <li className="inputBox type1 width1">
                <p className="title essential">배너형식</p>
                <ul>
                  <li className="checkBox">
                    <label>
                      <input type="radio"
                             id="bnrPopupFrm1"
                             name="bnrPopupFrm"
                             value="mainTopSlides"
                             onChange={bnrPopupFrmChange}
                             ref={(el) => (checkRef.current[0] = el)}
                      />
                      <small>메인 상단 슬라이드 배너</small>
                    </label>
                    <label>
                      <input type="radio"
                             id="bnrPopupFrm1"
                             name="bnrPopupFrm"
                             value="mainSlides"
                             onChange={bnrPopupFrmChange}
                             ref={(el) => (checkRef.current[0] = el)}
                      />
                      <small>메인 슬라이드 배너</small>
                    </label>
                    <label>
                      <input type="radio"
                             id="bnrPopupFrm1"
                             name="bnrPopupFrm"
                             value="footSlides"
                             onChange={bnrPopupFrmChange}
                             ref={(el) => (checkRef.current[0] = el)}
                      />
                      <small>하단 슬라이드 배너</small>
                    </label>
                  </li>
                </ul>
              </li>
              <li className="inputBox type1 width3 file base">
                <p className="title essential">파일선택</p>
                <div className="input">
                  <p className="file_name" id="fileNamePTag"></p>
                  <label>
                    <small className="text btn">파일 선택</small>
                    <input type="file"
                           name="formFile"
                           id="formFile"
                           onChange={handleFileChange}
                    />
                  </label>
                </div>
                <span className="warningText">gif,png,jpg 파일 / 권장 사이즈 : 500px * 500px / 용량 : 10M 이하</span>
              </li>

              <li className="inputBox type1 width2 file base">
                <p className="title">파일삭제</p>
                <div className="input">
                  {bnrPopupDetail != null && bnrPopupDetail.tblComFile != null && (
                      <>
                        <p className="file_name">{bnrPopupDetail.tblComFile.atchFileNm} - {(bnrPopupDetail.tblComFile.atchFileSz / 1024).toFixed(2)} KB
                          <button type="button" className="clickBtn gray"
                                  onClick={() => setFileDel(bnrPopupDetail.tblComFile.atchFileSn)}  // 삭제 버튼 클릭 시 처리할 함수
                                  style={{marginLeft: '10px', color: 'red'}}
                          >
                            삭제
                          </button>
                        </p>
                      </>
                  )}
                </div>
                <span className="warningText"></span>
              </li>

              <li className="inputBox type1 width1 mainTopSlides" style={{display:"none"}}>
                <label className="title essential" htmlFor="bnrCn"><small>내용</small></label>
                <div className="input">
                  <input type="text"
                         id="bnrCn"
                         placeholder=""
                         maxLength="256"
                         value={bnrPopupDetail.bnrCn}
                         onChange={(e) =>
                             setBnrPopupDetail({...bnrPopupDetail, bnrCn: e.target.value})
                         }
                  />
                  <span className="warningText" style={{fontSize: "14px"}}>줄 바꿈 기호 [^]</span>
                </div>
              </li>
              <li className="inputBox type1 width2">
              <label className="title essential" htmlFor="bnrPopupUrlAddr"><small>배너링크</small></label>
                <div className="input">
                  <input type="text"
                         id="bnrPopupUrlAddr"
                         placeholder=""
                         value={bnrPopupDetail.bnrPopupUrlAddr}
                         onChange={(e) =>
                             setBnrPopupDetail({...bnrPopupDetail, bnrPopupUrlAddr: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width3">
                <p className="title essential">분류</p>
                <div className="itemBox">
                  <select className="selectGroup"
                          id="npagYn"
                          value={bnrPopupDetail.npagYn}
                          onChange={(e) =>
                              setBnrPopupDetail({...bnrPopupDetail, npagYn: e.target.value})
                          }
                  >
                    <option value="Y">새창</option>
                    <option value="N">현재창</option>
                  </select>
                </div>
              </li>
              <li className="toggleBox width3">
                <div className="box">
                  <p className="title essential">사용여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="useYn"
                           onChange={(e) => {
                             setBnrPopupDetail({...bnrPopupDetail, useYn: e.target.checked ? "Y" : "N"})
                             setIsDatePickerEnabled(e.target.checked);
                           }}
                           ref={(el) => (checkRef.current[0] = el)}
                    />
                    <label htmlFor="useYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>

              <li className="inputBox type1 width3">
                <label className="title" htmlFor="ntcBgngDt"><small>공개 시작일</small></label>
                <div className="input">
                  <input type="datetime-local"
                         id="popupBgngDt"
                         name="popupBgngDt"
                         value={bnrPopupDetail.popupBgngDt}
                         onChange={dateCheck}
                         disabled={!isDatePickerEnabled}
                  />
                </div>
              </li>
              <li className="inputBox type1 width3">
                <label className="title" htmlFor="ntcEndDate"><small>공개 종료일</small></label>
                <div className="input">
                  <input type="datetime-local"
                         id="popupEndDt"
                         name="popupEndDt"
                         value={bnrPopupDetail.popupEndDt}
                         onChange={dateCheck}
                         disabled={!isDatePickerEnabled}
                  />
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
                  to={URL.MANAGER_BANNER_LIST}
              >
                <button type="button" className="clickBtn black"><span>목록</span></button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
  )
      ;
}

export default ManagerBannerEdit;
