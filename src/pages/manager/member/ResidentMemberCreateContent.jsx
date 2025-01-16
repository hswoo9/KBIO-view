import {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate, NavLink, useLocation} from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";
import Swal from "sweetalert2";



function ResidentMemberCreateContent(props){
    const location = useLocation();
    const [modeInfo, setModeInfo] = useState({ mode: location.state?.mode });

    const navigate = useNavigate();
    const [residentDetail, setResidentDetail] = useState({});
    const [searchDto, setSearchDto] = useState({mvnEntSn : location.state?.mvnEntSn});


    const initMode = () => {
        setModeInfo({
            ...modeInfo,
            modeTitle: "등록",
            editURL: `/mvnEntApi/setMvnEnt`,
        });

        getRc(searchDto);
    };

    function splitBrno(brno) {
        if (!brno || brno.length < 10) {
            console.error("Invalid brno length or undefined value.");
            return { brno1: "", brno2: "", brno3: "" }; // 기본값 반환
        }

        return {
            brno1: brno.slice(0, 3), // 앞 3자리
            brno2: brno.slice(3, 5), // 중간 2자리
            brno3: brno.slice(5),    // 마지막 5자리
        };
    }

    const getRc = (searchDto) =>{
        console.log("state : ",searchDto);
        if (modeInfo.mode === CODE.MODE_CREATE) {
            console.log("residentDetail",residentDetail);
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

                const brno = resp.result.rc.brno;
                const { brno1, brno2, brno3 } = splitBrno(brno);
                const updatedRc = {
                    ...resp.result.rc,
                    brno1,
                    brno2,
                    brno3,
                };
                setResidentDetail(updatedRc);


                console.log("resp.result.rc",resp.result.rc);
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
            console.log("카카오 주소 검색 API가 로드되었습니다.");
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    //사업자번호 상태 확인
    const kbioauth = async () => {
        const businessNumber = `${residentDetail.brno1}-${residentDetail.brno2}-${residentDetail.brno3}`;
        const businessNo = `${residentDetail.brno1}${residentDetail.brno2}${residentDetail.brno3}`;

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
                setResidentDetail({...residentDetail, brno: businessNo});
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

        if (!residentDetail.brno1 || !residentDetail.brno2 || !residentDetail.brno3) {
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
        if (!residentDetail.clsNm) {
            alert("산업은 필수 값입니다.");
            return false;
        }
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

        const brno = `${residentDetail.brno1}${residentDetail.brno2}${residentDetail.brno3}`;
        setResidentDetail({...residentDetail, brno: brno});

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
                        navigate(URL.MANAGER_RESIDENT_COMPANY);
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
                    <label htmlFor="entTelno">대표번호</label>
                    <span className="req">필수</span>
                </dt>
                <dd>
                    <input
                        className="f_input2 w_full"
                        type="text"
                        name="entTelno"
                        maxLength="11"
                        value={residentDetail.entTelno || ""}
                        style={{width: "80%", marginRight: "5px"}}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (/^\d*$/.test(inputValue)) { // 숫자만 허용
                                setResidentDetail({ ...residentDetail, entTelno: inputValue });
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
                    <NavLink
                        to={URL.MANAGER_RESIDENT_COMPANY}
                        className="btn btn_skyblue_h46 w_100"
                        style={{width: "10%"}}
                    >
                        목록
                    </NavLink>
                </div>
                {/* <!--// 버튼영역 --> */}
                
            </div>
        </div>
    );

}

export default ResidentMemberCreateContent;