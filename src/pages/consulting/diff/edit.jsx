
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import {NavLink, useNavigate, useLocation, Link} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import Swal from "sweetalert2";

import CommonEditor from "@/components/CommonEditor";
import {getSessionItem} from "../../../utils/storage.js";
import {getComCdList} from "../../../components/CommonComponents.jsx";

function DfclMttrPage(props) {
  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();
  const callBackUrl = location.state?.callBackUrl || "/";

  const [dfclMttr, setDfclMttr] = useState({
    creatrSn : sessionUser.userSn,
    userSn : sessionUser.userSn
  });

  const [comCdList, setComCdList] = useState([]);
  const acceptFileTypes = 'pdf,hwp,docx,xls,xlsx,ppt';
  const [fileList, setFileList] = useState([]);

  const handleChange = (value) => {
    setDfclMttr({...dfclMttr, dfclMttrCn: value});
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
    multiple: true,
  });

  const handleDeleteFile = (index) => {
    const updatedFileList = fileList.filter((_, i) => i !== index);
    setFileList(updatedFileList);  // 파일 리스트 업데이트
  };

  const setDfclMttrData = async () => {
    if (!dfclMttr.dfclMttrFld) {
      Swal.fire("분야를 선택해주세요.");
      return;
    }

    if (!dfclMttr.ttl) {
      Swal.fire("제목을 입력해주세요.");
      return;
    }
    if (!dfclMttr.dfclMttrCn) {
      Swal.fire("내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    for (let key in dfclMttr) {
      if(dfclMttr[key] != null){
        formData.append(key, dfclMttr[key]);
      }
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

        EgovNet.requestFetch("/consultingApi/setDfclMttr", requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("등록되었습니다.");
            navigate(
                { pathname : callBackUrl},
                { state: {
                    menuSn : location.state?.menuSn,
                    menuNmPath : location.state?.menuNmPath,
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

  useEffect(() => {
      getComCdList(15).then((data) => {
        setComCdList(data);
      })
  }, []);

  return (
      <div id="container" className="container layout cms">
        <div className="inner">
          <h2 className="pageTitle"><p>애로사항 등록</p></h2>

          <div className="contBox infoWrap customContBox">
            <ul className="inputWrap">
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="pstTtl"><small>분야</small></label>
                <div className="input">
                  <div className="itemBox">
                    <select
                        id="dfclMttrFld"
                        className="selectGroup"
                        key="0"
                        onChange={(e) =>
                            setDfclMttr({...dfclMttr, dfclMttrFld: e.target.value})
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
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="ttl"><small>제목</small></label>
                <div className="input">
                  <input type="text"
                         name="ttl"
                         title=""
                         id="ttl"
                         onChange={(e) =>
                             setDfclMttr({...dfclMttr, ttl: e.target.value})
                         }
                  />
                </div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential"><small>내용</small></label>
                <div>
                  <CommonEditor
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
            </ul>
            <div className="buttonBox">
              <div className="leftBox">
                <button type="button" className="clickBtn point" onClick={() => setDfclMttrData()}><span>등록</span>
                </button>
              </div>
              <Link
                  to={callBackUrl}
                  state={{
                    menuSn : location.state?.menuSn,
                    menuNmPath : location.state?.menuNmPath,
                  }}
              >
                <button type="button" className="clickBtn white">
                  목록
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}

export default DfclMttrPage;
