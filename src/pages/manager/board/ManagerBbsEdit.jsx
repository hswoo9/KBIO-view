
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftBoard";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import {getSessionItem} from "../../../utils/storage.js";

function setBbs(props) {
  const sessionUser = getSessionItem("loginUser");
  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);
  // const bbsNmRef = useRef([]);
  // const atchFileKndNmRef = useRef([]);
  // const rmrkCnRef = useRef([]);

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
        setBbsDetail(resp.result.bbs);
        setBbsDetail({
          ...bbsDetail,
          mdfrSn: sessionUser.userSn
        })
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
                <Link to={URL.MANAGER_BBS_LIST}>게시판관리</Link>
              </li>
              <li>게시판생성</li>
            </ul>
          </div>

          <div className="layout">
            <EgovLeftNav></EgovLeftNav>

            <div className="contents BOARD_CREATE_REG" id="contents">
              {modeInfo.mode === CODE.MODE_CREATE && (
                  <h2 className="tit_2">게시판 생성</h2>
              )}

              {modeInfo.mode === CODE.MODE_MODIFY && (
                  <h2 className="tit_2">게시판 수정</h2>
              )}

              <div className="board_view2">
                <dl>
                  <dt>
                    <label htmlFor="bbsNm">게시판명</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="bbsNm"
                        title=""
                        id="bbsNm"
                        placeholder=""
                        defaultValue={bbsDetail.bbsNm}
                        onChange={(e) =>
                            setBbsDetail({...bbsDetail, bbsNm: e.target.value})
                        }
                        ref={(el) => (checkRef.current[0] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    게시판유형<span className="req">필수</span>
                  </dt>
                  <dd>
                    {/* 수정/조회 일때 변경 불가 */}
                    {modeInfo.mode === CODE.MODE_CREATE && (
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
                    )}
                  </dd>
                </dl>
                <dl>
                  <dt>
                    카테고리사용유무<span className="req">필수</span>
                  </dt>
                  <dd>
                    <EgovRadioButtonGroup
                        name="pstCtgryYn"
                        radioGroup={activeRadioGroup}
                        setValue={bbsDetail.pstCtgryYn}
                        setter={(v) =>
                            setBbsDetail({...bbsDetail, pstCtgryYn: v})
                        }
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    작성자공개유무<span className="req">필수</span>
                  </dt>
                  <dd>
                    <EgovRadioButtonGroup
                        name="wrtrRlsYn"
                        radioGroup={wrtrRlsYnRadioGroup}
                        setValue={bbsDetail.wrtrRlsYn}
                        setter={(v) =>
                            setBbsDetail({...bbsDetail, wrtrRlsYn: v})
                        }
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    파일첨부가능여부<span className="req">필수</span>
                  </dt>
                  <dd>
                    <EgovRadioButtonGroup
                        name="atchFileYn"
                        radioGroup={accessRadioGroup}
                        setValue={bbsDetail.atchFileYn}
                        setter={(v) =>
                            setBbsDetail({...bbsDetail, atchFileYn: v})
                        }
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="atchFileKndNm">
                      파일첨부가능 확장자
                    </label>
                  </dt>
                  <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="atchFileKndNm"
                        title=""
                        id="atchFileKndNm"
                        placeholder="쉼표(,)로 분리"
                        defaultValue={bbsDetail.atchFileKndNm}
                        onChange={(e) =>
                            setBbsDetail({...bbsDetail, atchFileKndNm: e.target.value})
                        }
                        ref={(el) => (checkRef.current[1] = el)}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    댓글가능여부<span className="req">필수</span>
                  </dt>
                  <dd>
                    <EgovRadioButtonGroup
                        name="cmntPsbltyYn"
                        radioGroup={accessRadioGroup}
                        setValue={bbsDetail.cmntPsbltyYn}
                        setter={(v) =>
                            setBbsDetail({...bbsDetail, cmntPsbltyYn: v})
                        }
                    />
                  </dd>
                </dl>

                <dl>
                  <dt>
                    답글사용유무<span className="req">필수</span>
                  </dt>
                  <dd>
                    <EgovRadioButtonGroup
                        name="cmntPsbltyYn"
                        radioGroup={activeRadioGroup}
                        setValue={bbsDetail.replyPsbltyYn}
                        setter={(v) =>
                            setBbsDetail({...bbsDetail, replyPsbltyYn: v})
                        }
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="atchFileKndNm">
                      비고
                    </label>
                  </dt>
                  <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
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
                  </dd>
                </dl>
                <dl>
                  <dt>
                    사용여부<span className="req">필수</span>
                  </dt>
                  <dd>
                    <EgovRadioButtonGroup
                        name="actvtnYn"
                        radioGroup={activeRadioGroup}
                        setValue={bbsDetail.actvtnYn}
                        setter={(v) =>
                            setBbsDetail({...bbsDetail, actvtnYn: v})
                        }
                    />
                  </dd>
                </dl>

                {/* <!-- 버튼영역 --> */}
                <div className="board_btn_area">
                  <div className="left_col btn1">
                    <button
                        className="btn btn_skyblue_h46 w_100"
                        onClick={() => setBbs()}
                    >
                      저장
                    </button>
                    {modeInfo.mode === CODE.MODE_MODIFY && (
                        <button
                            className="btn btn_skyblue_h46 w_100"
                            onClick={() => {
                              setBbsDel(bbsDetail.bbsSn);
                            }}
                        >
                          삭제
                        </button>
                    )}
                  </div>

                  <div className="right_col btn1">
                    <Link to={URL.MANAGER_BBS_LIST} className="btn btn_blue_h46 w_100">
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

export default setBbs;
