import ManagerMatching from "./ManagerMatching.jsx";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as ComScript from "@/components/CommonScript";
import ManagerLeft from "@/components/manager/ManagerLeftConsulting";
import EgovPaging from "@/components/EgovPaging";
import CommonEditor from "@/components/CommonEditor";

import Swal from 'sweetalert2';
import base64 from 'base64-js';
import ManagerCnslttCnsltList from "./ManagerCnslttCnsltList.jsx";
import {getComCdList} from "@/components/CommonComponents";
import ManagerCnslttSimple from "./ManagerCnslttSimple.jsx";

function ManagerConsultuntDetail(props) {
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(0);
    const tabs = ['개인정보', '컨설팅의뢰', '간편상담'];

    const [searchDto, setSearchDto] = useState({
        userSn: location.state?.userSn
    });
    const [comCdList, setComCdList] = useState([]);
    const [consultantDetail, setConsultantDetail] = useState({});
    const [memberDetail, setMemberDetail] = useState({});
    const [cnsltProfileFile, setCnsltProfileFile] = useState(null);
    const [cnsltCertificateFile , setCnsltCertificateFile] = useState([]);

    const decodePhoneNumber = (encodedPhoneNumber) => {
        const decodedBytes = base64.toByteArray(encodedPhoneNumber);
        return new TextDecoder().decode(decodedBytes);
    };

    const isFirstRender = useRef(true);
    const handleChange = (value) => {
        if(isFirstRender.current){
          isFirstRender.current = false;
          return;
        }
        setConsultantDetail({...consultantDetail, cnsltSlfint: value});
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

    const setCnslttMbrActv = (e) =>{
        const setCnslttMbrActvUrl = "/consultingApi/setCnslttMbrActv";
        let requestOptions = {};

        if(!memberDetail.kornFlnm) {
            alert("성명을 입력해주세요.")
            return false;
        }

        if(!consultantDetail.cnsltFld) {
            alert("자문분야를 선택해주세요.")
            return false;
        }

        if(!memberDetail.mblTelno) {
            alert("전화번호를 입력해주세요.")
            return false;
        }

        if(!memberDetail.emailPrefix || !memberDetail.emailDomain) {
            alert("이메일을 입력해주세요.")
            return false;
        }

        if(!memberDetail.addr){
            alert("주소를 입력해주세요.")
            return false;
        }

        if(!memberDetail.daddr){
            alert("상세주소를 입력해주세요.")
        }

        if(!consultantDetail.ogdpNm) {
            alert("소속을 입력해주세요.");
            return false;
        }

        if(!consultantDetail.jbpsNm) {
            alert("직위를 입력해주세요.");
            return false;
        }

        if(!consultantDetail.crrPrd) {
            alert("경력을 입력해주세요.");
            return false;
        }

        if(!consultantDetail.cnsltArtcl) {
            alert("컨설팅항목을 입력해주세요.");
            return false;
        }

        if(!consultantDetail.cnsltSlfint) {
            alert("소개를 입력해주세요.");
            return false;
        }

        if(!consultantDetail.cnsltActv){
            alert("활동여부를 선택해주세요.");
            return false;
        }

        const formData = new FormData();

        for(let key in memberDetail) {
            const value = memberDetail[key];
            if(value != null && value !== undefined && value !== ''){
                formData.append(key, value);
            }
        }

        for(let key in consultantDetail) {
            const value = consultantDetail[key];
            if(value != null && value !== undefined && value !== ''){
                formData.append(key, value);
            }
        }


        Swal.fire({
            title: "수정하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if(result.isConfirmed) {
                requestOptions = {
                    method: "POST",
                    body: formData
                };

                console.log("formData : ",requestOptions.body);

                EgovNet.requestFetch(setCnslttMbrActvUrl,requestOptions, (resp) =>{
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("수정되었습니다.");
                        window.location.reload();
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                 });

            }else{
                //취소
            }
        });
    }

    const handleDownload = (file) => {

        const downloadUrl = `http://133.186.250.158${file.atchFilePathNm}/${file.strgFileNm}.${file.atchFileExtnNm}`; // 실제 파일 경로로 변경

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.atchFileNm; // 파일명을 다운로드할 이름으로 지정
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const getComCdListToHtml = (dataList) => {
        if (!dataList || dataList.length === 0) return null;

        return (
            <select
                className="selectGroup"
                name="cnsltFld"
                value={consultantDetail.cnsltFld || ""} // 기존 값 유지
                onChange={(e) =>
                    setConsultantDetail({...consultantDetail, cnsltFld: e.target.value})
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

    const getConsultantDetail = () => {
        const getConsultantDetailUrl = "/consultingApi/getConsultantDetail.do";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(
            getConsultantDetailUrl,
            requestOptions,
            (resp) => {
                /*debugger
                console.log("resp.result:",resp.result);*/
                const decodedPhoneNumber = decodePhoneNumber(resp.result.memberDetail.mblTelno);
                let emailPrefix = "";
                let emailDomain = "";
                let emailProvider = "direct";


                setConsultantDetail(resp.result.consultant);


                if(resp.result.memberDetail.email && resp.result.memberDetail.email.includes("@")){
                    const emailParts =resp.result.memberDetail.email.split("@");
                    emailPrefix = emailParts[0];
                    emailDomain = emailParts[1];
                    emailProvider = emailDomain;
                }

                setMemberDetail({...resp.result.memberDetail,
                    mblTelno: decodedPhoneNumber,
                    emailPrefix : emailPrefix,
                    emailDomain : emailDomain,
                    email: resp.result.memberDetail.email,
                    emailProvider : emailProvider,
                });

                if (resp.result.cnsltProfileFile) {
                    setCnsltProfileFile(resp.result.cnsltProfileFile);
                }

                if (resp.result.cnsltCertificateFile) {
                    setCnsltCertificateFile(resp.result.cnsltCertificateFile);
                }

            },
            (error) => {

            }
        );
    };

    useEffect(() => {
        getComCdList(10).then((data) => {
            setComCdList(data);
        })
    }, []);


    useEffect(() => {
        getConsultantDetail();
    }, [searchDto]);

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

    const renderTabContent = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                return (


                    <div key="tabIndex0">
                     <h2 className="pageTitle" style={{marginBottom:"20px"}}>
                         <p>전문가관리 - 개인정보</p>
                     </h2>
                    <div className="contBox infoWrap customContBox">
                        {/* 개인정보 탭 내용 */}
                            <ul className="inputWrap">


                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>사진</label>
                                    <div className="input">
                                        <div>
                                            <img
                                                src={
                                                    cnsltProfileFile
                                                        ? `http://133.186.250.158${cnsltProfileFile.atchFilePathNm}/${cnsltProfileFile.strgFileNm}.${cnsltProfileFile.atchFileExtnNm}`
                                                        : "" // 기본 이미지 (필요한 경우)
                                                }
                                                alt="컨설턴트사진"
                                                style={{
                                                    width: "200px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>성명</label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="kornFlnm"
                                            id="kornFlnm"
                                            value={memberDetail.kornFlnm || ""}
                                            onChange={(e) => setMemberDetail({...memberDetail, kornFlnm: e.target.value})}
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>자문분야</label>
                                    <div className="input">
                                        <div className="itemBox" style={{flex: 1}}>
                                            {getComCdListToHtml(comCdList)}
                                        </div>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>휴대폰</label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="mblTelno"
                                            id="mblTelno"
                                            value={ComScript.formatTelNumber(memberDetail.mblTelno)}
                                            onChange={(e) =>{
                                                const rawValue = e.target.value.replace(/-/g, "");  // 하이픈 제거
                                                setMemberDetail({ ...memberDetail, mblTelno: rawValue });
                                        }}
                                        >

                                        </input>
                                    </div>
                                </li>



                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>이메일</label>
                                    <div className="input" style={{display: 'flex'}}>
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
                                            style={{flex: 1, padding: '5px', width:'45%'}}
                                        />
                                        <span style={{margin: '0 5px'}}>@</span>
                                        <div className="itemBox" style={{width:"45%"}}>
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

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>주소</label>
                                    <div className="input">
                                        <input type="text" name="addr" id="addr" readOnly value={memberDetail.addr || ""}/>
                                        <button type="button" className="addressBtn btn" onClick={searchAddress}>
                                            <span>주소검색</span>
                                        </button>
                                    </div>
                                </li>
                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>상세주소</label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="daddr"
                                            id="daddr"
                                            placeholder="상세주소를 입력해주세요"
                                            value={memberDetail.daddr || ""}
                                            onChange={(e) => setMemberDetail({...memberDetail, daddr: e.target.value})}
                                        />
                                    </div>
                                </li>


                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>소속</label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="ogdpNm"
                                            value={consultantDetail.ogdpNm || ""}
                                            onChange={(e)=>setConsultantDetail({...consultantDetail,ogdpNm : e.target.value})}
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>직위</label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="jbpsNm"
                                            value={consultantDetail.jbpsNm || ""}
                                            onChange={(e) => setConsultantDetail({...consultantDetail, jbpsNm : e.target.value})}
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title" style={{cursor :"default"}}>경력</label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="crrPrd"
                                            placeholder="숫자만 입력"
                                            value={consultantDetail.crrPrd || ''}
                                            onChange={(e) => setConsultantDetail({...consultantDetail, crrPrd : e.target.value})}
                                            style={{width:"90%"}}
                                        />
                                        <span style={{marginLeft: "10px", color: "#333"}}>년</span>
                                    </div>
                                </li>

                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>컨설팅항목</label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="cnsltArtcl"
                                            placeholder="컨설팅 항목을 입력해주세요"
                                            value={consultantDetail.cnsltArtcl || ""}
                                            onChange={(e) => setConsultantDetail({...consultantDetail,cnsltArtcl:e.target.value})}
                                        />
                                        <span className="warningText" style={{fontSize: "14px"}}>항목과 항목 사이에 기호 [^] 를 넣어주세요.</span>
                                    </div>
                                </li>
                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>소개</label>
                                    <div className="input" style={{height: "100%"}}
                                         /*dangerouslySetInnerHTML={{__html: consultantDetail.cnsltSlfint}}*/>
                                        <CommonEditor
                                            value={consultantDetail.cnsltSlfint || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </li>


                                <li className="inputBox type1 width1">
                                    <label className="title" style={{cursor :"default"}}>자격증</label>
                                    <div className="input">
                                        <div>
                                            {cnsltCertificateFile.length > 0 ? (
                                                cnsltCertificateFile.map((file, index) => (
                                                    <div key={index} style={{ cursor: "pointer" }} onClick={() => handleDownload(file)}>
                                                        {index + 1}. {file.atchFileNm}
                                                    </div>
                                                ))
                                            ) : (
                                                <p key="noData"></p>
                                            )}
                                        </div>

                                    </div>
                                </li>

                                <ul className="box03 inputWrap">
                                <li className="inputBox type2 white">
                                    <div className="input">
                                        <span className="tt1">컨설팅활동</span>
                                        <div className="checkWrap"
                                             style={{
                                                 border: "1px solid #ddd",
                                                 borderRadius: "10px",
                                                 padding: "10px",
                                             }}>
                                            <label className="checkBox type3">
                                            <input
                                                type="radio"
                                                className="signUpRadio"
                                                value="Y"
                                                checked={consultantDetail.cnsltActv === "Y"}
                                                onChange={(e) => setConsultantDetail({...consultantDetail, cnsltActv : e.target.value})}
                                            />
                                            공개
                                            </label>
                                            <label className="checkBox type3">
                                            <input
                                                type="radio"
                                                className="signUpRadio"
                                                value="N"
                                                checked={consultantDetail.cnsltActv === "N"}
                                                onChange={(e) => setConsultantDetail({...consultantDetail, cnsltActv : e.target.value})}
                                            />
                                            비공개
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                </ul>

                            </ul>
                    </div>

                        {/*버튼영역*/}
                        <div style={{marginTop : "30px"}} className="pageWrap">
                            <div className="leftBox">
                                <button type="button" className="writeBtn clickBtn"
                                onClick={()=>{setCnslttMbrActv()}}>
                                    <span>수정</span>
                                </button>
                            </div>
                            <div className="rightBox">
                                <Link
                                    to={URL.MANAGER_CONSULTING_EXPERT}
                                >
                                    <button type="button" className="clickBtn black">
                                        <span>목록</span>
                                    </button>
                                </Link>
                            </div>

                        </div>
                        {/*버튼영역끝*/}
                    </div>
                );
            case 1:
                return (
                    <div key="tabIndex1">
                        {/* 컨설팅의뢰 탭 내용 */}
                        <ManagerCnslttCnsltList
                        cnsltSe={26}
                        userSn={searchDto.userSn}/>
                    </div>
                );
            case 2:
                return (
                    <div key="tabIndex2">
                        {/* 간편상담 탭 내용 */}
                        <ManagerCnslttSimple
                            cnsltSe={27}
                            userSn={searchDto.userSn}/>
                    </div>
                );
            default:
                return <div>잘못된 접근입니다.</div>;
        }
    };

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">

                {/*탭버튼*/}
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    {tabs.map((tab, index) => (
                        <div
                            key={`${index}_tab`}
                            onClick={() => setActiveTab(index)}  // 클릭 시 활성화된 탭 상태 변경
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                backgroundColor: activeTab === index ? '#007BFF' : '#f1f1f1',
                                color: activeTab === index ? '#fff' : '#000',
                                borderRadius: '5px',
                                marginRight: '5px',
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/*컨텐츠영역*/}
                <div>
                    {renderTabContent(activeTab)} {/* activeTab 값에 따라 콘텐츠를 표시 */}
                </div>




            </div>
        </div>
            );


}
export default ManagerConsultuntDetail;