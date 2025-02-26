import React, {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate, NavLink, useLocation, Link} from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";
import Swal from "sweetalert2";
import CommonEditor from "@/components/CommonEditor";
import {useDropzone} from "react-dropzone";
import { getSessionItem } from "@/utils/storage";
import {getComCdList} from "../../../components/CommonComponents.jsx";



function ResidentMemberCreateContent(props){
    const location = useLocation();
    const [modeInfo, setModeInfo] = useState({ mode: location.state?.mode });
    const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(true);
    const navigate = useNavigate();
    const [residentDetail, setResidentDetail] = useState({});
    const [searchDto, setSearchDto] = useState({mvnEntSn : location.state?.mvnEntSn});
    const [acceptFileTypes, setAcceptFileTypes] = useState('jpg,jpeg,png,gif,bmp,tiff,tif,webp,svg,ico,heic,avif');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imgFile, setImgFile] = useState("");
    const [fileList, setFileList] = useState([]);
    const sessionUser = getSessionItem("loginUser");
    /*기업분류*/
    const [comCdList, setComCdList] = useState([]);
    /*기업업종*/
    const [comCdTpbizList, setComCdTpbizList] = useState([]);


    //const isFirstRender = useRef(true);


    const initMode = () => {
        setModeInfo({
            ...modeInfo,
            modeTitle: "등록",
            editURL: `/mvnEntApi/setMvnEnt`,
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

    const handleDeleteFile = (index) => {
        const updatedFileList = fileList.filter((_, i) => i !== index);
        setFileList(updatedFileList);  // 파일 리스트 업데이트
    };

    const formatYmdForInput = (dateStr) => {
        if (!dateStr || dateStr.length !== 8) return "";
        return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
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

    const isFirstRender = {
        bzentyExpln: useRef(true),
        mainHstry: useRef(true)
    };

    const handleChangeField = (fieldName, value) => {
        if (isFirstRender[fieldName].current) {
            isFirstRender[fieldName].current = false;
            return;
        }
        setResidentDetail(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };


    //수정 시 데이터 조회
    const getRc = (searchDto) =>{
        // 등록 시 조회 안함
        if (modeInfo.mode === CODE.MODE_CREATE) {
            return;
        }

        const getRcURL = '/mvnEntApi/getRc';
        const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getRcURL, requestOptions, function (resp){

            if(modeInfo.mode === CODE.MODE_MODIFY){
                setResidentDetail({...resp.result.rc,
                                        mdfrSn : sessionUser.userSn,
                                        mdfcnDt: new Date().toISOString()});

                if(resp.result.logoFile){
                    setSelectedFiles(resp.result.logoFile);
                }

                if(resp.result.mvnEntAtchFile){
                    setFileList(resp.result.mvnEntAtchFile);
                }

                if(resp.result.rc.actvtnYn == "Y"){
                    setIsDatePickerEnabled(true);
                }else{
                    setIsDatePickerEnabled(false);
                }

            }

        });



    }

    const handleFileChange = (e) => {

        if(selectedFiles != null && selectedFiles.length > 0){
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
        if (residentDetail?.bzentyEmlAddr) {
            const email = residentDetail.bzentyEmlAddr;
            const domain = email.split("@")[1] || "";

            if (["naver.com", "gmail.com"].includes(domain)) {
                setSelectedDomain(domain);
                setIsCustom(false);
            } else {
                setSelectedDomain(domain);
                setIsCustom(true);
            }
        }
    }, [residentDetail]);

    const [emailAddr, setEmailAddr] = useState("");

    useEffect(() => {
        if (residentDetail.bzentyEmlAddr1 && selectedDomain) {
            const newEmail = `${residentDetail.bzentyEmlAddr1}@${selectedDomain}`;
            setEmailAddr(newEmail);
            setResidentDetail(prev => ({
                ...prev,
                bzentyEmlAddr: newEmail
            }));
        }
    }, [residentDetail.bzentyEmlAddr1, selectedDomain]);

    /*useEffect(() => {
        console.log("email :", emailAddr);
        console.log("residentDetail:", residentDetail);
        console.log("selectedFiles:", selectedFiles);
        console.log("fileList:", fileList);

    }, [residentDetail],[selectedFiles],[fileList]);*/


    useEffect(() => {
    }, [selectedFiles]);

    useEffect(() => {
        getComCdList(17).then((data) => {
            setComCdList(data);
        })
    }, []);

    //setComCdTpbizList
    useEffect(() => {
        getComCdList(18).then((data) => {
            setComCdTpbizList(data);
        })
    }, []);

    //사업자번호 상태 확인
    const kbioauth = async () => {
        //const businessNumber = `${residentDetail.brno1}-${residentDetail.brno2}-${residentDetail.brno3}`;
        const businessNumber = `${residentDetail.brno}`;

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
                setResidentDetail({...residentDetail, brno: businessNumber});
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
                setResidentDetail({
                    ...residentDetail,
                    zip: postcode,
                    entAddr: searchAddress,
                });
            },
        }).open();
    };




    //등록and수정
    const updateResident = () => {
        let requestOptions = {};

        if (!residentDetail.brno) {
            alert("사업자번호를 입력해주세요.");
            return false;
        }
        if (!residentDetail.brno) {
            alert("사업자번호 인증을 진행해주십시오.");
            return false;
        }
        if (!residentDetail.mvnEntNm) {
            alert("기업명을 입력해주세요.");
            return false;
        }
        if (!residentDetail.rpsvNm) {
            alert("대표자명을 입력해주세요.");
            return false;
        }
        if(modeInfo.mode === CODE.MODE_MODIFY){
            if (!residentDetail.bzentyEmlAddr) {
                alert("이메일 주소를 입력해주세요.");
                return false;
            }
        }else{
            if (!residentDetail.rpsvNm || emailAddr.trim() === "") {
                alert("이메일 주소를 입력해주세요.");
                return false;
            }
        }
        if(!residentDetail.entClsf) {
            alert("기업분류를 선택해주세요.");
            return false;
        }
        if(!residentDetail.entTpbiz) {
            alert("업종을 선택해주세요.");
            return false;
        }
        if(!residentDetail.bzentyExpln) {
            alert("기업소개를 입력해주세요.");
            return false;
        }

        if(!residentDetail.mainHstry) {
            alert("주요이력을 입력해주세요.");
            return false;
        }

        if (!residentDetail.zip || !residentDetail.entAddr) {
            alert("주소를 입력해주세요.");
            return false;
        }
        if (!residentDetail.entDaddr) {
            alert("세부주소를 입력해주십시오.");
            return false;
        }
        if (!residentDetail.entTelno) {
            alert("대표번호를 입력해주세요.");
            return false;
        }
        if (!residentDetail.actvtnYn) {
            alert("공개여부를 선택해주세요.");
            return false;
        }

        if(residentDetail.actvtnYn === 'Y'){
            if(!residentDetail.rlsBgngYmd || !residentDetail.rlsEndYmd){
                alert("공개기한을 선택해주세요.")
                return false;
            }
        }



        setResidentDetail({...residentDetail});

        const formData = new FormData();

        //로고
        /*selectedFiles.map((file) => {
            formData.append("files", file);
        })*/
        Array.from(selectedFiles).map((file) => {
            formData.append("files", file);
        });


        fileList.map((file) => {
            formData.append("mvnEntAtchFiles",file);
        })

        /*for (let key in residentDetail) {
            formData.append(key, residentDetail[key]);
        }*/
        for (let key in residentDetail) {
            const value = residentDetail[key];
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value);
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
                    /*headers: {
                        "Content-type": "application/json",
                    },*/
                    //body: JSON.stringify(residentDetail),
                    body: formData
                };

                EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("등록되었습니다.");
                        navigate(URL.MANAGER_OPERATIONAL_SUPPORT);
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




    return(
        <div className="inner">
                <h2 className="pageTitle">
                    <p>입주기업관리</p>
                </h2>
            
            <div className="contBox infoWrap customContBox">
                <div className="topTitle">입주기업 정보</div>
                <ul className="inputWrap">
                    {/* 기업분류 */}
                    <li className="inputBox type1 width3">
                        <label className="title essential" htmlFor="mvnEntType"><small>분류</small></label>
                        <div className="itemBox">
                            <select className="selectGroup"
                                    id="entClsf"
                                    value={residentDetail.entClsf || ""}
                                    onChange={(e) =>
                                            setResidentDetail({...residentDetail,entClsf : e.target.value})
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
                        <label className="title essential" htmlFor="mvnEntNm"><small>기업명</small></label>
                        <div className="input">
                            <input
                                type="text"
                                name="mvnEntNm"
                                id="mvnEntNm"
                                defaultValue={residentDetail.mvnEntNm || ""}
                                onChange={(e) =>
                                    setResidentDetail({ ...residentDetail, mvnEntNm: e.target.value })
                                }
                            />
                        </div>
                    </li>
                    {/*로고*/}
                    <li className="inputBox type1 width3 file">
                        <p className="title essential">로고파일선택</p>
                        <div className="input">
                            {selectedFiles&& selectedFiles.atchFileSn ? (
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
                            {/*<p className="file_name" id="fileNamePTag"></p>
                            <label>
                            <small className="text btn">파일 선택</small>
                            <input
                                type="file"
                                name="logo"
                                id="logo"
                                onChange={handleFileChange}
                            />
                            </label>*/}
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
                                defaultValue={residentDetail.rpsvNm || ""}
                                onChange={(e) =>
                                    setResidentDetail({ ...residentDetail, rpsvNm: e.target.value })
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
                                value={residentDetail.entTelno || ""}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d*$/.test(inputValue)) { // 숫자만 허용
                                        setResidentDetail({ ...residentDetail, entTelno: inputValue });
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
                                defaultValue={splitEmail(residentDetail.bzentyEmlAddr || "")}
                                onChange={(e) =>
                                    setResidentDetail({ ...residentDetail, bzentyEmlAddr1: e.target.value })
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
                                defaultValue={residentDetail.hmpgAddr || ""}
                                onChange={(e) =>
                                    setResidentDetail({ ...residentDetail, hmpgAddr: e.target.value })
                                }
                            >
                            </input>
                        </div>
                    </li>
                    {/* 업종 */}
                    <li className="inputBox type1 width3">
                        <label className="title essential" htmlFor="clsNm"><small>업종</small></label>
                        <div className="itemBox">
                            <select className="selectGroup"
                                    id="entClsf"
                                    value={residentDetail.entTpbiz || ""}
                                    onChange={(e) =>
                                        setResidentDetail({...residentDetail,entTpbiz : e.target.value})
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
                                defaultValue={residentDetail.brno || ""}
                                onChange={(e) =>
                                    setResidentDetail({ ...residentDetail, brno: e.target.value })
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
                                value={residentDetail.zip || ""}
                                onChange={(e) =>
                                    setResidentDetail({
                                        ...residentDetail,
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
                                value={residentDetail.entAddr || ""}
                                onChange={(e) =>
                                    setResidentDetail({
                                        ...residentDetail,
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
                                value={residentDetail.entDaddr || ""}
                                onChange={(e) =>
                                    setResidentDetail({ ...residentDetail, entDaddr: e.target.value })
                                }
                            >
                            </input>
                        </div>
                    </li>
                    {/* 참여기관 */}
                    <li className="inputBox type1 email width3">
                        <label className="title essential" htmlFor=""><small>참여기관 (BI)</small></label>
                        <div className="input">
                            <input
                                type="text"
                            >
                            </input>
                        </div>
                    </li>
                    {/* 기업소개 */}
                    <li className="inputBox type1">
                        <label className="title essential" htmlFor=""><small>기업소개</small></label>
                        <div className="input">
                            <CommonEditor
                                value={residentDetail.bzentyExpln || ""}
                                onChange={(value) => handleChangeField("bzentyExpln", value)}
                            />
                        </div>
                    </li>
                    {/* 주요이력 */}
                    <li className="inputBox type1">
                        <label className="title essential" htmlFor=""><small>주요이력</small></label>
                        <div className="input">
                            <CommonEditor
                            value={residentDetail.mainHstry || ""}
                            onChange={(value) => handleChangeField("mainHstry", value)}
                            />
                        </div>
                    </li>

                    {/*증빙자료*/}
                    <li className="inputBox type1 width1 file">
                        <p className="title essential">증빙자료</p>
                        {/*<div className="input">
                            <p className="file_name" id="fileNamePTag"></p>
                            <label>
                            <small className="text btn">파일 선택</small>
                            <input
                                type="file"
                                onChange={handleFileChange}
                            />
                            </label>
                        </div>*/}
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
                                <input type="checkbox" id="actvtnYn" hidden
                                       checked={residentDetail.actvtnYn === "Y"}
                                       onChange={(e) => {
                                           setResidentDetail({
                                               ...residentDetail,
                                               actvtnYn: e.target.checked ? "Y" : "N",
                                           })
                                           setIsDatePickerEnabled(e.target.checked);
                                       }}/>
                                <label htmlFor="actvtnYn" className="toggleSwitch">
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
                                value={formatYmdForInput(residentDetail.rlsBgngYmd) || ""}
                                onChange={(e) => {
                                    const selectedDate = e.target.value;
                                    const formattedDate = selectedDate.replace(/-/g, '');
                                    setResidentDetail({
                                        ...residentDetail,
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
                            value={formatYmdForInput(residentDetail.rlsEndYmd) || ""}
                            onChange={(e) => {
                                const selectedDate = e.target.value;
                                const formattedDate = selectedDate.replace(/-/g, '');
                                setResidentDetail({
                                    ...residentDetail,
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
                                <input type="checkbox" id="joinYn" hidden/>
                                <label htmlFor="joinYn" className="toggleSwitch">
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
                        onClick={()=>updateResident()}
                    >
                        저장
                    </button>
                        <button
                            type="button"
                            className="clickBtn gray"
                        >
                            <span>삭제</span>
                        </button>
                    </div>
                    <Link
                        to={URL.MANAGER_OPERATIONAL_SUPPORT}
                    >
                        <button type="button" className="clickBtn black">
                            <span>목록</span>
                        </button>
                    </Link>

                </div>
                {/* <!--// 버튼영역 --> */}
                
            </div>
        </div>
    );

}

export default ResidentMemberCreateContent;