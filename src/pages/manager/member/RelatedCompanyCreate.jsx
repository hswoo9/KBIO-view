import React, {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate, NavLink, useLocation, Link} from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";
import Swal from "sweetalert2";
import CommonEditor from "@/components/CommonEditor";
import { getSessionItem } from "@/utils/storage";


import ManagerLeft from "@/components/manager/ManagerLeftOperationalSupport";
import {getComCdList} from "../../../components/CommonComponents.jsx";
import {useDropzone} from "react-dropzone";


function RelatedCompanyCreate(props){
    const location = useLocation();
    const [modeInfo, setModeInfo] = useState({ mode: location.state?.mode });
    const sessionUser = getSessionItem("loginUser");
    const navigate = useNavigate();
    const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(true);
    const [relatedDetail, setRelatedDetail] = useState({});
    const [searchDto, setSearchDto] = useState({relInstSn : location.state?.relInstSn});
    const [acceptFileTypes, setAcceptFileTypes] = useState('jpg,jpeg,png,gif,bmp,tiff,tif,webp,svg,ico,heic,avif');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedBIFiles, setSelectedBIFiles] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [imgFile, setImgFile] = useState("");
    const [biImgFile, setBiImgFile] = useState("");
    const isFirstRender = {
        bzentyExpln: useRef(true),
        mainHstry: useRef(true)
    };
    /*기업분류*/
    const [comCdList, setComCdList] = useState([]);
    /*기업업종*/
    const [comCdTpbizList, setComCdTpbizList] = useState([]);

    const initMode = () => {
        setModeInfo({
            ...modeInfo,
            modeTitle: "등록",
            editURL: `/relatedApi/setRelInst`,
        });

        getRc(searchDto);
    };


    //이메일 도메인 구분
    const [selectedDomain, setSelectedDomain] = useState(""); // 선택된 이메일 도메인
    const [isCustom, setIsCustom] = useState(false); // 직접 입력 여부
    const acceptAtchFileTypes = 'pdf,hwp,docx,xls,ppt';
    const onDrop = useCallback((acceptAtchFiles) => {
        const allowedExtensions = acceptAtchFileTypes.split(','); // 허용된 확장자 목록
        const validFiles = acceptAtchFiles.filter((file) => {
            const fileExtension = file.name.split(".").pop().toLowerCase();
            return allowedExtensions.includes(fileExtension);
        });

        if (validFiles.length > 0) {
            setFileList((prevFiles) => [...prevFiles, ...validFiles]); // 유효한 파일만 추가
        }

        if (validFiles.length !== acceptAtchFiles.length) {
            Swal.fire(
                `허용되지 않은 파일 유형이 포함되어 있습니다! (허용 파일: ${acceptAtchFileTypes})`
            );
        }

    }, [acceptAtchFileTypes]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
    });

    const formatYmdForInput = (dateStr) => {
        if (!dateStr || dateStr.length !== 8) return "";
        return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    };

    const handleDeleteFile = (index) => {
        const updatedFileList = fileList.filter((_, i) => i !== index);
        setFileList(updatedFileList);  // 파일 리스트 업데이트
    };

    const splitEmail = (email) =>{
        if (!email || !email.includes("@")) return "";
        return email.split("@")[0];
    }

    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setIsCustom(true);
            setSelectedDomain("");
        } else {
            setIsCustom(false);
            setSelectedDomain(value);
        }
    };

    const handleChangeField = (fieldName, value) => {
        if (isFirstRender[fieldName].current) {
            isFirstRender[fieldName].current = false;
            return;
        }
        setRelatedDetail({...relatedDetail, [fieldName]: value});
    };

    const setRcActvtnYn = (e) => {
        Swal.fire({
            title: "유관기관을 삭제할 경우\n 소속 직원 계정도 삭제됩니다.\n그래도 삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                const setRcActvtnYnUrl = "/relatedApi/setRcActvtnYn";
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(relatedDetail)
                };
                EgovNet.requestFetch(setRcActvtnYnUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("삭제되었습니다.").then(() => {
                            navigate(URL.MANAGER_RELATED_ORGANIZATION);
                        });
                    }else {
                        Swal.fire("삭제 중 문제가 발생하였습니다.");
                        return;
                    }
                });
            }else{
                //취소
            }
        });
    }

    const getRc = (searchDto) =>{
        if (modeInfo.mode === CODE.MODE_CREATE) {

            return;
        }

        const getRcURL = '/relatedApi/getRc';
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getRcURL, requestOptions, function (resp){

            if(modeInfo.mode === CODE.MODE_MODIFY){
                setRelatedDetail({
                    ...resp.result.rc,
                    mdfrSn : sessionUser.userSn,
                    mdfcnDt: new Date().toISOString()
                });

                if(resp.result.rc.actvtnYn == "Y"){
                    setIsDatePickerEnabled(true);
                }else{
                    setIsDatePickerEnabled(false);
                }

                if(resp.result.rc.logoFile != null){
                    setSelectedFiles(resp.result.rc.logoFile);
                }

                if(resp.result.rc.biLogoFile != null){
                    setSelectedBIFiles(resp.result.rc.biLogoFile);
                }


                if(resp.result.rc.relInstAtchFiles != null){
                    setFileList(resp.result.rc.relInstAtchFiles);
                }
            }
        });



    }

    const handleBiFileChange = (e) => {
        if(selectedBIFiles.atchFileSn != null){
            Swal.fire("기존 파일 삭제 후 첨부가 가능합니다.");
            e.target.value = null;
            return false;
        }

        const allowedExtensions = acceptFileTypes.split(',');
        if(e.target.files.length > 0){
            const fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();
            if(allowedExtensions.includes(fileExtension)){
                let fileName = e.target.files[0].name;
                if(fileName.length > 30){
                    fileName = fileName.slice(0, 30) + "...";
                }
                document.getElementById("fileBiNamePTag").textContent = fileName;
                setSelectedBIFiles(Array.from(e.target.files));
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    setBiImgFile(reader.result);
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

    const handleFileChange = (e) => {
        if(selectedFiles.atchFileSn != null){
            Swal.fire("기존 파일 삭제 후 첨부가 가능합니다.");
            e.target.value = null;
            return false;
        }

        const allowedExtensions = acceptFileTypes.split(',');
        if(e.target.files.length > 0){
            const fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();
            if(allowedExtensions.includes(fileExtension)){
                let fileName = e.target.files[0].name;
                if(fileName.length > 30){
                    fileName = fileName.slice(0, 30) + "...";
                }
                document.getElementById("fileNamePTag").textContent = fileName;
                setSelectedFiles(Array.from(e.target.files));
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    setImgFile(reader.result);
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
    };

    const handleDeleteAtchFile = (index, atchFileSn) => {
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
                        const updatedFileList = fileList.filter((_, i) => i !== index);
                        setFileList(updatedFileList);  // 파일 리스트 업데이트
                    } else {
                        Swal.fire("삭제 중 문제가 발생하였습니다.");
                        return;
                    }
                });
            } else {
            }
        });
    };

    const setBiFileDel = (atchFileSn) => {
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
                        setSelectedBIFiles([]);
                    } else {
                    }
                });
            } else {
                //취소
            }
        });
    }

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
                        setSelectedFiles([]);
                    } else {
                    }
                });
            } else {
                //취소
            }
        });
    }

    useEffect(() => {
        initMode();
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
    }, []);

    useEffect(() => {
        if (relatedDetail?.bzentyEmlAddr) {
            const email = relatedDetail.bzentyEmlAddr;
            const domain = email.split("@")[1] || "";

            if (["naver.com", "gmail.com"].includes(domain)) {
                setSelectedDomain(domain);
                setIsCustom(false);
            } else {
                setSelectedDomain(domain);
                setIsCustom(true);
            }
        }
    }, [relatedDetail]);

    useEffect(() => {
    }, [selectedFiles]);


    //사업자번호 상태 확인
    const kbioauth = async () => {
        //const businessNumber = `${relatedDetail.brno1}-${relatedDetail.brno2}-${relatedDetail.brno3}`;
        const businessNumber = `${relatedDetail.brno}`;

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

            const businessStatus = response.data.data[0]?.b_stt_cd;

            if (businessStatus === '01') {
                alert("사업자가 정상적으로 운영 중입니다.");
                setRelatedDetail({...relatedDetail, brno: businessNumber});
                document.getElementById("confirmText").style.display = "block";
            } else if (businessStatus === '02') {
                alert("사업자가 휴업 중입니다.");
                document.getElementById("confirmText").style.display = "none";
            } else if (businessStatus === '03') {
                alert("사업자가 폐업 상태입니다.");
                document.getElementById("confirmText").style.display = "none";
            } else {
                alert("사업자가 존재 하지 않습니다.");
                document.getElementById("confirmText").style.display = "none";
            }

        } catch (error) {
            alert("사업자 등록번호 조회에 실패했습니다.");
        }
    };



    //주소찾기 api
    const searchAddress = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert('주소 검색 API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                const searchAddress = data.address;
                const postcode = data.zonecode;
                setRelatedDetail({
                    ...relatedDetail,
                    zip: postcode,
                    entAddr: searchAddress,
                });
            },
        }).open();
    };

    const [emailAddr, setEmailAddr] = useState("");

    useEffect(() => {
        if (relatedDetail.bzentyEmlAddr1 && selectedDomain) {
            const newEmail = `${relatedDetail.bzentyEmlAddr1}@${selectedDomain}`;
            setEmailAddr(newEmail);
            setRelatedDetail({
                ...relatedDetail,
                bzentyEmlAddr: newEmail
            });
        }
    }, [relatedDetail.bzentyEmlAddr1, selectedDomain]);


    //등록and수정
    const updateRelated = () => {
        let requestOptions = {};

        if(!relatedDetail.clsf) {
            alert("분류를 선택해주세요.");
            return false;
        }

        if (!relatedDetail.brno) {
            alert("사업자번호는 필수 값입니다.");
            return false;
        }
        if (!relatedDetail.brno) {
            alert("사업자번호 인증을 진행해주십시오.");
            return false;
        }
        if (!relatedDetail.relInstNm) {
            alert("기업명은 필수 값입니다.");
            return false;
        }
        if (!relatedDetail.rpsvNm) {
            alert("대표자명은 필수 값입니다.");
            return false;
        }
        if (!relatedDetail.entTelno) {
            alert("대표번호는 필수 값입니다.");
            return false;
        }


        if (!relatedDetail.bzentyEmlAddr) {
            alert("이메일 주소를 입력해주세요.");
            return false;
        }

        if(!relatedDetail.tpbiz) {
            alert("업종을 선택해주세요.");
            return false;
        }

        if (!relatedDetail.zip || !relatedDetail.entAddr) {
            alert("주소는 필수 값입니다.");
            return false;
        }
        if (!relatedDetail.entDaddr) {
            alert("세부주소를 입력해주십시오.");
            return false;
        }


        if(!relatedDetail.mainHstry) {
            alert("주요이력을 입력해주세요.");
            return false;
        }
        if(!relatedDetail.rlsYn) {
            alert("공개여부를 선택해주세요.");
            return false;
        }

        if(relatedDetail.rlsYn === 'Y'){
            if(!relatedDetail.rlsBgngYmd || !relatedDetail.rlsEndYmd){
                alert("공개기한을 선택해주세요.")
                return false;
            }
        }
        if(!relatedDetail.empJoinYn){
            alert("산하직원가입여부를 선택해주세요");
            return false;
        }

        setRelatedDetail({...relatedDetail});

        const formData = new FormData();

        Array.from(selectedFiles).map((file) => {
            formData.append("file", file);
        });

        Array.from(selectedBIFiles).map((file) => {
            formData.append("biFile", file);
        });

        fileList.map((file) => {
            formData.append("files", file);
        })

        for (let key in relatedDetail) {
            if(key != "logoFile" && key != "relInstAtchFiles" && key != "biLogoFile"){
                formData.append(key, relatedDetail[key]);
            }
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
                    body: formData
                };

                EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("등록되었습니다.");
                        navigate(URL.MANAGER_RELATED_ORGANIZATION);
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

    useEffect(() => {
        getComCdList(17).then((data) => {
            setComCdList(data);
        })

        getComCdList(18).then((data) => {
            setComCdTpbizList(data);
        })
    }, []);

    return(
        <div id="container" className="container layout cms">
        <ManagerLeft/>

        <div className="inner">
            <h2 className="pageTitle">
                <p>유관기관관리</p>
            </h2>

            <div className="contBox infoWrap customContBox">
                <div className="topTitle">유관기관 정보</div>
                <ul className="inputWrap">
                    {/* 종목 */}
                    <li className="inputBox type1 width3">
                        <label className="title essential" htmlFor="clsf"><small>분류</small></label>
                        <div className="itemBox">
                            <select className="selectGroup"
                                    id="clsf"
                                    value={relatedDetail.clsf || ""}
                                    onChange={(e) =>
                                        setRelatedDetail({...relatedDetail, clsf: e.target.value})
                                    }
                            >
                                <option value="">선택</option>
                                {comCdList.map((item, index) => (
                                    <option key={item.comCd}
                                            value={item.comCd}
                                    >
                                        {item.comCdNm}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </li>
                    {/*기업명*/}
                    <li className="inputBox type1 width3">
                        <label className="title essential" htmlFor="relInstNm"><small>기업명</small></label>
                        <div className="input">
                            <input
                                type="text"
                                name="relInstNm"
                                id="relInstNm"
                                defaultValue={relatedDetail.relInstNm || ""}
                                onChange={(e) =>
                                    setRelatedDetail({...relatedDetail, relInstNm: e.target.value})
                                }
                            />
                        </div>
                    </li>
                    {/*로고*/}
                    <li className="inputBox type1 width3 file">
                        <p className="title essential">로고파일선택</p>
                        <div className="input">
                            {selectedFiles.atchFileSn ? (
                                <p className="file_name" id="fileNamePTag">
                                    {selectedFiles.atchFileNm} - {(selectedFiles.atchFileSz / 1024).toFixed(2)} KB

                                    <button type="button" className="deletBtn white"
                                            onClick={() => setFileDel(selectedFiles.atchFileSn)}  // 삭제 버튼 클릭 시 처리할 함수
                                            style={{marginLeft: '10px', color: 'red'}}
                                    >
                                        삭제
                                    </button>
                                </p>
                            ) : (
                                <p className="file_name" id="fileNamePTag"></p>
                            )}

                            <label>
                                <small className="text btn">파일 선택</small>
                                <input
                                    type="file"
                                    name="logo"
                                    id="logo"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        <span className="warningText">gif,png,jpg 파일 / 권장 사이즈 : 500px * 500px / 용량 : 10M 이하</span>
                    </li>
                    {/*대표자명*/}
                    <li className="inputBox type1 width3">
                        <label className="title essential" htmlFor="rpsvNm"><small>대표자</small></label>
                        <div className="input">
                        <input
                                type="text"
                                name="rpsvNm"
                                id="rpsvNm"
                                defaultValue={relatedDetail.rpsvNm || ""}
                                onChange={(e) =>
                                    setRelatedDetail({ ...relatedDetail, rpsvNm: e.target.value })
                                }
                            />
                        </div>
                    </li>
                    {/*기업대표전화*/}
                    <li className="inputBox type1 width3">
                        <label className="title essential" htmlFor="entTelno"><small>대표번호</small></label>
                        <div className="input">
                            <input
                                type="text"
                                name="entTelno"
                                id="entTelno"
                                maxLength="11"
                                placeholder="숫자만 입력"
                                value={relatedDetail.entTelno || ""}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d*$/.test(inputValue)) { // 숫자만 허용
                                        setRelatedDetail({ ...relatedDetail, entTelno: inputValue });
                                    }
                                }}
                            />
                        </div>
                    </li>
                    {/*기업대표메일*/}
                    <li className="inputBox type1 email width3">
                        <label className="title essential" htmlFor="bzentyEmlId1"><small>대표이메일</small></label>
                        <div className="input">
                            <input
                                type="text"
                                name="bzentyEmlAddr1"
                                id="bzentyEmlAddr1"
                                defaultValue={splitEmail(relatedDetail.bzentyEmlAddr || "")}
                                onChange={(e) =>
                                    setRelatedDetail({ ...relatedDetail, bzentyEmlAddr1: e.target.value })
                                }
                            />
                            <span>@</span>
                            <div className="itemBox">
                                {isCustom ? (
                                    // 직접 입력 시 input으로 변경
                                    <input
                                        type="text"
                                        placeholder="도메인 입력"
                                        value={selectedDomain}
                                        onChange={(e) => setSelectedDomain(e.target.value)}
                                        onBlur={() => {
                                            if (!selectedDomain) {
                                                setIsCustom(false); // 입력 없이 벗어나면 다시 select로 변경
                                            }
                                        }}
                                    />
                                ) : (
                                    // 기본 select 박스
                                    <select className="selectGroup" onChange={handleSelectChange} value={selectedDomain}>
                                        <option value="">선택하세요</option>
                                        <option value="naver.com">naver.com</option>
                                        <option value="gmail.com">gmail.com</option>
                                        <option value="custom">직접 입력</option>
                                    </select>
                                )}

                            </div>
                        </div>
                    </li>
                    {/*기업 홈페이지*/}
                    <li className="inputBox type1 email width3">
                        <label className="title essential" htmlFor="hmpgAddr"><small>홈페이지</small></label>
                        <div className="input">
                            <input
                                type="text"
                                name="hmpgAddr"
                                id="hmpgAddr"
                                defaultValue={relatedDetail.hmpgAddr || ""}
                                onChange={(e) =>
                                    setRelatedDetail({ ...relatedDetail, hmpgAddr: e.target.value })
                                }
                            >
                            </input>
                        </div>
                    </li>
                    {/* 업종 */}
                    <li className="inputBox type1 width3">
                        <label className="title essential" htmlFor="tpbiz"><small>업종</small></label>
                        <div className="itemBox">
                            <select className="selectGroup"
                                    id="tpbiz"
                                    value={relatedDetail.tpbiz || ""}
                                    onChange={(e) =>
                                        setRelatedDetail({...relatedDetail, tpbiz: e.target.value})
                                    }
                            >
                                <option value="">선택</option>
                                {comCdTpbizList.map((item, index) => (
                                    <option key={item.comCd}
                                            value={item.comCd}
                                    >
                                        {item.comCdNm}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </li>
                    {/* 사업자 등록번호 */}
                    <li className="inputBox type1 email width3">
                        <label className="title essential" htmlFor="brno"><small>사업자등록번호</small></label>
                        <div className="input">
                            <small className="text btn" onClick={kbioauth}>기업인증</small>
                            <input
                                type="text"
                                name="brno"
                                id="brno"
                                placeholder="숫자만 입력"
                                defaultValue={relatedDetail.brno || ""}
                                onChange={(e) =>
                                    setRelatedDetail({...relatedDetail, brno: e.target.value})
                                }
                            >
                            </input>
                        </div>
                        <span className="warningText" id="confirmText" style={{display:"none"}}>*인증되었습니다.</span>
                    </li>
                    {/* 주소 */}
                    <li className="inputBox type1 email width3">
                        <label className="title essential" htmlFor="entAddr"><small>주소</small></label>
                        <div className="input">
                            <small className="text btn" onClick={searchAddress}>주소 검색</small>
                            <input
                                type="hidden"
                                name="zip"
                                id="zip"
                                title="우편번호 입력"
                                value={relatedDetail.zip || ""}
                                onChange={(e) =>
                                    setRelatedDetail({
                                        ...relatedDetail,
                                        zip: e.target.value,
                                    })
                                }
                                required
                            />
                            <input
                                type="text"
                                name="entAddr"
                                id="entAddr"
                                title="검색된 주소"
                                value={relatedDetail.entAddr || ""}
                                onChange={(e) =>
                                    setRelatedDetail({
                                        ...relatedDetail,
                                        entAddr: e.target.value,
                                    })
                                }
                                readOnly
                            >
                            </input>
                        </div>
                    </li>
                    {/* 상세주소 */}
                    <li className="inputBox type1 email width3">
                        <label className="title essential" htmlFor="entDaddr"><small>상세주소</small></label>
                        <div className="input">
                            <input
                                type="text"
                                name="entDaddr"
                                id="entDaddr"
                                value={relatedDetail.entDaddr || ""}
                                onChange={(e) =>
                                    setRelatedDetail({ ...relatedDetail, entDaddr: e.target.value })
                                }
                            >
                            </input>
                        </div>
                    </li>
                    {/* 참여기관 */}
                    <li className="inputBox type1 file width3">
                        <p className="title essential" htmlFor="">참여기관 (BI)</p>
                        <div className="input">
                            {selectedBIFiles.atchFileSn ? (
                                <p className="file_name" id="fileBiNamePTag">
                                    {selectedBIFiles.atchFileNm} - {(selectedBIFiles.atchFileSz / 1024).toFixed(2)} KB

                                    <button type="button" className="deletBtn white"
                                            onClick={() => setBiFileDel(selectedBIFiles.atchFileSn)}  // 삭제 버튼 클릭 시 처리할 함수
                                            style={{marginLeft: '10px', color: 'red'}}
                                    >
                                        삭제
                                    </button>
                                </p>
                            ) : (
                                <p className="file_name" id="fileBiNamePTag"></p>
                            )}
                            <label>
                                <small className="text btn">파일 선택</small>
                                <input
                                    type="file"
                                    name="biLogo"
                                    id="biLogo"
                                    onChange={handleBiFileChange}
                                />
                            </label>
                        </div>
                        <span className="warningText">gif,png,jpg 파일 / 권장 사이즈 : 500px * 500px / 용량 : 10M 이하</span>
                    </li>

                    {/* 주요이력 */}
                    <li className="inputBox type1">
                        <label className="title essential" htmlFor="mainHstry"><small>주요이력</small></label>
                        <div className="input">
                            <CommonEditor
                                value={relatedDetail.mainHstry || ""}
                                onChange={(value) => handleChangeField("mainHstry", value)}

                            />
                        </div>
                    </li>

                    {/*증빙자료*/}
                    <li className="inputBox type1 width1 file">
                        <p className="title essential">증빙자료</p>
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
                        {fileList.length > 0 && (
                            <ul>
                                {fileList.map((file, index) =>
                                    file.atchFileSn ? (
                                        <li key={index}>
                                            {file.atchFileNm} - {(file.atchFileSz/ 1024).toFixed(2)} KB
                                            <button
                                                onClick={() => handleDeleteAtchFile(index,file.atchFileSn)}
                                                style={{ marginLeft: '10px', color: 'red' }}
                                            >
                                                삭제
                                            </button>
                                        </li>
                                    ) : (
                                        <li key={index}>
                                            {file.name} - {(file.size / 1024).toFixed(2)} KB
                                            <button
                                                onClick={() => handleDeleteFile(index)}
                                                style={{ marginLeft: '10px', color: 'red' }}
                                            >
                                                삭제
                                            </button>
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                        <span className="warningText">첨부파일은 PDF,HWP,Docx, xls,PPT형식만 가능하며 최대 10MB까지만 지원</span>
                    </li>
                    {/* 공개여부 */}
                    <li className="toggleBox width3">
                        <div className="box">
                            <p className="title essential">공개여부</p>
                            <div className="toggleSwithWrap">
                                <input type="checkbox" id="rlsYn" hidden
                                       checked={relatedDetail.rlsYn === "Y"}
                                       onChange={(e) => {
                                           setRelatedDetail({
                                               ...relatedDetail,
                                               rlsYn: e.target.checked ? "Y" : "N",
                                           })
                                           setIsDatePickerEnabled(e.target.checked);
                                       }}/>
                                <label htmlFor="rlsYn" className="toggleSwitch">
                                    <span className="toggleButton"></span>
                                </label>
                            </div>
                        </div>
                        <span className="warningText">
                            On : 기관소개 메뉴에 기관 정보가 노출됩니다.
                            <br/>
                            Off : 기관소개 메뉴에 기관 정보가 노출되지 않습니다.
                        </span>
                    </li>

                    <li className="inputBox type1 width3">
                        <label className="title" htmlFor="ntcBgngDt"><small>공개 시작일</small></label>
                        <div className="input" >
                            <input
                                type="date"
                                name="rlsBgngYmd"
                                value={formatYmdForInput(relatedDetail.rlsBgngYmd) || ""}
                                onChange={(e) => {
                                    const selectedDate = e.target.value;
                                    const formattedDate = selectedDate.replace(/-/g, '');
                                    setRelatedDetail({
                                        ...relatedDetail,
                                        rlsBgngYmd: formattedDate,
                                    });
                                }}
                                disabled={!isDatePickerEnabled}
                            />
                        </div>
                    </li>
                    <li className="inputBox type1 width3">
                        <label className="title" htmlFor="ntcEndDate"><small>공개 종료일</small></label>
                        <div className="input">
                            <input
                                type="date"
                                name="rlsEndYmd"
                                value={formatYmdForInput(relatedDetail.rlsEndYmd) || ""}
                                onChange={(e) => {
                                    const selectedDate = e.target.value;
                                    const formattedDate = selectedDate.replace(/-/g, '');
                                    setRelatedDetail({
                                        ...relatedDetail,
                                        rlsEndYmd: formattedDate,
                                    });
                                }}
                                disabled={!isDatePickerEnabled}
                            />
                        </div>
                    </li>

                    {/* 산하직원 가입여부 */}
                    <li className="toggleBox width3">
                        <div className="box">
                            <p className="title essential">산하직원 가입여부</p>
                            <div className="toggleSwithWrap">
                                <input type="checkbox" id="empJoinYn" hidden
                                       checked={relatedDetail.empJoinYn === "Y"}
                                       onChange={(e) => {
                                           setRelatedDetail({
                                               ...relatedDetail,
                                               empJoinYn : e.target.checked ? "Y" : "N"
                                           })
                                       }}
                                />
                                <label htmlFor="empJoinYn" className="toggleSwitch">
                                    <span className="toggleButton"></span>
                                </label>
                            </div>
                        </div>
                        <span className="warningText">
                            On : 회원가입시 직원들이 해당 기업을 선택가능하도록 노출됩니다.
                            <br/>
                            Off : 회원가입시 직원들이 해당 기업을 선택하지 못하도록 비활성화 처리됩니다.
                        </span>
                    </li>
                </ul>

                {/* <!--// 버튼영역 --> */}
                <div className="buttonBox">
                    <div className="leftBox">
                        <button
                            type="button" className="clickBtn point"
                            onClick={()=>updateRelated()}
                        >
                            저장
                        </button>
                        {modeInfo.mode === "modify" && (
                            <button
                                type="button"
                                className="clickBtn gray"
                                onClick={()=>setRcActvtnYn()}
                            >
                                <span>삭제</span>
                            </button>
                        )}
                    </div>
                    <Link
                        to={URL.MANAGER_RELATED_ORGANIZATION}
                    >
                        <button type="button" className="clickBtn black">
                            <span>목록</span>
                        </button>
                    </Link>

                </div>
                {/* <!--// 버튼영역 --> */}

            </div>
        </div>
        </div>
    );

}

export default RelatedCompanyCreate;