import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";

import { setSessionItem } from "@/utils/storage";


function ResidentMemberCreateContent(props){
    const [modeInfo, setModeInfo] = useState({ mode: props.mode });
    const navigate = useNavigate();
    const [residentDetail, setResidentDetail] = useState({
        
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

    const kbioauth = async () => {
        const businessNumber = `${residentDetail.brno1}-${residentDetail.brno2}-${residentDetail.brno3}`;

        console.log(businessNumber);

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
            console.error("Error fetching business status:", error);
            alert("사업자 등록번호 조회에 실패했습니다.");
        }
    };

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

    const formValidator = (formData) =>{
        return new Promise((resolve) => {
        if (formData.get("brno1") === null || formData.get("brno1") === "" ||
            formData.get("brno2") === null || formData.get("brno2") === "" ||
            formData.get("brno3") === null || formData.get("brno3") === "") {
            alert("사업자번호는 필수 값입니다.");
            return false;
        }
        if (formData.get("mvnEntNm") === null || formData.get("mvnEntNm") === "") {
            alert("기업명은 필수 값입니다.");
            return false;
        }
        if (formData.get("rpsvNm") === null || formData.get("rpsvNm") === "") {
            alert("대표자명은 필수 값입니다.");
            return false;
        }
        if (formData.get("clsNm") === null || formData.get("clsNm") === "") {
            alert("산업은 필수 값입니다.");
            return false;
        }
        if (formData.get("zip") === null || formData.get("zip") === ""
            || formData.get("entAddr") === null || formData.get("entAddr") === "") {
            alert("주소는 필수 값입니다.");
            return false;
        }
        if (formData.get("entDaddr") === null || formData.get("entDaddr") === "") {
            alert("세부주소를 입력해주십시오.");
            return false;
        }
        if (formData.get("entTelNo") === null || formData.get("entTelNo") === "") {
            alert("대표번호는 필수 값입니다.");
            return false;
        }
        /*if (formData.get("bzentyEmlAddr") === null || formData.get("bzentyEmlAddr") === "") {
            alert("기업메일은 필수 값입니다.");
            return false;
        }*/
            resolve(true);
        });
    };

    const updateResident = () => {
        //let modeStr = modeInfo.mode === CODE.MODE_CREATE ? "POST" : "PUT";
        let modeStr = "POST";
        let requestOptions = {};
        console.log("modeStr", modeStr);

        const brno = `${residentDetail.brno1}-${residentDetail.brno2}-${residentDetail.brno3}`;
        setResidentDetail({...residentDetail, brno: brno});



        if (modeStr === "POST") {
            const formData = new FormData();
            for (let key in residentDetail) {
                formData.append(key, residentDetail[key]);
            }

            formValidator(formData).then((res) => {
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }
            });
        }

    };

    /*useEffect(() => {
        initMode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);*/


    return(
        <div className="contents" style={{width:"100%"}} id="contents">
            <div className="top_tit">
                <h2 className="tit_2">입주기업등록</h2>
            </div>
            
            <div className="board_view2">
                {/* 기업정보 섹션 */}
                <div style={{borderTop: "1px solid #ddd", paddingTop: "20px", marginTop: "20px"}}>
                    <h3 style={{fontSize: "18px", fontWeight: "bold", marginBottom: "10px"}}>기업정보</h3>
            {/* 사업자 등록번호 */}
            <dl style={{borderTop:"1px solid #dde2e5"}}>
                <dt>
                    <label htmlFor="brno">사업자 등록번호</label>
                    <span className="req">필수</span>
                </dt>
                <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="brno1"
                        maxLength="3"
                        value={residentDetail.brno1 || ""}
                        style={{width: "100px", marginRight: "5px"}}
                        onChange={(e) =>
                            setResidentDetail({ ...residentDetail, brno1: e.target.value })
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
                        name="brno2"
                        maxLength="2"
                        value={residentDetail.brno2 || ""}
                        style={{width: "70px", margin: "0 5px"}}
                        onChange={(e) =>
                            setResidentDetail({ ...residentDetail, brno2: e.target.value })
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
                        name="brno3"
                        maxLength="5"
                        value={residentDetail.brno3 || ""}
                        style={{width: "130px", marginLeft: "5px"}}
                        onChange={(e) =>
                            setResidentDetail({ ...residentDetail, brno3: e.target.value })
                        }
                    />
                    <button
                        className="btn btn_skyblue_h46"
                        type="button"
                        onClick={kbioauth}
                        style={{marginLeft: "10px"}}
                    >
                        사업자번호 인증
                    </button>
                    <span id="confirmText"
                        style={{display:"none", fontSize:"13px", marginTop:"10px", marginLeft:"10px"}}
                    >
                        * 인증되었습니다.
                    </span>
                </dd>
            </dl>

            {/* 기업명 */}
            <dl>
                <dt>
                    <label htmlFor="mvnEntNm">기업명</label>
                    <span className="req">필수</span>
                </dt>
                <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="mvnEntNm"
                        value={residentDetail.mvnEntNm || ""}
                        style={{width: "80%", marginRight: "5px"}}
                        onChange={(e) =>
                            setResidentDetail({ ...residentDetail, mvnEntNm: e.target.value })
                        }
                    />
                </dd>
            </dl>

            {/* 대표자 */}
            <dl>
                <dt>
                    <label htmlFor="rpsvNm">대표자</label>
                    <span className="req">필수</span>
                </dt>
                <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="rpsvNm"
                        value={residentDetail.rpsvNm || ""}
                        style={{width: "80%", marginRight: "5px"}}
                        onChange={(e) =>
                            setResidentDetail({ ...residentDetail, rpsvNm: e.target.value })
                        }
                    />
                </dd>
            </dl>

            {/* 산업 */}
            <dl>
                <dt>
                    <label htmlFor="clsNm">산업</label>
                    <span className="req">필수</span>
                </dt>
                <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="clsNm"
                        value={residentDetail.clsNm || ""}
                        style={{width: "80%", marginRight: "5px"}}
                        onChange={(e) =>
                            setResidentDetail({ ...residentDetail, clsNm: e.target.value })
                        }
                    />
                </dd>
            </dl>

            {/* 주소 */}
            <dl>
                <dt>
                    <label htmlFor="entAddr">주소</label>
                    <span className="req">필수</span>
                </dt>
                <dd>
                <div>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="zip"
                        title="우편번호 입력"
                        id="zip"
                        value={residentDetail.zip || ""}
                        onChange={(e) =>
                            setResidentDetail({
                                ...residentDetail,
                                zip: e.target.value,
                            })
                        }
                        style={{width: "50%"}}
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
                            name="entAddr"
                            title="검색된 주소"
                            id="entAddr"
                            value={residentDetail.entAddr || ""}
                            onChange={(e) =>
                                setResidentDetail({
                                    ...residentDetail,
                                    entAddr: e.target.value,
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
                            name="entDaddr"
                            title="상세주소 입력"
                            id="entDaddr"
                            value={residentDetail.entDaddr || ""}
                            onChange={(e) =>
                                setResidentDetail({
                                    ...residentDetail,
                                    entDaddr: e.target.value,
                                })
                            }
                            style={{width: "100%"}}
                            required
                        />
                    </dd>
            </dl>

            {/* 대표번호 */}
            <dl>
                <dt>
                    <label htmlFor="entTelNo">대표번호</label>
                    <span className="req">필수</span>
                </dt>
                <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="entTelNo"
                        maxLength="11"
                        value={residentDetail.entTelNo || ""}
                        style={{width: "80%", marginRight: "5px"}}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (/^\d*$/.test(inputValue)) { // 숫자만 허용
                                setResidentDetail({ ...residentDetail, entTelNo: inputValue });
                            }
                        }}
                    />
                </dd>
            </dl>

            {/* 기업메일 */}
            <dl>
                <dt>
                    <label htmlFor="bzentyEmlAddr">기업메일</label>
                </dt>
                <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="bzentyEmlAddr"
                        value={residentDetail.bzentyEmlAddr || ""}
                        style={{width: "80%", marginRight: "5px"}}
                        onChange={(e) =>
                            setResidentDetail({ ...residentDetail, bzentyEmlAddr: e.target.value })
                        }
                    />
                </dd>
            </dl>
                </div>
                
                {/* <!--// 버튼영역 --> */}
                <div className="board_btn_area" style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop:"20px" }}>
                    <button
                        className="btn btn_skyblue_h46 w_100"
                        style={{width: '10%', color:"#fff", backgroundColor:"#169bd5"}}
                        onClick={()=>updateResident()}
                    >
                        등록
                    </button>
                    <button
                        className="btn btn_skyblue_h46 w_100"
                        style={{width: "10%"}}
                    >
                        목록
                    </button>
                </div>
                {/* <!--// 버튼영역 --> */}
                
            </div>
        </div>
    );

}

export default ResidentMemberCreateContent;