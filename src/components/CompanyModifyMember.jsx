import React, {useState, useEffect, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import Swal from "sweetalert2";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as EgovNet from "@/api/egovFetch";
import * as ComScript from "@/components/CommonScript";
import { getComCdList } from "@/components/CommonComponents";
import CommonEditor from "@/components/CommonEditor";
import moment from "moment/moment.js";

const CompanyModifyMember = ({data, onSave}) => {
    const [paramsData, setParamsData] = useState({});

    useEffect(() => {
        console.log(data);
        setParamsData(data);
    }, [data]);


    const searchAddress = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert('주소 검색 API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                const fullAddress = data.address;
                const zipCode = data.zonecode;
                setCompanyDetail({
                    ...memberDetail,
                    zip: zipCode,
                    addr: fullAddress,
                    searchAddress: '',
                });
            },
        }).open();
    };



    useEffect(() => {
        setCompanyMember(paramsData);
    }, [paramsData]);

    const [companyMember, setCompanyMember] = useState({});
    useEffect(() => {
    }, [companyMember]);

    useEffect(() => {
        setCompanyMember({
            ...paramsData,
            userSn: paramsData?.userSn || '',
            userId: paramsData?.userId || '',
            userPw: paramsData?.userPw || '',
            kornFlnm: paramsData?.kornFlnm || '',
            mblTelno: paramsData?.mblTelno || '',
            zip: paramsData?.zip || '',
            addr: paramsData?.addr || '',
            daddr: paramsData?.daddr || '',
            email: paramsData?.email || '',
        });
    }, [paramsData]);


    return (

        <div className="modifyModal modalCon companyModal">
            <div className="bg" onClick={() => ComScript.closeModal("modifyModal")}></div>
            <div className="m-inner">
                <div className="boxWrap">
                    <div className="close" onClick={() => ComScript.closeModal("modifyModal")}>
                        <div className="icon"></div>
                    </div>
                    <div className="titleWrap type2">
                        <p className="tt1">직원 수정</p>
                    </div>
                    <form className="diffiBox">
                        <div className="cont">
                            <ul className="listBox">

                                <li className="inputBox type1 width1">
                                    <label className="title"><small>아이디</small></label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            defaultValue={companyMember?.userId || ''}
                                            onChange={(e) =>
                                                setCompanyDetail({...companyMember, userId: e.target.value})
                                            }
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title"><small>비밀번호</small></label>
                                    <div className="input">
                                        <input
                                            type="password"
                                            defaultValue={companyMember?.userPw || ''}
                                        />
                                        <button type="button" className="pwdBtn btn" onClick={(e) => {
                                            pwdReset();
                                        }}>
                                            <span>비밀번호 초기화</span>
                                        </button>
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title"><small>성명</small></label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            defaultValue={companyMember?.kornFlnm || ''}
                                            onChange={(e) =>
                                                setCompanyDetail({...companyMember, kornFlnm: e.target.value})
                                            }
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title"><small>휴대폰</small></label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            value={companyMember?.mblTelno || ''}
                                            onChange={(e) =>
                                                setCompanyDetail({...companyMember, mblTelno: e.target.value})
                                            }
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <label className="title"><small>이메일</small></label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            defaultValue={companyMember?.email || ''}
                                            onChange={(e) =>
                                                setCompanyMember({...companyMember, email: e.target.value})
                                            }
                                        />
                                    </div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <span className="title">주소</span>
                                    <div className="input">
                                        <small className="text btn" onClick={searchAddress}>주소 검색</small>
                                        <input
                                            type="hidden"
                                            name="zip"
                                            id="zip"
                                            title="우편번호 입력"
                                            defaultValue={companyMember?.zip || ""}
                                            onChange={(e) =>
                                                setCompanyDetail({
                                                    ...companyMember,
                                                    zip: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="addr"
                                            id="addr"
                                            title="주소"
                                            defaultValue={companyMember?.addr || ""}
                                            onChange={(e) => setCompanyDetail({
                                                ...companyMember,
                                                addr: e.target.value
                                            })}
                                            readOnly
                                        /></div>
                                </li>

                                <li className="inputBox type1 width2">
                                    <span className="title">상세주소</span>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="daddr"
                                            id="daddr"
                                            title="상세주소"
                                            defaultValue={companyMember?.daddr || ""}
                                            onChange={(e) => setCompanyDetail({
                                                ...companyMember,
                                                daddr: e.target.value
                                            })}
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <button type="button" className="clickBtn black writeBtn" onClick="">
                            <span>수정</span></button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default CompanyModifyMember;
