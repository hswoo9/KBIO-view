import React, {useState, useEffect, useRef, useCallback} from "react";
import $ from 'jquery';
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
        saveBnrPopupData(bnrPopupDetail);
      }
      if(saveEvent.mode == "delete"){
        delBnrPopupData(bnrPopupDetail);
      }
    }
  }, [saveEvent]);

  const [acceptFileTypes, setAcceptFileTypes] = useState('jpg,jpeg,png,gif,bmp,tiff,tif,webp,svg,ico,heic,avif');
  const [selectedFiles, setSelectedFiles] = useState({});
  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  const handleFileChange = (e) => {
    console.log(bnrPopupDetail.tblComFiles);
    if(bnrPopupDetail.tblComFiles != null && bnrPopupDetail.tblComFiles.length > 0){
      Swal.fire("기존 파일 삭제 후 첨부가 가능합니다.");
      e.target.value = null;
      return false;
    }

    const allowedExtensions = acceptFileTypes.split(',');
    console.log(allowedExtensions);
    console.log(e.target.files);
    if(e.target.files.length > 0){
      const fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();
      if(allowedExtensions.includes(fileExtension)){
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
        if($("#formFile").val() == null || $("#formFile").val() == ""){
          Swal.fire("첨부된 파일이 없습니다.");
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

  const saveBnrPopupData = useCallback(
      (bnrPopupDetail) => {
        const formData = new FormData();
        for (let key in bnrPopupDetail) {
          if(bnrPopupDetail[key] != null){
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
        console.log(bnrPopupDetail);
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
        bnrPopupKnd: "TOP"
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
                      {dataListToOptionHtml(comCdGroupList, "cdGroup", "BNR_POPUP_GROUP")}
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
                      value="images"
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
                      <Form.Control type="file"
                        onChange={handleFileChange}
                      />
                    </Form.Group>
                    {bnrPopupDetail != null && bnrPopupDetail.tblComFiles != null && bnrPopupDetail.tblComFiles.length > 0 && (
                        <ul>
                          {bnrPopupDetail.tblComFiles.map((file, index) => (
                              <li key={index}>
                                {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB

                                <button
                                    onClick={() => setFileDel(file.atchFileSn)}  // 삭제 버튼 클릭 시 처리할 함수
                                    style={{marginLeft: '10px', color: 'red'}}
                                >
                                  삭제
                                </button>
                              </li>
                          ))}
                        </ul>
                    )}
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
                    <Link to={URL.MANAGER_BANNER_LIST}
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
