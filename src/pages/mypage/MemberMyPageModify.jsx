import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { getComCdList } from "@/components/CommonComponents";
import ManagerLeft from "@/components/manager/ManagerLeftMember";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";
import { fileDownLoad } from "@/components/CommonComponents";
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
    const [acceptFileTypes, setAcceptFileTypes] = useState('jpg,jpeg,png,gif,bmp,tiff,tif,webp,svg,ico,heic,avif,pdf');
    const [image, setImage] = useState({});
    const [comCdList, setComCdList] = useState([]);
    const [cnsltProfileFile, setCnsltProfileFile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 상태
    const [newPassword, setNewPassword] = useState(''); // 변경할 비밀번호 상태

    const [consultDetail, setConsultDetail] = useState({});

    const [memberDetail, setMemberDetail] = useState({});
    const [modeInfo, setModeInfo] = useState({mode: props.mode});
    const [searchDto, setSearchDto] = useState({userSn:sessionUserSn});

    const [selectedCertFiles, setSelectedCertFiles] = useState([]);
    const [selectedCareerFiles, setSelectedCareerFiles] = useState([]);
    const [selectedAcbgFiles, setSelectedAcbgFiles] = useState([]);


    const [rcDetail, setRcDetail] = useState({});

    const [certificates, setCertificates] = useState([]);
    const addCertificate = () => {
        const newId = `certificate_${Date.now()}`;
        setCertificates([...certificates, { key: newId , qlfcLcnsNm: "", pblcnInstNm: "", acqsYmd: "", userSn: sessionUserSn, actvtnYn: 'Y'}]);
    };

    const removeCertificate = (id, qlfcLcnsSn, atchFileSn) => {
        if (qlfcLcnsSn) {
            removeCertificateFromServer(id, qlfcLcnsSn, atchFileSn);
        } else {
            removeLocalCertificate(id);
        }
    };
    const removeLocalCertificate = (id) => {
        setCertificates(certificates.filter(cert => cert.key !== id));
    };

    const removeCertificateFromServer = (id, qlfcLcnsSn, atchFileSn) => {
        Swal.fire({
            title: "삭제한 정보는 복구할 수 없습니다.\n그래도 삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        qlfcLcnsSn: qlfcLcnsSn,
                    }),
                };

                EgovNet.requestFetch("/memberApi/delCertificate", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {

                        if (atchFileSn) {
                            const fileRequestOptions = {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json",
                                },
                                body: JSON.stringify({
                                    atchFileSn: atchFileSn,
                                }),
                            };

                            EgovNet.requestFetch("/commonApi/setFileDel", fileRequestOptions, (fileResp) => {
                                if (Number(fileResp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                                    Swal.fire("삭제되었습니다.");
                                    getNormalMember(searchDto);
                                }
                            });
                        } else {
                            Swal.fire("삭제되었습니다.");
                            getNormalMember(searchDto);
                        }
                    }
                });
            }
        });
    };



    const [careers, setCareer] = useState([]);
    const addCareer = () => {
        const newId = `career_${Date.now()}`;
        setCareer([...careers, { key: newId, ogdpCoNm : "", jbgdNm : "", jncmpYmd: "", rsgntnYmd: "", userSn: sessionUserSn, actvtnYn: 'Y'}]);
    };

    const removeCareer = (id, crrSn, atchFileSn) => {
        if (crrSn) {
            removeCareerFromServer(id, crrSn, atchFileSn);
        } else {
            removeLocalCareer(id);
        }
    };
    const removeLocalCareer = (id) => {
        setCareer(careers.filter((career) => career.key !== id));
    };

    const removeCareerFromServer = (id, crrSn, atchFileSn) => {
        Swal.fire({
            title: "삭제한 정보는 복구할 수 없습니다.\n그래도 삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        crrSn: crrSn,
                    }),
                };

                EgovNet.requestFetch("/memberApi/delCareer", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {

                        if (atchFileSn) {
                            const fileRequestOptions = {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json",
                                },
                                body: JSON.stringify({
                                    atchFileSn: atchFileSn,
                                }),
                            };

                            EgovNet.requestFetch("/commonApi/setFileDel", fileRequestOptions, (fileResp) => {
                                if (Number(fileResp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                                    Swal.fire("삭제되었습니다.");
                                    getNormalMember(searchDto);
                                }
                            });
                        } else {
                            Swal.fire("삭제되었습니다.");
                            getNormalMember(searchDto);
                        }
                    }
                });
            }
        });
    };

    const [acbges, setAcbg] = useState([]);
    const addAcbg = () => {
        const newId = `acbg_${Date.now()}`;
        setAcbg([...acbges, { key: newId, schlNm : "", scsbjtNm : "", mjrNm: "", dgrNm : "", grdtnYmd : "", userSn: sessionUserSn, actvtnYn: 'Y'}]);
    };
    const removeAcbg = (id, acbgSn, atchFileSn) => {
        if (acbgSn) {
            removeAcbgFromServer(id, acbgSn, atchFileSn);
        } else {
            removeLocalAcbg(id);
        }
    };
    const removeLocalAcbg = (id) => {
        setAcbg(acbges.filter((acbg) => acbg.key !== id));
    };

    const removeAcbgFromServer = (id, acbgSn, atchFileSn) => {
        Swal.fire({
            title: "삭제한 정보는 복구할 수 없습니다.\n그래도 삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        acbgSn: acbgSn,
                    }),
                };

                EgovNet.requestFetch("/memberApi/delAcbg", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {

                        if (atchFileSn) {
                            const fileRequestOptions = {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json",
                                },
                                body: JSON.stringify({
                                    atchFileSn: atchFileSn,
                                }),
                            };

                            EgovNet.requestFetch("/commonApi/setFileDel", fileRequestOptions, (fileResp) => {
                                if (Number(fileResp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                                    Swal.fire("삭제되었습니다.");
                                    getNormalMember(searchDto);
                                }
                            });
                        } else {
                            Swal.fire("삭제되었습니다.");
                            getNormalMember(searchDto);
                        }
                    }
                });
            }
        });
    };

    const handleInputChange = (e, id, type, field) => {
        let { value } = e.target;

        if (e.target.type === "date") {
            value = value.replace(/-/g, ""); // '-' 제거
        }

        const updateList = (list, setList) => {
            const updatedList = list.map(item =>
                item.key === id ? { ...item, [field]: value } : item
            );
            setList(updatedList);
        };

        if (type === "cert") updateList(certificates, setCertificates);
        if (type === "career") updateList(careers, setCareer);
        if (type === "acbg") updateList(acbges, setAcbg);
    };


    const formatDate = (dateString) => {
        if (!dateString) return "";
        return dateString.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    };


    const handleFileChange = (e, id, index) => {
        const file = e.target.files[0];
        if(!file){
            Swal.fire(
                `선택된 파일이 없습니다.`
            );
            if(document.getElementById(id + index)){
                document.getElementById(id + index).textContent = "";
            }
        }
        const fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();

        const allowedExtensions = acceptFileTypes.split(',');
        if(e.target.files.length > 0){

            if(allowedExtensions.includes(fileExtension)){
                let fileName = e.target.files[0].name;
                if(fileName.length > 10){
                    fileName = fileName.slice(0, 10) + "...";
                }
                if(document.getElementById(id + index)){
                    document.getElementById(id + index).textContent = fileName;
                }

                if (id === "cert") {
                    setSelectedCertFiles((prevFiles) => {
                        const updatedFiles = [...prevFiles];
                        updatedFiles[index] = { file, isNew: true};
                        return updatedFiles;
                    });
                } else if (id === "career") {
                    setSelectedCareerFiles((prevFiles) => {
                        const updatedFiles = [...prevFiles];
                        updatedFiles[index] = { file, isNew: true};
                        return updatedFiles;
                    });
                } else if (id === "acbg") {
                    setSelectedAcbgFiles((prevFiles) => {
                        const updatedFiles = [...prevFiles];
                        updatedFiles[index] = { file, isNew: true};
                        return updatedFiles;
                    });
                }

            }else{
                Swal.fire({
                    title: "허용되지 않은 확장자입니다.",
                    text: `허용 확장자: ` + acceptFileTypes
                });
                e.target.value = null;
            }
        }else{
            Swal.fire(
                `선택된 파일이 없습니다.`
            );
        }

    }

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
                const rcData = resp.result.rc;


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

                if (resp.result.tblQlfcLcnsList) {
                    setCertificates(resp.result.tblQlfcLcnsList.map(item => ({
                        key: item.qlfcLcnsSn,
                        qlfcLcnsSn: item.qlfcLcnsSn,
                        userSn: sessionUserSn,
                        qlfcLcnsNm: item.qlfcLcnsNm,
                        pblcnInstNm: item.pblcnInstNm,
                        acqsYmd: item.acqsYmd
                    })));
                }

                if (resp.result.tblAcbgList) {
                    setAcbg(resp.result.tblAcbgList.map(item => ({
                        key: item.acbgSn,
                        acbgSn: item.acbgSn,
                        userSn: sessionUserSn,
                        schlNm: item.schlNm,
                        scsbjtNm: item.scsbjtNm,
                        mjrNm: item.mjrNm,
                        grdtnYmd: item.grdtnYmd,
                        dgrNm: item.dgrNm
                    })));
                }

                if (resp.result.tblCrrList) {
                    setCareer(resp.result.tblCrrList.map(item => ({
                        key: item.crrSn,
                        crrSn: item.crrSn,
                        userSn: sessionUserSn,
                        ogdpCoNm: item.ogdpCoNm,
                        jbgdNm: item.jbgdNm,
                        jncmpYmd: item.jncmpYmd,
                        rsgntnYmd: item.rsgntnYmd
                    })));
                }

                if (resp.result.cnsltCertificateFile) {
                    setSelectedCertFiles(resp.result.cnsltCertificateFile);
                }

                if (resp.result.cnsltCareerFile) {
                    setSelectedCareerFiles(resp.result.cnsltCareerFile);
                }

                if (resp.result.cnsltAcbgFile) {
                    setSelectedAcbgFiles(resp.result.cnsltAcbgFile);
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

                setRcDetail({
                    ...rcData
                })
            }
        });
    };



    useEffect(() => {
        initMode();
    }, []);


    useEffect(() => {
        getComCdList(10).then((data) => {
            setComCdList(data);
        });

        if (consultDetail?.cnsltFld) {
            setConsultDetail((prev) => ({
                ...prev,
                cnsltFld: consultDetail.cnsltFld,
            }));
        }

        AOS.init();
    }, []);

    const getComCdListToHtml = (dataList) => {
        if (!dataList || dataList.length === 0) return null;

        return (
            <select
                className="selectGroup"
                style={{fontSize: '1.3em', marginTop: '-10px', marginLeft: '-13px', }}
                name="cnsltFld"
                value={consultDetail.cnsltFld || ""} // 기존 값 유지
                onChange={(e) =>
                    setConsultDetail({...consultDetail, cnsltFld: e.target.value})
                }
            >
                <option value="">전체</option>
                {dataList.map((item) => (
                    <option key={item.comCd} value={item.comCd}>
                        {item.comCdNm}
                    </option>
                ))}
            </select>
        );
    };

    const getComCdForCnstltArtcl = (dataList) => {
        let htmlData = [];
        if (dataList != null && dataList.length > 0) {
            htmlData.push(
                <label className="checkBox type2" key="all">
                    <input
                        type="radio"
                        name="cnsltFld"
                        key="all"
                        value=""
                        checked
                        onChange={(e) =>
                            setConsultDetail({...consultDetail, cnsltArtcl: e.target.value})
                        }
                    />전체</label>
            )
            dataList.forEach(function (item, index) {
                htmlData.push(
                    <label className="checkBox type2" key={item.comCd}>
                        <input
                            type="radio"
                            name="cnsltFld"
                            key={item.comCd}
                            value={item.comCd}
                            onChange={(e) =>
                                setConsultDetail({...consultDetail, cnsltArtcl: e.target.value})
                            }
                        />{item.comCdNm}</label>
                )
            });
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

        EgovNet.requestFetch(checkPwdUrl, requestOptions, (resp) => {
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

                if (newPassword && !validatePassword(newPassword)) {
                    Swal.fire("비밀번호는 8자 이상, 16자 이하이며, 최소 1개의 숫자, 문자, 특수문자를 포함해야 합니다.");
                    return;
                }

                if (!memberDetail.addr) {
                    Swal.fire("주소를 입력해주세요.");
                    return;
                }

                if (!memberDetail.daddr) {
                    Swal.fire("상세주소를 입력해주세요.");
                    return;
                }

                if (sessionUsermbrType === 2) {
                    const { jbpsNm, ogdpNm, cnsltSlfint, crrPrd, rmrkCn } = consultDetail;
                    if (!jbpsNm || !ogdpNm || !cnsltSlfint || !crrPrd || !rmrkCn) {
                        Swal.fire("모든 컨설턴트 정보를 입력해야 합니다.");
                        return;
                    }
                    for (const cert of certificates) {
                        if (!cert.qlfcLcnsNm || !cert.pblcnInstNm || !cert.acqsYmd) {
                            Swal.fire("모든 자격증 정보를 입력해야 합니다.");
                            return;
                        }
                    }

                    for (const career of careers) {
                        if (!career.ogdpCoNm || !career.jbgdNm || !career.jncmpYmd || !career.rsgntnYmd) {
                            Swal.fire("모든 경력 정보를 입력해야 합니다.");
                            return;
                        }
                    }

                    for (const acbg of acbges) {
                        if (!acbg.schlNm || !acbg.scsbjtNm || !acbg.mjrNm || !acbg.dgrNm || !acbg.grdtnYmd) {
                            Swal.fire("모든 학력 정보를 입력해야 합니다.");
                            return;
                        }
                    }
                }


                const emailPrefix = memberDetail.emailPrefix;
                const emailDomain = memberDetail.emailDomain;
                const email = `${emailPrefix}@${emailDomain}`;


                const updatedMemberDetail = {
                    ...memberDetail,
                    emailPrefix,
                    emailDomain,
                    email,
                    emailProvider: emailDomain,
                    userPwdRe: newPassword,
                };

                const hasConsultData = consultDetail && Object.keys(consultDetail).length > 0;

                const hasCertData = certificates && certificates.length > 0 ? certificates : null;
                const hasCrrData = careers && careers.length > 0 ? careers : null;
                const hasAcbgData = acbges && acbges.length > 0 ? acbges : null;


                setSaveEvent({
                    ...saveEvent,
                    save: true,
                    mode: "save",
                    memberDetail: updatedMemberDetail,
                    consultDetail: hasConsultData ? consultDetail : null,
                    hasCertData: hasCertData,
                    hasCrrData: hasCrrData,
                    hasAcbgData: hasAcbgData
                });
                
                
                
                
            } else {
            }
        });
    };
    const [saveEvent, setSaveEvent] = useState({});

    useEffect(() => {
    }, [selectedCertFiles]);

    useEffect(() => {
    }, [selectedCareerFiles]);

    useEffect(() => {
    }, [selectedAcbgFiles]);


    useEffect(() => {
        if (saveEvent.save && saveEvent.mode === "save") {
            saveMemberModifyData(saveEvent.memberDetail, saveEvent.consultDetail, saveEvent.hasCertData, saveEvent.hasCrrData, saveEvent.hasAcbgData);
        }
    }, [saveEvent]);

    const saveMemberModifyData = (memberDetail, consultDetail, hasCertData, hasCrrData, hasAcbgData) => {
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
        selectedCertFiles.forEach((file) => {
            if (file.file != null) {
                formData.append("certFiles", file.file);
            }
        });
        selectedCareerFiles.forEach((file) => {
            if (file.file != null) {
                formData.append("careerFiles", file.file);
            }
        });

        selectedAcbgFiles.forEach((file) => {
            if (file.file != null) {
                formData.append("acbgFiles", file.file);
            }
        });

        if (hasCertData) {
            formData.append("hasCertData", JSON.stringify(hasCertData))
        }


        if (hasCrrData) {
            formData.append("hasCrrData", JSON.stringify(hasCrrData))
        }

        if (hasAcbgData) {
            formData.append("hasAcbgData", JSON.stringify(hasAcbgData))
        }


        const menuListURL = "/memberApi/setMemberMyPageModify";
        const requestOptions = {
            method: "POST",
            body: formData,
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
                    navigate({ pathname: URL.MAIN });
                } else {
                    navigate(
                        { pathname: URL.ERROR },
                        { state: { msg: resp.resultMessage } }
                    );
                }
            }
        );
    };


    return (
        <div id="container" className="container mypage_information">
            <div className="inner">
            <CommonSubMenu/>
            <div className="inner2" data-aos="fade-up" data-aos-duration="1500">

                {/* 페이지 내용 표시 */}
                <form className="contBox">

                    <div className="inforBox">
                        <div className="titleWrap type2 left">
                            <p className="tt1">회원정보</p>
                        </div>
                        <ul className="listBox" data-aos="fade-up" data-aos-duration="1500">
                            <li className="inputBox type2 textBox">
                                <span className="title">성명</span>
                                <label className="text">
                                    <input
                                        type="text"
                                        name="kornFlnm"
                                        id="kornFlnm"
                                        value={memberDetail.kornFlnm || ""}
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
                                        value={memberDetail.mblTelno || ""}
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
                                            value={memberDetail.userId || ""}
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
                                        value={memberDetail.emailPrefix || ""}
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
                                                value={memberDetail.emailDomain || ""}
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
                                <span className="tt1">비밀번호 확인</span>
                                <label className="input">
                                    <input
                                        type="password"
                                        name="userPw"
                                        id="userPw"
                                        placeholder="현재 비밀번호를 작성해주세요."
                                        value={currentPassword || ""}
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
                                        value={newPassword || ""}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </label>
                            </li>

                            <li className="inputBox type2">
                                <span className="tt1">주소</span>
                                <label className="input" style={{paddingRight: "6rem"}}>
                                    <input type="text" name="addr" id="addr" readOnly value={memberDetail.addr || ""}/>
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
                                        value={memberDetail.daddr || ""}
                                        onChange={(e) => setMemberDetail({...memberDetail, daddr: e.target.value})}
                                    />
                                </label>
                            </li>
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
                                <span
                                    className="warningText">※ 메일링 서비스 수신동의 시 K-바이오랩허브 관련한 다양한 정보를 받으실 수 있습니다</span>
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
                                <span
                                    className="warningText">※ 메일링 서비스 수신동의 시 K-바이오랩허브 관련한 다양한 정보를 받으실 수 있습니다</span>
                            </li>
                        </ul>
                    </div>

                    <div className="box02" data-aos="fade-up" data-aos-duration="1500">
                        {sessionUsermbrType !== 2 && (
                            <div className="companyBox">
                                <div className="titleWrap type2 left">
                                    <p className="tt1">기업 정보</p>
                                </div>
                                <ul className="listBox" data-aos="fade-up" data-aos-duration="1500">
                                    <li className="inputBox type2">
                                        <label htmlFor="brno" className="tt1">사업자등록번호</label>
                                        <div className="input">
                                            <input type="text" name="brno" id="brno" title="사업자등록번호" readOnly
                                                   value={rcDetail.brno || ""}/>
                                        </div>
                                    </li>
                                    <li className="inputBox type2">
                                        <label htmlFor="company_tel" className="tt1">대표번호</label>
                                        <div className="input">
                                            <input type="text" name="company_tel" id="company_tel" title="대표번호" readOnly
                                                   value={rcDetail.entTelno || ""}/>
                                        </div>
                                    </li>
                                    <li className="inputBox type2">
                                        <label htmlFor="company_name" className="tt1">기업명</label>
                                        <div className="input">
                                            <input type="text" name="company_name" id="company_name" title="기업명"
                                                   readOnly
                                                   value={rcDetail.relInstNm || rcDetail.mvnEntNm || ""}/>
                                        </div>
                                    </li>
                                    <li className="inputBox type2">
                                        <label htmlFor="company_email" className="tt1">기업메일</label>
                                        <div className="input">
                                            <input type="text" name="company_email" id="company_email" title="기업메일"
                                                   readOnly
                                                   value={rcDetail.bzentyEmlAddr || ""}/>
                                        </div>
                                    </li>
                                    <li className="inputBox type2">
                                        <label htmlFor="company_representative" className="tt1">대표자</label>
                                        <div className="input">
                                            <input type="text" name="company_representative" id="company_representative"
                                                   title="대표자" readOnly
                                                   value={rcDetail.relInstNm || rcDetail.mvnEntNm || ""}/>
                                        </div>
                                    </li>
                                    <li className="inputBox type2">
                                        <span className="tt1">주소</span>
                                        <label className="input" style={{paddingRight: "6rem"}}>
                                            <input type="text" name="company_address1" id="company_address1" readOnly
                                                   title="주소"
                                                   value={rcDetail.entAddr || ""}/>
                                        </label>
                                    </li>
                                    <li className="inputBox type2">
                                        <label htmlFor="company_industry" className="tt1">산업</label>
                                        <div className="input">
                                            <input type="text" name="company_industry" id="company_industry"
                                                   title="산업" readOnly
                                                   value={rcDetail.clsNm || ""}/>
                                        </div>
                                    </li>
                                    <li className="inputBox type2 noText">
                                        <label className="input">
                                            <input
                                                type="text"
                                                name="company_address2"
                                                id="company_address2"
                                                placeholder="상세주소를 입력해주세요"
                                                title="상세주소"
                                                readOnly
                                                value={rcDetail.entDaddr || ""}
                                            />
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        )}
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
                                            value={consultDetail.cnsltSlfint || ""}
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
                                            value={consultDetail.jbpsNm || ""}
                                            onChange={(e) => setConsultDetail({
                                                ...consultDetail,
                                                jbpsNm: e.target.value
                                            })}
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
                                            value={consultDetail.crrPrd || ""}
                                            onChange={(e) => setConsultDetail({
                                                ...consultDetail,
                                                crrPrd: e.target.value
                                            })}
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
                                            value={consultDetail.ogdpNm || ""}
                                            onChange={(e) => setConsultDetail({
                                                ...consultDetail,
                                                ogdpNm: e.target.value
                                            })}
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
                                    <label className="input">
                                        <div className="itemBox" style={{flex: 1}}>
                                            {getComCdListToHtml(comCdList)}
                                        </div>
                                    </label>
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
                                                    className="signUpRadio"
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
                                                    className="signUpRadio"
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
                                    <span className="tt1">간략 소개</span>
                                    <label className="input">
                                    <textarea
                                        style={{height: "100px"}}
                                        name="consultantAffiliation"
                                        placeholder="최대 3줄, 100자 이내만 입력 가능합니다."
                                        value={consultDetail.rmrkCn || ""}
                                        maxLength={100}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            const lines = value.split("\n");
                                            if (lines.length > 3) {
                                                value = lines.slice(0, 3).join("\n");
                                            }
                                            setConsultDetail({
                                                ...consultDetail,
                                                rmrkCn: value,
                                            });
                                        }}
                                    ></textarea>
                                        <div style={{textAlign: "right", fontSize: "0.9em", color: "#666"}}>
                                            {(consultDetail.rmrkCn || "").length} / 100
                                        </div>
                                    </label>
                                </li>

                                <li className="inputBox type2 width1">
                                    <span className="tt1">자격증</span>
                                    <div className="input" style={{height: "100%"}}>
                                        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                            <div
                                                className="certificate-header"
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                                                    gap: "10px",
                                                    paddingBottom: "5px",
                                                    borderBottom: "1px solid #000",
                                                }}>
                                                <span>자격증명</span>
                                                <span>발급기관</span>
                                                <span>취득일</span>
                                                <span>파일 업로드</span>
                                            </div>
                                            {certificates.map((cert, index) => (
                                                <div
                                                    key={cert.key}
                                                    className="flexinput"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        name="qlfcLcnsNm"
                                                        placeholder="자격증명을 입력하세요"
                                                        className="f_input2"
                                                        style={{width: "29%"}}
                                                        value={cert.qlfcLcnsNm}
                                                        onChange={(e) => handleInputChange(e, cert.key, "cert", "qlfcLcnsNm")}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="pblcnInstNm"
                                                        placeholder="발급기관을 입력하세요"
                                                        className="f_input2"
                                                        value={cert.pblcnInstNm}
                                                        style={{width: "29%"}}
                                                        onChange={(e) => handleInputChange(e, cert.key, "cert", "pblcnInstNm")}
                                                    />
                                                    <input
                                                        type="date"
                                                        name="acqsYmd"
                                                        placeholder="취득일"
                                                        className="f_input2"
                                                        style={{width: "29%"}}
                                                        value={formatDate(cert.acqsYmd)}
                                                        onChange={(e) => handleInputChange(e, cert.key, "cert", "acqsYmd")}
                                                    />
                                                    {selectedCertFiles.length > 0 && selectedCertFiles[index] ? (
                                                        selectedCertFiles[index].isNew ? (
                                                            <p className="file_name" id={`cert${index}`}
                                                               style={{width: "20%"}}>
                                                            <span style={{cursor: "pointer"}}>
                                                                {selectedCertFiles[index].file.name}
                                                            </span>
                                                            </p>
                                                        ) : (
                                                            <p className="file_name" id={`CertFileNamePTag${cert.key}`}
                                                               style={{width: "20%"}}>
                                                            <span
                                                                onClick={() => fileDownLoad(selectedCertFiles[index].atchFileSn, selectedCertFiles[index].atchFileNm)}
                                                                style={{cursor: "pointer"}}>
                                                                {selectedCertFiles[index].atchFileNm}
                                                            </span>
                                                            </p>
                                                        )
                                                    ) : (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "10px",
                                                            }}
                                                            className="widthGroup20"
                                                        >
                                                            <p className="file_name" id={`cert${index}`}
                                                               style={{width: "50%"}}></p>
                                                            <label
                                                                className="fileLabel"
                                                                style={{ marginLeft: "auto", cursor: "pointer" }}
                                                            >
                                                                파일 선택
                                                                <input
                                                                    type="file"
                                                                    name={`selectedCertFile${index}`}
                                                                    id={`formCertFile${index}`}
                                                                    className="noneTag"
                                                                    onChange={(e) => handleFileChange(e, "cert", index)}
                                                                />
                                                            </label>
                                                        </div>
                                                    )}
                                                    <button type="button" className="fileLabel"
                                                            onClick={() => {
                                                                const certFile = selectedCertFiles[index];
                                                                if (certFile && certFile.atchFileSn) {
                                                                    removeCertificate(cert.key, cert.qlfcLcnsSn, certFile.atchFileSn);
                                                                } else {
                                                                    removeCertificate(cert.key, cert.qlfcLcnsSn, null);
                                                                }
                                                            }}>
                                                        삭제
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="writeBtn clickBtn"
                                                style={{width: "10%", height: "30px"}}
                                                onClick={addCertificate}
                                            >
                                                추가
                                            </button>
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type2 width1">
                                    <span className="tt1">경력 상세</span>
                                    <div className="input" style={{height: "100%"}}>
                                        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                            <div
                                                className="certificate-header"
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                                                    gap: "10px",
                                                    paddingBottom: "5px",
                                                    borderBottom: "1px solid #000",
                                                }}>
                                                <span>근무처</span>
                                                <span>직위</span>
                                                <span>근무기간</span>
                                                <span>파일 업로드</span>
                                            </div>
                                            {careers.map((career, index) => (
                                                <div
                                                    key={career.key}
                                                    className="flexinput"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        name="ogdpCoNm"
                                                        placeholder="근무처를 입력하세요"
                                                        className="f_input2"
                                                        style={{width: "29%"}}
                                                        value={career.ogdpCoNm || ""}
                                                        onChange={(e) => handleInputChange(e, career.key, "career", "ogdpCoNm")}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="jbgdNm"
                                                        placeholder="직위를 입력하세요"
                                                        className="f_input2"
                                                        style={{width: "29%"}}
                                                        value={career.jbgdNm || ""}
                                                        onChange={(e) => handleInputChange(e, career.key, "career", "jbgdNm")}
                                                    />
                                                    <input
                                                        type="date"
                                                        name="jncmpYmd"
                                                        placeholder="입사일자"
                                                        className="f_input2"
                                                        style={{width: "14%"}}
                                                        value={formatDate(career.jncmpYmd) || ""}
                                                        onChange={(e) => handleInputChange(e, career.key, "career", "jncmpYmd")}
                                                    />~&nbsp;
                                                    <input
                                                        type="date"
                                                        name="rsgntnYmd"
                                                        placeholder="퇴사일자"
                                                        className="f_input2"
                                                        style={{width: "14%"}}
                                                        value={formatDate(career.rsgntnYmd) || ""}
                                                        onChange={(e) => handleInputChange(e, career.key, "career", "rsgntnYmd")}
                                                    />
                                                    {selectedCareerFiles.length > 0 && selectedCareerFiles[index] ? (
                                                        selectedCareerFiles[index].isNew ? (
                                                            <p className="file_name" id={`career${index}`}
                                                               style={{width: "20%"}}>
                                                               <span style={{cursor: "pointer"}}>
                                                                    {selectedCareerFiles[index].file.name}
                                                                </span>
                                                            </p>
                                                        ) : (
                                                            <p className="file_name" id={`CrrFileNamePTag${career.key}`}
                                                               style={{width: "20%"}}>
                                                                <span
                                                                    onClick={() => fileDownLoad(selectedCareerFiles[index].atchFileSn, selectedCareerFiles[index].atchFileNm)}
                                                                    style={{cursor: "pointer"}}
                                                                >
                                                                    {selectedCareerFiles[index].atchFileNm}
                                                                </span>
                                                            </p>
                                                        )
                                                    ) : (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "10px",
                                                            }}
                                                            className="widthGroup20"
                                                        >
                                                            <p className="file_name" id={`career${index}`}
                                                               style={{width: "50%"}}></p>
                                                            <label
                                                                className="fileLabel"
                                                                style={{ marginLeft: "auto", cursor: "pointer" }}
                                                            >
                                                                파일 선택
                                                                <input
                                                                    type="file"
                                                                    name={`selectedCareerFile${index}`}
                                                                    id={`formCareerFile${index}`}
                                                                    className="noneTag"
                                                                    onChange={(e) => handleFileChange(e, "career", index)}
                                                                />
                                                            </label>
                                                        </div>
                                                    )}
                                                    <button type="button" className="fileLabel"
                                                            onClick={() => {
                                                                const crrFile = selectedCareerFiles[index];
                                                                if (crrFile && crrFile.atchFileSn) {
                                                                    removeCareer(career.key, career.crrSn, crrFile.atchFileSn);
                                                                } else {
                                                                    removeCareer(career.key, career.crrSn, null);
                                                                }
                                                            }}>
                                                        삭제
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                className="writeBtn clickBtn"
                                                style={{width: "10%", height: "30px"}}
                                                onClick={addCareer}
                                            >
                                                추가
                                            </button>
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type2 width1">
                                    <span className="tt1">학력 상세</span>
                                    <div className="input" style={{height: "100%"}}>
                                        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                            <div
                                                className="certificate-header"
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr auto",
                                                    gap: "10px",
                                                    paddingBottom: "5px",
                                                    borderBottom: "1px solid #000",
                                                }}>
                                                <span>학교명</span>
                                                <span>학과</span>
                                                <span>전공</span>
                                                <span>학위</span>
                                                <span>졸업일자</span>
                                                <span>파일 업로드</span>
                                            </div>
                                            {acbges.map((acbg, index) => (
                                                <div
                                                    key={acbg.key}
                                                    className="flexinput"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        name="schlNm"
                                                        placeholder="학교명을 입력하세요"
                                                        className="f_input2"
                                                        style={{width: "29%"}}
                                                        value={acbg.schlNm || ""}
                                                        onChange={(e) => handleInputChange(e, acbg.key, "acbg", "schlNm")}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="scsbjtNm"
                                                        placeholder="학과를 입력하세요"
                                                        className="f_input2"
                                                        style={{width: "29%"}}
                                                        value={acbg.scsbjtNm || ""}
                                                        onChange={(e) => handleInputChange(e, acbg.key, "acbg", "scsbjtNm")}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="mjrNm"
                                                        placeholder="전공을 입력하세요"
                                                        className="f_input2"
                                                        style={{width: "29%"}}
                                                        value={acbg.mjrNm || ""}
                                                        onChange={(e) => handleInputChange(e, acbg.key, "acbg", "mjrNm")}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="dgrNm"
                                                        placeholder="학위를 입력하세요"
                                                        className="f_input2"
                                                        style={{width: "29%"}}
                                                        value={acbg.dgrNm || ""}
                                                        onChange={(e) => handleInputChange(e, acbg.key, "acbg", "dgrNm")}
                                                    />
                                                    <input
                                                        type="date"
                                                        name="grdtnYmd"
                                                        placeholder="졸업일자"
                                                        className="f_input2"
                                                        style={{width: "29%"}}
                                                        value={formatDate(acbg.grdtnYmd) || ""}
                                                        onChange={(e) => handleInputChange(e, acbg.key, "acbg", "grdtnYmd")}
                                                    />
                                                    {selectedAcbgFiles.length > 0 && selectedAcbgFiles[index] ? (
                                                        selectedAcbgFiles[index].isNew ? (
                                                            <p className="file_name" id={`acbg${index}`}
                                                               style={{width: "20%"}}>
                                                            <span style={{cursor: "pointer"}}>
                                                                {selectedAcbgFiles[index].file.name}
                                                            </span>
                                                            </p>
                                                        ) : (
                                                            <p className="file_name" id={`AcbgFileNamePTag${acbg.key}`}
                                                               style={{width: "20%"}}>
                                                            <span
                                                                onClick={() => fileDownLoad(selectedAcbgFiles[index].atchFileSn, selectedAcbgFiles[index].atchFileNm)}
                                                                style={{cursor: "pointer"}}>
                                                                {selectedAcbgFiles[index].atchFileNm}
                                                            </span>
                                                            </p>
                                                        )
                                                    ) : (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "10px",
                                                            }}
                                                            className="widthGroup20"
                                                        >
                                                            <p className="file_name" id={`acbg${index}`}
                                                               style={{width: "50%"}}></p>
                                                            <label
                                                                className="fileLabel"
                                                                style={{ marginLeft: "auto", cursor: "pointer" }}
                                                            >
                                                                파일 선택
                                                                <input
                                                                    type="file"
                                                                    name={`selectedAcbgFile${index}`}
                                                                    id={`formAcbgFile${index}`}
                                                                    className="noneTag"
                                                                    onChange={(e) => handleFileChange(e, "acbg", index)}
                                                                />
                                                            </label>
                                                        </div>
                                                    )}
                                                    <button type="button" className="fileLabel"
                                                            onClick={() => {
                                                                const acbgFile = selectedAcbgFiles[index];
                                                                if (acbgFile && acbgFile.atchFileSn) {
                                                                    removeAcbg(acbg.key, acbg.acbgSn, acbgFile.atchFileSn);
                                                                } else {
                                                                    removeAcbg(acbg.key, acbg.acbgSn, null);
                                                                }
                                                            }}
                                                            style={{width: "6%"}}>
                                                        삭제
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="writeBtn clickBtn"
                                                style={{width: "10%", height: "30px"}}
                                                onClick={addAcbg}
                                            >
                                                추가
                                            </button>
                                        </div>
                                    </div>
                                </li>

                            </ul>

                        )}
                    </div>

                        <div className="buttonBox">
                            <button type="button" className="clickBtn black" onClick={checkPwd}
                                    style={{marginBottom: "50px", marginTop: "30px"}}>
                                <span>수정</span>
                            </button>
                        </div>
                </form>
            </div>
            </div>
        </div>
);
};

export default MemberMyPageModify;