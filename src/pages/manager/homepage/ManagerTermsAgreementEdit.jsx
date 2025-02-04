import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ManagerLeftNew from "@/components/manager/ManagerLeftHomepage";

const ManagerTermsAgreementEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [termsDetail, setTermsDetail] = useState({
        termsTitle: '',
        termsContent: '',
        useYn: 'Y',
    });

    useEffect(() => {
        // 이용약관 데이터 가져오기 (백엔드 구현 전 UI만 구성)
        // getTermsData();
    }, []);

    const handleSave = () => {
        // 저장 버튼 클릭 시 처리 (백엔드 구현 전 UI만 구성)
        console.log("저장 버튼 클릭");
    };

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew />
            <h2 className="pageTitle"><p>이용약관 수정</p></h2>
            <div className="contBox infoWrap customContBox">
                <ul className="inputWrap">
                    <li className="inputBox type1 width1">
                        <label className="title essential" htmlFor="termsTitle"><small>제목</small></label>
                        <div className="input">
                            <input type="text"
                                   id="termsTitle"
                                   value={termsDetail.termsTitle || ""}
                                   onChange={(e) => setTermsDetail({ ...termsDetail, termsTitle: e.target.value })}
                                   required
                            />
                        </div>
                    </li>
                    <li className="inputBox type1 width3">
                        <label className="title" htmlFor="termsContent"><small>내용</small></label>
                        <div className="input">
                            <textarea
                                id="termsContent"
                                value={termsDetail.termsContent || ""}
                                onChange={(e) => setTermsDetail({ ...termsDetail, termsContent: e.target.value })}
                            />
                        </div>
                    </li>
                    <li className="toggleBox width3">
                        <div className="box">
                            <p className="title essential">사용여부</p>
                            <div className="toggleSwithWrap">
                                <input type="checkbox"
                                       id="useYn"
                                       checked={termsDetail.useYn === "Y"}
                                       onChange={(e) => setTermsDetail({ ...termsDetail, useYn: e.target.checked ? "Y" : "N" })}
                                />
                                <label htmlFor="useYn" className="toggleSwitch">
                                    <span className="toggleButton"></span>
                                </label>
                            </div>
                        </div>
                    </li>
                </ul>
                <div className="buttonBox">
                    <button type="button" className="clickBtn point" onClick={handleSave}><span>저장</span></button>
                    <button type="button" className="clickBtn gray" onClick={() => navigate(URL.MANAGER_TERMS_LIST)}><span>목록</span></button>
                </div>
            </div>
        </div>
    );
};

export default ManagerTermsAgreementEdit;