
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftBoard";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import Form from "react-bootstrap/Form";
import moment from "moment";
import ReactQuill from 'react-quill-new';
import '@/css/quillSnow.css';
import {getSessionItem} from "../../../../utils/storage.js";

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

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [pstDetail, setPstDetail] = useState({});
  const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(false);
  const [acceptFileTypes, setAcceptFileTypes] = useState('');
  const [fileList, setFileList] = useState([]);
  const [bbsDetail, setBbsDetail] = useState({});

  const rlsYnRadioGroup = [
    { value: "Y", label: "비공개" },
    { value: "N", label: "공개" },
  ];

  const handleChange = (value) => {
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
    accept: acceptFileTypes, // accept 값은 `acceptFileTypes` 상태에 따라 동적으로 변경됩니다.
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

    const getPstURL = `/pstApi/getPst`;
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
          setStartDate(
              new Date(
                  resp.result.pst.ntcBgngDt.substring(0, 4),
                  resp.result.pst.ntcBgngDt.substring(4, 6) - 1,
                  resp.result.pst.ntcBgngDt.substring(6, 8)
              )
          )
          setEndDate(
              new Date(
                  resp.result.pst.ntcEndDate.substring(0, 4),
                  resp.result.pst.ntcEndDate.substring(4, 6) - 1,
                  resp.result.pst.ntcEndDate.substring(6, 8)
              )
          )
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

    if (!pstDetail.pstTtl) {
      Swal.fire("제목은 필수 값입니다.");
      return;
    }
    if (!pstDetail.pstCn) {
      Swal.fire("내용은 필수 값입니다.");
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


    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

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
                { pathname : URL.MANAGER_PST_LIST},
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
                { pathname : URL.MANAGER_PST_LIST},
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

  return (
      <div className="container">
        <style>{`
          .layout dt {
            width: 200px !important;
          }
        `}</style>
        <div className="c_wrap">
          <div className="location">
            <ul>
              <li>
                <Link to={URL.MANAGER} className="home">
                  Home
                </Link>
              </li>
              <li>
                <Link
                    to={URL.MANAGER_PST_LIST}
                    state={{
                      bbsSn: bbsDetail.bbsSn,
                      atchFileYn : bbsDetail.atchFileYn
                    }}
                >
                  게시글관리
                </Link>
              </li>
              <li>게시글생성</li>
            </ul>
          </div>

          <div className="layout">
            <EgovLeftNav></EgovLeftNav>

            <div className="contents BOARD_CREATE_REG" id="contents">
              {modeInfo.mode === CODE.MODE_CREATE && (
                  <h2 className="tit_2">게시글 생성</h2>
              )}

              {modeInfo.mode === CODE.MODE_MODIFY && (
                  <h2 className="tit_2">게시글 수정</h2>
              )}

              <div className="board_view2">
                {upPstSn == null && pstDetail.upPstSn == null && (
                    <dl>
                      <dt>
                        <label htmlFor="bbsNm">공지(기간)</label>
                        <span className="req">필수</span>
                      </dt>
                      <dd className="pstUpendNtcDd">
                        <Form.Check
                            type="checkbox"
                            id="upendNtcYn"
                            label="공지"
                            checked={pstDetail.upendNtcYn == "Y"}
                            onChange={(e) => {
                              setPstDetail({
                                ...pstDetail,
                                upendNtcYn: e.target.checked ? "Y" : "N",
                                ntcBgngDt: e.target.checked ? moment(startDate).format('YYYYMMDD') : null,
                                ntcEndDate: e.target.checked ? moment(endDate).format('YYYYMMDD') : null
                              })
                              setIsDatePickerEnabled(e.target.checked);
                            }}
                        ></Form.Check>
                        <input type="date"
                               name="ntcBgngDt"
                               onChange={(date) => setStartDate(date)}
                               disabled={!isDatePickerEnabled} // 활성화 여부 결정
                        />~
                        <input type="date"
                               name="ntcEndDate"
                               onChange={(date) => setEndDate(date)}
                               disabled={!isDatePickerEnabled} // 활성화 여부 결정
                        />
                      </dd>
                    </dl>
                )}
                <dl>
                  <dt>
                    <label htmlFor="pstTtl">제목</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="pstTtl"
                        title=""
                        id="pstTtl"
                        defaultValue={pstDetail.pstTtl}
                        onChange={(e) =>
                            setPstDetail({...pstDetail, pstTtl: e.target.value})
                        }
                    />
                  </dd>
                </dl>

                <dl>
                  <dt>
                    <label htmlFor="pstTtl">작성일</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    {moment(pstDetail.frstCrtDt).format('YYYY-MM-DD')}
                  </dd>
                </dl>
                {bbsDetail.atchFileYn == "Y" && (
                    <dl>
                      <dt>
                        <label htmlFor="pstTtl">첨부파일</label>
                      </dt>
                      <dd>
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

                        {pstDetail != null && pstDetail.pstFiles != null &&pstDetail.pstFiles.length > 0 && (
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
                      </dd>
                    </dl>
                )}
                <dl>
                  <dt>
                    <label htmlFor="pstTtl">외부링크</label>
                  </dt>
                  <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="linkUrlAddr"
                        title=""
                        id="linkUrlAddr"
                        defaultValue={pstDetail.linkUrlAddr}
                        onChange={(e) =>
                            setPstDetail({...pstDetail, linkUrlAddr: e.target.value})
                        }
                    />
                  </dd>
                </dl>

                <dl>
                  <dt>
                    <label htmlFor="pstCn">
                      내용
                    </label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <ReactQuill
                        value={pstDetail.pstCn}
                        onChange={handleChange}
                    />
                  </dd>
                </dl>
                {bbsDetail.wrtrRlsYn == "Y" && upPstSn == null && pstDetail.upPstSn == null && (
                <dl>
                  <dt>
                    <label htmlFor="pstTtl">공개여부</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <EgovRadioButtonGroup
                        name="rlsYn"
                        radioGroup={rlsYnRadioGroup}
                        setValue={pstDetail.rlsYn}
                        setter={(v) =>
                            setPstDetail({...pstDetail, rlsYn: v})
                        }
                    />
                    <input
                        className="f_input2 w_full"
                        type="password"
                        name="prvtPswd"
                        title=""
                        id="prvtPswd"
                        placeholder="비밀번호"
                        defaultValue={pstDetail.prvtPswd}
                        onChange={(e) =>
                            setPstDetail({...pstDetail, prvtPswd: e.target.value})
                        }
                        disabled={pstDetail.rlsYn == "N"} // 활성화 여부 결정
                    />
                  </dd>
                </dl>
                )}
                {/* <!-- 버튼영역 --> */}
                <div className="board_btn_area">
                  <div className="left_col btn1">
                    <button
                        className="btn btn_skyblue_h46 w_100"
                        onClick={() => setPstData()}
                    >
                      저장
                    </button>
                    {modeInfo.mode === CODE.MODE_MODIFY && (
                        <button
                            className="btn btn_skyblue_h46 w_100"
                            onClick={() => {
                              setPstDel(pstDetail.pstSn);
                            }}
                        >
                          삭제
                        </button>
                    )}
                  </div>

                  <div className="right_col btn1">
                    <Link
                        to={URL.MANAGER_PST_LIST}
                        className="btn btn_blue_h46 w_100"
                        state={{
                          bbsSn: bbsDetail.bbsSn,
                          atchFileYn : bbsDetail.atchFileYn
                        }}
                    >
                      목록
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

export default setPst;
