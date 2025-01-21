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
              <Link to={URL.MANAGER_BANNER_POPUP}>배너팝업관리</Link>
            </li>
            <li>팝업등록</li>
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
                  <h2 className="tit_2">팝업 등록</h2>
              )}

              {modeInfo.mode === CODE.MODE_MODIFY && (
                  <h2 className="tit_2">팝업 수정</h2>
              )}

              <div className="board_view2">
                <dl>
                  <dt>
                    <label htmlFor="cd">시작일시</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <input type="datetime-local"
                           id="popupBgngDt"
                           onChange={dateCheck}
                           value={bnrPopupDetail.popupBgngDt}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="cd">종료일시</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <input type="datetime-local"
                           id="popupEndDt"
                           onChange={dateCheck}
                           value={bnrPopupDetail.popupEndDt}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="cdNm">사용여부</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <Form.Select
                        size="sm"
                        id="useYn"
                        value={bnrPopupDetail.useYn}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, useYn: e.target.value})
                        }
                    >
                      {dataListToOptionHtml(comCdGroupList, "cdGroup", "ACTVTN_YN")}
                    </Form.Select>
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="rmrkCn">팝업형식</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <Form.Check
                        inline
                        type="radio"
                        label="레이어형식"
                        id="layerRadio"
                        name="bnrPopupFrm"
                        value="layer"
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, bnrPopupFrm: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                    <Form.Check
                        inline
                        type="radio"
                        label="팝업형식"
                        id="popupRadio"
                        name="bnrPopupFrm"
                        value="popup"
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, bnrPopupFrm: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="rmrkCn">팝업창 크기</label>
                  </dt>
                  <dd>
                    <label htmlFor="popupWdthSz">가로</label>
                      <Form.Control
                          size="sm"
                          type="text"
                          id="popupWdthSz"
                          placeholder=""
                          value={bnrPopupDetail.popupWdthSz}
                          onChange={(e) =>
                              setBnrPopupDetail({...bnrPopupDetail, popupWdthSz: e.target.value})
                          }
                          ref={(el) => (checkRef.current[0] = el)}
                      />
                    <label htmlFor="popupVrtcSz" className="mr-l20">세로</label>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="popupVrtcSz"
                        placeholder=""
                        value={bnrPopupDetail.popupVrtcSz}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, popupVrtcSz: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="rmrkCn">팝업창 위치</label>
                  </dt>
                  <dd>
                    <label htmlFor="popupPstnUpend">위쪽여백</label>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="popupPstnUpend"
                        placeholder=""
                        value={bnrPopupDetail.popupPstnUpend}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, popupPstnUpend: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                    <label htmlFor="popupPstnWdth" className="mr-l20">아래여백</label>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="popupPstnWdth"
                        placeholder=""
                        value={bnrPopupDetail.popupPstnWdth}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, popupPstnWdth: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="bnrPopupUrlAddr">링크주소</label>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="bnrPopupUrlAddr"
                        placeholder=""
                        value={bnrPopupDetail.bnrPopupUrlAddr}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, bnrPopupUrlAddr: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                    <Form.Check
                        type="checkbox"
                        label="유튜브 영상"
                        id="youtubeYn"
                        onChange={(e) =>
                            setBnrPopupDetail({
                              ...bnrPopupDetail,
                              youtubeYn: e.target.checked ? "Y" : "N"
                            })
                        }
                    />
                    <Form.Select
                        size="sm"
                        id="npagYn"
                        value={bnrPopupDetail.npagYn}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, npagYn: e.target.value})
                        }
                    >
                      <option value="Y">새창</option>
                      <option value="N">현재창</option>
                    </Form.Select>
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="bnrPopupTtl">팝업창 제목</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <Form.Control
                        size="sm"
                        type="text"
                        id="bnrPopupTtl"
                        placeholder=""
                        required="required"
                        value={bnrPopupDetail.bnrPopupTtl}
                        onChange={(e) =>
                            setBnrPopupDetail({...bnrPopupDetail, bnrPopupTtl: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="templateImg">파일선택</label>
                    <span className="req">필수</span>
                    <BTButton variant="secondary"
                        onClick={sampleImgView}
                    >
                      미리보기
                    </BTButton>
                  </dt>
                  <dd>

                    <Form.Group controlId="templateImg">
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

                    {imgFile != "" && imgFile != null && (<img src={imgFile} id="templatesImgTag"/>)}
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
