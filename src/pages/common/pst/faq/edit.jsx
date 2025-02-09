
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import {NavLink, useNavigate, useLocation, Link} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import Swal from "sweetalert2";
import moment from "moment";

import CommonEditor from "@/components/CommonEditor";
import {getSessionItem} from "../../../../utils/storage.js";
import {getComCdList} from "../../../../components/CommonComponents.jsx";

function setCommonPst(props) {

  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();
  const upPstSn = location.state?.upPstSn || null;
  const pstGroup = location.state?.pstGroup || null;

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });

  const [bbs, setBbs] = useState({bbsSn : location.state?.bbsSn});
  const [pst, setPst] = useState({pstSn : location.state?.pstSn});
  const [comCdList, setComCdList] = useState([]);
  const [acceptFileTypes, setAcceptFileTypes] = useState('');
  const [fileList, setFileList] = useState([]);

  const isFirstRender = useRef(true);
  const handleChange = (value) => {
    if(isFirstRender.current){
      isFirstRender.current = false;
      return;
    }
    setPst({...pst, pstCn: value});
  };

  const getBbs = (bbs) => {
    const getBbsURL = `/bbsApi/getBbs`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(bbs)
    };

    EgovNet.requestFetch(getBbsURL, requestOptions, function (resp) {
      setBbs(resp.result.bbs);
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
    multiple: true,
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

    getPst(pst);
  };

  const getPst = (pst) => {
    if (modeInfo.mode === CODE.MODE_CREATE) {
      getBbs(bbs)
      // 조회/등록이면 조회 안함
      setPst({
        bbsSn : bbs.bbsSn,
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
      body: JSON.stringify(pst)
    };

    EgovNet.requestFetch(getPstURL, requestOptions, function (resp) {
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        setBbs(resp.result.bbs);
        setAcceptFileTypes(
            resp.result.bbs.atchFileKndNm != ""
                ? resp.result.bbs.atchFileKndNm.split(',').join(',')
                : ''
        );

        resp.result.pst.mdfrSn = sessionUser.userSn
        setPst(resp.result.pst);
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

            const updatedFiles = pst.pstFiles.filter(file => file.atchFileSn !== atchFileSn);
            setPst({ ...pst, pstFiles: updatedFiles });  // 상태 업데이트
          } else {
          }
        });
      } else {
        //취소
      }
    });
  }

  const setPstData = async () => {
    if(bbs.pstCtgryYn == "Y"){
      if (!pst.pstClsf) {
        Swal.fire("분류를 선택해주세요.");
        return;
      }
    }
    if (!pst.pstTtl) {
      Swal.fire("제목을 입력해주세요.");
      return;
    }
    if (!pst.pstCn) {
      Swal.fire("내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    for (let key in pst) {
      if(pst[key] != null && key != "pstFiles"){
        formData.append(key, pst[key]);
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
                { pathname : URL.COMMON_PST_FAQ_LIST},
                { state: {
                    bbsSn: bbs.bbsSn,
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
                { pathname : URL.COMMON_PST_FAQ_LIST},
                { state: {
                    bbsSn: bbs.bbsSn,
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
    if(bbs.pstCtgryYn == "Y"){
      getComCdList(9).then((data) => {
        setComCdList(data);
      })
    }
  }, [bbs]);

  return (
      <div id="container" className="container layout cms">
        <div className="inner">
          <h2 className="pageTitle"><p>{bbs.bbsNm}</p></h2>
          <div className="contBox infoWrap customContBox">
            <ul className="inputWrap">
              {bbs.pstCtgryYn == "Y" && (
                  <li className="inputBox type1 width1">
                    <label className="title essential" htmlFor="pstTtl"><small>분류</small></label>
                    <div className="input">
                      <div className="itemBox">
                        <select
                            id="pstClsf"
                            className="selectGroup"
                            key={pst.pstSn}
                            value={pst.pstClsf}
                            onChange={(e) =>
                                setPst({...pst, pstClsf: e.target.value})
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
                         defaultValue={pst.pstTtl}
                         onChange={(e) =>
                             setPst({...pst, pstTtl: e.target.value})
                         }
                  />
                </div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential"><small>작성일</small></label>
                <div className="input">{moment(pst.frstCrtDt).format('YYYY-MM-DD')}</div>
              </li>
              {bbs.atchFileYn == "Y" && (
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
                    {pst != null && pst.pstFiles != null && pst.pstFiles.length > 0 && (
                        <ul>
                          {pst.pstFiles.map((file, index) => (
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
                         defaultValue={pst.linkUrlAddr}
                         onChange={(e) =>
                             setPst({...pst, linkUrlAddr: e.target.value})
                         }
                  />
                </div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential"><small>내용</small></label>
                <div>
                  <CommonEditor
                      value={pst.pstCn}
                      onChange={handleChange}
                  />
                </div>
              </li>
            </ul>
            <div className="buttonBox">
              <div className="leftBox">
                <button type="button" className="clickBtn point" onClick={() => setPstData()}><span>저장</span></button>
                {modeInfo.mode === CODE.MODE_MODIFY && (
                    <button type="button" className="clickBtn gray"
                            onClick={() => {
                              setPstDel(pst.pstSn);
                            }}
                    ><span>삭제</span></button>
                )}
              </div>
              <Link
                  to={URL.COMMON_PST_FAQ_LIST}
                  state={{
                    bbsSn: bbs.bbsSn,
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

export default setCommonPst;
