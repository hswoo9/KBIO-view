import React, {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate, NavLink, useLocation, Link} from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";
import Swal from "sweetalert2";
import CommonEditor from "@/components/CommonEditor";



function ResidentMemberCreateContent(props){
    const location = useLocation();
    const [modeInfo, setModeInfo] = useState({ mode: location.state?.mode });

    const navigate = useNavigate();
    const [residentDetail, setResidentDetail] = useState({});
    const [searchDto, setSearchDto] = useState({mvnEntSn : location.state?.mvnEntSn});
    const [acceptFileTypes, setAcceptFileTypes] = useState('jpg,jpeg,png,gif,bmp,tiff,tif,webp,svg,ico,heic,avif');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imgFile, setImgFile] = useState("");
    const isFirstRender = useRef(true);


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

    const handleChange = (value) => {
        if(isFirstRender.current){
            isFirstRender.current = false;
            return;
        }
        setResidentDetail({...residentDetail, bzentyExpln: value});
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
                setResidentDetail(resp.result.rc);
            }
        });



    }

    const handleFileChange = (e) => {

        if(residentDetail.tblComFiles != null && residentDetail.tblComFiles.length > 0){
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

    useEffect(() => {
    }, [selectedFiles]);


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


    //등록and수정
    const updateResident = () => {
        let requestOptions = {};

        if (!residentDetail.brno) {
            alert("사업자번호는 필수 값입니다.");
            return false;
        }
        if (!residentDetail.brno) {
            alert("사업자번호 인증을 진행해주십시오.");
            return false;
        }
        if (!residentDetail.mvnEntNm) {
            alert("기업명은 필수 값입니다.");
            return false;
        }
        if (!residentDetail.rpsvNm) {
            alert("대표자명은 필수 값입니다.");
            return false;
        }
        if (!emailAddr || emailAddr.trim() === "") {
            alert("이메일 주소를 입력해주세요.");
            return false;
        }
        /*if (!residentDetail.clsNm) {
            alert("산업은 필수 값입니다.");
            return false;
        }*/
        if (!residentDetail.zip || !residentDetail.entAddr) {
            alert("주소는 필수 값입니다.");
            return false;
        }
        if (!residentDetail.entDaddr) {
            alert("세부주소를 입력해주십시오.");
            return false;
        }
        if (!residentDetail.entTelno) {
            alert("대표번호는 필수 값입니다.");
            return false;
        }



        setResidentDetail({...residentDetail});

        const formData = new FormData();

        for (let key in residentDetail) {
            formData.append(key, residentDetail[key]);
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
                    body: JSON.stringify(residentDetail),
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
                            <select className="selectGroup">
                                <option value="0">전체</option>
                                <option value="1">예시1</option>
                                <option value="2">예시2</option>
                                <option value="3">예시3</option>
                                <option value="4">예시4</option>
                                <option value="5">예시5</option>
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
                        <p className="title essential">파일선택</p>
                        <div className="input">
                            <p className="file_name" id="fileNamePTag"></p>
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
                            <select className="selectGroup">
                                <option value="0">전체</option>
                                <option value="1">예시1</option>
                                <option value="2">예시2</option>
                                <option value="3">예시3</option>
                                <option value="4">예시4</option>
                                <option value="5">예시5</option>
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
                                onChange={handleChange}
                            />
                        </div>
                    </li>
                    {/* 주요이력 */}
                    <li className="inputBox type1">
                        <label className="title essential" htmlFor=""><small>주요이력</small></label>
                        <div className="input">
                            <textarea
                                type="text"
                            >
                            </textarea>
                        </div>
                    </li>
                    {/*증빙자료*/}
                    <li className="inputBox type1 width3 file">
                        <p className="title essential">증빙자료</p>
                        <div className="input">
                            <p className="file_name" id="fileNamePTag"></p>
                            <label>
                            <small className="text btn">파일 선택</small>
                            <input
                                type="file"
                                onChange={handleFileChange}
                            />
                            </label>
                        </div>
                        <span className="warningText">첨부파일은 PDF,HWP,Docx, xls,PPT형식만 가능하며 최대 10MB까지만 지원</span>
                    </li>
                    {/* 공개여부 */}
                    <li className="toggleBox width3">
                        <div className="box">
                            <p className="title essential">공개여부</p>
                            <div className="toggleSwithWrap">
                                <input type="checkbox" id="actvtnYn" hidden/>
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