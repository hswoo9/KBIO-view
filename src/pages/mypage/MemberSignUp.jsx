import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";

import { setSessionItem } from "@/utils/storage";

function MemberSignUp(props) {

  const navigate = useNavigate();
  const location = useLocation();
  const checkRef = useRef([]);
  const signupType = location.state?.signupType;

  console.log("EgovMypageEdit [location] : ", location);
  //const uniqId = location.state?.uniqId || "";
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  //const [memberDetail, setMemberDetail] = useState({});
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [emailAddr, setEmailAddr] = useState("");


  const [memberDetail, setMemberDetail] = useState({
  });


  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;

    script.onload = () => {
      console.log("카카오 주소 검색 API가 로드되었습니다.");

      // 여기서 type 콘솔에 찍기
      if (location.state?.signupType) {
        console.log("Signup Type: ", location.state.signupType);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [location.state]);

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
        const zipCode = data.zonecode;
        setMemberDetail({
          ...memberDetail,
          zip: zipCode,
          addr: fullAddress,
          searchAddress: '',
        });
      },
    }).open();
  };

  const handleBusinessNumberChange = (e, part) => {
    const value = e.target.value;

    setMemberDetail({
      ...memberDetail,
      bizRegNum1: part === 'bizRegNum1' ? value : memberDetail.bizRegNum1,
      bizRegNum2: part === 'bizRegNum2' ? value : memberDetail.bizRegNum2,
      bizRegNum3: part === 'bizRegNum3' ? value : memberDetail.bizRegNum3,

      mvnEntNm: "",         // 사업자명 초기화
      rpsvNm: "",           // 대표자명 초기화
      clsNm: "",            // 산업명 초기화
      entTelno: "",         // 대표번호 초기화
      bzentyEmlAddr: "",    // 기업메일 초기화
      address: "",          // 주소 초기화
    });
  };
  // 버튼 클릭 핸들러
  const kbioauth = async () => {
    const businessNumber = `${memberDetail.bizRegNum1}-${memberDetail.bizRegNum2}-${memberDetail.bizRegNum3}`;

    if (!businessNumber || businessNumber.includes("--")) {
      alert("사업자 등록번호를 정확히 입력하세요.");
      return;
    }

    try {
      // Step 1: 로컬 데이터베이스에서 사업자 등록번호 조회
      const checkBusinessURL = '/memberApi/checkBusiness.do';
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          businessNumber: businessNumber.replace(/-/g, ''),
        }),
      };

      // 비동기 함수로 처리하기 위해 내부 콜백 함수를 async로 설정
      await EgovNet.requestFetch(checkBusinessURL, reqOptions, async function (resp) {
        if (resp.resultCode === 200) {
          const businessData = resp.result.businessData;
          console.log("로컬 데이터:", businessData);

          if (businessData) {

            setMemberDetail({
              ...memberDetail,
              mvnEntSn: businessData.mvnEntSn,
              mvnEntNm: businessData.mvnEntNm,
              rpsvNm: businessData.rpsvNm,
              clsNm: businessData.clsNm,
              entTelno: businessData.entTelno,
              bzentyEmlAddr: businessData.bzentyEmlAddr,
              address: businessData.entAddr,
              daddress: businessData.entDaddr,

            });
          } else {
            alert("로컬 데이터는 있으나 상세 정보가 없습니다.");
          }
        } else if (resp.resultCode === 400) {
          const apiKey = import.meta.env.VITE_APP_DATA_API_CLIENTID;
          const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${apiKey}`;

          try {
            const response = await axios.post(url, {
              b_no: [businessNumber.replace(/-/g, '')],
            });

            const businessData = response.data[0];
            console.log("공공포털 데이터:", businessData);

            const businessStatus = response.data.data[0]?.b_stt_cd;

            if (businessStatus === '01') {
              alert("사업자가 정상적으로 운영 중입니다.");
            } else if (businessStatus === '02') {
              alert("사업자가 휴업 중입니다.");
            } else if (businessStatus === '03') {
              alert("사업자가 폐업 상태입니다.");
            } else {
              alert("사업자가 존재하지 않습니다.");
            }
          } catch (error) {
            console.error("공공 API 요청 실패:", error);
            alert("공공 API 요청 중 문제가 발생했습니다.");
          }
        } else {
          alert("서버에서 데이터를 조회할 수 없습니다.");
        }
      }, function (error) {
        console.error("로컬 데이터 요청 실패:", error);
        alert("로컬 데이터 요청 중 문제가 발생했습니다.");
      });
    } catch (error) {
      console.error("에러 발생:", error);
      alert("오류가 발생했습니다.");
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
        setMemberDetail({
          ...memberDetail,
          nonpostcode: fullAddress,
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
          editURL: "/memberApi/memberinsert.do",
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
      setMemberDetail({
        tmplatId: "TMPLAT_MYPAGE_DEFAULT", //Template 고정
        groupId: "GROUP_00000000000001", //그룹ID 초기값
        mberSttus: "P", //로그인가능여부 초기값
        checkIdResult: "",
      });

      if(location.state?.snsType){
        if(location.state.snsType == "naver"){
          setMemberDetail({
            ...memberDetail,
            kornFlnm: location.state.totalData.name,
            userId: location.state.totalData.email,
            mblTelno: location.state.totalData.mobile,
            snsType: location.state.snsType,
            snsId: location.state.snsId
          })
        }
      }

      return;
    }


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
      let checkId = memberDetail["userId"];
      if (checkId === null || checkId === undefined) {
        alert("회원ID를 입력해 주세요");
        return false;
      }
      /*const regex = /^[a-zA-Z0-9]{6,12}$/;
      if (!regex.test(checkId)) {
        alert("회원ID는 6~12자의 영문 대소문자와 숫자만 사용 가능합니다.");
        return false;
      }*/
      const checkIdURL = `/memberApi/checkMemberId.do`;
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId : checkId
        })
      };
      EgovNet.requestFetch(checkIdURL, reqOptions, function (resp) {
        if (resp.resultCode === 400 && resp.result.usedCnt > 0
        ) {
          setMemberDetail({
            ...memberDetail,
            checkIdResult: "중복된 아이디입니다.",
            checkIdResultColor: "red",
            userId: checkId,
          });
          resolve(resp.result.usedCnt);
        } else {
          setMemberDetail({
            ...memberDetail,
            checkIdResult: "사용 가능한 아이디입니다.",
            checkIdResultColor: "green",
            userId: checkId,
          });
          resolve(0);
        }
      });
    });
  };

  const formValidator = (formData) => {
    return new Promise((resolve) => {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      if (!form.get("userId")) {
        alert("회원ID는 필수 값입니다.");
        return resolve(false);
      }

      checkIdDplct().then((res) => {
        if (res > 0) {
          alert("중복된 아이디입니다. 다른 아이디를 사용해주세요.");
          return resolve(false);
        }

        if (!form.get("userPw")) {
          alert("비밀번호는 필수 값입니다.");
          return resolve(false);
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~_`|-]).{8,20}$/;
        if (!passwordRegex.test(form.get("userPw"))) {
          alert("비밀번호는 영문자, 숫자, 특수문자 조합으로 8~20자리 이내여야 합니다.");
          return resolve(false);
        }

        if (form.get("password_chk") !== form.get("userPw")) {
          alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
          return resolve(false);
        }

        if (!form.get("kornFlnm")) {
          alert("성명은 필수 값입니다.");
          return resolve(false);
        }

        const mberNmRegex = /^[a-zA-Zㄱ-ㅎ가-힣]+$/;
        if (!mberNmRegex.test(form.get("kornFlnm"))) {
          alert("성명은 한글 또는 영문자만 사용 가능합니다.");
          return resolve(false);
        }

        if (!form.get("mblTelno")) {
          alert("전화번호는 필수 값입니다.");
          return resolve(false);
        }

        const phonenumRegex = /^[0-9\-]+$/;
        if (!phonenumRegex.test(form.get("mblTelno"))) {
          alert("전화번호는 숫자와 하이픈(-)만 포함할 수 있습니다.");
          return resolve(false);
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


  // 회원가입 신청
  const insertMember = () => {
    const insertMemURL = `/memberApi/insertMember.do`;

    formValidator(memberDetail).then((isValid) => {
      if (!isValid) return; // 검증 실패 시 함수 종료

      const reqOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...memberDetail,
        }),
      };

      EgovNet.requestFetch(insertMemURL, reqOptions, function (resp) {
        console.log("Result Code:", resp.resultCode);
        console.log("Expected Code:", CODE.RCV_SUCCESS);
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          setMemberDetail({
            ...memberDetail,
            insertMemResult: "회원가입신청이 완료되었습니다.",
          });
          navigate({ pathname: URL.COMPLETE_MEMBER });
        } else {
          navigate(
              { pathname: URL.ERROR },
              { state: { msg: resp.resultMessage } }
          );
        }
      });
    });
  };


  useEffect(() => {
    initMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("------------------------------EgovMypageEdit [End]");
  console.groupEnd("EgovMypageEdit");

  return (
      <div id="container" className="container join_step step2">
        <div className="inner">
          <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
            <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
              <li>
                <div className="num"><p>1</p></div>
                <p className="text">약관동의</p>
              </li>
              <li >
                <div className="num"><p>2</p></div>
                <p className="text">본인인증</p>
              </li>
              <li className="active">
                <div className="num"><p>3</p></div>
                <p className="text">정보입력</p>
              </li>
              <li>
                <div className="num"><p>4</p></div>
                <p className="text">신청완료</p>
              </li>
            </ul>
          </ul>

          <form className="contBox">
            <ul className="inputWrap box01" data-aos="fade-up" data-aos-duration="1500">

              {/*추 후에 본인인증이 연동되면 다시 설정
              <li className="inputBox type2 white">
                <span className="tt1">성명</span>
                <label className="input">
                  <input type="text" name="mberNm" id="mberNm" title="성명" value={memberDetail.mberNm} readOnly/>
                </label>
              </li>
              <li className="inputBox type2 white">
                <span className="tt1">휴대폰</span>
                <label className="input">
                  <input type="text" name="phonenum" id="phonenum" title="휴대폰" value={memberDetail.phonenum} readOnly/>
                </label>
              </li>*/}

              <li className="inputBox type2">
                <span className="tt1">성명</span>
                <label className="input">
                  <input
                      type="text"
                      name="kornFlnm"
                      title=""
                      id="kornFlnm"
                      placeholder=""
                      value={memberDetail.kornFlnm || ""}
                      onChange={(e) => setMemberDetail({...memberDetail, kornFlnm: e.target.value})}
                      ref={(el) => (checkRef.current[3] = el)}
                  />
                </label>
              </li>

              <li className="inputBox type2">
                <span className="tt1">휴대폰</span>
                <label className="input">
                  <input
                      type="text"
                      name="mblTelno"
                      title=""
                      id="mblTelno"
                      placeholder=""
                      value={memberDetail.mblTelno || ""}
                      onChange={(e) => setMemberDetail({...memberDetail, mblTelno: e.target.value})}
                      ref={(el) => (checkRef.current[4] = el)}
                  />
                </label>
              </li>

              <li className="inputBox type2">
                <span className="tt1">아이디</span>
                <div className="input">
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                    <input
                        type="text"
                        name="userId"
                        id="userId"
                        placeholder="아이디는 6~12자 영문, 숫자만 가능합니다."
                        title="아이디"
                        value={memberDetail.userId || ""}
                        onChange={(e) => setMemberDetail({...memberDetail, userId: e.target.value})}
                        style={{flex: 1}}
                    />
                    <button
                        type="button"
                        className="btn btn_skyblue_h46"
                        onClick={checkIdDplct}
                        disabled={signupType === "kakao" || signupType === "naver" || signupType === "google"}
                    >
                      중복확인
                    </button>
                  </div>
                  {memberDetail.checkIdResult && (
                      <div style={{color: memberDetail.checkIdResultColor, marginTop: '10px', fontSize: '12px'}}>
                        {memberDetail.checkIdResult}
                      </div>
                  )}
                </div>
              </li>

              <li className="inputBox type2">
                <span className="tt1" htmlFor="emailId">이메일</span>
                <div className="input flexinput" style={{display: 'flex', alignItems: 'center'}}>
                  <input
                      type="text"
                      name="emailPrefix"
                      id="emailPrefix"
                      placeholder="이메일 아이디 입력"
                      value={memberDetail.emailPrefix || ""}
                      onChange={(e) => setMemberDetail({
                        ...memberDetail,
                        emailPrefix: e.target.value,
                        email: `${e.target.value}@${memberDetail.emailDomain || ''}` // 도메인이 비어있을 경우 처리
                      })}
                      style={{flex: 1, padding: '5px'}}
                  />
                  <span style={{margin: '0 5px'}}>@</span>
                  <div className="itemBox" style={{flex: 1}}>
                    {memberDetail.emailProvider === "direct" ? (
                        <input
                            type="text"
                            placeholder="도메인 입력"
                            value={memberDetail.emailDomain || ""}
                            onChange={(e) => setMemberDetail({
                              ...memberDetail,
                              emailDomain: e.target.value,
                              email: `${memberDetail.emailPrefix}@${e.target.value}` // 도메인 입력 시 이메일 업데이트
                            })}
                            onBlur={() => {
                              if (!memberDetail.emailDomain) {
                                setMemberDetail({...memberDetail, emailProvider: ""});
                              }
                            }}
                        />
                    ) : (
                        <select
                            className="selectGroup"
                            onChange={(e) => {
                              const provider = e.target.value;
                              const newEmailDomain = provider === "direct" ? "" : provider; // 선택한 도메인
                              const newEmail = `${memberDetail.emailPrefix}@${newEmailDomain}`; // 새로운 이메일 생성
                              setMemberDetail((prevDetail) => ({
                                ...prevDetail,
                                emailProvider: provider,
                                emailDomain: newEmailDomain,
                                email: newEmail
                              }));
                            }}
                            value={memberDetail.emailProvider || ""}
                            style={{
                              padding: '5px',
                              flex: 1,
                              appearance: 'none',
                              width: '100%',
                            }}
                        >
                          <option value="">선택하세요</option>
                          <option value="naver.com">naver.com</option>
                          <option value="gmail.com">gmail.com</option>
                          <option value="daum.net">daum.net</option>
                          <option value="hotmail.com">hotmail.com</option>
                          <option value="nate.com">nate.com</option>
                          <option value="hanmail.net">hanmail.net</option>
                          <option value="direct">직접 입력</option>
                        </select>
                    )}
                  </div>
                </div>
              </li>


              <li className="inputBox type2">
                <span className="tt1">비밀번호</span>
                <label className="input">
                  <input
                      type="password"
                      name="userPw"
                      id="userPw"
                      placeholder="영문자, 숫자, 특수문자 조합으로 8~20자 이내만 가능합니다."
                      title="비밀번호"
                      value={memberDetail.userPw || ""}
                      onChange={(e) => setMemberDetail({...memberDetail, userPw: e.target.value})}
                  />
                </label>
              </li>

              <li>
                <div className="inputBox type2">
                  <span className="tt1">비밀번호 확인</span>
                  <label className="input">
                    <input
                        type="password"
                        name="password_chk"
                        id="password_chk"
                        title="비밀번호 확인"
                        value={memberDetail.password_chk || ""}
                        onChange={(e) => setMemberDetail({...memberDetail, password_chk: e.target.value})}
                    />
                  </label>
                </div>
                <span className="warningText">비밀번호: 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.</span>
              </li>

              <li className="inputBox type2">
                <span className="tt1">주소</span>
                <label className="input" style={{paddingRight: "6rem"}}>
                  <input
                      type="text"
                      name="addr"
                      id="addr"
                      readOnly
                      title="주소"
                      value={memberDetail.addr || ""}
                  />
                  <button type="button" className="addressBtn btn" onClick={searchAddress}>
                    <span>주소검색</span>
                  </button>
                </label>
              </li>

              <li className="inputBox type2 ">
                <span className="tt1">상세주소</span>
                <label className="input" style={{paddingRight: "6rem"}}>
                  <input
                      type="text"
                      name="daddr"
                      id="daddr"
                      placeholder="상세주소를 입력해주세요"
                      title="상세주소"
                      value={memberDetail.daddr || ""}
                      onChange={(e) => setMemberDetail({...memberDetail, daddr: e.target.value})}
                  />
                </label>
              </li>
            </ul>

            <div className="box02" data-aos="fade-up" data-aos-duration="1500">
              <div className="tabBox type1">
                <div className="bg hover"></div>
                <ul className="list">
                  <li className={memberDetail.mbrType === "입주기업" ? "active" : ""}>
                    <a href="#" onClick={() => {
                      setMemberDetail({
                        ...memberDetail,
                        mbrType: 1,
                        bizRegNum1: '',
                        bizRegNum2: '',
                        bizRegNum3: '',
                        mvnEntNm: '',
                        rpsvNm: '',
                        clsNm: '',
                        entTelno: '',
                        bzentyEmlAddr: '',
                        address: '',
                        daddress: '',
                      });
                    }}>
                      <span>입주기업</span>
                    </a>
                  </li>
                  <li className={memberDetail.mbrType === "유관기관" ? "active" : ""}>
                    <a href="#" onClick={() => {
                      setMemberDetail({
                        ...memberDetail,
                        mbrType: 3,
                        bizRegNum1: '',
                        bizRegNum2: '',
                        bizRegNum3: '',
                        mvnEntNm: '',
                        rpsvNm: '',
                        clsNm: '',
                        entTelno: '',
                        bzentyEmlAddr: '',
                        address: '',
                        daddress: '',
                      });
                    }}>
                      <span>유관기관</span>
                    </a>
                  </li>
                  <li className={memberDetail.mbrType === "비입주기업" ? "active" : ""}>
                    <a href="#" onClick={() => {
                      setMemberDetail({
                        ...memberDetail,
                        mbrType: 4,
                        bizRegNum1: '',
                        bizRegNum2: '',
                        bizRegNum3: '',
                        mvnEntNm: '',
                        rpsvNm: '',
                        clsNm: '',
                        entTelno: '',
                        bzentyEmlAddr: '',
                        address: '',
                        daddress: '',
                      });
                    }}>
                      <span>비입주기업</span>
                    </a>
                  </li>
                  <li className={memberDetail.mbrType === "컨설턴트" ? "active" : ""}>
                    <a href="#" onClick={() => setMemberDetail({...memberDetail, mbrType: 2,})}>
                      <span>컨설턴트</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* 입주기업 / 유관기관 폼 */}
              {(memberDetail.mbrType === 1 || memberDetail.mbrType === 3) && (
                  <ul className="inputWrap">
                    <li className="inputBox type2 business_num">
                      <span className="tt1">사업자 등록번호</span>
                      <div className="flexinput input" style={{paddingRight: "7rem"}}>
                        <label>
                          <input
                              type="text"
                              name="business_registration_number1"
                              id="business_registration_number1"
                              title="사업자 등록번호1"
                              maxLength="3"
                              value={memberDetail.bizRegNum1 || ""}
                              onChange={(e) => handleBusinessNumberChange(e, 'bizRegNum1')}
                          />
                        </label>
                        <label>
                          <input
                              type="text"
                              name="business_registration_number2"
                              id="business_registration_number2"
                              title="사업자 등록번호2"
                              maxLength="2"
                              value={memberDetail.bizRegNum2 || ""}
                              onChange={(e) => handleBusinessNumberChange(e, 'bizRegNum2')}
                          />
                        </label>
                        <label>
                          <input
                              type="text"
                              name="business_registration_number3"
                              id="business_registration_number3"
                              title="사업자 등록번호3"
                              maxLength="5"
                              value={memberDetail.bizRegNum3 || ""}
                              onChange={(e) => handleBusinessNumberChange(e, 'bizRegNum3')}
                          />
                        </label>
                        <button type="button" className="addressBtn btn" onClick={kbioauth}>
                          <span>사업자번호 인증</span>
                        </button>
                      </div>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">대표번호</span>
                      <label className="input">
                        <input
                            type="text"
                            name="business_phone"
                            id="business_phone"
                            title="대표번호"
                            value={memberDetail.entTelno || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, entTelno: e.target.value})}
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">기업명</span>
                      <label className="input">
                        <input
                            type="text"
                            name="business_name"
                            id="business_name"
                            title="기업명"
                            value={memberDetail.mvnEntNm || ""}
                            readOnly
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">기업메일</span>
                      <label className="input">
                        <input
                            type="text"
                            name="business_email"
                            id="business_email"
                            title="기업메일"
                            value={memberDetail.bzentyEmlAddr || ""}
                            readOnly
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">대표자</span>
                      <label className="input">
                        <input
                            type="text"
                            name="business_name_representative"
                            id="business_name_representative"
                            title="대표자"
                            value={memberDetail.rpsvNm || ""}
                            readOnly
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">산업</span>
                      <label className="input">
                        <input
                            type="text"
                            name="industry"
                            id="industry"
                            title="산업"
                            value={memberDetail.clsNm || ""}
                            readOnly
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">주소</span>
                      <label className="input" style={{paddingRight: "6rem"}}>
                        <input
                            type="text"
                            name="business_address"
                            id="business_address"
                            title="주소"
                            value={memberDetail.address || ""}
                            readOnly
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">상세주소</span>
                      <label className="input" style={{paddingRight: "6rem"}}>
                        <input
                            type="text"
                            name="business_entDaddr"
                            id="business_entDaddr"
                            title="주소"
                            value={memberDetail.daddress || ""}
                            readOnly
                        />
                      </label>
                    </li>
                  </ul>
              )}

              {memberDetail.mbrType === 4 && (
                  <ul className="inputWrap">
                    <li className="inputBox type2 business_num">
                      <span className="tt1">사업자 등록번호</span>
                      <div className="flexinput input" style={{paddingRight: "7rem"}}>
                        <label>
                          <input
                              type="text"
                              name="business_registration_number1"
                              id="business_registration_number1"
                              title="사업자 등록번호1"
                              maxLength="3"
                              value={memberDetail.bizRegNum1 || ""}
                              onChange={(e) => handleBusinessNumberChange(e, 'bizRegNum1')}
                          />
                        </label>
                        <label>
                          <input
                              type="text"
                              name="business_registration_number2"
                              id="business_registration_number2"
                              title="사업자 등록번호2"
                              maxLength="2"
                              value={memberDetail.bizRegNum2 || ""}
                              onChange={(e) => handleBusinessNumberChange(e, 'bizRegNum2')}
                          />
                        </label>
                        <label>
                          <input
                              type="text"
                              name="business_registration_number3"
                              id="business_registration_number3"
                              title="사업자 등록번호3"
                              maxLength="5"
                              value={memberDetail.bizRegNum3 || ""}
                              onChange={(e) => handleBusinessNumberChange(e, 'bizRegNum3')}
                          />
                        </label>
                        <button type="button" className="addressBtn btn" onClick={kbioauth}>
                          <span>사업자번호 인증</span>
                        </button>
                      </div>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">대표번호</span>
                      <label className="input">
                        <input
                            type="text"
                            name="business_phone"
                            id="non-business_phone"
                            title="대표번호"
                            value={memberDetail.nonEntTelno || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, nonEntTelno: e.target.value})}
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">기업명</span>
                      <label className="input">
                        <input
                            type="text"
                            name="business_name"
                            id="non-business_name"
                            title="기업명"
                            value={memberDetail.nonCompanyName || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, nonCompanyName: e.target.value})}
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">기업메일</span>
                      <label className="input">
                        <input
                            type="text"
                            name="business_email"
                            id="non-business_email"
                            title="기업메일"
                            value={memberDetail.nonBzentyEmlAddr || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, nonBzentyEmlAddr: e.target.value})}
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">대표자</span>
                      <label className="input">
                        <input
                            type="text"
                            name="business_name_representative"
                            id="non-business_name_representative"
                            title="대표자"
                            value={memberDetail.nonCeoName || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, nonCeoName: e.target.value})}
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">산업</span>
                      <label className="input">
                        <input
                            type="text"
                            name="industry"
                            id="non-industry"
                            title="산업"
                            value={memberDetail.nonIndustry || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, nonIndustry: e.target.value})}
                        />
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">주소</span>
                      <label className="input" style={{paddingRight: "6rem"}}>
                        <input
                            type="text"
                            name="business_address1"
                            id="non-business_address1"
                            title="주소"
                            value={memberDetail.nonAddress1 || ""}
                            readOnly
                        />
                        <button type="button" className="addressBtn btn" onClick={nonsearchAddress}>
                          <span>주소검색</span>
                        </button>
                      </label>
                    </li>
                    <li className="inputBox type2">
                      <span className="tt1">상세주소</span>
                      <label className="input" style={{paddingRight: "6rem"}}>
                        <input
                            type="text"
                            name="business_address2"
                            id="non-business_address2"
                            title="상세주소"
                            value={memberDetail.nonAddress2 || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, nonAddress2: e.target.value})}
                        />
                      </label>
                    </li>
                  </ul>
              )}

              {memberDetail.mbrType === 2 && (
                  <ul className="inputWrap">
                    <li className="inputBox type2">
                      <span className="tt1">사진</span>
                      <div className="input" style={{height: "100%"}}>
                        <div style={{display: "flex", alignItems: "flex-start", gap: "20px"}}>
                          <div style={{
                            width: "150px",
                            height: "150px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "#f8f8f8"
                          }}>
                            {image ? (
                                <img
                                    src={image}
                                    alt="컨설턴트 사진"
                                    style={{width: "100%", height: "100%", objectFit: "cover"}}
                                />
                            ) : (
                                <div style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#999"
                                }}>
                                </div>
                            )}
                          </div>
                          <div style={{flex: 1}}>
                            <p style={{color: "#ff4444", fontSize: "14px", marginBottom: "8px"}}>
                              - 대표 사진 등록시 상세, 목록, 축소 이미지에 자동 리사이징되어 들어갑니다.
                            </p>
                            <p style={{color: "#666", fontSize: "14px", marginBottom: "12px"}}>
                              - 사진 권장 사이즈: 500px * 500px / 10M 이하 / gif, png, jpg(jpeg)
                            </p>
                            <label style={{display: "block", marginTop: "12px"}}>
                              <small className="text btn">파일 선택</small>
                              <input type="file"
                                     name="formFile"
                                     id="formFile"
                                     onChange={handleImageChange}
                                     style={{display: "none"}} // 파일 선택 input 숨김
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className="inputBox type2">
                      <span className="tt1">소개</span>
                      <label className="input" style={{height: "100%"}}>
                        <textarea
                            name="consultantIntroduction"
                            placeholder="소개를 입력해주세요"
                            value={memberDetail.consultantIntroduction || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, consultantIntroduction: e.target.value})}
                            style={{
                              width: "100%",
                              height: "100px",
                              border: "none",
                              outline: "none",
                              resize: "none",
                              backgroundColor: "transparent",
                              fontFamily: "inherit",
                              fontSize: "inherit",
                              lineHeight: "1.5",
                              padding: 0
                            }}
                        />
                      </label>
                    </li>

                    <li className="inputBox type2">
                      <span className="tt1">직위</span>
                      <label className="input">
                        <input
                            type="text"
                            name="consultantPosition"
                            placeholder="직위를 입력해주세요"
                            value={memberDetail.consultantPosition || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, consultantPosition: e.target.value})}
                        />
                      </label>
                    </li>

                    <li className="inputBox type2">
                      <span className="tt1">경력</span>
                      <div className="flexinput input">
                        <input
                            type="text"
                            name="consultantExperience"
                            placeholder="숫자만 입력"
                            value={memberDetail.consultantExperience || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, consultantExperience: e.target.value})}
                            style={{width: "120px"}}
                        />
                        <span style={{marginLeft: "10px", color: "#333"}}>년</span>
                      </div>
                    </li>

                    <li className="inputBox type2">
                      <span className="tt1">소속</span>
                      <label className="input">
                        <input
                            type="text"
                            name="consultantAffiliation"
                            placeholder="소속을 입력해주세요"
                            value={memberDetail.consultantAffiliation || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, consultantAffiliation: e.target.value})}
                        />
                      </label>
                    </li>

                    <li className="inputBox type2">
                      <span className="tt1">컨설팅 항목</span>
                      <div className="input">
                        <div className="checkWrap" style={{display: "flex", gap: "20px"}}>
                          <label className="checkBox type3">
                            <input
                                type="checkbox"
                                name="consultingOption1"
                                checked={memberDetail.consultingOption1}
                                onChange={(e) => setMemberDetail({
                                  ...memberDetail,
                                  consultingOption1: e.target.checked
                                })}
                            />
                            <small>체크박스 1</small>
                          </label>
                          <label className="checkBox type3">
                            <input
                                type="checkbox"
                                name="consultingOption2"
                                checked={memberDetail.consultingOption2}
                                onChange={(e) => setMemberDetail({
                                  ...memberDetail,
                                  consultingOption2: e.target.checked
                                })}
                            />
                            <small>체크박스 2</small>
                          </label>
                        </div>
                      </div>
                    </li>

                    <li className="inputBox type2">
                      <span className="tt1">자문분야</span>
                      <label className="input">
                        <input
                            type="text"
                            name="consultantArea"
                            placeholder="자문분야를 입력해주세요"
                            value={memberDetail.consultantArea || ""}
                            onChange={(e) => setMemberDetail({...memberDetail, consultantArea: e.target.value})}
                        />
                      </label>
                    </li>

                    <li className="inputBox type2">
                      <span className="tt1">자격증</span>
                      <div className="input" style={{height: "100%"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                          {[1, 2, 3].map((num) => (
                              <div key={num} className="flexinput"
                                   style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                <input
                                    type="text"
                                    name={`consultantCertificates${num}`}
                                    placeholder="자격증명을 입력하세요"
                                    className="f_input2"
                                    style={{width: "40%"}}
                                />
                                <input
                                    type="file"
                                    name={`consultantCertificatesFile${num}`}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    style={{flex: 1}}
                                />
                              </div>
                          ))}
                        </div>
                      </div>
                    </li>
                  </ul>
              )}
            </div>

            <ul className="box03 inputWrap" data-aos="fade-up" data-aos-duration="1500">
              <li className="inputBox type2 white">
                <div className="input">
                  <span className="tt1">메일수신</span>
                  <div className="checkWrap">
                    <label className="checkBox type3">
                      <input
                          type="radio"
                          id="receive_mail_yes"
                          name="receive_mail"
                          checked={memberDetail.emlRcptnAgreYn === "Y"}
                          onChange={() => setMemberDetail({...memberDetail, emlRcptnAgreYn: "Y"})}
                      />
                      <small>수신</small>
                    </label>
                    <label className="checkBox type3">
                      <input
                          type="radio"
                          id="receive_mail_no"
                          name="receive_mail"
                          checked={memberDetail.emlRcptnAgreYn === "N"}
                          onChange={() => setMemberDetail({...memberDetail, emlRcptnAgreYn: "N"})}
                      />
                      <small>수신안함</small>
                    </label>
                  </div>
                </div>
                <span className="warningText">※ 메일링 서비스 수신동의 시 K-바이오랩허브 관련한 다양한 정보를 받으실 수 있습니다</span>
              </li>
              <li className="inputBox type2 white">
                <div className="input">
                  <span className="tt1">문자수신</span>
                  <div className="checkWrap">
                    <label className="checkBox type3">
                      <input
                          type="radio"
                          id="receive_sms_yes"
                          name="receive_sms"
                          checked={memberDetail.smsRcptnAgreYn === "Y"}
                          onChange={() => setMemberDetail({...memberDetail, smsRcptnAgreYn: "Y"})}
                      />
                      <small>수신</small>
                    </label>
                    <label className="checkBox type3">
                      <input
                          type="radio"
                          id="receive_sms_no"
                          name="receive_sms"
                          checked={memberDetail.smsRcptnAgreYn === "N"}
                          onChange={() => setMemberDetail({...memberDetail, smsRcptnAgreYn: "N"})}
                      />
                      <small>수신안함</small>
                    </label>
                  </div>
                </div>
                <span className="warningText">※ 메일링 서비스 수신동의 시 K-바이오랩허브 관련한 다양한 정보를 받으실 수 있습니다</span>
              </li>
            </ul>

            <div className="buttonBox">
              <button type="button" className="clickBtn black" onClick={insertMember}>
                <span>다음</span>
              </button>
              <button type="button" className="clickBtn white" onClick={() => navigate(URL.LOGIN)}>
                <span>뒤로가기</span>
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default MemberSignUp;
