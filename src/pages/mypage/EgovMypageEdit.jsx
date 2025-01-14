import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";

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
  const [image, setImage] = useState("");

  const [memberDetail, setMemberDetail] = useState({
    memberType: "",
    postcode: '',
    address: '',
    searchAddress: '',
    detailAddress: '',
    emailReceive: true,
    smsReceive: true,
    nonEmailPrefix: '',
    nonEmailDomain: '',
    nonEmailProvider: '',
    nonpostcode: '',
    nonaddress: '',
    nonsearchAddress: '',
    nondetailAddress: '',
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // 사진 데이터를 상태에 저장
      };
      reader.readAsDataURL(file); // 사진 파일을 Data URL로 변환
    }
  };


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

  const kbioauth = async () => {
    const businessNumber = `${memberDetail.bizRegNum1}-${memberDetail.bizRegNum2}-${memberDetail.bizRegNum3}`;

    if (!businessNumber || businessNumber.includes("--")) {
      alert("사업자 등록번호를 정확히 입력하세요.");
      return;
    }

    const apiKey = import.meta.env.VITE_APP_DATA_API_CLIENTID;
    const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${apiKey}`;

    try {
      const response = await axios.post(url, {
        b_no: [businessNumber.replace(/-/g, '')],
      });

      const businessData = response.data.data[0];
      console.log(businessData);

      const businessStatus = response.data.data[0]?.b_stt_cd;

      if (businessStatus === '01') {
        alert("사업자가 정상적으로 운영 중입니다.");
      } else if (businessStatus === '02') {
        alert("사업자가 휴업 중입니다.");
      } else if (businessStatus === '03') {
        alert("사업자가 폐업 상태입니다.");
      } else {
        alert("사업자가 존재 하지 않습니다.");
      }

    } catch (error) {
      console.error("Error fetching business status:", error);
      alert("사업자 등록번호 조회에 실패했습니다.");
    }
  };

  const nonsearchAddress = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.address;
        const nonpostcode = data.zonecode;
        setMemberDetail({
          ...memberDetail,
          nonpostcode: nonpostcode,
          nonaddress: fullAddress,
          nonsearchAddress: fullAddress,
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
        checkIdResult: "",
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
      const regex = /^[a-zA-Z0-9]{6,12}$/;
      if (!regex.test(checkId)) {
        alert("회원ID는 6~12자의 영문 대소문자와 숫자만 사용 가능합니다.");
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
            checkIdResult: "중복된 아이디입니다.",
            checkIdResultColor: "red", 
            mberId: checkId,
          });
          resolve(resp.result.usedCnt);
        } else {
          setMemberDetail({
            ...memberDetail,
            checkIdResult: "사용 가능한 아이디입니다.",
            checkIdResultColor: "green", 
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

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~_`|-]).{8,20}$/;
        if (!passwordRegex.test(formData.get("password"))) {
          alert("암호는 영문자, 숫자, 특수문자 조합으로 8~20자리 이내여야 합니다.");
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
        const mberNmRegex = /^[a-zA-Zㄱ-ㅎ가-힣]+$/;
        if (!mberNmRegex.test(formData.get("mberNm"))) {
          alert("회원명은 한글 또는 영문자만 사용 가능합니다.");
          return false;
        }
        if (formData.get("phonenum") === null || formData.get("phonenum") === "") {
          alert("전화번호는 필수 값입니다.");
          return false;
        }
        const phonenumRegex = /^[0-9\-]+$/;
        if (!phonenumRegex.test(formData.get("phonenum"))) {
          alert("전화번호는 숫자와 하이픈(-)만 포함할 수 있습니다.");
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
    const phonenumRegex = /^[0-9\-]+$/;
    if (!phonenumRegex.test(formData.get("phonenum"))) {
      alert("전화번호는 숫자와 하이픈(-)만 포함할 수 있습니다.");
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
          setSessionItem("loginUser", { userSn: "" });
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
                                    checkIdResult: "",
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
                            중복확인
                          </button>
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
                          아이디는 6~12자 영문,숫자-,_만 가능합니다.
                        </span>
                          {memberDetail.checkIdResult && (
                              <div
                                  style={{
                                    marginTop: '10px',
                                    color: memberDetail.checkIdResultColor,
                                    fontSize: '16px',
                                  }}
                              >
                                {memberDetail.checkIdResult}
                              </div>
                          )}
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
                          readOnly
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

                <dl>
                  <dt>
                    <label htmlFor="email-receive">메일 수신</label>
                    <span className="req">선택</span>
                  </dt>
                  <dd>
                    <div style={{display: 'flex', gap: '20px'}}>
                      {/* 메일 수신 체크박스 */}
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                            type="radio"
                            name="email-receive"
                            id="email-receive"
                            checked={memberDetail.emailReceive === true}
                            onChange={() => {
                              setMemberDetail({
                                ...memberDetail,
                                emailReceive: true,
                              });
                            }}
                            style={{transform: 'scale(1.2)'}}
                        />
                        수신
                      </label>

                      {/* 메일 수신 안함 체크박스 */}
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                            type="radio"
                            name="email-no-receive"
                            id="email-no-receive"
                            checked={memberDetail.emailReceive === false}
                            onChange={() => {
                              setMemberDetail({
                                ...memberDetail,
                                emailReceive: false,
                              });
                            }}
                            style={{transform: 'scale(1.2)'}}
                        />
                        수신 안함
                      </label>

                      <span
                          style={{
                            marginLeft: '10px',
                            fontSize: '13px',
                            color: '#888',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                      >
                        ※ 메일링 서비스 수신동의 시 K-바이오랩허브 관련한 다양한 정보를 받으실 수 있습니다.​
                      </span>
                    </div>
                  </dd>
                </dl>


                <dl>
                  <dt>
                    <label htmlFor="sms-receive">문자 수신</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <div style={{display: 'flex', gap: '20px'}}>
                      {/* 문자 수신 체크박스 */}
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                            type="radio"
                            name="sms-receive"
                            id="sms-receive"
                            checked={memberDetail.smsReceive === "receive"}
                            onChange={() => {
                              setMemberDetail({
                                ...memberDetail,
                                smsReceive: memberDetail.smsReceive === "receive" ? "no-receive" : "receive",
                              });
                            }}
                            style={{transform: 'scale(1.2)'}}
                        />
                        수신
                      </label>

                      {/* 메일 수신 안함 체크박스 */}
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                            type="radio"
                            name="sms-no-receive"
                            id="sms-no-receive"
                            checked={memberDetail.smsReceive === "no-receive"}
                            onChange={() => {
                              setMemberDetail({
                                ...memberDetail,
                                smsReceive: memberDetail.smsReceive === "no-receive" ? "receive" : "no-receive",
                              });
                            }}
                            style={{transform: 'scale(1.2)'}}
                        />
                        수신 안함
                      </label>
                      <span
                          style={{
                            marginLeft: '10px',
                            fontSize: '13px',
                            color: '#888',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                      >
                          ※ SMS 서비스 수신동의 시 신청안내, 예약알림 등 다양한 알림 서비스를 받으실 수 있습니다.​
                        </span>
                    </div>
                  </dd>
                </dl>

                <dl>
                  <dt>
                    <label htmlFor="member-type">회원분류</label>
                    <span className="req">필수</span>
                  </dt>
                  <dd>
                    <div style={{display: 'flex', gap: '20px'}}>
                      {/* 입주기업 라디오 버튼 */}
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                            type="radio"
                            name="member-type"
                            id="resident-company"
                            checked={memberDetail.memberType === "입주기업"}
                            onChange={() => {
                              setMemberDetail({
                                ...memberDetail,
                                memberType: "입주기업",
                              });
                            }}
                            style={{transform: 'scale(1.2)'}}
                        />
                        입주기업
                      </label>

                      {/* 유관기관 라디오 버튼 */}
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                            type="radio"
                            name="member-type"
                            id="related-organization"
                            checked={memberDetail.memberType === "유관기관"}
                            onChange={() => {
                              setMemberDetail({
                                ...memberDetail,
                                memberType: "유관기관",
                              });
                            }}
                            style={{transform: 'scale(1.2)'}}
                        />
                        유관기관
                      </label>

                      {/* 비입주기업 라디오 버튼 */}
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                            type="radio"
                            name="member-type"
                            id="non-resident-company"
                            checked={memberDetail.memberType === "비입주기업"}
                            onChange={() => {
                              setMemberDetail({
                                ...memberDetail,
                                memberType: "비입주기업",
                              });
                            }}
                            style={{transform: 'scale(1.2)'}}
                        />
                        비입주기업
                      </label>

                      {/* 컨설턴트 라디오 버튼 */}
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <input
                            type="radio"
                            name="member-type"
                            id="consultant"
                            checked={memberDetail.memberType === "컨설턴트"}
                            onChange={() => {
                              setMemberDetail({
                                ...memberDetail,
                                memberType: "컨설턴트",
                              });
                            }}
                            style={{transform: 'scale(1.2)'}}
                        />
                        컨설턴트
                      </label>
                    </div>
                  </dd>
                </dl>

                {/* 기업정보 섹션 */}
                {(memberDetail.memberType === "입주기업" || memberDetail.memberType === "유관기관") && (
                    <div style={{borderTop: "1px solid #ddd", paddingTop: "20px", marginTop: "20px"}}>
                      <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>기업정보</h3>

                      {/* 사업자 등록번호 */}
                      <dl>
                        <dt>
                          <label htmlFor="bizRegNum">사업자 등록번호</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                        <input
                              className="f_input2 w_full"
                              type="text"
                              name="bizRegNum1"
                              maxLength="3"
                              value={memberDetail.bizRegNum1 || ""}
                              style={{width: "100px", marginRight: "5px"}}
                              onChange={(e) =>
                                  setMemberDetail({ ...memberDetail, bizRegNum1: e.target.value })
                              }
                          />
                          <span style={{
                            marginLeft: '10px',
                            marginRight: '10px',
                            marginTop: '10px',
                            fontSize: '13px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>-</span>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="bizRegNum2"
                              maxLength="2"
                              value={memberDetail.bizRegNum2 || ""}
                              style={{width: "70px", margin: "0 5px"}}
                              onChange={(e) =>
                                  setMemberDetail({ ...memberDetail, bizRegNum2: e.target.value })
                              }
                          />
                          <span style={{
                            marginLeft: '10px',
                            marginRight: '10px',
                            fontSize: '13px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>-</span>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="bizRegNum3"
                              maxLength="5"
                              value={memberDetail.bizRegNum3 || ""}
                              style={{width: "130px", marginLeft: "5px"}}
                              onChange={(e) =>
                                  setMemberDetail({ ...memberDetail, bizRegNum3: e.target.value })
                              }
                          />
                          <button
                              className="btn btn_skyblue_h46"
                              type="button"
                              onClick={kbioauth}
                              style={{marginLeft: "10px"}}
                          >
                            K-바이오 인증
                          </button>
                        </dd>
                      </dl>

                      {/* 기업명 */}
                      <dl>
                        <dt>
                          <label htmlFor="companyName">기업명</label>
                        </dt>
                        <dd>
                          <span>{memberDetail.companyName || ""}</span> {/* 텍스트로 기업명 표시 */}
                        </dd>
                      </dl>

                      {/* 대표자 */}
                      <dl>
                        <dt>
                          <label htmlFor="ceoName">대표자</label>
                        </dt>
                        <dd>
                          <span>{memberDetail.ceoName || ""}</span> {/* 텍스트로 대표자 표시 */}
                        </dd>
                      </dl>

                      {/* 산업 */}
                      <dl>
                        <dt>
                          <label htmlFor="industry">산업</label>
                        </dt>
                        <dd>
                          <span>{memberDetail.industry || ""}</span> {/* 텍스트로 산업 표시 */}
                        </dd>
                      </dl>

                      {/* 주소 */}
                      <dl>
                        <dt>
                          <label htmlFor="address">주소</label>
                        </dt>
                        <dd style={{display: "block"}}>
                          <span>{memberDetail.address1 || ""}</span> {/* 첫 번째 줄 주소 */}
                        </dd>
                        <dd style={{display: "block"}}>
                          <span>{memberDetail.address2 || ""}</span> {/* 두 번째 줄 주소 */}
                        </dd>
                        <dd style={{display: "block"}}>
                          <span>{memberDetail.address3 || ""}</span> {/* 세 번째 줄 주소 */}
                        </dd>
                      </dl>

                      {/* 대표번호 */}
                      <dl>
                        <dt>
                          <label htmlFor="phoneNum">대표번호</label>
                        </dt>
                        <dd>
                          <span>{memberDetail.phoneNum || ""}</span> {/* 텍스트로 대표번호 표시 */}
                        </dd>
                      </dl>

                      {/* 기업메일 */}
                      <dl>
                      <dt>
                          <label htmlFor="email">기업메일</label>
                        </dt>
                        <dd>
                          <span>{memberDetail.email || ""}</span> {/* 텍스트로 기업메일 표시 */}
                        </dd>
                      </dl>
                    </div>
                )}



                {/* 비입주기업 기업정보 섹션 */}
                {memberDetail.memberType === "비입주기업" && (
                    <div style={{borderTop: "1px solid #ddd", paddingTop: "20px", marginTop: "20px"}}>
                      <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>기업정보</h3>
                      <dl>
                        <dt>
                          <label htmlFor="non-bizRegNum">사업자 등록번호</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="non-bizRegNum1"
                              maxLength="3"
                              style={{width: "100px", marginRight: "5px"}}
                              placeholder=""
                          />
                          <span
                              style={{
                                marginLeft: '10px',
                                marginRight: '10px',
                                marginTop: '10px',
                                fontSize: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                          >-</span>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="non-bizRegNum2"
                              maxLength="2"
                              style={{width: "70px", margin: "0 5px"}}
                              placeholder=""
                          />
                          <span
                              style={{
                                marginLeft: '10px',
                                marginRight: '10px',
                                marginTop: '10px',
                                fontSize: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                          >-</span>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="non-bizRegNum3"
                              maxLength="5"
                              style={{width: "130px", marginLeft: "5px"}}
                              placeholder=""
                          />
                        </dd>
                      </dl>

                      <dl>
                        <dt>
                          <label htmlFor="non-companyName">기업명</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="non-companyName"
                              style={{width: "50%"}}
                              placeholder=""
                          />
                        </dd>
                      </dl>

                      <dl>
                        <dt>
                          <label htmlFor="non-ceoName">대표자</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="non-ceoName"
                              style={{width: "200px"}}
                              placeholder=""
                          />
                        </dd>
                      </dl>

                      <dl>
                        <dt>
                          <label htmlFor="non-industry">산업</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="non-industry"
                              style={{width: "300px"}}
                              placeholder=""
                          />
                        </dd>
                      </dl>
                      <dl>
                        <dt>
                          <label htmlFor="non-address">주소</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                          {/* 우편번호 */}
                          <div>
                            <input
                                className="f_input2 w_full"
                                type="text"
                                name="non-postcode"
                                title="우편번호 입력"
                                id="non-postcode"
                                value={memberDetail.nonpostcode || ""}
                                onChange={(e) =>
                                    setMemberDetail({
                                      ...memberDetail,
                                      nonpostcode: e.target.value,
                                    })
                                }
                                style={{width: "70%"}}
                                required
                            />
                            <button
                                className="btn btn_skyblue_h46"
                                type="button"
                                onClick={nonsearchAddress}
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
                              name="non-searchAddress"
                              title="검색된 주소"
                              id="non-searchAddress"
                              value={memberDetail.nonsearchAddress || ""}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    nonsearchAddress: e.target.value,
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
                              name="non-detailAddress"
                              title="상세주소 입력"
                              id="non-detailAddress"
                              value={memberDetail.nondetailAddress || ""}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    nondetailAddress: e.target.value,
                                  })
                              }
                              style={{width: "100%"}}
                              required
                          />
                        </dd>
                      </dl>
                      <dl>
                        <dt>
                          <label htmlFor="non-phoneNum">대표번호</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                          <select
                              className="f_input2"
                              name="non-phoneNumCode"
                              style={{width: "80px", marginRight: "5px"}}
                          >
                            <option value="010">010</option>
                            <option value="02">02</option>
                            <option value="031">031</option>
                          </select>
                          <span
                              style={{
                                marginLeft: '10px',
                                marginRight: '10px',
                                marginTop: '10px',
                                fontSize: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                          >-</span>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="non-phoneNum1"
                              maxLength="4"
                              style={{width: "120px", margin: "0 5px"}}
                              placeholder=""
                          />
                          <span
                              style={{
                                marginLeft: '10px',
                                marginRight: '10px',
                                marginTop: '10px',
                                fontSize: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                          >-</span>
                          <input
                              className="f_input2 w_full"
                              type="text"
                              name="non-phoneNum2"
                              maxLength="4"
                              style={{width: "120px", marginLeft: "5px"}}
                              placeholder=""
                          />
                        </dd>
                      </dl>

                      <dl>
                        <dt>
                          <label htmlFor="non-email">이메일</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                          <div style={{display: 'flex', gap: '10px'}}>
                            {/* 첫 번째 입력칸: 이메일 사용자 부분 */}
                            <input
                                className="f_input2 w_full"
                                type="text"
                                name="non-email-prefix"
                                title=""
                                id="non-email-prefix"
                                value={memberDetail.nonemailPrefix}
                                onChange={(e) =>
                                    setMemberDetail({
                                      ...memberDetail,
                                      nonemailPrefix: e.target.value,
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
                                name="non-email-domain"
                                title=""
                                id="non-email-domain"
                                value={memberDetail.nonemailDomain}
                                onChange={(e) =>
                                    setMemberDetail({
                                      ...memberDetail,
                                      nonemailDomain: e.target.value,
                                    })
                                }
                                disabled={memberDetail.nonemailProvider !== "direct"}  // 이메일 제공자가 직접입력이 아닐 경우 비활성화
                                required
                                style={{width: '20%'}}
                            />

                            {/* 이메일 제공자 선택 select 박스 */}
                            <div style={{position: 'relative', width: '10%'}}>
                              <select
                                  name="non-email-provider"
                                  id="non-email-provider"
                                  onChange={(e) => {
                                    const provider = e.target.value;
                                    setMemberDetail({
                                      ...memberDetail,
                                      nonemailProvider: provider,
                                      nonemailDomain: provider === "direct" ? "" : provider,
                                    });
                                  }}
                                  value={memberDetail.nonemailProvider}
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

                    </div>
                )}


                {/* 컨설턴트 정보 섹션 */}
                {memberDetail.memberType === '컨설턴트' && (
                    <div style={{borderTop: "1px solid #ddd", paddingTop: "20px", marginTop: "20px"}}>
                      <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>컨설턴트 정보</h3>

                      <dl>
                        <dt>
                          <label htmlFor="consultantPhoto">사진</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                        {/* 사진 업로드 부분 */}
                          <div style={{display: "flex", alignItems: "center", marginBottom: "10px"}}>
                            {/* 첨부 파일 이미지 (사진 자리) */}
                            <div
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  backgroundColor: "#f0f0f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "1px solid #ccc",
                                  borderRadius: "5px",
                                  overflow: "hidden",
                                }}
                            >
                              {image ? (
                                  <img
                                      src={image}
                                      alt="첨부된 사진"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                  />
                              ) : (
                                  <span style={{fontSize: "20px", color: "#aaa"}}>사진</span>
                              )}
                            </div>
                            <div style={{marginLeft: "10px"}}>
                              {/* 사진 설명 */}
                              <div style={{marginBottom: "10px"}}>
                                <p style={{fontSize: "12px", color: "#777"}}>
                                  - 대표 사진 등록시 상세, 목록, 축소 이미지에 자동 리사이징되어 들어갑니다.
                                </p>
                                <p style={{fontSize: "12px", color: "#777"}}>
                                  - 사진 권장 사이즈: 500px * 500px / 10M 이하 / gif, png, jpg(jpeg)
                                </p>
                              </div>
                              {/* 사진 파일 선택 */}
                              <input
                                  type="file"
                                  name="consultantPhoto"
                                  id="consultantPhoto"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  style={{marginTop: "3px"}}
                              />
                            </div>
                          </div>
                        </dd>
                      </dl>


                      {/* 소속 */}
                      <dl>
                        <dt>
                          <label htmlFor="consultantAffiliation">소속</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                        <input
                              className="f_input2 w_full"
                              type="text"
                              name="consultantAffiliation"
                              id="consultantAffiliation"
                              value={memberDetail.consultantAffiliation || ""}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    consultantAffiliation: e.target.value,
                                  })
                              }
                              style={{width: '100%'}}
                          />
                        </dd>
                      </dl>

                      {/* 직위 */}
                      <dl>
                        <dt>
                          <label htmlFor="consultantPosition">직위</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                        <input
                              className="f_input2 w_full"
                              type="text"
                              name="consultantPosition"
                              id="consultantPosition"
                              value={memberDetail.consultantPosition || ""}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    consultantPosition: e.target.value,
                                  })
                              }
                              style={{width: '20%'}}
                          />
                        </dd>
                      </dl>

                      {/* 경력 */}
                      <dl>
                        <dt>
                          <label htmlFor="consultantExperience">경력</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                        <input
                              className="f_input2 w_full"
                              type="text"
                              name="consultantExperience"
                              id="consultantExperience"
                              value={memberDetail.consultantExperience || ""}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    consultantExperience: e.target.value,
                                  })
                              }
                              style={{width: '10%', marginRight: '10px'}}
                          />
                          <span style={{
                            marginTop: '7px',
                            fontSize: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>년</span>
                        </dd>
                      </dl>

                      {/* 자문분야 */}
                      <dl>
                        <dt>
                          <label htmlFor="consultantArea">자문분야</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                        <input
                              className="f_input2 w_full"
                              type="text"
                              name="consultantArea"
                              id="consultantArea"
                              value={memberDetail.consultantArea || ""}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    consultantArea: e.target.value,
                                  })
                              }
                          />
                        </dd>
                      </dl>

                      {/* 컨설팅 항목 체크박스 */}
                      <dl>
                        <dt>
                          <label>컨설팅 항목</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                        <div>
                            <label
                                style={{
                                  display: "block",
                                  marginBottom: "15px", // 위아래 간격 넓힘
                                  fontSize: "16px", // 글씨 크기 키움
                                }}
                            >
                              <input
                                  type="checkbox"
                                  name="consultingOption1"
                                  checked={memberDetail.consultingOption1}
                                  onChange={(e) =>
                                      setMemberDetail({
                                        ...memberDetail,
                                        consultingOption1: e.target.checked,
                                      })
                                  }
                                  style={{transform: "scale(1.3)"}}
                              />
                              <span style={{marginLeft: "5px"}}>체크박스 1</span> {/* 글씨와 체크박스 사이 간격 조정 */}
                            </label>
                            <label
                                style={{
                                  display: "block",
                                  fontSize: "16px", // 글씨 크기 키움
                                }}
                            >
                              <input
                                  type="checkbox"
                                  name="consultingOption2"
                                  checked={memberDetail.consultingOption2}
                                  onChange={(e) =>
                                      setMemberDetail({
                                        ...memberDetail,
                                        consultingOption2: e.target.checked,
                                      })
                                  }
                                  style={{transform: "scale(1.3)"}}
                              />
                              <span style={{marginLeft: "5px"}}>체크박스 2</span> {/* 글씨와 체크박스 사이 간격 조정 */}
                            </label>
                          </div>
                        </dd>
                      </dl>


                      {/* 소개 */}
                      <dl>
                        <dt>
                          <label htmlFor="consultantIntroduction">소개</label>
                          <span className="req">필수</span>
                        </dt>
                        <dd>
                        <input
                              className="f_input2 w_full"
                              type="text"
                              name="consultantIntroduction"
                              id="consultantIntroduction"
                              value={memberDetail.consultantIntroduction || ""}
                              onChange={(e) =>
                                  setMemberDetail({
                                    ...memberDetail,
                                    consultantIntroduction: e.target.value,
                                  })
                              }
                          />
                        </dd>
                      </dl>

                      {/* 자격증 */}
                      <dl>
                        <dt>
                          <label htmlFor="consultantCertificates">자격증</label>
                        </dt>
                        <dd>
                          {/* 자격증 파일 선택 */}
                          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                            <div style={{display: "flex", alignItems: "center"}}>
                              <input
                                  className="f_input2 w_full"
                                  type="text"
                                  name="consultantCertificates1"
                                  id="consultantCertificates1"
                                  style={{width: "30%"}}
                              />
                              <input
                                  type="file"
                                  name="consultantCertificatesFile1"
                                  id="consultantCertificatesFile1"
                                  style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                              />
                            </div>
                            <div style={{display: "flex", alignItems: "center"}}>
                              <input
                                  className="f_input2 w_full"
                                  type="text"
                                  name="consultantCertificates2"
                                  id="consultantCertificates2"
                                  style={{width: "30%"}}
                              />
                              <input
                                  type="file"
                                  name="consultantCertificatesFile2"
                                  id="consultantCertificatesFile2"
                                  style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                              />
                            </div>
                            <div style={{display: "flex", alignItems: "center"}}>
                              <input
                                  className="f_input2 w_full"
                                  type="text"
                                  name="consultantCertificates3"
                                  id="consultantCertificates3"
                                  style={{width: "30%"}}
                              />
                              <input
                                  type="file"
                                  name="consultantCertificatesFile3"
                                  id="consultantCertificatesFile3"
                                  style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                              />
                            </div>
                          </div>
                        </dd>
                      </dl>

                    </div>
                )}


                {/* <!-- 버튼영역 --> */}
                <div className="board_btn_area" style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        className="btn btn_skyblue_h46 w_100"
                        onClick={() => updateMember()}
                        style={{width: '10%'}}
                    >
                      가입 신청
                    </button>
                    <button
                        className="btn btn_skyblue_h46 w_100"
                        onClick={() => navigate(URL.LOGIN)}
                        style={{
                          width: "10%",
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                        }}
                    >
                      가입 취소
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
