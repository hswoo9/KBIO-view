
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftNew";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import {getSessionItem} from "../../../utils/storage.js";

function setBbs(props) {
  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);

  const bbsTypeOptions = [
    { value: "", label: "선택" },
    { value: "0", label: "일반" },
    { value: "1", label: "FaQ" },
    { value: "2", label: "QnA" },
  ];
  const wrtrRlsYnRadioGroup = [
    { value: "Y", label: "공개" },
    { value: "N", label: "비공개" },
  ];
  const accessRadioGroup = [
    { value: "Y", label: "가능" },
    { value: "N", label: "불가능" },
  ];
  const activeRadioGroup = [
    { value: "Y", label: "사용" },
    { value: "N", label: "미사용" },
  ];

  const [searchDto, setSearchDto] = useState({bbsSn : location.state?.bbsSn});

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [bbsDetail, setBbsDetail] = useState({});
  useEffect(() => {
    console.log(bbsDetail);
  }, [bbsDetail])

  const initMode = () => {
    setModeInfo({
      ...modeInfo,
      modeTitle: "등록",
      editURL: `/bbsApi/setBbs`,
    });

    getBbs(searchDto);
  };

  const getBbs = (searchDto) => {
    if (modeInfo.mode === CODE.MODE_CREATE) {
      // 조회/등록이면 조회 안함
      setBbsDetail({
        tmplatId: "TMPLAT_BOARD_DEFAULT", //Template 고정
        pstCtgryYn: "N",
        wrtrRlsYn: "N",
        atchFileYn : "N",
        cmntPsbltyYn : "N",
        replyPsbltyYn : "N",
        actvtnYn : "Y",
        creatrSn: sessionUser.userSn,
      });
      return;
    }

    const getBbsURL = `/bbsApi/getBbs`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(searchDto)
    };

    EgovNet.requestFetch(getBbsURL, requestOptions, function (resp) {
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        resp.result.bbs.mdfrSn = sessionUser.userSn;
        let bbsData = resp.result.bbs;
        /*if(bbsData.actvtnYn)*/
        if(bbsData.pstCtgryYn != null){
          document.getElementById("pstCtgryYn").checked = bbsData.pstCtgryYn == "Y" ? true : false;
        }
        if(bbsData.wrtrRlsYn != null){
          document.getElementById("wrtrRlsYn").checked = bbsData.wrtrRlsYn == "Y" ? true : false;
        }
        if(bbsData.atchFileYn != null){
          document.getElementById("atchFileYn").checked = bbsData.atchFileYn == "Y" ? true : false;
        }
        if(bbsData.actvtnYn != null){
          document.getElementById("actvtnYn").checked = bbsData.actvtnYn == "Y" ? true : false;
        }
        if(bbsData.cmntPsbltyYn != null){
          document.getElementById("cmntPsbltyYn").checked = bbsData.cmntPsbltyYn == "Y" ? true : false;
        }
        if(bbsData.replyPsbltyYn != null){
          document.getElementById("replyPsbltyYn").checked = bbsData.replyPsbltyYn == "Y" ? true : false;
        }
        setBbsDetail(bbsData);
      }
    });
  };

  const setBbs = () => {
    let requestOptions = {};
    if (!bbsDetail.bbsNm) {
      Swal.fire("게시판명은 필수 값입니다.");
      return;
    }
    if (!bbsDetail.bbsType) {
      Swal.fire("게시판 유형은 필수 값입니다.");
      return;
    }

    if(bbsDetail.atchFileYn == "Y"){
      if (!bbsDetail.atchFileKndNm) {
        Swal.fire("파일첨부가능 확장자는 필수 값입니다.");
        return;
      }
    }

    const formData = new FormData();

    for (let key in bbsDetail) {
      formData.append(key, bbsDetail[key]);
    }

    Swal.fire({
      title: "저장하시겠습니까?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "저장",
      cancelButtonText: "취소"
    }).then((result) => {
      if(result.isConfirmed) {
        requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(bbsDetail),
        };

        EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("등록되었습니다.");
            navigate(URL.MANAGER_BBS_LIST);
          } else {
            navigate(
                { pathname: URL.ERROR },
                { state: { msg: resp.resultMessage } }
            );
          }
        });
      } else {
        //취소
      }
    });


  };

  const setBbsDel = (bbsSn) => {
    const setBbsDelUrl = "/bbsApi/setBbsDel";

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
          body: JSON.stringify({bbsSn : bbsSn}),
        };

        EgovNet.requestFetch(setBbsDelUrl, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            Swal.fire("삭제되었습니다.");
            navigate(URL.MANAGER_BBS_LIST);
          } else {
            alert("ERR : " + resp.resultMessage);
          }
        });
      } else {
        //취소
      }
    });
  };

  const getSelectedLabel = (objArray, findLabel = "") => {
    let foundValueLabelObj = objArray.find((o) => o["value"] === findLabel);
    return foundValueLabelObj["label"];
  };

  useEffect(() => {
    initMode();
  }, []);

  return (
      <div id="container" className="container layout cms">
        <ManagerLeftNew/>
        <div className="inner">
          {modeInfo.mode === CODE.MODE_CREATE && (
              <h2 className="pageTitle"><p>게시판 생성</p></h2>
          )}

          {modeInfo.mode === CODE.MODE_MODIFY && (
              <h2 className="pageTitle"><p>게시판 수정</p></h2>
          )}
          <div className="contBox infoWrap customContBox">
            <ul className="inputWrap">
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="bbsNm"><small>게시판명</small></label>
                <div className="input">
                  <input type="text"
                         id="bbsNm"
                         placeholder=""
                         value={bbsDetail.bbsNm || ""}
                         onChange={(e) =>
                             setBbsDetail({...bbsDetail, bbsNm: e.target.value})
                         }
                         ref={(el) => (checkRef.current[0] = el)}
                  />
                </div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title" htmlFor="bbsType"><small>게시판유형</small></label>
                <div className="itemBox">
                  {/*{modeInfo.mode === CODE.MODE_CREATE && (
                      <label className="f_select w_130" htmlFor="bbsType">
                        <select
                            id="bbsType"
                            name="bbsType"
                            title="게시판유형선택"
                            onChange={(e) =>
                                setBbsDetail({
                                  ...bbsDetail,
                                  bbsType: e.target.value,
                                })
                            }
                            value={bbsDetail.bbsType}
                        >
                          {bbsTypeOptions.map((option) => {
                            return (
                                <option value={option.value} key={option.value}>
                                  {option.label}
                                </option>
                            );
                          })}
                        </select>
                      </label>
                  )}
                  {modeInfo.mode === CODE.MODE_MODIFY && (
                      <span>
                      {bbsDetail.bbsType &&
                          getSelectedLabel(
                              bbsTypeOptions,
                              bbsDetail.bbsType
                          )}
                    </span>
                  )}*/}
                  <select
                      id="bbsType"
                      name="bbsType"
                      className="selectGroup"
                      title="게시판유형선택"
                      onChange={(e) =>
                          setBbsDetail({
                            ...bbsDetail,
                            bbsType: e.target.value,
                          })
                      }
                      value={bbsDetail.bbsType || ""}
                  >
                    {bbsTypeOptions.map((option) => {
                      return (
                          <option value={option.value} key={option.value}>
                            {option.label}
                          </option>
                      );
                    })}
                  </select>
                </div>
              </li>
              <li className="toggleBox type1 width4 customToggleBox">
                <div className="box">
                  <p className="title essential">카테고리 사용여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="pstCtgryYn"
                           onChange={(e) =>
                               setBbsDetail({
                                 ...bbsDetail,
                                 pstCtgryYn: e.target.checked ? "Y" : "N",
                               })
                           }
                    />
                    <label htmlFor="pstCtgryYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>
              <li className="toggleBox type1 width4 customToggleBox">
                <div className="box">
                  <p className="title essential">작성자공개 사용여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="wrtrRlsYn"
                           onChange={(e) =>
                               setBbsDetail({
                                 ...bbsDetail,
                                 wrtrRlsYn: e.target.checked ? "Y" : "N",
                               })
                           }
                    />
                    <label htmlFor="wrtrRlsYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>
              <li className="toggleBox type1 width4 customToggleBox">
                <div className="box">
                  <p className="title essential">파일첨부 가능여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="atchFileYn"
                           onChange={(e) =>
                               setBbsDetail({
                                 ...bbsDetail,
                                 atchFileYn: e.target.checked ? "Y" : "N",
                               })
                           }
                    />
                    <label htmlFor="atchFileYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>
              <li className="toggleBox type1 width4 customToggleBox">
                <div className="box">
                  <p className="title essential">사용여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="actvtnYn"
                           onChange={(e) =>
                               setBbsDetail({
                                 ...bbsDetail,
                                 actvtnYn: e.target.checked ? "Y" : "N",
                               })
                           }
                    />
                    <label htmlFor="actvtnYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>
              <li className="inputBox type1 width3">
                <label className="title essential" htmlFor="atchFileKndNm"><small>첨부가능 확장자</small></label>
                <div className="input">
                  <input type="text"
                         placeholder=""
                         required="required"
                         name="atchFileKndNm"
                         title=""
                         id="atchFileKndNm"
                         placeholder="쉼표(,)로 분리"
                         value={bbsDetail.atchFileKndNm || ""}
                         onChange={(e) =>
                             setBbsDetail({...bbsDetail, atchFileKndNm: e.target.value})
                         }
                         ref={(el) => (checkRef.current[1] = el)}
                  />
                </div>
              </li>

              <li className="toggleBox type1 width3 customToggleBox">
                <div className="box">
                  <p className="title essential">댓글가능여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="cmntPsbltyYn"
                           onChange={(e) =>
                               setBbsDetail({
                                 ...bbsDetail,
                                 cmntPsbltyYn: e.target.checked ? "Y" : "N",
                               })
                           }
                    />
                    <label htmlFor="cmntPsbltyYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>
              <li className="toggleBox type1 width3 customToggleBox">
                <div className="box">
                  <p className="title essential">답글사용여부</p>
                  <div className="toggleSwithWrap">
                    <input type="checkbox"
                           id="replyPsbltyYn"
                           onChange={(e) =>
                               setBbsDetail({
                                 ...bbsDetail,
                                 replyPsbltyYn: e.target.checked ? "Y" : "N",
                               })
                           }
                    />
                    <label htmlFor="replyPsbltyYn" className="toggleSwitch">
                      <span className="toggleButton"></span>
                    </label>
                  </div>
                </div>
              </li>
              <li className="inputBox type1 width1">
                <label className="title essential" htmlFor="rmrkCn"><small>비고</small></label>
                <div className="input">
                  <input type="text"
                         name="rmrkCn"
                         title=""
                         id="rmrkCn"
                         placeholder=""
                         defaultValue={bbsDetail.rmrkCn}
                         onChange={(e) =>
                             setBbsDetail({...bbsDetail, rmrkCn: e.target.value})
                         }
                         ref={(el) => (checkRef.current[2] = el)}
                  />
                </div>
              </li>
            </ul>
            <div className="buttonBox">
              <div className="leftBox">
                <button type="button" className="clickBtn point" onClick={() => setBbs()}><span>저장</span></button>
                {modeInfo.mode === CODE.MODE_MODIFY && (
                    <button
                        className="clickBtn gray"
                        onClick={() => {
                          setBbsDel(bbsDetail.bbsSn);
                        }}
                    >
                      <span>삭제</span>
                    </button>
                )}
              </div>
              <NavLink
                  to={URL.MANAGER_BBS_LIST}
              >
                <button type="button" className="clickBtn black"><span>목록</span></button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
  );
}

export default setBbs;
