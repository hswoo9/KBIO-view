
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftBoard";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";

function setBbs(props) {
  const navigate = useNavigate();
  const bbsNmRef = useRef([]);
  const atchFileKndNmRef = useRef([]);

  const bbsTypeOptions = [
    { value: "", label: "선택" },
    { value: "0", label: "일반게시판" },
    { value: "1", label: "FaQ" },
    { value: "1", label: "QnA" },
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


  const bbsSn = location.state?.bbsSn || "";

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [bbsDetail, setBbsDetail] = useState({});

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: "등록",
          editURL: "/bbsMaster",
        });
        break;

      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: "수정",
          editURL: `/bbsMaster/${bbsId}`,
        });
        break;
      default:
        navigate({ pathname: URL.ERROR }, { state: { msg: "" } });
    }
    retrieveDetail();
  };

  const retrieveDetail = () => {
    if (modeInfo.mode === CODE.MODE_CREATE) {
      // 조회/등록이면 조회 안함
      setBbsDetail({
        tmplatId: "TMPLAT_BOARD_DEFAULT", //Template 고정
        replyPosblAt: "Y", //답장가능여부 초기값
        fileAtchPosblAt: "Y", //파일첨부가능여부 초기값
      });
      return;
    }

    const retrieveDetailURL = `/bbsMaster/${bbsId}`;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    };

    EgovNet.requestFetch(retrieveDetailURL, requestOptions, function (resp) {
      // 수정모드일 경우 조회값 세팅
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        setBbsDetail(resp.result.boardMasterVO);
      }
    });
  };

  const formValidator = (formData) => {
    if (formData.get("bbsNm") === null || formData.get("bbsNm") === "") {
      alert("게시판명은 필수 값입니다.");
      return false;
    }
    if (
      formData.get("bbsIntrcn") === null ||
      formData.get("bbsIntrcn") === ""
    ) {
      alert("게시판 소개는 필수 값입니다.");
      return false;
    }
    if (
      formData.get("bbsTyCode") === null ||
      formData.get("bbsTyCode") === ""
    ) {
      alert("게시판 유형은 필수 값입니다.");
      return false;
    }
    if (
      formData.get("bbsAttrbCode") === null ||
      formData.get("bbsAttrbCode") === ""
    ) {
      alert("게시판 속성은 필수 값입니다.");
      return false;
    }
    if (
      formData.get("posblAtchFileNumber") === null ||
      formData.get("posblAtchFileNumber") === ""
    ) {
      alert("첨부파일 가능 숫자는 필수 값입니다.");
      return false;
    }
    return true;
  };

  const formObjValidator = (checkRef) => {
    if (checkRef.current[0].value === "") {
      alert("게시판명은 필수 값입니다.");
      return false;
    }
    if (checkRef.current[1].value === "") {
      alert("게시판 소개는 필수 값입니다.");
      return false;
    }
    if (checkRef.current[2].value === "0") {
      alert("첨부파일 가능 숫자는 필수 값입니다.");
      return false;
    }
    return true;
  };

  const updateBoard = () => {
    let modeStr = modeInfo.mode === CODE.MODE_CREATE ? "POST" : "PUT";

    let requestOptions = {};

    if (modeStr === "POST") {
      const formData = new FormData();

      for (let key in bbsDetail) {
        formData.append(key, bbsDetail[key]);
        //console.log("bbsDetail [%s] ", key, bbsDetail[key]);
      }

      if (formValidator(formData)) {
        requestOptions = {
          method: modeStr,
          headers: {},
          body: formData,
        };

        EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            navigate({ pathname: URL.ADMIN_BOARD });
          } else {
            navigate(
              { pathname: URL.ERROR },
              { state: { msg: resp.resultMessage } }
            );
          }
        });
      }
    } else {
      if (formObjValidator(checkRef)) {
        requestOptions = {
          method: modeStr,
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ ...bbsDetail }),
        };

        EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            navigate({ pathname: URL.ADMIN_BOARD });
          } else {
            navigate(
              { pathname: URL.ERROR },
              { state: { msg: resp.resultMessage } }
            );
          }
        });
      }
    }
  };

  const deleteBoardArticle = (bbsId) => {
    const deleteBoardURL = `/bbsMaster/${bbsId}`;

    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
    };

    EgovNet.requestFetch(deleteBoardURL, requestOptions, (resp) => {
      console.log("====>>> board delete= ", resp);
      if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
        alert("게시글이 삭제되었습니다.");
        navigate(URL.ADMIN_BOARD, { replace: true });
      } else {
        alert("ERR : " + resp.resultMessage);
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

  console.log("------------------------------EgovAdminBoardEdit [End]");
  console.groupEnd("EgovAdminBoardEdit");

  return (
    <div className="container">
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
                      ref={(el) => (bbsNmRef.current[0] = el)}
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
                      <label className="f_select w_130" htmlFor="bbsTyCode">
                        <select
                            id="bbsTyCode"
                            name="bbsTyCode"
                            title="게시판유형선택"
                            onChange={(e) =>
                                setBbsDetail({
                                  ...bbsDetail,
                                  bbsTyCode: e.target.value,
                                })
                            }
                            value={bbsDetail.bbsTyCode}
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
                      {bbsDetail.bbsTyCode &&
                          getSelectedLabel(
                              bbsTypeOptions,
                              bbsDetail.bbsTyCode
                          )}
                    </span>
                  )}
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
                  <span className="req">필수</span>
                </dt>
                <dd>
                  <input
                      className="f_input2 w_full"
                      type="text"
                      name="atchFileKndNm"
                      title=""
                      id="atchFileKndNm"
                      placeholder=""
                      defaultValue={bbsDetail.atchFileKndNm}
                      onChange={(e) =>
                          setBbsDetail({...bbsDetail, atchFileKndNm: e.target.value})
                      }
                      ref={(el) => (atchFileKndNmRef.current[0] = el)}
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
                      setValue={bbsDetail.cmntPsbltyYn}
                      setter={(v) =>
                          setBbsDetail({...bbsDetail, cmntPsbltyYn: v})
                      }
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
                      onClick={() => updateBoard()}
                  >
                    저장
                  </button>
                  {modeInfo.mode === CODE.MODE_MODIFY && (
                      <button
                          className="btn btn_skyblue_h46 w_100"
                          onClick={() => {
                            deleteBoardArticle(bbsDetail.bbsId);
                          }}
                      >
                        삭제
                      </button>
                  )}
                </div>

                <div className="right_col btn1">
                  <Link to={URL.ADMIN_BOARD} className="btn btn_blue_h46 w_100">
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
