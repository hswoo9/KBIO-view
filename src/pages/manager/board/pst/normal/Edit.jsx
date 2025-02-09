
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import Form from "react-bootstrap/Form";
import moment from "moment";
import {getSessionItem} from "../../../../../utils/storage.js";

import CommonEditor from "@/components/CommonEditor";
import {getComCdList} from "../../../../../components/CommonComponents.jsx";

function setPst(props) {

  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();

  const [searchDto, setSearchDto] = useState({
    bbsSn : location.state?.bbsSn,
    pstSn : location.state?.pstSn
  });
  const upPstSn = location.state?.upPstSn || null;
  const pstGroup = location.state?.pstGroup || null;

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [pstDetail, setPstDetail] = useState({});
  const [comCdList, setComCdList] = useState([]);
  useEffect(() => {
  }, [pstDetail])
  const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(false);
  const [acceptFileTypes, setAcceptFileTypes] = useState('');
  const [fileList, setFileList] = useState([]);
  const [bbsDetail, setBbsDetail] = useState({});

  const isFirstRender = useRef(true);
  const handleChange = (value) => {
    if(isFirstRender.current){
      isFirstRender.current = false;
      return;
    }
    setPstDetail({...pstDetail, pstCn: value});
  };

  const getBbs = (searchDto) => {
    const getBbsURL = `/bbsApi/getBbs`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(searchDto)
    };

    EgovNet.requestFetch(getBbsURL, requestOptions, function (resp) {
      setBbsDetail(resp.result.bbs);
      setAcceptFileTypes(
          resp.result.bbs.atchFileKndNm != ""
              ? resp.result.bbs.atchFileKndNm.split(',').join(',')
              : ''
      );
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const allowedExtensions = acceptFileTypes.split(','); // 허용된 확장자 목록
    const validFiles = acceptedFiles.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    });

    if (validFiles.length > 0) {
      setFileList((prevFiles) => [...prevFiles, ...validFiles]); // 유효한 파일만 추가
    }

    if (validFiles.length !== acceptedFiles.length) {
      Swal.fire(
          `허용되지 않은 파일 유형이 포함되어 있습니다! (허용 파일: ${acceptFileTypes})`
      );
    }

  }, [acceptFileTypes]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    /*accept: acceptFileTypes, // accept 값은 `acceptFileTypes` 상태에 따라 동적으로 변경됩니다.*/
    multiple: true, // 멀티파일 허용
  });

  const handleDeleteFile = (index) => {
    const updatedFileList = fileList.filter((_, i) => i !== index);
    setFileList(updatedFileList);  // 파일 리스트 업데이트
  };

  const initMode = () => {
    setModeInfo({
      ...modeInfo,
      modeTitle: "등록",
      editURL: `/pstApi/setPst`,
    });

    getPst(searchDto);
  };

  const getPst = (searchDto) => {
    if (modeInfo.mode === CODE.MODE_CREATE) {
      getBbs(searchDto)
      // 조회/등록이면 조회 안함
      setPstDetail({
        bbsSn : searchDto.bbsSn,
        linkUrlAddr : "",
        upendNtcYn : "N",
        rlsYn : "N",
        actvtnYn : "Y",
        creatrSn: sessionUser.userSn,
      });

      return;
    }

    const getPstURL = `/pstApi/getPst.do`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(searchDto)
    };

    EgovNet.requestFetch(getPstURL, requestOptions, function (resp) {
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        setBbsDetail(resp.result.bbs);
        setAcceptFileTypes(
            resp.result.bbs.atchFileKndNm != ""
                ? resp.result.bbs.atchFileKndNm.split(',').join(',')
                : ''
        );

        resp.result.pst.mdfrSn = sessionUser.userSn
        setPstDetail(resp.result.pst);
        if(resp.result.pst.upendNtcYn == "Y"){
          setIsDatePickerEnabled(true);
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

            const updatedFiles = pstDetail.pstFiles.filter(file => file.atchFileSn !== atchFileSn);
            setPstDetail({ ...pstDetail, pstFiles: updatedFiles });  // 상태 업데이트
          } else {
          }
        });
      } else {
        //취소
      }
    });
  }

  const setPstData = async () => {
    if (pstDetail.upendNtcYn == "Y") {
      if(!pstDetail.ntcBgngDt && !pstDetail.ntcEndDate){
        Swal.fire("공지기간은 선택해주세요.");
        return;
      }
    }

    if(bbsDetail.pstCtgryYn == "Y"){
      if (!pstDetail.pstClsf) {
        Swal.fire("분류를 선택해주세요.");
        return;
      }
    }

    if (!pstDetail.pstTtl) {
      Swal.fire("제목을 입력해주세요.");
      return;
    }
    if (!pstDetail.pstCn) {
      Swal.fire("내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    for (let key in pstDetail) {
      if(pstDetail[key] != null && key != "pstFiles"){
        formData.append(key, pstDetail[key]);
      }
    }

    if(upPstSn != null){
      formData.append("upPstSn", upPstSn);
    }

    if(pstGroup != null){
      formData.append("pstGroup", pstGroup);
    }

    fileList.map((file) => {
      formData.append("files", file);
    });

    Swal.fire({
      title: "저장하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        const requestOptions = {
          method: "POST",
          body: formData
        };

        EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("등록되었습니다.");
            navigate(
                { pathname : URL.MANAGER_PST_NORMAL_LIST},
                { state: {
                    bbsSn: bbsDetail.bbsSn,
                    atchFileYn: bbsDetail.atchFileYn,
                  }
                }
            );
          } else {
          }
        });
      } else {
        //취소
      }
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
                { pathname : URL.MANAGER_PST_NORMAL_LIST},
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

  useEffect(() => {
    initMode();
  }, []);

  useEffect(() => {
    if(bbsDetail.pstCtgryYn == "Y"){
      getComCdList(7).then((data) => {
        setComCdList(data);
      })
    }
  }, [bbsDetail]);


  return (
      <div id="container" className="container layout cms">
        <ManagerLeftNew/>
        <div className="inner">
          {modeInfo.mode === CODE.MODE_CREATE && (
              <h2 className="pageTitle"><p>게시글 생성</p></h2>
          )}

          {modeInfo.mode === CODE.MODE_MODIFY && (
              <h2 className="pageTitle"><p>게시글 수정</p></h2>
          )}

          <div className="contBox infoWrap customContBox">
            <ul className="inputWrap">
              {upPstSn == null && pstDetail.upPstSn == null && (
                  <>
                    <li className="toggleBox width3">
                      <div className="box">
                        <p className="title essential">공지(기간)</p>
                        <div className="toggleSwithWrap">
                          <input type="checkbox"
                                 id="upendNtcYn"
                                 checked={pstDetail.upendNtcYn == "Y"}
                                 onChange={(e) => {
                                   setPstDetail({
                                     ...pstDetail,
                                     upendNtcYn: e.target.checked ? "Y" : "N",
                                     ntcBgngDt: !e.target.checked ? null : pstDetail.ntcBgngDt,
                                     ntcEndDate: !e.target.checked ? null : pstDetail.ntcEndDate,
                                   })
                                   setIsDatePickerEnabled(e.target.checked);
                                 }}
                          />
                          <label htmlFor="upendNtcYn" className="toggleSwitch">
                            <span className="toggleButton"></span>
                          </label>
                        </div>
                      </div>
                    </li>
                    <li className="inputBox type1 width3">
                      <label className="title" htmlFor="ntcBgngDt"><small>공지시작일</small></label>
                      <div className="input">
                        <input type="date"
                               id="ntcBgngDt"
                               name="ntcBgngDt"
                               value={moment(pstDetail.ntcBgngDt).format('YYYY-MM-DD')}
                               onChange={(e) =>
                                   setPstDetail({...pstDetail, ntcBgngDt: moment(e.target.value).format('YYYYMMDD')})
                               }
                               disabled={!isDatePickerEnabled}
                        />
                      </div>
                    </li>
                    <li className="inputBox type1 width3">
                      <label className="title" htmlFor="ntcEndDate"><small>공지종료일</small></label>
                      <div className="input">
                        <input type="date"
                               id="ntcEndDate"
                               name="ntcEndDate"
                               value={moment(pstDetail.ntcEndDate).format('YYYY-MM-DD')}
                               onChange={(e) =>
                                   setPstDetail({...pstDetail, ntcEndDate: moment(e.target.value).format('YYYYMMDD')})
                               }
                               disabled={!isDatePickerEnabled}
                        />
                      </div>
                    </li>
                  </>
              )}
              {bbsDetail.pstCtgryYn == "Y" && (
                  <li className="inputBox type1 width1">
                    <label className="title essential" htmlFor="pstTtl"><small>분류</small></label>
                    <div className="input">
                      <div className="itemBox">
                        <select
                            id="pstClsf"
                            className="selectGroup"
                            key={pstDetail.pstSn}
                            value={pstDetail.pstClsf}
                            onChange={(e) =>
                                setPstDetail({...pstDetail, pstClsf: e.target.value})
                            }

                        >
                          <option value="">선택</option>
                          {comCdList.map((item, index) => (
                              <option value={item.comCdSn}>{item.comCdNm}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </li>
              )}
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="pstTtl"><small>제목</small></label>
                <div className="input">
                  <input type="text"
                         name="pstTtl"
                         title=""
                         id="pstTtl"
                         defaultValue={pstDetail.pstTtl}
                         onChange={(e) =>
                             setPstDetail({...pstDetail, pstTtl: e.target.value})
                         }
                  />
                </div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential"><small>작성일</small></label>
                <div className="input">{moment(pstDetail.frstCrtDt).format('YYYY-MM-DD')}</div>
              </li>
              {bbsDetail.atchFileYn == "Y" && (
                  <li className="inputBox type1 width1 file">
                    <p className="title essential">첨부파일</p>
                    <div
                        {...getRootProps({
                          style: {
                            border: "2px dashed #cccccc",
                            padding: "20px",
                            textAlign: "center",
                            cursor: "pointer",
                          },
                        })}
                    >
                      <input {...getInputProps()} />
                      <p>파일을 이곳에 드롭하거나 클릭하여 업로드하세요</p>
                    </div>
                    {pstDetail != null && pstDetail.pstFiles != null && pstDetail.pstFiles.length > 0 && (
                        <ul>
                          {pstDetail.pstFiles.map((file, index) => (
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
                    {fileList.length > 0 && (
                        <ul>
                          {fileList.map((file, index) => (
                              <li key={index}>
                                {file.name} - {(file.size / 1024).toFixed(2)} KB

                                <button
                                    onClick={() => handleDeleteFile(index)}  // 삭제 버튼 클릭 시 처리할 함수
                                    style={{marginLeft: '10px', color: 'red'}}
                                >
                                  삭제
                                </button>
                              </li>
                          ))}
                        </ul>
                    )}
                    <span className="warningText"></span>
                  </li>
              )}
              <li className="inputBox type1 width1">
                <label className="title" htmlFor="linkUrlAddr"><small>외부링크</small></label>
                <div className="input">
                  <input type="text"
                         name="linkUrlAddr"
                         title=""
                         id="linkUrlAddr"
                         defaultValue={pstDetail.linkUrlAddr}
                         onChange={(e) =>
                             setPstDetail({...pstDetail, linkUrlAddr: e.target.value})
                         }
                  />
                </div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential"><small>내용</small></label>
                <div>
                  <CommonEditor
                      value={pstDetail.pstCn}
                      onChange={handleChange}
                  />
                </div>
              </li>
              {bbsDetail.wrtrRlsYn == "Y" && upPstSn == null && pstDetail.upPstSn == null && (
                  <>
                    <li className="inputBox type1 width2">
                      <label className="title" htmlFor="rlsYn"><small>공개여부</small></label>
                      <div className="itemBox">
                        <select
                            id="rlsYn"
                            className="selectGroup"
                            onChange={(e) =>
                                setPstDetail({
                                  ...pstDetail,
                                  rlsYn: e.target.value,
                                })
                            }
                            value={pstDetail.rlsYn || "Y"}
                        >
                          <option value="Y">비공개</option>
                          <option value="N">공개</option>
                        </select>
                      </div>
                    </li>
                    <li className="inputBox type1 width2">
                      <label className="title essential" htmlFor="prvtPswd"><small>비밀번호</small></label>
                      <div className="input">
                        <form>
                          <input type="password"
                                 name="prvtPswd"
                                 title=""
                                 id="prvtPswd"
                                 placeholder="비밀번호"
                                 autoComplete="off"
                                 defaultValue={pstDetail.prvtPswd}
                                 onChange={(e) =>
                                     setPstDetail({...pstDetail, prvtPswd: e.target.value})
                                 }
                                 disabled={pstDetail.rlsYn == "N"}
                          />
                        </form>
                      </div>
                    </li>
                  </>
              )}
            </ul>
            <div className="buttonBox">
              <div className="leftBox">
                <button type="button" className="clickBtn point" onClick={() => setPstData()}><span>저장</span></button>
                {modeInfo.mode === CODE.MODE_MODIFY && (
                    <button type="button" className="clickBtn gray"
                            onClick={() => {
                              setPstDel(pstDetail.pstSn);
                            }}
                    ><span>삭제</span></button>
                )}
              </div>
              <NavLink
                  to={URL.MANAGER_PST_NORMAL_LIST}
                  className="btn btn_blue_h46 w_100"
                  state={{
                    bbsSn: bbsDetail.bbsSn,
                    atchFileYn: bbsDetail.atchFileYn
                  }}
              >
                <button type="button" className="clickBtn black"><span>목록</span></button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
  );
}

export default setPst;
