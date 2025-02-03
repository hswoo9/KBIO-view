import React, {useState, useEffect, useRef, useCallback} from "react";
import $ from 'jquery';
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";

import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import moment from "moment/moment.js";
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem,setSessionItem, removeSessionItem } from "@/utils/storage";

function ManagerCodeEdit(props) {
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
  const [comCdGroupList, setComCdGroupList] = useState([]);
  useEffect(() => {
  }, [comCdGroupList]);

  const [bnrPopupDetail, setBnrPopupDetail] = useState({});
  useEffect(() => {
  }, [bnrPopupDetail]);

  const dateCheck = (e) => {
    if(e.target.id == "popupBgngDt"){
      const startDt = moment(e.target.value).format('YYYY-MM-DD HH:mm');
      const endDt = moment($("#popupEndDt").val()).format('YYYY-MM-DD HH:mm');
      if(startDt > endDt){
        $("#popupEndDt").val(e.target.value);
      }
    }else{
      const startDt = moment($("#popupBgngDt").val()).format('YYYY-MM-DD HH:mm');
      const endDt = moment(e.target.value).format('YYYY-MM-DD HH:mm');
      if(startDt > endDt){
        $("#popupBgngDt").val(e.target.value);
      }
    }
    setBnrPopupDetail({
      ...bnrPopupDetail,
      popupBgngDt: $("#popupBgngDt").val(),
      popupEndDt: $("#popupEndDt").val()
    });
  }

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
              console.log("err response : ", resp);
            }
        )
      },
      [comCdGroupList, searchDto]
  );

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

  const saveBnrPopupData = useCallback(
      (bnrPopupDetail) => {
        const formData = new FormData();
        for (let key in bnrPopupDetail) {
          if(bnrPopupDetail[key] != null && key != "tblComFiles"){
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
                    { pathname: URL.MANAGER_POPUP_LIST }
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
                navigate({ pathname: URL.MANAGER_POPUP_LIST });
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

  const saveBtnEvent = () => {
    Swal.fire({
      title: "저장하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        if(!$("#popupBgngDt").val()){
          Swal.fire("시작일시가 없습니다.");
          return;
        }
        if(!$("#popupEndDt").val()){
          Swal.fire("종료일시가 없습니다.");
          return;
        }
        if(!$("#bnrPopupTtl").val()){
          Swal.fire("제목이 없습니다.");
          return;
        }
          if($("#templateImg").val() == null || $("#templateImg").val() == ""
              && (bnrPopupDetail.tblComFiles == null || bnrPopupDetail.tblComFiles == "" || bnrPopupDetail.tblComFiles.length == 0)
          ){
          Swal.fire("첨부된 파일이 없습니다.");
          return;
        }

        setBnrPopupDetail({
          ...bnrPopupDetail,
          popupWdthSz: !$("#popupWdthSz").val() ? 500 : $("#popupWdthSz").val(),
          popupVrtcSz: !$("#popupVrtcSz").val() ? 500 : $("#popupVrtcSz").val(),
          popupPstnUpend: !$("#popupPstnUpend").val() ? 0 : $("#popupPstnUpend").val(),
          popupPstnWdth: !$("#popupPstnWdth").val() ? 0 : $("#popupPstnWdth").val()
        });

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
        bnrPopupFrm: "popup",
        bnrPopupKnd: "popup",
        youtubeYn: "N",
        npagYn: "Y",
      });
      $.each($("input[name='bnrPopupFrm']"), function(item, index){
        if($(this).val() == "popup"){
        $(this).prop("checked", true);
        }
      });
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
              }
            });
          }
          if(resp.result.tblBnrPopup.youtubeYn != null){
            if(resp.result.tblBnrPopup.youtubeYn == "Y"){
              $("#youtubeYn").prop("checked", true);
            }
          }

          if(resp.result.tblBnrPopup.useYn != null){
            if(resp.result.tblBnrPopup.useYn == "Y"){
              document.getElementById("useYn").checked = true;
            }else{
              document.getElementById("useYn").checked = false;
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
            setBnrPopupDetail({ ...bnrPopupDetail, tblComFiles: [] });  // 상태 업데이트
          } else {
          }
        });
      } else {
        //취소
      }
    });
  }

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

  useEffect(() => {
    getComCdList(searchDto);
    initMode();
  }, []);

  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();

  const [acceptFileTypes, setAcceptFileTypes] = useState('jpg,jpeg,png,gif,bmp,tiff,tif,webp,svg,ico,heic,avif');
  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
  }, [selectedFiles]);

  const handleFileChange = (e) => {

    if(bnrPopupDetail.tblComFiles != null && bnrPopupDetail.tblComFiles.length > 0){
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
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setImgFile(reader.result);
        }

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
  };

  const sampleImgView = () => {
    removeSessionItem("imgFile");
    removeSessionItem("imgWidth");
    removeSessionItem("imgHeight");
    setSessionItem("imgFile", imgFile);
    setSessionItem("imgWidth", !$("#popupWdthSz").val() ? "500px" : $("#popupWdthSz").val() + "px");
    setSessionItem("imgHeight", !$("#popupVrtcSz").val() ? "500px" : $("#popupVrtcSz").val() + "px");
    const styleStr = "width=" + (!$("#popupWdthSz").val() ? "500," : $("#popupWdthSz").val()) + ", height=" + (!$("#popupVrtcSz").val() ? "500" : $("#popupVrtcSz").val());
    window.open(
        URL.MANAGER_IMAGES_POPUP,
        "_blank",
        styleStr
    );
    //navigate({ pathname: URL.MANAGER_IMAGES_POPUP }, { state: imgFile});
  }

  return (
      <div id="container" className="container layout cms">
        <ManagerLeftNew/>
        <div className="inner">
          {modeInfo.mode === CODE.MODE_CREATE && (
              <h2 className="pageTitle"><p>팝업 등록</p></h2>
          )}

          {modeInfo.mode === CODE.MODE_MODIFY && (
              <h2 className="pageTitle"><p>팝업 수정</p></h2>
          )}
          <div className="contBox infoWrap customContBox">
            <ul className="inputWrap">
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="bnrPopupTtl"><small>팝업창 제목</small></label>
                <div className="input">
                  <input type="text"
                         id="bnrPopupTtl"
                         placeholder=""
                         required="required"
                         value={bnrPopupDetail.bnrPopupTtl}
                         onChange={(e) =>
                             setBnrPopupDetail({...bnrPopupDetail, bnrPopupTtl: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width3">
                <label className="title essential" htmlFor="bnrPopupTtl"><small>시작일시</small></label>
                <div className="input">
                  <input type="datetime-local"
                         id="popupBgngDt"
                         onChange={dateCheck}
                         value={bnrPopupDetail.popupBgngDt}
                  />
                </div>
              </li>
              <li className="inputBox type1 width3">
                <label className="title essential" htmlFor="bnrPopupTtl"><small>종료일시</small></label>
                <div className="input">
                  <input type="datetime-local"
                         id="popupEndDt"
                         onChange={dateCheck}
                         value={bnrPopupDetail.popupEndDt}
                  />
                </div>
              </li>
              <li className="toggleBox width3">
                <div className="box">
                  <p className="title">사용여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="useYn"
                           onChange={(e) =>
                               setBnrPopupDetail({
                                 ...bnrPopupDetail,
                                 useYn: e.target.checked ? "Y" : "N"
                               })
                           }
                    />
                    <label htmlFor="useYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>
              <li className="inputBox type1 width1">
                <p className="title essential">팝업형식</p>
                <ul className="checkWrap customCheckWrap">
                  <li className="checkBox">
                    <label>
                      <input type="radio"
                             id="layerRadio"
                             name="bnrPopupFrm"
                             value="layer"
                             onChange={(e) =>
                                 setBnrPopupDetail({...bnrPopupDetail, bnrPopupFrm: e.target.value})
                             }
                             ref={(el) => (checkRef.current[0] = el)}
                      />
                      <small>레이어형식</small>
                    </label>
                  </li>
                  <li className="checkBox">
                    <label>
                      <input type="radio"
                             id="popupRadio"
                             name="bnrPopupFrm"
                             value="popup"
                             onChange={(e) =>
                                 setBnrPopupDetail({...bnrPopupDetail, bnrPopupFrm: e.target.value})
                             }
                             ref={(el) => (checkRef.current[0] = el)}
                      />
                      <small>팝업형식</small>
                    </label>
                  </li>
                </ul>
              </li>
              <li className="inputBox type1 width4">
                <label className="title essential" htmlFor="popupWdthSz"><small>넓이</small></label>
                <div className="input">
                  <input type="text"
                         id="popupWdthSz"
                         placeholder=""
                         value={bnrPopupDetail.popupWdthSz}
                         onChange={(e) =>
                             setBnrPopupDetail({...bnrPopupDetail, popupWdthSz: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width4">
                <label className="title essential" htmlFor="popupVrtcSz"><small>높이</small></label>
                <div className="input">
                  <input type="text"
                         id="popupVrtcSz"
                         placeholder=""
                         value={bnrPopupDetail.popupVrtcSz}
                         onChange={(e) =>
                             setBnrPopupDetail({...bnrPopupDetail, popupVrtcSz: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width4">
                <label className="title essential" htmlFor="popupPstnUpend"><small>팝업 위쪽여백</small></label>
                <div className="input">
                  <input type="text"
                         id="popupPstnUpend"
                         placeholder=""
                         value={bnrPopupDetail.popupPstnUpend}
                         onChange={(e) =>
                             setBnrPopupDetail({...bnrPopupDetail, popupPstnUpend: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width4">
                <label className="title essential" htmlFor="popupPstnWdth"><small>팝업 왼쪽여백</small></label>
                <div className="input">
                  <input type="text"
                         id="popupPstnWdth"
                         placeholder=""
                         value={bnrPopupDetail.popupPstnWdth}
                         onChange={(e) =>
                             setBnrPopupDetail({...bnrPopupDetail, popupPstnWdth: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>

              <li className="inputBox type1 width3 file">
                <p className="title essential">파일선택</p>
                <div className="input">
                  <p className="file_name" id="fileNamePTag"></p>
                  <label>
                    <small className="text btn">파일 선택</small>
                    <input type="file"
                           id="templateImg"
                           onChange={handleFileChange}
                    />
                  </label>
                </div>
                <span className="warningText">gif,png,jpg 파일 / 권장 사이즈 : 500px * 500px / 용량 : 10M 이하</span>
              </li>
              <li className="inputBox type1 width2 file">
                <p className="title">파일삭제</p>
                <div className="input">
                  {bnrPopupDetail != null && bnrPopupDetail.tblComFiles != null && bnrPopupDetail.tblComFiles.length > 0 && (
                      <>
                        {bnrPopupDetail.tblComFiles.map((file, index) => (
                            <p className="file_name">{file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                              <button type="button" className="clickBtn gray"
                                      onClick={() => setFileDel(file.atchFileSn)}
                                      style={{marginLeft: '10px', color: 'red'}}
                              >
                                삭제
                              </button>
                            </p>
                        ))}
                      </>
                  )}
                  {/*{imgFile != "" && imgFile != null && (<img src={imgFile} id="templatesImgTag"/>)}*/}
                </div>
                <span className="warningText"></span>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="bnrPopupUrlAddr"><small>링크주소</small></label>
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
              <li className="toggleBox width3">
                <div className="box">
                  <p className="title">유튜브 영상</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="youtubeYn"
                           onChange={(e) =>
                               setBnrPopupDetail({
                                 ...bnrPopupDetail,
                                 youtubeYn: e.target.checked ? "Y" : "N"
                               })
                           }
                    />
                    <label htmlFor="youtubeYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>
              <li className="inputBox type1 width3">
                <p className="title essential">분류</p>
                <div className="itemBox">
                  <select className="selectGroup"
                          id="npagYn"
                          value={bnrPopupDetail.npagYn || "Y"}
                          onChange={(e) =>
                              setBnrPopupDetail({...bnrPopupDetail, npagYn: e.target.value})
                          }
                  >
                    <option value="Y">새창</option>
                    <option value="N">현재창</option>
                  </select>
                </div>
              </li>


              <li className="inputBox type1 width1">
                <label className="title" htmlFor="bnrPopupCn"><small>내용</small></label>
                <div className="input">
                  <textarea type="text"
                            id="bnrPopupCn"
                            title="내용"
                            value={bnrPopupDetail.bnrPopupCn || ""}
                            onChange={(e) =>
                                setBnrPopupDetail({...bnrPopupDetail, bnrPopupCn: e.target.value})
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
                {modeInfo.mode === CODE.MODE_MODIFY && (
                    <button type="button" className="clickBtn gray" onClick={delBtnEvent}><span>삭제</span></button>
                )}
              </div>
              <NavLink
                  to={URL.MANAGER_POPUP_LIST}
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
