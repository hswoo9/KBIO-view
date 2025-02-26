
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftOperationalSupport";
import Swal from "sweetalert2";
import moment from "moment";

import {fileDownLoad} from "../../../../components/CommonComponents.jsx";
import {getSessionItem} from "../../../../utils/storage.js";
import CommonEditor from "../../../../components/CommonEditor.jsx";

function setDiffEdit(props) {

  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();

  const [searchDto, setSearchDto] = useState({
    dfclMttrSn : location.state?.dfclMttrSn,
  });

  const [dfclMttr, setDfclMttr] = useState({})
  const acceptFileTypes = 'pdf,hwp,docx,xls,xlsx,ppt';
  const [answerFileList, setAnswerFileList] = useState([]);

  const isFirstRender = useRef(true);
  const handleChange = (value) => {
    if(isFirstRender.current){
      isFirstRender.current = false;
      return;
    }
    setDfclMttr({...dfclMttr, ansCn: value});
  };

  const onDrop = useCallback((acceptedFiles) => {
    const allowedExtensions = acceptFileTypes.split(','); // 허용된 확장자 목록
    const validFiles = acceptedFiles.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    });

    if (validFiles.length > 0) {
      setAnswerFileList((prevFiles) => [...prevFiles, ...validFiles]); // 유효한 파일만 추가
    }

    if (validFiles.length !== acceptedFiles.length) {
      Swal.fire(
          `허용되지 않은 파일 유형이 포함되어 있습니다! (허용 파일: ${acceptFileTypes})`
      );
    }

  }, [acceptFileTypes]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleDeleteFile = (index) => {
    const updatedFileList = answerFileList.filter((_, i) => i !== index);
    setAnswerFileList(updatedFileList);  // 파일 리스트 업데이트
  };

  const getDfclMttr = (searchDto) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(searchDto)
    };

    EgovNet.requestFetch("/diffApi/getDfclMttr", requestOptions, function (resp) {
      resp.result.dfclMttr.mdfrSn = sessionUser.userSn
      setDfclMttr(resp.result.dfclMttr);
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

            const updatedFiles = dfclMttr.answerFiles.filter(file => file.atchFileSn !== atchFileSn);
            setDfclMttr({ ...dfclMttr, answerFiles: updatedFiles });  // 상태 업데이트
          } else {

          }
        });
      } else {
        //취소
      }
    });
  }

  const setDiffData = async () => {
    if (!dfclMttr.ansCn) {
      Swal.fire("답변내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    for (let key in dfclMttr) {
      if(dfclMttr[key] != null && key != "diffFiles" && key != "answerFiles"){
        formData.append(key, dfclMttr[key]);
      }
    }

    answerFileList.map((file) => {
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

        EgovNet.requestFetch("/diffApi/setDfclMttrAnswer", requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("등록되었습니다.");
            navigate(
                { pathname : URL.MANAGER_DIFFICULTIES},
            );
          } else {
          }
        });
      } else {
        //취소
      }
    });
  };

  useEffect(() => {
    getDfclMttr(searchDto);
  }, []);

  return (
      <div id="container" className="container layout cms">
        <ManagerLeftNew/>
        <div className="inner">
          <div className="contBox infoWrap customContBox">
            <ul className="inputWrap">
              <li className="inputBox type1 width1">
                <label className="title essential"><small>신청자</small></label>
                <div className="input">{dfclMttr.kornFlnm}</div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential"><small>등록일</small></label>
                <div className="input">{moment(dfclMttr.frstCrtDt).format('YYYY-MM-DD')}</div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title"><small>분류</small></label>
                <div className="input">{dfclMttr.dfclMttrFldNm}</div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title"><small>제목</small></label>
                <div className="input">{dfclMttr.ttl}</div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title"><small>의뢰내용</small></label>
                <div className="input" dangerouslySetInnerHTML={{__html: dfclMttr.dfclMttrCn}}></div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title"><small>첨부파일</small></label>
                <div className="input">
                  {dfclMttr.diffFiles && dfclMttr.diffFiles.length > 0 ? (
                      <ul>
                        {dfclMttr.diffFiles.map((file, index) => (
                            <li key={index}>
                                <span
                                    onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}>{file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB</span>
                            </li>
                        ))}
                      </ul>
                  ) : "첨부파일이 없습니다."}
                </div>
              </li>

              <li className="inputBox type1 width1">
                <label className="title essential"><small>답변내용</small></label>
                <div>
                  <CommonEditor
                      value={dfclMttr.ansCn || ""}
                      onChange={handleChange}
                  />
                </div>
              </li>
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
                {dfclMttr.answerFiles != null && dfclMttr.answerFiles.length > 0 && (
                    <ul>
                      {dfclMttr.answerFiles.map((file, index) => (
                          <li key={index}>
                            <span
                                onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}
                                style={{cursor: "pointer"}}>
                                      {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                            </span>
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
                <span className="warningText"></span>
                {answerFileList.length > 0 && (
                    <ul>
                      {answerFileList.map((file, index) => (
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
              </li>
            </ul>
            <div className="buttonBox">
              <div className="leftBox">
                <button type="button" className="clickBtn point" onClick={() => setDiffData()}><span>저장</span></button>
              </div>
              <NavLink
                  to={URL.MANAGER_DIFFICULTIES}
                  className="btn btn_blue_h46 w_100"
              >
                <button type="button" className="clickBtn black"><span>목록</span></button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
  );
}

export default setDiffEdit;
