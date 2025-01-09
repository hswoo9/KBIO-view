import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; //Link, 제거

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { setSessionItem } from "@/utils/storage";

function EgovMypageEdit(props) {
  console.group("EgovMypageEdit");
  console.log("[Start] EgovMypageEdit ------------------------------");
  console.log("EgovMypageEdit [props] : ", props);

  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);

  console.log("EgovMypageEdit [location] : ", location);
  //const uniqId = location.state?.uniqId || "";
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  //const [memberDetail, setMemberDetail] = useState({});
  const [address, setAddress] = useState("");

  const [memberDetail, setMemberDetail] = useState({
    postcode: '',
    address: '',
    searchAddress: '',
    detailAddress: ''
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;

    script.onload = () => {
      console.log("카카오 주소 검색 API가 로드되었습니다.");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const searchAddress = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.address;
        const postcode = data.zonecode;
        setMemberDetail({
          ...memberDetail,
          postcode,
          address: fullAddress,
          searchAddress: fullAddress,
        });
      },
    }).open();
  };

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: "등록",
          editURL: "/etc/member_insert",
        });
        break;

      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: "수정",
          editURL: `/mypage/update`,
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
      setMemberDetail({
        tmplatId: "TMPLAT_MYPAGE_DEFAULT", //Template 고정
        groupId: "GROUP_00000000000001", //그룹ID 초기값
        mberSttus: "P", //로그인가능여부 초기값
        checkIdResult: "중복확인",
      });
      return;
    }

    const retrieveDetailURL = `/mypage/update`;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    };

    EgovNet.requestFetch(retrieveDetailURL, requestOptions, function (resp) {
      // 수정모드일 경우 조회값 세팅
      if (modeInfo.mode === CODE.MODE_MODIFY) {
        setMemberDetail(resp.result.mberManageVO);
      }
    });
  };
  const checkIdDplct = () => {
    return new Promise((resolve) => {
      let checkId = memberDetail["mberId"];
      if (checkId === null || checkId === undefined) {
        alert("회원ID를 입력해 주세요");
        return false;
      }
      const checkIdURL = `/etc/member_checkid/${checkId}`;
      const reqOptions = {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      };
      EgovNet.requestFetch(checkIdURL, reqOptions, function (resp) {
        if (
            Number(resp.resultCode) === Number(CODE.RCV_SUCCESS) &&
            resp.result.usedCnt > 0
        ) {
          setMemberDetail({
            ...memberDetail,
            checkIdResult: "이미 사용중인 아이디입니다. [ID체크]",
            mberId: checkId,
          });
          resolve(resp.result.usedCnt);
        } else {
          setMemberDetail({
            ...memberDetail,
            checkIdResult: "사용 가능한 아이디입니다.",
            mberId: checkId,
          });
          resolve(0);
        }
      });
    });
  };

  const formValidator = (formData) => {
    return new Promise((resolve) => {
      if (formData.get("mberId") === null || formData.get("mberId") === "") {
        alert("회원ID는 필수 값입니다.");
        return false;
      }
      checkIdDplct().then((res) => {
        if (res > 0) {
          return false;
        }
        if (
            formData.get("password") === null ||
            formData.get("password") === ""
        ) {
          alert("암호는 필수 값입니다.");
          return false;
        }
        if (formData.get("password_chk") === null ||
            formData.get("password_chk") === ""
        ) {
          alert("비밀번호 확인은 필수 값입니다.");
          return false;
        }
        if (formData.get("password") !== formData.get("password_chk")) {
          alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
          return false;
        }
        if (formData.get("mberNm") === null || formData.get("mberNm") === "") {
          alert("회원명은 필수 값입니다.");
          return false;
        }
        resolve(true);
      });
    });
  };

  const formObjValidator = (checkRef) => {
    if (checkRef.current[0].value === "") {
      alert("회원ID는 필수 값입니다.");
      return false;
    }
    if (checkRef.current[1].value === "") {
      memberDetail.password = ""; //수정 시 암호값을 입력하지 않으면 공백으로처리
    }
    if (checkRef.current[2].value === "") {
      alert("회원명은 필수 값입니다.");
      return false;
    }
    return true;
  };

  const updateMember = () => {
    let modeStr = modeInfo.mode === CODE.MODE_CREATE ? "POST" : "PUT";

    let requestOptions = {};

    if (modeStr === "POST") {
      const formData = new FormData();
      for (let key in memberDetail) {
        formData.append(key, memberDetail[key]);
        //console.log("boardDetail [%s] ", key, boardDetail[key]);
      }

      formValidator(formData).then((res) => {
        if (res) {
          requestOptions = {
            method: modeStr,
            headers: {},
            body: formData,
          };

          EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
            if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
              alert("회원 정보가 등록되었습니다. 로그인 후 이용해 주세요.");
              navigate({ pathname: URL.MAIN });
            } else {
              navigate(
                  { pathname: URL.ERROR },
                  { state: { msg: resp.resultMessage } }
              );
            }
          });
        }
      });
    } else {
      if (formObjValidator(checkRef)) {
        requestOptions = {
          method: modeStr,
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ ...memberDetail }),
        };

        EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            alert("회원 정보가 수정되었습니다.");
            navigate({ pathname: URL.MYPAGE_MODIFY });
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

  const deleteMember = () => {
    if (formObjValidator(checkRef)) {
      const deleteMypageURL = `/mypage/delete`; // /${uniqId} 제거 서버단에서 토큰 값 사용.
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...memberDetail }),
      };

      EgovNet.requestFetch(deleteMypageURL, requestOptions, (resp) => {
        console.log("====>>> member delete= ", resp);
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          setSessionItem("loginUser", { id: "" });
          setSessionItem("jToken", null);
          // PC와 Mobile 열린메뉴 닫기
          document.querySelector(".all_menu.WEB").classList.add("closed");
          document.querySelector(".btnAllMenu").classList.remove("active");
          document.querySelector(".btnAllMenu").title = "전체메뉴 닫힘";
          document.querySelector(".all_menu.Mobile").classList.add("closed");
          alert("회원이 탈퇴되었습니다. 로그아웃 됩니다.");
          navigate(URL.MAIN, { replace: true });
        } else {
          alert("ERR : " + resp.resultMessage);
        }
      });
    }
  };

  useEffect(() => {
    initMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("------------------------------EgovMypageEdit [End]");
  console.groupEnd("EgovMypageEdit");

  return (
      <div className="container">
        <div className="c_wrap">
          {/* <!-- Location --> */}
          <div className="location">
            <ul>
              <li>
                <a className="home" href="#!">
                  Home
                </a>
              </li>
              <li>마이페이지</li>
            </ul>
          </div>
          {/* <!--// Location --> */}

          <div className="layout">
            {/* <!-- Navigation --> */}
            {/* <EgovLeftNav></EgovLeftNav> *}
                    {/* <!--// Navigation --> */}

            <div className="contents BOARD_CREATE_REG" id="contents">
              {/* <!-- 본문 --> */}

              <div className="top_tit">
                <h1 className="tit_1">마이페이지</h1>
              </div>

              {modeInfo.mode === CODE.MODE_CREATE && (
                  <h2 className="tit_2">회원 생성</h2>
              )}

              {modeInfo.mode === CODE.MODE_MODIFY && (
                  <h2 className="tit_2">회원 수정</h2>
              )}

              <div className="board_view2">
                <dl>
                  <dt>
                    <label htmlFor="mberId">회원ID</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    {/* 등록 일때 변경 가능 */}
                    {modeInfo.mode === CODE.MODE_CREATE && (
                        <>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="mberId"
                              title=""
                              id="mberId"
                              placeholder=""
                              defaultValue={memberDetail.mberId}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    mberId: e.target.value,
                                  })
                              }
                              ref={(el) => (checkRef.current[0] = el)}
                              required
                              style={{width: '30%', marginRight: '10px'}}
                          />
                          <button
                              className="btn btn_skyblue_h46"
                              onClick={() => {
                                checkIdDplct();
                              }}
                          >
                            {memberDetail.checkIdResult}
                          </button>
                          <span
                              style={{
                                marginLeft: '10px',
                                fontSize: '18px',
                                color: '#888',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                          >
                          아이디는 6~12자 영문,숫자-,_만 가능합니다.
                        </span>
                        </>
                    )}
                    {/* 수정/조회 일때 변경 불가 */}
                    {modeInfo.mode === CODE.MODE_MODIFY && (
                        <input
                            className="f_input2 w_full"
                            type="text"
                            name="mberId"
                            title=""
                            id="mberId"
                            placeholder=""
                            defaultValue={memberDetail.mberId}
                            ref={(el) => (checkRef.current[0] = el)}
                            readOnly
                            required
                        />
                    )}
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="password">비밀번호</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    {/* 등록 일때 변경 가능 */}
                    {modeInfo.mode === CODE.MODE_CREATE && (
                        <>
                          <input
                              className="f_input2 w_full"
                              type="password"
                              name="password"
                              title=""
                              id="password"
                              placeholder=""
                              defaultValue={memberDetail.password}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    password: e.target.value,
                                  })
                              }
                              ref={(el) => (checkRef.current[1] = el)}
                              required
                              style={{width: '30%', marginrigth: '30px'}}
                          />
                          <span
                              style={{
                                marginTop: '10px',
                                marginLeft: '10px',
                                fontSize: '18px',
                                color: '#888',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                          >
                          영문자, 숫자, 특수문자 조합으로 8~20자리이내만 가능합니다.
                        </span>
                        </>
                    )}
                    {/* 수정/조회 일때 */}
                    {modeInfo.mode === CODE.MODE_MODIFY && (
                        <input
                            className="f_input2 w_full"
                            type="password"
                            name="password"
                            title=""
                            id="password"
                            placeholder="빈값이면 기존 암호가 변경되지 않고 그대로 유지됩니다."
                            defaultValue=""
                            onChange={(e) =>
                                setMemberDetail({
                                  ...memberDetail,
                                  password: e.target.value,
                                })
                            }
                            ref={(el) => (checkRef.current[1] = el)}
                        />
                    )}
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="password">비밀번호 확인</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    {/* 등록 일때 변경 가능 */}
                    {modeInfo.mode === CODE.MODE_CREATE && (
                        <>
                          <input
                              className="f_input2 w_full"
                              type="password"
                              name="password_chk"
                              title=""
                              id="password_chk"
                              placeholder=""
                              //defaultValue={memberDetail.password_chk}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    password_chk: e.target.value,
                                  })
                              }
                              ref={(el) => (checkRef.current[2] = el)}
                              required
                              style={{width: '30%'}}
                          />
                          <span
                              style={{
                                marginTop: '10px',
                                marginLeft: '10px',
                                fontSize: '18px',
                                color: '#888',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                          >
                      비밀번호 한번 더 입력하세요.
                      </span>
                        </>
                    )}
                    {/* 수정/조회 일때 */}
                    {modeInfo.mode === CODE.MODE_MODIFY && (
                        <input
                            className="f_input2 w_full"
                            type="password"
                            name="password_chk"
                            title=""
                            id="password_chk"
                            placeholder="빈값이면 기존 암호가 변경되지 않고 그대로 유지됩니다."
                            defaultValue=""
                            onChange={(e) =>
                                setMemberDetail({
                                  ...memberDetail,
                                  password: e.target.value,
                                })
                            }
                            ref={(el) => (checkRef.current[2] = el)}
                        />
                    )}
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="bbsNm">성명</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="mberNm"
                        title=""
                        id="mberNm"
                        placeholder=""
                        defaultValue={memberDetail.mberNm}
                        onChange={(e) =>
                            setMemberDetail({
                              ...memberDetail,
                              mberNm: e.target.value,
                            })
                        }
                        ref={(el) => (checkRef.current[3] = el)}
                        required
                        style={{width: '30%'}}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="bbsNm">휴대폰</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="phonenum"
                        title=""
                        id="phonenum"
                        placeholder=""
                        defaultValue={memberDetail.phonenum}
                        onChange={(e) =>
                            setMemberDetail({
                              ...memberDetail,
                              phonenum: e.target.value,
                            })
                        }
                        ref={(el) => (checkRef.current[4] = el)}
                        required
                        style={{width: '30%'}}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="email">이메일</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <div style={{display: 'flex', gap: '10px'}}>
                      {/* 첫 번째 입력칸: 이메일 사용자 부분 */}
                      <input
                          className="f_input2 w_full"
                          type="text"
                          name="email-prefix"
                          title=""
                          id="email-prefix"
                          value={memberDetail.emailPrefix}
                          onChange={(e) =>
                              setMemberDetail({
                                ...memberDetail,
                                emailPrefix: e.target.value,
                              })
                          }
                          ref={(el) => (checkRef.current[5] = el)}
                          required
                          style={{width: '20%'}}
                      />

                      {/* 이메일 구분자 */}
                      <span style={{alignSelf: 'center'}}>@</span>

                      {/* 두 번째 입력칸: 이메일 도메인 부분 */}
                      <input
                          className="f_input2 w_full"
                          type="text"
                          name="email-domain"
                          title=""
                          id="email-domain"
                          value={memberDetail.emailDomain}
                          onChange={(e) =>
                              setMemberDetail({
                                ...memberDetail,
                                emailDomain: e.target.value,
                              })
                          }
                          disabled={memberDetail.emailProvider !== "direct"}  // 이메일 제공자가 직접입력이 아닐 경우 비활성화
                          required
                          style={{width: '20%'}}
                      />

                      {/* 이메일 제공자 선택 select 박스 */}
                      <div style={{position: 'relative', width: '10%'}}>
                        <select
                            name="email-provider"
                            id="email-provider"
                            onChange={(e) => {
                              const provider = e.target.value;
                              setMemberDetail({
                                ...memberDetail,
                                emailProvider: provider,
                                emailDomain: provider === "direct" ? "" : provider,
                              });
                            }}
                            value={memberDetail.emailProvider}
                            style={{
                              width: '100%',
                              height: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #ccc',
                              fontSize: '14px',
                              backgroundColor: '#fff',
                              cursor: 'pointer',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                            }}
                        >
                          <option value="direct">직접입력</option>
                          <option value="naver.com">네이버</option>
                          <option value="daum.net">다음</option>
                          <option value="gmail.com">구글</option>
                          <option value="hotmail.com">핫메일</option>
                          <option value="nate.com">네이트</option>
                          <option value="hanmail.net">한메일</option>
                        </select>

                        <span
                            style={{
                              position: 'absolute',
                              top: '50%',
                              right: '10px',
                              transform: 'translateY(-50%)',
                              borderLeft: '5px solid transparent',
                              borderRight: '5px solid transparent',
                              borderTop: '5px solid #333',
                              pointerEvents: 'none',
                            }}
                        ></span>
                      </div>
                    </div>
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <label htmlFor="address">주소</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    {/* 우편번호 */}
                    <div>
                      <input
                          className="f_input2 w_full"
                          type="text"
                          name="postcode"
                          title="우편번호 입력"
                          id="postcode"
                          value={memberDetail.postcode || ""}
                          onChange={(e) =>
                              setMemberDetail({
                                ...memberDetail,
                                postcode: e.target.value,
                              })
                          }
                          style={{width: "70%"}}
                          required
                      />
                      <button
                          className="btn btn_skyblue_h46"
                          type="button"
                          onClick={searchAddress}
                          style={{marginLeft: "10px"}}
                      >
                        주소검색
                      </button>
                    </div>
                  </dd>

                  <dd style={{marginTop: "10px"}}>
                    {/* 주소 */}
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="searchAddress"
                        title="검색된 주소"
                        id="searchAddress"
                        value={memberDetail.searchAddress || ""}
                        onChange={(e) =>
                            setMemberDetail({
                              ...memberDetail,
                              searchAddress: e.target.value,
                            })
                        }
                        style={{width: "100%"}}
                        readOnly
                    />
                  </dd>

                  <dd style={{marginTop: "10px"}}>
                    {/* 3번: 상세주소 입력 필드 */}
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="detailAddress"
                        title="상세주소 입력"
                        id="detailAddress"
                        value={memberDetail.detailAddress || ""}
                        onChange={(e) =>
                            setMemberDetail({
                              ...memberDetail,
                              detailAddress: e.target.value,
                            })
                        }
                        style={{width: "100%"}}
                        required
                    />
                  </dd>
                </dl>


                {/* <!-- 버튼영역 --> */}
                <div className="board_btn_area">
                  <div className="left_col btn1">
                    <button
                        className="btn btn_skyblue_h46 w_100"
                        onClick={() => updateMember()}
                    >
                      저장
                    </button>
                    {modeInfo.mode === CODE.MODE_MODIFY && (
                        <button
                            className="btn btn_skyblue_h46 w_100"
                            onClick={() => {
                              deleteMember();
                            }}
                        >
                          탈퇴
                        </button>
                    )}
                    {/* memberDetail.uniqId 제거 서버단에서 토큰값 사용 */}
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

export default EgovMypageEdit;
