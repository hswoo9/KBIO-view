
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import {NavLink, useNavigate, useLocation, Link} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import Swal from "sweetalert2";
import moment from "moment";
import CommonSubMenu from "@/components/CommonSubMenu";
import AOS from "aos";
import CommonEditor from "@/components/CommonEditor";
import {getSessionItem} from "../../../../utils/storage.js";
import {getComCdList} from "../../../../components/CommonComponents.jsx";

function setCommonPst(props) {

  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();

  const upPstSn = location.state?.upPstSn || null;
  const upPstClsf = location.state?.upPstClsf || null;
  const upPstTtl = location.state?.upPstTtl || null;
  const upRlsYn = location.state?.upRlsYn || null;
  const upPrvtPswd = location.state?.upPrvtPswd || null;

  const pstGroup = location.state?.pstGroup || null;

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [pst, setPst] = useState({pstSn : location.state?.pstSn});
  const [comCdList, setComCdList] = useState([]);
  const [rlsYn, setRlsYn] = useState(null);
  useEffect(() => {
    setPst({
        ...pst,
        rlsYn: rlsYn
        })
  }, [rlsYn]);

  const [acceptFileTypes, setAcceptFileTypes] = useState('');
  const [fileList, setFileList] = useState([]);
  const [bbs, setBbs] = useState({bbsSn : location.state?.bbsSn});

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
        pstClsf : upPstClsf ? upPstClsf : null,
        pstTtl : upPstTtl ? "문의하신 " + upPstTtl + " 답변입니다." : null,
        linkUrlAddr : "",
        upendNtcYn : "N",
        rlsYn : upRlsYn ? upRlsYn : "N",
        prvtPswd : upPrvtPswd ? upPrvtPswd : null,
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
      if(pst[key] != null && key != "pstFiles" && key != "tblUser"){
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
                { pathname : URL.COMMON_PST_QNA_LIST},
                { state: {
                    bbsSn: bbs.bbsSn,
                    menuSn: location.state?.menuSn,
                    menuNmPath: location.state?.menuNmPath,
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
                { pathname : URL.COMMON_PST_QNA_LIST},
                { state: {
                    bbsSn: bbs.bbsSn,
                    menuSn: location.state?.menuSn,
                    menuNmPath: location.state?.menuNmPath,
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

  const rlsYnChange = (e) => {
    if(e.currentTarget.closest("button").classList.contains("click")){
      e.currentTarget.closest("button").classList.remove("click");
      setRlsYn("N");
    }else{
      e.currentTarget.closest("button").classList.add("click");
      setRlsYn("Y");
    }

  }

  useEffect(() => {
    initMode();
    AOS.init();
  }, []);

  useEffect(() => {
    if(bbs.pstCtgryYn == "Y"){
      getComCdList(8).then((data) => {
        setComCdList(data);
      })
    }
  }, [bbs]);

  return (
      <div id="container" className="container q&a board write">
        <div className="inner">
          <CommonSubMenu />
          <div className="inner2">
            <div className="textWrap">
              <ul className="listBox" data-aos="fade-up" data-aos-duration="1500">
                <li className="textBox width3">
                  <p className="title">작성자</p>
                  <p className="text">김덕배</p>
                </li>
                <li className="textBox width3">
                  <p className="title">작성일</p>
                  <p className="text">{moment(pst.frstCrtDt).format('YYYY-MM-DD')}</p>
                </li>
                <li className="inputBox type1 width3">
                  <p className="title essential">분류</p>
                  <div className="itemBox">
                    <select
                        className="niceSelectCustom"
                        id="pstClsf"
                        key={pst.pstSn || 0}
                        value={upPstClsf != null ? upPstClsf : pst.pstClsf}
                        onChange={(e) =>
                            setPst({...pst, pstClsf: e.target.value})
                        }
                        disabled={upPstClsf}
                    >
                      <option value="">선택</option>
                      {comCdList.map((item, index) => (
                          <option value={item.comCdSn} key={index}>{item.comCdNm}</option>
                      ))}
                    </select>
                  </div>
                </li>
                <li className="inputBox type1">
                  <label htmlFor="q&a_title" className="title">외부링크</label>
                  <div className="input">
                    <input
                        type="text"
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
                <li className="inputBox type1">
                  <label htmlFor="q&a_title" className="title essential">제목</label>
                  <div className="input">
                    <input
                        type="text"
                        name="pstTtl"
                        title=""
                        id="pstTtl"
                        defaultValue={upPstTtl != null ? "문의하신 " + upPstTtl + " 답변입니다." : pst.pstTtl}
                        onChange={(e) =>
                            setPst({...pst, pstTtl: e.target.value})
                        }
                        disabled={upPstTtl}
                    />
                    {bbs.wrtrRlsYn == "Y" && upPstSn == null && pst.upPstSn == null && (
                        <button type="button"
                                className={upRlsYn == "Y" ? "secretBtn btn click" : "secretBtn btn"}
                                onClick={rlsYnChange}
                                disabled={upRlsYn == "Y"}
                        >
                          <span>비밀글 활성화</span>
                          <div className="icon"></div>
                        </button>
                    )}
                  </div>
                </li>
                <li className="inputBox type1">
                  <label htmlFor="q&a_text" className="title essential">내용</label>
                  <div className="input">
                    <CommonEditor
                        value={pst.pstCn}
                        onChange={handleChange}
                    />
                  </div>
                </li>
              </ul>
              <p className="botText">* 표시는 필수 입력 사항입니다.</p>
            </div>
            <div className="buttonBox">
              <button type="button" className="clickBtn writeBtn" onClick={() => setPstData()}>
                <div className="icon"></div>
                <span>등록</span>
              </button>
              {modeInfo.mode === CODE.MODE_MODIFY && (
                  <button type="button" className="clickBtn red"
                          onClick={() => {
                            setPstDel(pst.pstSn);
                          }}
                  ><span>삭제</span></button>
              )}

              <Link
                  to={URL.COMMON_PST_QNA_LIST}
                  state={{
                    bbsSn: bbs.bbsSn,
                    menuSn: location.state?.menuSn,
                    menuNmPath: location.state?.menuNmPath,
                  }}
                  className="clickBtn listBtn"
              >
                <div className="icon"></div>
                <span>목록</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}

export default setCommonPst;
