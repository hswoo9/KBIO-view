import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeft from "@/components/manager/ManagerLeftMember";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import base64 from 'base64-js';
import { getSessionItem } from "@/utils/storage";
import CommonSubMenu from "@/components/CommonSubMenu";
import CommonEditor from "@/components/CommonEditor";
import notProfile from "@/assets/images/no_profile.png";

function MemberMyPageModify(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const sessionUserName = sessionUser?.name;
    const sessionUserSn = sessionUser?.userSn;
    const sessionUsermbrType = sessionUser?.mbrType;
    const [address, setAddress] = useState({});
    const [image, setImage] = useState({});
    const [comCdList, setComCdList] = useState([]);
    const [cnsltProfileFile, setCnsltProfileFile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 상태
    const [newPassword, setNewPassword] = useState(''); // 변경할 비밀번호 상태

    const [consultDetail, setConsultDetail] = useState({});

    const [memberDetail, setMemberDetail] = useState({});
    const [modeInfo, setModeInfo] = useState({mode: props.mode});
    const [searchDto, setSearchDto] = useState({userSn:sessionUserSn});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if(allowedImgExtensions.includes(fileExtension)) {
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result); // 사진 데이터를 상태에 저장
                };
                reader.readAsDataURL(file); // 사진 파일을 Data URL로 변환
                setSelectedImgFile(Array.from(e.target.files));
            }
        }else{
            Swal.fire({
                title: "허용되지 않은 확장자입니다.",
                text: `허용 확장자: ` + acceptImgFileTypes
            });
            e.target.value = null;
        }


    };

    const handleMailChange = (e) => {
        const value = e.target.value;
        setMemberDetail({
            ...memberDetail,
            emlRcptnAgreYn: value,
        });
    };
/*
    useEffect(() => {
        console.log(memberDetail);
    }, [memberDetail]);
*/

    const handleSmsChange = (e) => {
        const value = e.target.value;
        setMemberDetail({
            ...memberDetail,
            smsRcptnAgreYn: value,
        });
    };
    const initMode = () => {
        setModeInfo({
            ...modeInfo,
            modeTitle: modeInfo.mode === CODE.MODE_CREATE ? "회원 등록" : "회원 수정",
            editURL: `/memberApi/setNormalMember`,
        });

        getNormalMember(searchDto);
    };
    const memberTypeLabel =
        memberDetail.mbrType === 9 ? '관리자' :
            memberDetail.mbrType === 1 ? '입주기업' :
                memberDetail.mbrType === 2 ? '컨설턴트' :
                    memberDetail.mbrType === 3 ? '유관기관' :
                        memberDetail.mbrType === 4 ? '비입주기업' :
                            '테스트';

    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };


    useEffect(() => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;

        script.onload = () => {
            console.log("카카오 주소 검색 API가 로드되었습니다.");

            if (location.state?.signupType) {
                console.log("Signup Type: ", location.state.signupType);
            }
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [location.state]);

    useEffect(() => {
        if (memberDetail.email) {
            const emailParts = memberDetail.email.split("@");
            const emailPrefix = emailParts[0];
            const emailDomain = emailParts[1];

            // 기본 제공 도메인 리스트
            const defaultProviders = [
                "naver.com",
                "gmail.com",
                "daum.net",
                "hotmail.com",
                "nate.com",
                "hanmail.net"
            ];
            setMemberDetail((prevState) => ({
                ...prevState,
                emailPrefix,
                emailDomain,
                emailProvider: defaultProviders.includes(emailDomain) ? emailDomain : "direct",
            }));
        }
    }, [memberDetail.email]);

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

    const getNormalMember = (searchDto) => {
        const getNormalMemberURL = '/memberApi/getMyPageNormalMember';
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getNormalMemberURL, requestOptions, (resp) => {
            if (modeInfo.mode === CODE.MODE_MODIFY) {
                const memberData = resp.result.member;
                const cnsltData = resp.result.cnslttMbr;

                console.log("멤버데이터 : ",memberData);

                const decodedPhoneNumber = memberData.mblTelno ? decodePhoneNumber(memberData.mblTelno) : "";

                let emailPrefix = "";
                let emailDomain = "";
                let emailProvider = "direct";

                if (memberData.email && memberData.email.includes("@")) {
                    const emailParts = memberData.email.split("@");
                    emailPrefix = emailParts[0];
                    emailDomain = emailParts[1];
                    emailProvider = emailDomain;
                }

                if (resp.result.cnsltProfileFile) {
                    setCnsltProfileFile(resp.result.cnsltProfileFile);
                }

                setMemberDetail({
                    ...memberData,
                    mblTelno: decodedPhoneNumber,
                    emailPrefix : emailPrefix,
                    emailDomain : emailDomain,
                    email: memberData.email,
                    emailProvider : emailProvider,
                });

                setConsultDetail((prevState) => ({
                    ...prevState,
                    ...cnsltData,
                }));
                console.log("현재 consultDetail:", consultDetail);
                console.log("현재 memberDetail:", memberDetail)
            }
        });
    };



    useEffect(() => {
        initMode();
    }, []);

    const getComCdListToHtml = (dataList) => {
        let htmlData = [];
        if(dataList != null && dataList.length > 0) {
            htmlData.push(
                <select
                    className="selectGroup"
                    name="cnsltFld"
                    onChange={(e) =>
                        setMemberDetail({...memberDetail, cnsltFld: e.target.value})
                    }
                    key="commonCodeSelect"
                >
                    <option value="">전체</option>
                    {dataList.map((item) => (
                        <option key={item.comCd} value={item.comCd}>
                            {item.comCdNm}
                        </option>
                    ))}
                </select>
            )

        }
        return htmlData;
    }

    const handleChange = (value) => {
        setConsultDetail((prevState) => ({
            ...prevState,
            cnsltSlfint: value,
        }));
    };

    useEffect(() => {
        console.log("현재 consultDetail:", consultDetail);
    }, [consultDetail]);

    const checkPwd = () => {
        if (!currentPassword) {
            Swal.fire("현재 비밀번호를 입력해주세요.");
            return;
        }

        const checkPwdUrl = '/memberApi/checkPassword.do';
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: memberDetail.userId,
                userPw: currentPassword,
            }),
        };

        console.log("비밀번호 : ", currentPassword);
        console.log("아이디 : ", memberDetail.userId);

        EgovNet.requestFetch(checkPwdUrl, requestOptions, (resp) => {
            console.log("백엔드 응답:", resp);
            if (resp.resultCode == "200") {
                updateMember();
            } else {
                Swal.fire("비밀번호가 틀립니다.");
                return;
            }
        });
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        return passwordRegex.test(password);
    };

    const updateMember = () => {
        console.log("현재 memberDetail 상태:", memberDetail);
        console.log("현재 consultDetail:", consultDetail);
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                if (!memberDetail.emailPrefix || !memberDetail.emailDomain) {
                    Swal.fire("이메일을 입력해주세요.");
                    return;
                }
                /*if (!memberDetail.userPw) {
                    Swal.fire({
                        title: '비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.',
                        text: '비밀번호가 요구 사항에 맞지 않습니다.',
                    });
                    return;
                }*/

                if (!memberDetail.addr) {
                    Swal.fire("주소를 입력해주세요.");
                    return;
                }

                if (!memberDetail.daddr) {
                    Swal.fire("상세주소를 입력해주세요.");
                    return;
                }

                const emailPrefix = memberDetail.emailPrefix;
                const emailDomain = memberDetail.emailDomain;
                const email = `${emailPrefix}@${emailDomain}`;

                if (newPassword) {
                    if (!validatePassword(newPassword)) {
                        Swal.fire({
                            title: "비밀번호 형식이 올바르지 않습니다.",
                            text: "비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.",
                        });
                        return;
                    }
                }

                const updatedMemberDetail = {
                    ...memberDetail,
                    emailPrefix,
                    emailDomain,
                    email,
                    emailProvider: emailDomain,
                    userPwdRe: newPassword,
                };

                const hasConsultData = consultDetail && Object.keys(consultDetail).length > 0;

                setSaveEvent({
                    ...saveEvent,
                    save: true,
                    mode: "save",
                    memberDetail: updatedMemberDetail,
                    consultDetail: hasConsultData ? consultDetail : null
                });
            } else {
            }
        });
    };
    const [saveEvent, setSaveEvent] = useState({});
    
    useEffect(() => {
        if (saveEvent.save && saveEvent.mode === "save") {
            saveMemberModifyData(saveEvent.memberDetail, saveEvent.consultDetail);
        }
    }, [saveEvent]);

    const saveMemberModifyData = useCallback((memberDetail, consultDetail) => {
        const formData = new FormData();

        Object.keys(memberDetail).forEach((key) => {
            if (memberDetail[key] != null) {
                formData.append(key, memberDetail[key]);
            }
        });

        if (consultDetail && Object.keys(consultDetail).length > 0) {
            Object.keys(consultDetail).forEach((key) => {
                if (consultDetail[key] != null) {
                    formData.append(key, consultDetail[key]);
                }
            });
        }

        const menuListURL = "/memberApi/setMemberMyPageModfiy";
            const requestOptions = {
                method: "POST",
                body: formData
            };

            EgovNet.requestFetch(
                menuListURL,
                requestOptions,
                (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire({
                            text: resp.resultMessage,
                            confirmButtonText: '확인'
                        });
                        navigate({ pathname: URL.LOGIN });
                    } else {
                        navigate(
                            { pathname: URL.ERROR },
                            { state: { msg: resp.resultMessage } }
                        );
                    }
                }
            );
        },
    );

    return (
        <div id="container" className="container ithdraw join_step">
            <div className="inner">
                <CommonSubMenu/>

                {/* 페이지 내용 표시 */}
                <form className="contBox">
                    <ul className="inputWrap box01" data-aos="fade-up" data-aos-duration="1500">
                        {/*<li className="inputBox type2 white">
                            <span className="tt1">회원분류</span>
                            <div className="input">
                                <input
                                    type="text"
                                    name="mbrType"
                                    id="mbrType"
                                    value={memberTypeLabel}
                                    readOnly
                                />
                            </div>
                        </li>*/}

                        <li className="inputBox type2 white">
                            <span className="tt1">성명</span>
                            <label className="input">
                                <input
                                    type="text"
                                    name="kornFlnm"
                                    id="kornFlnm"
                                    value={memberDetail.kornFlnm}
                                    readOnly
                                />
                            </label>
                        </li>

                        <li className="inputBox type2 white">
                            <span className="tt1">휴대폰</span>
                            <label className="input">
                                <input
                                    type="text"
                                    name="mblTelno"
                                    id="mblTelno"
                                    value={memberDetail.mblTelno}
                                    readOnly
                                />
                            </label>
                        </li>

                        <li className="inputBox type2 white">
                            <span className="tt1">아이디</span>
                            <div className="input">
                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
                                    <input
                                        type="text"
                                        name="userId"
                                        id="userId"
                                        placeholder="아이디는 6~12자 영문, 숫자만 가능합니다."
                                        value={memberDetail.userId}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </li>
                        <li className="inputBox type2">
                            <span className="tt1">이메일</span>
                            <div className="input flexinput" style={{display: 'flex', alignItems: 'center'}}>
                                <input
                                    type="text"
                                    name="emailPrefix"
                                    id="emailPrefix"
                                    placeholder="이메일 아이디 입력"
                                    value={memberDetail.emailPrefix}
                                    onChange={(e) => setMemberDetail((prev) => ({
                                        ...prev,
                                        emailPrefix: e.target.value,
                                        email: `${e.target.value}@${prev.emailDomain}`
                                    }))}
                                    style={{flex: 1, padding: '5px'}}
                                />
                                <span style={{margin: '0 5px'}}>@</span>
                                <div className="itemBox" style={{flex: 1}}>
                                    {memberDetail.emailProvider === "direct" ? (
                                        <input
                                            type="text"
                                            placeholder="도메인 입력"
                                            value={memberDetail.emailDomain}
                                            onChange={(e) => {
                                                const updatedEmailDomain = e.target.value;
                                                setMemberDetail({
                                                    ...memberDetail,
                                                    emailDomain: updatedEmailDomain,
                                                    email: `${memberDetail.emailPrefix}@${updatedEmailDomain}`,  // emailDomain이 수정될 때 email 값도 갱신
                                                });
                                            }}
                                            onBlur={() => {
                                                if (!memberDetail.emailDomain) {
                                                    setMemberDetail({
                                                        ...memberDetail,
                                                        emailProvider: "",
                                                        emailDomain: "",
                                                    });
                                                }
                                            }}
                                            style={{flex: 1, padding: '5px'}}
                                        />
                                    ) : (
                                        <select
                                            className="selectGroup"
                                            onChange={(e) => {
                                                const provider = e.target.value;
                                                setMemberDetail((prev) => ({
                                                    ...prev,
                                                    emailProvider: provider,
                                                    emailDomain: provider === "direct" ? "" : provider,
                                                    email: `${prev.emailPrefix}@${provider === "direct" ? "" : provider}`
                                                }));
                                            }}
                                            value={memberDetail.emailProvider}
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
                            <span className="tt1">비밀번호 확인</span>
                            <label className="input">
                                <input
                                    type="password"
                                    name="userPw"
                                    id="userPw"
                                    placeholder="현재 비밀번호를 작성해주세요."
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </label>
                        </li>

                        <li className="inputBox type2">
                            <span className="tt1">비밀번호 변경</span>
                            <label className="input">
                                <input
                                    type="password"
                                    name="newUserPw"
                                    id="newUserPw"
                                    placeholder="비밀번호 변경을 원하지 않으시면 작성하지 않으시면 됩니다."
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </label>
                        </li>

                        <li className="inputBox type2">
                            <span className="tt1">주소</span>
                            <label className="input" style={{paddingRight: "6rem"}}>
                                <input type="text" name="addr" id="addr" readOnly value={memberDetail.addr}/>
                                <button type="button" className="addressBtn btn" onClick={searchAddress}>
                                    <span>주소검색</span>
                                </button>
                            </label>
                        </li>

                        <li className="inputBox type2">
                            <span className="tt1">상세주소</span>
                            <label className="input" style={{paddingRight: "6rem"}}>
                                <input
                                    type="text"
                                    name="daddr"
                                    id="daddr"
                                    placeholder="상세주소를 입력해주세요"
                                    value={memberDetail.daddr}
                                    onChange={(e) => setMemberDetail({...memberDetail, daddr: e.target.value})}
                                />
                            </label>
                        </li>
                    </ul>
                    {sessionUsermbrType === 2 && (
                        <ul className="inputWrap" data-aos="fade-up" data-aos-duration="1500">
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
                                            <img
                                                src={
                                                    cnsltProfileFile
                                                        ? `http://133.186.250.158${cnsltProfileFile.atchFilePathNm}/${cnsltProfileFile.strgFileNm}.${cnsltProfileFile.atchFileExtnNm}`
                                                        : notProfile
                                                }
                                                onError={(e) => {
                                                    e.target.src = notProfile;
                                                }}
                                                alt="컨설턴트사진"
                                            />
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
                                <div className="input" style={{height: "100%"}}>
                                    <CommonEditor
                                        value={consultDetail.cnsltSlfint}
                                        onChange={handleChange}
                                    />
                                </div>
                            </li>

                            <li className="inputBox type2">
                                <span className="tt1">직위</span>
                                <label className="input">
                                    <input
                                        type="text"
                                        name="consultantPosition"
                                        placeholder="직위를 입력해주세요"
                                        value={consultDetail.jbpsNm}
                                        onChange={(e) => setConsultDetail({...consultDetail, jbpsNm: e.target.value})}
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
                                        value={consultDetail.crrPrd}
                                        onChange={(e) => setConsultDetail({...consultDetail, crrPrd: e.target.value})}
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
                                        value={consultDetail.ogdpNm}
                                        onChange={(e) => setConsultDetail({...consultDetail, ogdpNm: e.target.value})}
                                    />
                                </label>
                            </li>

                            <li className="inputBox type2">
                                <span className="tt1">컨설팅 항목</span>
                                <div className="input">
                                    <div className="checkWrap" style={{display: "flex", gap: "20px"}}>
                                        <input
                                            type="text"
                                            name="consultingOption1"
                                            checked={consultDetail.consultingOption1}
                                            onChange={(e) => setConsultDetail({
                                                ...consultDetail,
                                                consultingOption1: e.target.checked
                                            })}
                                        />
                                    </div>
                                </div>
                            </li>

                            <li className="inputBox type2">
                                <span className="tt1">자문분야</span>
                                <div className="input">
                                    <div style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "10px",
                                        padding: "10px",
                                    }}>
                                        {comCdList.find(item => item.comCd === String(consultantDetail.cnsltFld))?.comCdNm || ""}
                                    </div>
                                </div>
                            </li>

                            <li className="inputBox type2">
                                <span className="tt1">컨설팅 활동</span>
                                <div className="input">
                                    <div className="checkWrap" style={{display: "flex", gap: "20px"}}>
                                        <label className="checkBox type3">
                                            <input
                                                type="radio"
                                                name="cnsltActv"
                                                value="Y"
                                                checked={consultDetail.cnsltActv === "Y"}
                                                onChange={() =>
                                                    setConsultDetail({...consultDetail, cnsltActv: "Y"})
                                                }
                                            />
                                            <small>공개</small>
                                        </label>
                                        <label className="checkBox type3">
                                            <input
                                                type="radio"
                                                name="cnsltActv"
                                                value="N"
                                                checked={consultDetail.cnsltActv === "N"}
                                                onChange={() =>
                                                    setConsultDetail({...consultDetail, cnsltActv: "N"})
                                                }
                                            />
                                            <small>비공개</small>
                                        </label>
                                    </div>
                                </div>
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
                                                <p className="file_name" id={`fileNamePTag${num}`}></p>
                                                <label>
                                                    <input type="file"
                                                           name={`selectedFile${num}`}
                                                           id={`formFile${num}`}
                                                           onChange={(e) => handleFileChange(e, num)}
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        </ul>

                    )}
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
                                            value="Y"
                                            className="signUpRadio"
                                            checked={memberDetail.emlRcptnAgreYn === "Y"}
                                            onChange={handleMailChange}
                                        />
                                        <small>수신</small>
                                    </label>
                                    <label className="checkBox type3">
                                        <input
                                            type="radio"
                                            id="receive_mail_no"
                                            name="receive_mail"
                                            value="N"
                                            className="signUpRadio"
                                            checked={memberDetail.emlRcptnAgreYn === "N"}
                                            onChange={handleMailChange}
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
                                            value="Y"
                                            className="signUpRadio"
                                            checked={memberDetail.smsRcptnAgreYn === "Y"}
                                            onChange={handleSmsChange}
                                        />
                                        <small>수신</small>
                                    </label>
                                    <label className="checkBox type3">
                                        <input
                                            type="radio"
                                            id="receive_sms_no"
                                            name="receive_sms"
                                            value="N"
                                            className="signUpRadio"
                                            checked={memberDetail.smsRcptnAgreYn === "N"}
                                            onChange={handleSmsChange}
                                        />
                                        <small>수신안함</small>
                                    </label>
                                </div>
                            </div>
                            <span className="warningText">※ 메일링 서비스 수신동의 시 K-바이오랩허브 관련한 다양한 정보를 받으실 수 있습니다</span>
                        </li>
                    </ul>

                    <div className="buttonBox">
                        <button type="button" className="clickBtn black" onClick={checkPwd}>
                            <span>수정</span>
                        </button>
                        {/*<button type="button" className="clickBtn white" onClick={() => navigate(URL.LOGIN)}>
                            <span>뒤로가기</span>
                        </button>*/}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MemberMyPageModify;